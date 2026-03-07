import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Layout = ({ children }) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-dark text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden relative`}>
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className={`absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 animate-pulse ${isDark ? 'bg-primary' : 'bg-red-400'}`} />
                <div className={`absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 animate-pulse ${isDark ? 'bg-secondary' : 'bg-orange-400'}`} style={{ animationDelay: '2s' }} />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
            </div>

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
                <Logo size="normal" animated={false} />

                <div
                    onClick={() => setIsDark(!isDark)}
                    className="w-16 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-inner p-1 cursor-pointer relative transition-colors duration-300 flex items-center"
                >
                    <motion.div
                        className={`w-6 h-6 rounded-full shadow-lg ${isDark ? 'bg-orange-500 shadow-orange-500/50' : 'bg-white shadow-sm'} flex items-center justify-center`}
                        layout
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        style={{
                            marginLeft: isDark ? 'auto' : '0',
                            marginRight: isDark ? '0' : 'auto'
                        }}
                    >
                        {isDark ? (
                            <Moon size={14} className="text-white" />
                        ) : (
                            <Sun size={14} className="text-orange-500" />
                        )}
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-[85vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </main>

            {/* Footer Credit */}
            <div className={`fixed bottom-4 left-4 z-50 text-[10px] font-mono tracking-tighter uppercase flex items-center gap-3 ${isDark ? 'text-white/30' : 'text-black/40'}`}>
                <span>Engineered by Mahir Aggarwal</span>
                <span className="w-1 h-1 bg-primary/40 rounded-full" />
                <span className="bg-primary/10 px-1.5 py-0.5 rounded text-primary/60 border border-primary/20">v1.0.0</span>
            </div>
        </div>
    );
};

export default Layout;
