
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsRight, RefreshCw, X } from 'lucide-react';
import { Button } from '../../ui';
import { cardVariants } from '../constants';
import { MonthlyGoal } from '../../../types'; // 타입 확인: MonthlyGoal

interface MonthCardProps {
    month: MonthlyGoal;
    index: number;
    isSelected: boolean;
    isPast: boolean;
    isEditing: boolean;
    isAdjusting: boolean;
    onEditStart: () => void;
    onEditEnd: () => void;
    onClick: () => void;
    onUpdateTheme: (text: string) => void;
    onUpdateObjectives: (goals: string[]) => void;
    onAiAdjustment: () => void;
}

export function MonthCard({
    month,
    index,
    isSelected,
    isPast,
    isEditing,
    isAdjusting,
    onEditStart,
    onEditEnd,
    onClick,
    onUpdateTheme,
    onUpdateObjectives,
    onAiAdjustment
}: MonthCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // 내부 핸들러
    const handleGoalChange = (idx: number, val: string) => {
        const newGoals = [...month.goals];
        newGoals[idx] = val;
        onUpdateObjectives(newGoals);
    };

    const handleAddGoal = () => {
        onUpdateObjectives([...month.goals, "새 목표"]);
    };

    const handleDeleteGoal = (idx: number) => {
        const newGoals = month.goals.filter((_, i) => i !== idx);
        onUpdateObjectives(newGoals);
    };

    return (
        <motion.div
            variants={cardVariants}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            className={`
                w-[340px] shrink-0 p-8 border transition-all duration-300 cursor-pointer relative group flex flex-col overflow-hidden cyber-clipper-lg
                ${isSelected
                    ? 'bg-gradient-to-br from-cyber-cyan/10 to-transparent border-cyber-cyan shadow-[0_0_30px_rgba(0,255,255,0.15)] z-20'
                    : 'bg-zinc-950/80 border-white/10 hover:border-cyber-cyan/30'
                }
                ${isPast ? 'opacity-60 saturate-0 hover:saturate-100 hover:opacity-100' : ''}
            `}
            animate={{
                y: isHovered ? -10 : 0,
                height: isHovered ? 'auto' : 460,
                zIndex: isHovered ? 50 : (isSelected ? 20 : 0)
            }}
            transition={{
                y: { type: "spring", stiffness: 400, damping: 30 },
                height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
                default: { duration: 0.3 }
            }}
            style={{ minHeight: 460 }}
        >
            <div className="flex-1 flex flex-col relative">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-10">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={isSelected || isHovered ? { x: [0, 3, 0], opacity: [1, 0.8, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                                className={isSelected ? 'text-cyber-cyan' : 'text-white/20'}
                            >
                                <ChevronsRight size={18} />
                            </motion.div>
                            <span className={`text-xl font-cyber font-black uppercase tracking-tighter italic ${isSelected ? 'text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] scale-110 origin-left transition-transform' : 'text-white/30'}`}>
                                SPRINT_{index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </span>
                        </div>

                        {/* Speed Lines Animation */}
                        {(isSelected || isHovered) && (
                            <div className="flex gap-0.5 overflow-hidden h-1 w-24 opacity-60">
                                {[...Array(6)].map((_, lineIdx) => (
                                    <motion.div
                                        key={lineIdx}
                                        className={`h-full w-3 -skew-x-[30deg] ${isSelected ? 'bg-cyber-cyan' : 'bg-white/40'}`}
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 100, opacity: [0, 1, 0] }}
                                        transition={{
                                            duration: 0.6,
                                            delay: lineIdx * 0.05,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isEditing && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEditStart(); }}
                                className="p-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all rounded-full"
                            >
                                <RefreshCw size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 relative">
                    <AnimatePresence mode="wait">
                        {isEditing && isSelected ? (
                            <motion.div
                                key="edit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col bg-black/95 backdrop-blur-md absolute inset-0 z-30 -m-6 p-6 border border-cyber-cyan shadow-xl min-h-[400px]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mb-2 text-[10px] font-cyber text-cyber-cyan uppercase tracking-wider">R=VD Vision (Past Tense)</div>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 text-white p-3 focus:outline-none focus:border-cyber-cyan font-mono text-sm resize-none leading-relaxed h-20 mb-4 rounded-sm placeholder:text-white/20"
                                    value={month.theme}
                                    onChange={(e) => onUpdateTheme(e.target.value)}
                                    autoFocus
                                    spellCheck={false}
                                    placeholder='ex) "나는 이번 스프린트에서 핵심 기능을 완벽하게 구현했다."'
                                />

                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-[10px] font-cyber text-cyber-cyan uppercase tracking-wider">Objectives</div>
                                        <button onClick={handleAddGoal} className="text-[10px] bg-cyber-cyan/20 px-2 py-0.5 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-colors rounded-sm">+</button>
                                    </div>
                                    <div className="space-y-2">
                                        {month.goals.map((g, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    className="flex-1 bg-white/5 border border-white/10 text-white/80 px-2 py-1 text-xs font-mono focus:border-cyber-cyan focus:outline-none"
                                                    value={g}
                                                    onChange={(e) => handleGoalChange(i, e.target.value)}
                                                />
                                                <button onClick={() => handleDeleteGoal(i)} className="text-red-500 hover:text-red-400 px-1 text-xs">x</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10 shrink-0">
                                    <Button onClick={onAiAdjustment} size="sm" variant="ghost" className="flex-1 text-[10px] font-cyber font-black border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink hover:text-white" isLoading={isAdjusting}>
                                        AI_RECALC
                                    </Button>
                                    <Button onClick={onEditEnd} size="sm" className="bg-cyber-cyan text-black font-cyber font-black text-[10px] border-none px-4 flex-1">
                                        DONE
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col min-h-0"
                            >
                                <h3 className={`font-cyber font-black text-2xl leading-tight uppercase tracking-tight mb-8 ${isSelected ? 'text-white' : 'text-white/30'} line-clamp-3`}>
                                    "{month.theme}"
                                </h3>

                                <div className="flex-1 relative">
                                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest block mb-3 border-b border-white/5 pb-1">Primary_Objectives</span>

                                    <motion.ul className="space-y-3 relative z-10">
                                        <AnimatePresence>
                                            {(isHovered ? month.goals : month.goals.slice(0, 3)).map((goal, gIdx) => (
                                                <motion.li
                                                    key={gIdx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ delay: gIdx * 0.05 + 0.1 }}
                                                    className="text-sm text-white/50 flex items-start gap-3 leading-relaxed group-hover:text-white/80 transition-colors"
                                                >
                                                    <span className={`mt-1.5 w-1.5 h-1.5 ${isSelected ? 'bg-cyber-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'bg-white/20'} rotate-45 shrink-0`} />
                                                    <span className="font-medium tracking-tight font-mono text-xs">{goal}</span>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </motion.ul>

                                    {/* More Indicator */}
                                    {!isHovered && month.goals.length > 3 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent flex items-end justify-center pointer-events-none">
                                            <span className="text-[9px] text-cyber-cyan animate-pulse bg-black/50 px-2">+ {month.goals.length - 3} MORE_DATA</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Selection Glow */}
            {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50 blur-sm" />
            )}

            {/* Hover Glow */}
            {isHovered && (
                <motion.div
                    layoutId="hoverGlow"
                    className="absolute inset-0 bg-cyber-cyan/5 rounded-none z-0 pointer-events-none mix-blend-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </motion.div>
    );
}
