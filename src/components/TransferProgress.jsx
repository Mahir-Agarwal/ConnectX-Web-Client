import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

const TransferProgress = ({ progress, status }) => {
    return (
        <div className="w-full glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                    {status === 'COMPLETED' ? (
                        <>
                            <CheckCircle size={18} className="text-green-400" />
                            <span className="text-green-400">Sent Successfully</span>
                        </>
                    ) : (
                        <>
                            <Loader2 size={18} className="animate-spin text-primary" />
                            <span>Sending...</span>
                        </>
                    )}
                </span>
                <span className="font-mono text-sm">{Math.round(progress)}%</span>
            </div>

            <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary relative"
                >
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default TransferProgress;
