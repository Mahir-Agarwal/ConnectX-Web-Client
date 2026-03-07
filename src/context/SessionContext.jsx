import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createSession as apiCreateSession } from '../api/session';
import { signalingService } from '../services/signaling';
import { webRTCManager } from '../services/webrtc';

const SessionContext = createContext();

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

export const SessionProvider = ({ children }) => {
    const [status, setStatus] = useState('IDLE'); // IDLE, CREATING, WAITING, CONNECTED, SENDING, COMPLETED, ERROR
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [filesProgress, setFilesProgress] = useState({}); // { 0: 50, 1: 0 }

    const filesRef = useRef(files);
    const transferInProgress = useRef(false);

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const handleError = useCallback((err) => {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
        setStatus('ERROR');
    }, []);

    const startDataTransfer = useCallback(async (filesToSend) => {
        setStatus('SENDING');
        try {
            for (let i = 0; i < filesToSend.length; i++) {
                const file = filesToSend[i];
                await webRTCManager.sendFile(file, i);
            }
            setStatus('COMPLETED');
        } catch (err) {
            handleError(err);
        }
    }, [handleError]);

    const createSession = useCallback(async () => {
        setStatus('CREATING');
        setError(null);
        try {
            // Check for URL params for testing
            const params = new URLSearchParams(window.location.search);
            const urlSessionId = params.get('sessionId');
            const urlSenderToken = params.get('senderToken');

            let sessionData;
            if (urlSessionId && urlSenderToken) {
                sessionData = { sessionId: urlSessionId, senderToken: urlSenderToken };
            } else {
                sessionData = await apiCreateSession();
            }

            setSession(sessionData);

            await signalingService.connect(sessionData.senderToken, sessionData.sessionId);
            webRTCManager.initialize(sessionData.sessionId);

            // RECEIVER_JOINED triggers offer creation in WebRTCManager, but we don't update status yet
            // signalingService.on('RECEIVER_JOINED', () => setStatus('CONNECTED')); // Wait for CHANNEL_OPEN

            // ... (existing code)

            // Listen for Receiver Acceptance
            signalingService.on('CONNECTION_APPROVED', () => {
                if (transferInProgress.current || status === 'SENDING') {
                    console.warn('[SessionContext] Transfer already in progress, ignoring duplicate approval.');
                    return;
                }

                if (filesRef.current && filesRef.current.length > 0) {
                    transferInProgress.current = true;
                    startDataTransfer(filesRef.current).finally(() => {
                        transferInProgress.current = false;
                    });
                }
            });

            webRTCManager.on('CHANNEL_OPEN', () => {
                setStatus('CONNECTED');
            });

            webRTCManager.on('PROGRESS', ({ progress, fileIndex }) => {
                setFilesProgress(prev => ({ ...prev, [fileIndex]: progress }));
            });
            webRTCManager.on('TRANSFER_COMPLETE', () => setStatus('COMPLETED'));
            webRTCManager.on('ERROR', (e) => handleError(e));

            setStatus('WAITING');
        } catch (err) {
            handleError(err);
        }
    }, [handleError, startDataTransfer]);

    const sendMoreFiles = useCallback(() => {
        setFiles([]);
        setFilesProgress({});
        setStatus('CONNECTED');
    }, []);

    const sendFiles = useCallback(async (filesOverride) => {
        // If filesOverride is an array, use it. Otherwise use state files.
        const filesToSend = Array.isArray(filesOverride) ? filesOverride : files;

        if (!filesToSend || filesToSend.length === 0 || !session) return;

        // Send Metadata via Signaling
        signalingService.sendMessage('FILE_METADATA', session.sessionId, {
            count: filesToSend.length,
            files: filesToSend.map(f => ({
                name: f.name,
                size: f.size,
                type: f.type
            }))
        });

        setStatus('WAITING_FOR_ACCEPTANCE');
    }, [files, session]);

    const resetSession = useCallback(() => {
        setStatus('IDLE');
        setSession(null);
        setFiles([]);
        setFilesProgress({});
        setError(null);
        signalingService.disconnect();
        webRTCManager.close();
    }, []);

    // Cleanup on unmount (only if the provider itself unmounts, e.g. app close)
    useEffect(() => {
        return () => {
            signalingService.disconnect();
            webRTCManager.close();
        };
    }, []);

    const value = {
        status,
        session,
        error,
        files,
        filesProgress,
        createSession,
        sendFiles,
        sendMoreFiles,
        setFiles,
        resetSession
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};
