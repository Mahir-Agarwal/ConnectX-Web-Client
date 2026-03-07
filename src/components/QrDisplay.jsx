import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Scan, Smartphone } from 'lucide-react';

const QrDisplay = ({ value, expiry, locked }) => {
    return (
        <div className="relative group">
            {/* Holographic Card Container */}
            <div className="relative z-10 glass-panel p-1 bg-gradient-to-br from-white/10 to-white/5 border-white/20 overflow-hidden">

                {/* Scanning Line Animation */}
                {!locked && (
                    <motion.div
                        className="absolute inset-0 w-full h-1 bg-primary/50 blur-md z-20"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                )}

                <div className="bg-dark/90 p-8 rounded-xl flex flex-col items-center gap-8 relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    <div className="relative z-10 text-center space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            {locked ? 'Device Connected' : 'Scan to Connect'}
                        </h2>
                        <p className="text-sm text-primary font-mono tracking-wider">
                            {locked ? 'SESSION LOCKED' : 'SECURE CHANNEL READY'}
                        </p>
                    </div>

                    <div className="relative p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,0,60,0.2)] group-hover:shadow-[0_0_60px_rgba(255,0,60,0.4)] transition-shadow duration-500">
                        <QRCodeSVG
                            value={value}
                            size={220}
                            level="H"
                            includeMargin={true}
                            className={`rounded-lg ${locked ? 'opacity-50 blur-sm' : ''}`}
                        />
                        {/* Center Logo Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white p-2 rounded-full shadow-lg">
                                <Scan className={`text-dark w-8 h-8 ${locked ? 'text-green-500' : ''}`} />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 text-sm text-gray-400 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                        <Smartphone size={16} className="text-primary" />
                        <span>{locked ? 'Receiver Linked' : 'Open ConnectX App'}</span>
                        {expiry && (
                            <>
                                <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                <span className={`font-mono ${locked ? 'text-green-400' : 'text-primary'}`}>
                                    <Countdown target={expiry} locked={locked} />
                                </span>
                            </>
                        )}
                    </div>


                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10" />
        </div>
    );
};

const Countdown = ({ target, locked }) => {
    const [timeLeft, setTimeLeft] = React.useState('');

    React.useEffect(() => {
        if (locked) {
            setTimeLeft('LOCKED');
            return;
        }
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = target - now;
            if (diff <= 0) {
                setTimeLeft('EXPIRED');
                clearInterval(interval);
            } else {
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [target, locked]);

    return <span>{timeLeft}</span>;
};

export default QrDisplay;
