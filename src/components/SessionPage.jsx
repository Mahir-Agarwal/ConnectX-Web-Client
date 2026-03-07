import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import QrDisplay from './QrDisplay';
import { useNavigate } from 'react-router-dom';

const SessionPage = () => {
    const { status, session, createSession } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        // Start session creation immediately if idle
        if (status === 'IDLE') {
            createSession();
        }
    }, [status, createSession]);

    useEffect(() => {
        // Redirect to transfer page when connected
        if (status === 'CONNECTED') {
            navigate('/transfer');
        }
    }, [status, navigate]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {(status === 'CREATING' || status === 'WAITING') && session && (
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
                            locked={status === 'CONNECTED'}
                        />
                        {status === 'CREATING' && (
                            <p className="text-center mt-8 text-primary font-mono animate-pulse">
                                Establishing Secure Channel...
                            </p>
                        )}
                        {status === 'WAITING' && (
                            <p className="text-center mt-8 text-green-400 font-mono text-sm flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Sender Connected & Waiting for Receiver
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SessionPage;
