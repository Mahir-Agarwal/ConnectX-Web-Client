import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ size = "normal", animated = true }) => {
    const isLarge = size === "large";
    const iconSize = isLarge ? 48 : 24;

    // If large (on home page), don't link. If small (in header), link to home.
    const Wrapper = isLarge ? 'div' : Link;
    const wrapperProps = isLarge ? {} : { to: "/" };

    return (
        <Wrapper {...wrapperProps} className="flex items-center gap-3 select-none cursor-pointer group">
            <motion.div
                className="relative flex items-center justify-center"
                initial={animated ? { rotate: 0 } : false}
                animate={animated ? { rotate: 360 } : false}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <div className={`relative z-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary ${isLarge ? 'p-4' : 'p-2'} shadow-[0_0_20px_rgba(255,0,60,0.3)]`}>
                    <Zap size={iconSize} className="text-white fill-white" />
                </div>

                {/* Glowing ring effect */}
                {animated && (
                    <motion.div
                        className="absolute inset-0 rounded-xl bg-primary/50 blur-lg"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </motion.div>

            <div className="flex flex-col">
                <h1 className={`font-bold tracking-tighter leading-none ${isLarge ? 'text-5xl' : 'text-2xl'} group-hover:opacity-80 transition-opacity`}>
                    Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">X</span>
                </h1>
                {isLarge && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-mono text-primary/80 tracking-[0.3em] uppercase mt-1"
                    >
                        Quantum Link
                    </motion.span>
                )}
            </div>
        </Wrapper>
    );
};

export default Logo;
