
import React from 'react';
import { motion } from 'framer-motion';

interface VisionPaginationProps {
    activeYearIndex: number;
    hasVision: boolean;
    onPageChange: (index: number) => void;
    themeColors: { text: string }[];
}

export function VisionPagination({
    activeYearIndex,
    hasVision,
    onPageChange,
    themeColors
}: VisionPaginationProps) {
    return (
        <motion.div
            className="py-8 flex justify-center gap-8 bg-white/5 border-t border-white/5 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            {[0, 1, 2].map((idx) => (
                <motion.button
                    key={idx}
                    onClick={() => onPageChange(idx)}
                    disabled={!hasVision && idx > 0 && idx > 1}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group relative flex flex-col items-center gap-3
                        ${(!hasVision && idx > 1) ? 'opacity-20 cursor-not-allowed' : ''}
                    `}
                >
                    <motion.div
                        className={`h-2 transition-all duration-500 rounded-full relative overflow-hidden
                            ${activeYearIndex === idx ? `w-16 ${themeColors[idx].text.replace('text-', 'bg-')} shadow-lg` : 'w-5 bg-white/10 group-hover:bg-white/30'}
                        `}
                        layoutId={`pagination-${idx}`}
                    >
                        {activeYearIndex === idx && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                    <motion.span
                        className={`text-[9px] font-cyber font-black uppercase tracking-tighter transition-all 
                            ${activeYearIndex === idx ? themeColors[idx].text : 'text-white/20'}`}
                        animate={activeYearIndex === idx ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {idx + 1}년차
                    </motion.span>
                </motion.button>
            ))}
        </motion.div>
    );
}
