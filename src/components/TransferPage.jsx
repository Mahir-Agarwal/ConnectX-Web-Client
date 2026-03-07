import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, File, AlertCircle } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import SpotlightButton from './SpotlightButton';
import TransferProgress from './TransferProgress';

const TransferPage = () => {
    const { status, files, setFiles, sendFiles, sendMoreFiles, filesProgress, resetSession, error } = useSession();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (status === 'IDLE' || status === 'CREATING' || status === 'WAITING') {
            navigate('/session');
        }
    }, [status, navigate]);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleReset = () => {
        resetSession();
        navigate('/');
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {status === 'CONNECTED' && (
                    <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 space-y-8 flex flex-col items-center"
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
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Receiver Linked</h3>
                            <p className="text-gray-500 dark:text-gray-400">Secure tunnel established. Ready for transmission.</p>
                        </div>

                        {/* File Selection Area */}
                        <div className="w-full flex flex-col items-center gap-6">
                            <input
                                id="file-upload-input"
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            {(!files || files.length === 0) ? (
                                <SpotlightButton onClick={() => fileInputRef.current?.click()} text="Select Files to Send" />
                            ) : (
                                <div className="w-full space-y-3">
                                    {files.map((f, index) => (
                                        <div key={index} className="w-full glass-panel p-4 flex items-center gap-4 bg-white/5">
                                            <div className="p-3 rounded-lg bg-secondary/20 text-secondary">
                                                <File size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate text-gray-900 dark:text-white">{f.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setFiles([])}
                                        className="w-full text-center text-sm text-red-400 hover:text-red-300 transition-colors py-2"
                                    >
                                        Clear Selection
                                    </button>
                                </div>
                            )}
                        </div>

                        {files && files.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => sendFiles()}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
                            >
                                Send {files.length} Files <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </motion.div>
                )}


                {status === 'WAITING_FOR_ACCEPTANCE' && (
                    <motion.div
                        key="waiting-acceptance"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-10 flex flex-col items-center space-y-6 text-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-500/20"></div>
                            <div className="relative p-4 rounded-full bg-yellow-500/20 text-yellow-400">
                                <Send size={40} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">Request Sent</h3>
                            <p className="text-gray-400">Waiting for receiver to accept the file...</p>
                        </div>
                        <div className="w-full max-w-xs bg-white/5 rounded-full h-1 overflow-hidden">
                            <motion.div
                                className="h-full bg-yellow-500"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                )}

                {(status === 'SENDING' || status === 'COMPLETED') && (
                    <motion.div
                        key="transfer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8 w-full"
                    >
                        <h3 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            {status === 'COMPLETED' ? 'Transmission Complete' : 'Transferring Data...'}
                        </h3>

                        <div className="space-y-4">
                            {files.map((file, index) => (
                                <div key={index} className="glass-panel p-4 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium truncate max-w-[70%] dark:text-white text-gray-900">{file.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {filesProgress[index] || 0}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${filesProgress[index] || 0}%` }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {status === 'COMPLETED' && (
                            <div className="flex flex-col gap-4 mt-8">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={sendMoreFiles}
                                    className="w-full btn-primary"
                                >
                                    Send More Files
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={handleReset}
                                    className="w-full px-6 py-3 rounded-xl border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    Disconnect
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                )}

                {status === 'ERROR' && (
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
                            onClick={handleReset}
                            className="btn-primary mt-4 bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                        >
                            Retry Connection
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default TransferPage;
