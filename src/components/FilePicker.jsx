import React, { useRef } from 'react';
import { Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';

const FilePicker = ({ onFileSelect, selectedFile }) => {
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
            />

            {!selectedFile ? (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="glass-panel p-10 border-2 border-dashed border-white/20 cursor-pointer flex flex-col items-center gap-4 hover:border-primary/50 transition-colors"
                >
                    <div className="p-4 rounded-full bg-primary/10 text-primary">
                        <Upload size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Choose a file</h3>
                        <p className="text-sm opacity-60">or drag and drop here</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 flex items-center gap-4"
                >
                    <div className="p-3 rounded-lg bg-secondary/20 text-secondary">
                        <File size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{selectedFile.name}</h4>
                        <p className="text-xs opacity-60">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                        onClick={() => onFileSelect(null)}
                        className="text-xs hover:text-red-400 transition-colors"
                    >
                        Change
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default FilePicker;
