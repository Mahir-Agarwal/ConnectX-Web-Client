import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ScrambleButton from './ScrambleButton';

import { useSession } from '../context/SessionContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { resetSession } = useSession();

    const handleStart = () => {
        resetSession();
        navigate('/session');
    };

    return (
        <motion.div
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
                <ScrambleButton onClick={handleStart} />
            </motion.div>
        </motion.div>
    );
};

export default HomePage;
