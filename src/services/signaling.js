import { WS_URL } from '../config';


class SignalingService {
    constructor() {
        this.socket = null;
        this.callbacks = {};
    }

    connect(token, sessionId) {
        // Cleanup existing connection to prevent race conditions (React Strict Mode etc.)
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`${WS_URL}?token=${token}`);
            this.socket = ws;

            ws.onopen = () => {
                // Use 'ws' directly to ensure we send on THIS socket, 
                // regardless of whether 'this.socket' changed in the meantime.
                const payload = JSON.stringify({
                    type: 'JOIN_AS_SENDER',
                    sessionId,
                    payload: {}
                });

                // Small delay still good for stability, but use specific socket
                setTimeout(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(payload);
                        resolve();
                    } else {
                        // This might happen if closed immediately
                        console.warn('WebSocket closed before JOIN_AS_SENDER could be sent');
                    }
                }, 100);
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
                reject(error);
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (e) {
                    console.error('Failed to parse signaling message:', e);
                }
            };

            ws.onclose = () => {
                if (this.callbacks['DISCONNECTED']) {
                    this.callbacks['DISCONNECTED']();
                }
            };
        });
    }

    send(type, payload = {}) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = {
                type,
                sessionId: payload.sessionId,
                payload: payload.payload || payload
            };

            this.socket.send(JSON.stringify({
                type,
                sessionId: payload.sessionId,
                payload: payload.data || {}
            }));
        } else {
            console.warn('WebSocket not connected, cannot send:', type);
        }
    }

    sendMessage(type, sessionId, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type,
                sessionId,
                payload
            }));
        }
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    off(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
        }
    }

    handleMessage(message) {
        const { type, payload } = message;
        if (this.callbacks[type]) {
            this.callbacks[type].forEach(callback => callback(payload));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export const signalingService = new SignalingService();
