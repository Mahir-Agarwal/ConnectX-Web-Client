import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { createSession } from '../api/session';
import { signalingService } from '../services/signaling';
import { webRTCManager } from '../services/webrtc';
import QrDisplay from './QrDisplay';
import FilePicker from './FilePicker';
import TransferProgress from './TransferProgress';
import Logo from './Logo';
import ScrambleButton from './ScrambleButton';

const STATES = {
    IDLE: 'IDLE',
    CREATING: 'CREATING',
    WAITING: 'WAITING',
    CONNECTED: 'CONNECTED',
    SENDING: 'SENDING',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR',
};

const SenderPage = () => {
    const [status, setStatus] = useState(STATES.IDLE);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        return () => {
            signalingService.disconnect();
            webRTCManager.close();
        };
    }, []);

    const handleCreateSession = async () => {
        setStatus(STATES.CREATING);
        setError(null);
        try {
            const sessionData = await createSession();
            setSession(sessionData);
            await signalingService.connect(sessionData.senderToken, sessionData.sessionId);
            webRTCManager.initialize(sessionData.sessionId);

            signalingService.on('RECEIVER_JOINED', () => setStatus(STATES.CONNECTED));
            webRTCManager.on('PROGRESS', (p) => setProgress(p));
            webRTCManager.on('TRANSFER_COMPLETE', () => setStatus(STATES.COMPLETED));
            webRTCManager.on('ERROR', (e) => handleError(e));

            setStatus(STATES.WAITING);
        } catch (err) {
            handleError(err);
        }
    };

    const handleSendFile = async () => {
        if (!file) return;
        setStatus(STATES.SENDING);
        try {
            await webRTCManager.sendFile(file);
        } catch (err) {
            handleError(err);
        }
    };

    const handleError = (err) => {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
        setStatus(STATES.ERROR);
    };

    const reset = () => {
        setStatus(STATES.IDLE);
        setSession(null);
        setFile(null);
        setProgress(0);
        setError(null);
        signalingService.disconnect();
        webRTCManager.close();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {status === STATES.IDLE && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        className="flex flex-col items-center text-center space-y-12 py-10"
                    >
                        <motion.div
                            initial={{ y: -50 }}
                            animate={{ y: 0 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <Logo size="large" />
                        </motion.div>

                        <div className="space-y-6 max-w-lg">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-white/50"
                            >
                                Defy Limits. <br />
                                <span className="text-primary">Share Instantly.</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl text-gray-400 leading-relaxed font-cursive"
                            >
                                Share files wirelessly - no wire mess, no logins, no messy steps, your data stays private !...
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <ScrambleButton onClick={handleCreateSession} />
                        </motion.div>
                    </motion.div>
                )}

                {(status === STATES.CREATING || status === STATES.WAITING) && session && (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0, rotateX: 90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        exit={{ opacity: 0, rotateX: -90 }}
                        transition={{ type: "spring", damping: 20 }}
                    >
                        <QrDisplay
                            value={JSON.stringify({
                                sessionId: session.sessionId,
                                receiverToken: session.receiverToken
                            })}
                            expiry={session.expiresAt}
                        />
                        {status === STATES.CREATING && (
                            <p className="text-center mt-8 text-primary font-mono animate-pulse">
                                Establishing Secure Channel...
                            </p>
                        )}
                    </motion.div>
                )}

                {status === STATES.CONNECTED && (
                    <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 space-y-8"
                    >
                        <div className="text-center space-y-2">
                            <div className="inline-flex p-3 rounded-full bg-green-500/20 text-green-400 mb-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Send size={32} />
                                </motion.div>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Receiver Linked</h3>
                            <p className="text-gray-400">Secure tunnel established. Ready for transmission.</p>
                        </div>

                        <FilePicker onFileSelect={setFile} selectedFile={file} />

                        {file && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleSendFile}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
                            >
                                Initiate Transfer <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {(status === STATES.SENDING || status === STATES.COMPLETED) && (
                    <motion.div
                        key="transfer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <h3 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            {status === STATES.COMPLETED ? 'Transmission Complete' : 'Transferring Data...'}
                        </h3>
                        <TransferProgress progress={progress} status={status} />

                        {status === STATES.COMPLETED && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={reset}
                                className="w-full btn-primary mt-8"
                            >
                                Start New Session
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {status === STATES.ERROR && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 glass-panel p-10 border-red-500/30"
                    >
                        <div className="p-4 rounded-full bg-red-500/20 text-red-500 inline-block">
                            <AlertCircle size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-red-500">Connection Terminated</h3>
                        </div>
                        <button
                            onClick={reset}
                            className="btn-primary mt-4 bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                            Retry Connection
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SenderPage;
