
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, Star, Crown } from 'lucide-react';
import { floatVariants } from '../constants';

interface ThemeColor {
    text: string;
    // other props if needed
}

interface VisionDisplayProps {
    vision: string;
    keyResults: string[];
    ultimateGoal?: string;
    activeYearIndex: number;
    theme: ThemeColor;
}

export function VisionDisplay({
    vision,
    keyResults,
    ultimateGoal,
    activeYearIndex,
    theme
}: VisionDisplayProps) {
    const bgClass = theme.text.replace('text-', 'bg-');

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-12 items-start">
                <motion.div
                    className="flex-1"
                    variants={floatVariants}
                    animate="animate"
                >
                    <motion.div
                        className={`font-cyber font-black text-[10px] uppercase tracking-[0.3em] mb-4 ${theme.text} flex items-center gap-2`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <Activity size={14} />
                        </motion.span>
                        Future_Self::{activeYearIndex + 1}년_후의_나는
                    </motion.div>
                    <motion.h3
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-3xl md:text-4xl font-cyber font-black text-white leading-tight uppercase tracking-tight skew-x-[-5deg] relative"
                    >
                        <motion.span
                            className="relative inline-block"
                            whileHover={{ scale: 1.02 }}
                        >
                            "{vision}"
                        </motion.span>
                    </motion.h3>
                </motion.div>

                <div className="w-full md:w-5/12 flex flex-col gap-3">
                    <motion.div
                        className="text-[9px] font-cyber font-black text-white/20 uppercase tracking-[0.4em] mb-2 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Wifi size={12} />
                        </motion.span>
                        Milestone_Checkpoints::마일스톤
                    </motion.div>
                    {keyResults.map((kr, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 30, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: 0.5 + (0.15 * idx), type: "spring", stiffness: 100 }}
                            whileHover={{
                                x: 8,
                                borderColor: "rgba(255,255,255,0.4)",
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }}
                            className={`flex items-start gap-4 p-5 border border-white/5 bg-zinc-900/40 transition-all cursor-default relative overflow-hidden group cyber-clipper`}
                        >
                            <motion.div
                                className={`absolute top-0 left-0 w-[4px] h-full ${bgClass}`}
                                initial={{ height: 0 }}
                                animate={{ height: "100%" }}
                                transition={{ delay: 0.6 + (0.15 * idx), duration: 0.4 }}
                            />
                            <motion.div
                                className={`mt-1 flex items-center justify-center w-6 h-6 ${bgClass} text-black shrink-0 cyber-clipper`}
                                whileHover={{ rotate: 180, scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <Star size={14} fill="currentColor" />
                            </motion.div>
                            <span className="text-white/80 text-xs font-mono font-bold leading-relaxed">{kr}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Ultimate Goal Footer for Year 3 */}
            {activeYearIndex === 2 && ultimateGoal && (
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,0,255,0.3)" }}
                    className="mt-6 p-7 border-2 border-cyber-pink bg-cyber-pink/5 relative overflow-hidden shadow-neon-pink cyber-clipper-lg"
                >
                    <motion.div
                        className="absolute top-0 right-0 p-2 bg-cyber-pink text-black font-cyber font-black text-[8px] uppercase tracking-widest shadow-neon-pink"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        FINAL_PROTOCOL
                    </motion.div>
                    <div className="text-cyber-pink font-cyber font-black text-[10px] uppercase tracking-[0.4em] block mb-2 flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Crown size={14} />
                        </motion.div>
                        Ultimate_Goal::궁극적_목표
                    </div>
                    <motion.p
                        className="text-xl text-white font-cyber font-black leading-tight uppercase tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        {ultimateGoal}
                    </motion.p>
                </motion.div>
            )}
        </div>
    );
}
