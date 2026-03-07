import { signalingService } from './signaling';
import { ICE_SERVERS, TURN_CREDENTIALS_API } from '../config';

const CHUNK_SIZE = 16 * 1024; // 16KB (Sweet spot/Backend Requirement)
const BUFFER_THRESHOLD = 64 * 1024; // 64KB (Max buffer before backpressure)
const PING_INTERVAL_MS = 3000; // 3 seconds Keep-Alive

class WebRTCManager {
    constructor() {
        this.pc = null;
        this.dataChannel = null;
        this.sessionId = null;
        this.callbacks = {};
        this.fileReader = null;
        this.fileReader = null;
        this.isSending = false;
        this.pingInterval = null; // Keep-Alive timer
    }

    async initialize(sessionId) {
        this.cleanup(); // Ensure clean state
        this.sessionId = sessionId;

        // OpenRelay Configuration (Matches Android/Backend Policy)
        const rtcConfig = {
            iceServers: [
                // 1. Standard STUN (Google/Twilio)
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" },
                // 2. OpenRelay TURN (UDP Port 80)
                {
                    urls: "turn:openrelay.metered.ca:80",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                },
                // 3. TCP Tunneling (Port 80)
                {
                    urls: "turn:openrelay.metered.ca:80?transport=tcp",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                },
                // 4. TLS Tunneling (Port 443)
                {
                    urls: "turns:openrelay.metered.ca:443?transport=tcp",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                }
            ],
            iceTransportPolicy: 'all',
            bundlePolicy: 'max-bundle'
        };

        this.pc = new RTCPeerConnection(rtcConfig);

        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                // Use ICE_CANDIDATE to match backend protocol (verified by e2e test)
                signalingService.sendMessage('ICE_CANDIDATE', this.sessionId, event.candidate);
            }
        };

        this.pc.onconnectionstatechange = () => {
            this.trigger('CONNECTION_STATE', this.pc.connectionState);
        };

        // Create Data Channel
        this.dataChannel = this.pc.createDataChannel('fileTransfer', {
            ordered: true,
        });

        this.setupDataChannel();

        // Bind handlers to this instance for removal later
        this.handleReceiverJoined = async () => {
            await this.createOffer();
        };

        this.handleAnswer = async (answer) => {
            try {
                // Backend might send just SDP or partial object, ensure type is set
                const description = {
                    type: 'answer',
                    sdp: answer.sdp || answer
                };

                await this.pc.setRemoteDescription(new RTCSessionDescription(description));
            } catch (e) {
                console.error('Error setting remote description:', e);
            }
        };

        this.handleIce = async (candidate) => {
            try {
                if (candidate) {
                    await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (e) {
                console.error('Error adding ICE candidate:', e);
            }
        };

        // Listen for signaling messages
        signalingService.on('RECEIVER_JOINED', this.handleReceiverJoined);
        signalingService.on('ANSWER', this.handleAnswer);
        signalingService.on('ICE_CANDIDATE', this.handleIce);
    }

    setupDataChannel() {
        this.dataChannel.onopen = () => {
            this.trigger('CHANNEL_OPEN');
            this.startKeepAlive();
        };

        this.dataChannel.onclose = () => {
            this.trigger('CHANNEL_CLOSE');
        };

        this.dataChannel.onerror = (error) => {
            console.error('Data Channel Error:', error);
            this.trigger('ERROR', error);
        };
    }

    async createOffer() {
        try {
            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);
            signalingService.sendMessage('OFFER', this.sessionId, offer);
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }


    startKeepAlive() {
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
            if (this.dataChannel && this.dataChannel.readyState === 'open' && !this.isSending) {
                try {
                    this.dataChannel.send('PING');
                } catch (e) {
                    console.warn('Keep-Alive PING failed:', e);
                }
            }
        }, PING_INTERVAL_MS);
    }

    async sendFile(file, fileIndex = 0) {
        if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
            throw new Error('Data Channel not open');
        }

        return new Promise(async (resolve, reject) => {
            this.isSending = true;

            // Metadata is already sent via SessionContext handshake
            // const metadata = {
            //     name: file.name,
            //     size: file.size,
            //     type: file.type,
            // };
            // signalingService.sendMessage('FILE_METADATA', this.sessionId, metadata);

            // Start sending chunks
            try {
                const arrayBuffer = await file.arrayBuffer();
                let offset = 0;

                const sendChunk = async () => {
                    if (!this.isSending) {
                        console.error('[WebRTCManager] Transfer aborted: isSending is false');
                        reject(new Error('Transfer aborted'));
                        return;
                    }

                    while (offset < arrayBuffer.byteLength) {
                        if (this.dataChannel.bufferedAmount > BUFFER_THRESHOLD) {
                            // Wait for buffer to drain
                            await new Promise(resolve => {
                                const checkBuffer = setInterval(() => {
                                    if (this.dataChannel.bufferedAmount < BUFFER_THRESHOLD) {
                                        clearInterval(checkBuffer);
                                        resolve();
                                    }
                                }, 50);
                            });
                        }

                        const chunk = arrayBuffer.slice(offset, offset + CHUNK_SIZE);
                        this.dataChannel.send(chunk);
                        offset += chunk.byteLength;

                        // Progress update
                        const progress = Math.min(100, Math.round((offset / file.size) * 100));
                        this.trigger('PROGRESS', { progress, fileIndex });
                    }

                    if (offset >= arrayBuffer.byteLength) {
                        this.isSending = false;
                        this.trigger('TRANSFER_COMPLETE', fileIndex);
                        resolve();
                    }
                };

                await sendChunk();
            } catch (error) {
                this.isSending = false;
                reject(error);
            }
        });
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => callback(data));
        }
    }

    cleanup() {
        if (this.handleReceiverJoined) {
            signalingService.off('RECEIVER_JOINED', this.handleReceiverJoined);
            this.handleReceiverJoined = null;
        }
        if (this.handleAnswer) {
            signalingService.off('ANSWER', this.handleAnswer);
            this.handleAnswer = null;
        }
        if (this.handleIce) {
            signalingService.off('ICE_CANDIDATE', this.handleIce);
            this.handleIce = null;
        }

        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }

        this.dataChannel = null;
        this.isSending = false;
    }

    close() {
        this.cleanup();
    }
}

export const webRTCManager = new WebRTCManager();
