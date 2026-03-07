import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const NeoButton = ({ onClick, text = "HOVER ME!", icon: Icon = ArrowRight }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ x: 4, y: 4, boxShadow: "0px 0px 0px 0px #000000" }}
            whileTap={{ x: 6, y: 6, boxShadow: "0px 0px 0px 0px #000000" }}
            className="group relative flex items-center gap-3 px-8 py-4 bg-surface text-black font-bold text-lg uppercase tracking-wider neo-border neo-shadow transition-all duration-200"
        >
            <span>{text}</span>
            <Icon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </motion.button>
    );
};

export default NeoButton;
