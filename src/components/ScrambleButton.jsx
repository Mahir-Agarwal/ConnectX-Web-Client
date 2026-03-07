import React, { useRef, useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const TARGET_TEXT = "Connect Now ->";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const ScrambleButton = ({ onClick }) => {
    const intervalRef = useRef(null);
    const [text, setText] = useState(TARGET_TEXT);

    const scramble = () => {
        let pos = 0;

        intervalRef.current = setInterval(() => {
            const scrambled = TARGET_TEXT.split("")
                .map((char, index) => {
                    if (pos / CYCLES_PER_LETTER > index) {
                        return char;
                    }

                    const randomCharIndex = Math.floor(Math.random() * CHARS.length);
                    const randomChar = CHARS[randomCharIndex];

                    return randomChar;
                })
                .join("");

            setText(scrambled);
            pos++;

            if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
                stopScramble();
            }
        }, SHUFFLE_TIME);
    };

    const stopScramble = () => {
        clearInterval(intervalRef.current || undefined);
        setText(TARGET_TEXT);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            onMouseEnter={scramble}
            onMouseLeave={stopScramble}
            onClick={onClick}
            className="group relative overflow-hidden rounded-lg border-[1px] border-primary/50 bg-primary/10 px-8 py-4 font-mono font-medium uppercase text-primary transition-colors hover:text-white hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(255,0,60,0.4)]"
        >
            <div className="relative z-10 flex items-center gap-2 text-lg tracking-widest">
                <Zap size={20} />
                <span>{text}</span>
            </div>
            <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                transition={{
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1,
                    ease: "linear",
                }}
                className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-primary/0 from-40% via-primary/100 to-primary/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
            />
        </motion.button>
    );
};

export default ScrambleButton;
