
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui';
import { Save, Edit3 } from 'lucide-react';

interface ThemeColor {
    text: string;
    label: string;
    icon: React.ReactNode;
    // bg variant generation uses text color
}

interface VisionHeaderProps {
    activeYearIndex: number;
    theme: ThemeColor;
    isEditingVision: boolean;
    hasVision: boolean;
    handleEditVision: () => void;
    handleCancelEditVision: () => void;
    handleSaveVision: () => void;
}

export function VisionHeader({
    activeYearIndex,
    theme,
    isEditingVision,
    hasVision,
    handleEditVision,
    handleCancelEditVision,
    handleSaveVision
}: VisionHeaderProps) {
    const bgClass = theme.text.replace('text-', 'bg-');

    return (
        <motion.div
            className="px-10 py-6 flex justify-between items-center border-b border-white/5 relative z-10 bg-white/5 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className={`flex items-center gap-4 ${theme.text}`}>
                <motion.div
                    className="font-cyber font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        {theme.icon}
                    </motion.span>
                    VISION_SEQUENCE::{activeYearIndex + 1}년차
                </motion.div>
                <motion.div
                    className={`w-2 h-2 rounded-full ${bgClass}`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                        boxShadow: [
                            "0 0 0px currentColor",
                            "0 0 15px currentColor",
                            "0 0 0px currentColor"
                        ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                    className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-widest"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {theme.label}
                </motion.div>
            </div>

            <div className="flex items-center gap-4">
                {isEditingVision ? (
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Button variant="ghost" size="sm" onClick={handleCancelEditVision} className="text-[10px] font-cyber font-black text-white/20 hover:text-white uppercase tracking-widest">중단</Button>
                        <Button size="sm" onClick={handleSaveVision} className="bg-cyber-cyan text-black font-cyber font-black text-[10px] uppercase tracking-widest px-6 shadow-neon-cyan border-none">
                            <Save size={14} className="mr-2" /> 데이터_동기화
                        </Button>
                    </motion.div>
                ) : hasVision ? (
                    <motion.button
                        onClick={handleEditVision}
                        whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all text-[10px] font-cyber font-black uppercase tracking-widest cyber-clipper"
                    >
                        <Edit3 size={12} /> 재보정
                    </motion.button>
                ) : null}
            </div>
        </motion.div>
    );
}
