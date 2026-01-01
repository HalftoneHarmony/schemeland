import React, { useState } from 'react';
import { Target, Edit3, Save, Sparkles, Flag, Star, Rocket, Crown, ChevronLeft, ChevronRight, Lock, Zap, Activity, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { ProjectScheme, ThreeYearVision } from '../../types';

interface VisionSectionProps {
    activeProject: ProjectScheme;
    isEditingVision: boolean;
    visionDraft: ThreeYearVision | null;
    isExpandingVision: boolean;
    handleEditVision: () => void;
    handleCancelEditVision: () => void;
    handleSaveVision: () => void;
    handleExpandVision: () => void;
    setVisionDraft: (vision: ThreeYearVision | null) => void;
}

export function VisionSection({
    activeProject, isEditingVision, visionDraft, isExpandingVision,
    handleEditVision, handleCancelEditVision, handleSaveVision, handleExpandVision, setVisionDraft
}: VisionSectionProps) {

    const [activeYearIndex, setActiveYearIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const VisionTextarea = ({ value, onChange, label, rows = 2 }: { value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, label: string, rows?: number }) => (
        <div className="mb-6">
            <label className="text-cyber-cyan font-cyber font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full bg-black border-2 border-white/5 p-5 text-base text-white/90 focus:outline-none focus:border-cyber-cyan font-mono resize-none leading-relaxed transition-all"
            />
        </div>
    );

    const hasVision = !!activeProject.threeYearVision;
    const handlePrev = () => {
        setDirection(-1);
        setActiveYearIndex(prev => Math.max(0, prev - 1));
    };
    const handleNext = () => {
        setDirection(1);
        setActiveYearIndex(prev => Math.min(hasVision ? 2 : 1, prev + 1));
    };

    const themeColors = [
        { border: 'border-cyber-yellow', text: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', shadow: 'shadow-neon-yellow', icon: <Flag size={20} />, label: 'Phase_Foundation' },
        { border: 'border-cyber-cyan', text: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', shadow: 'shadow-neon-cyan', icon: <Rocket size={20} />, label: 'Phase_Expansion' },
        { border: 'border-cyber-pink', text: 'text-cyber-pink', bg: 'bg-cyber-pink/10', shadow: 'shadow-neon-pink', icon: <Crown size={20} />, label: 'Phase_Dominance' },
    ];

    const currentTheme = themeColors[activeYearIndex];

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            filter: "brightness(2) blur(10px)"
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            filter: "brightness(1) blur(0px)"
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            filter: "brightness(0.5) blur(10px)"
        })
    };

    return (
        <section className="mb-20">
            <div className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-3xl font-cyber font-black text-white flex items-center gap-4 uppercase tracking-[0.1em]">
                    <Target className="text-white/20" /> Strategic_Vision
                </h2>
            </div>

            <div className="relative max-w-5xl mx-auto px-16">
                {/* Navigation Buttons */}
                <motion.button
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    disabled={activeYearIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 border-2 flex items-center justify-center transition-all z-20 skew-x-[-10deg]
                        ${activeYearIndex === 0 ? 'opacity-0 pointer-events-none' : 'border-white/10 text-white hover:border-cyber-cyan hover:text-cyber-cyan bg-black shadow-neon-cyan'}`}
                >
                    <div className="skew-x-[10deg]"><ChevronLeft size={24} /></div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    disabled={activeYearIndex >= 2 || (!hasVision && activeYearIndex === 1)}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 border-2 flex items-center justify-center transition-all z-20 skew-x-[-10deg]
                        ${activeYearIndex >= 2 || (!hasVision && activeYearIndex === 1) ? 'opacity-0 pointer-events-none' : 'border-white/10 text-white hover:border-cyber-cyan hover:text-cyber-cyan bg-black shadow-neon-cyan'}`}
                >
                    <div className="skew-x-[10deg]"><ChevronRight size={24} /></div>
                </motion.button>

                {/* Main Card */}
                <motion.div
                    layout
                    className={`
                        min-h-[400px] flex flex-col relative overflow-hidden border-2 transition-all duration-700 skew-x-[-1deg] bg-black
                        ${currentTheme.border} ${currentTheme.shadow}
                    `}
                >
                    {/* Atmospheric Glow */}
                    <div className={`absolute top-0 right-0 w-64 h-64 ${currentTheme.bg} blur-[100px] -mr-32 -mt-32 opacity-50`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    {/* Header */}
                    <div className="px-10 py-6 flex justify-between items-center border-b border-white/5 relative z-10 bg-white/5 backdrop-blur-md">
                        <div className={`flex items-center gap-4 ${currentTheme.text}`}>
                            <div className="font-cyber font-black text-xs uppercase tracking-[0.3em]">
                                Vision_Sequence::{activeYearIndex + 1}
                            </div>
                            <div className={`w-2 h-2 rounded-full ${currentTheme.text.replace('text-', 'bg-')} animate-pulse`} />
                            <div className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-widest">{currentTheme.label}</div>
                        </div>

                        <div className="flex items-center gap-4">
                            {isEditingVision ? (
                                <>
                                    <Button variant="ghost" size="sm" onClick={handleCancelEditVision} className="text-[10px] font-cyber font-black text-white/20 hover:text-white uppercase tracking-widest">Abort</Button>
                                    <Button size="sm" onClick={handleSaveVision} className="bg-cyber-cyan text-black font-cyber font-black text-[10px] uppercase tracking-widest px-6 shadow-neon-cyan border-none">
                                        <Save size={14} className="mr-2" /> Sync_Data
                                    </Button>
                                </>
                            ) : hasVision ? (
                                <button
                                    onClick={handleEditVision}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all text-[10px] font-cyber font-black uppercase tracking-widest"
                                >
                                    <Edit3 size={12} /> Reconfigure
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-12 py-12 flex-1 relative z-10 flex flex-col justify-center skew-x-[1deg]">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={activeYearIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                className="w-full h-full flex flex-col justify-center"
                            >
                                {/* YEAR 1 */}
                                {activeYearIndex === 0 && (
                                    <div className="w-full">
                                        {isEditingVision && visionDraft ? (
                                            <VisionTextarea
                                                label="Foundation_Objective"
                                                value={visionDraft.year1 || activeProject.yearlyPlan.vision}
                                                onChange={(e) => setVisionDraft({ ...visionDraft, year1: e.target.value })}
                                                rows={5}
                                            />
                                        ) : (
                                            <div className="flex flex-col md:flex-row gap-12 items-start">
                                                <div className="flex-1">
                                                    <div className="text-cyber-yellow font-cyber font-black text-[10px] uppercase tracking-[0.3em] mb-4">Core_Directive</div>
                                                    <motion.h3
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="text-3xl md:text-4xl font-cyber font-black text-white leading-tight uppercase tracking-tight skew-x-[-5deg]"
                                                    >
                                                        "{activeProject.yearlyPlan.vision}"
                                                    </motion.h3>
                                                </div>

                                                <div className="w-full md:w-5/12 flex flex-col gap-4">
                                                    <div className="text-[9px] font-cyber font-black text-white/20 uppercase tracking-[0.4em] mb-2">Milestone_Checkpoints</div>
                                                    {activeProject.yearlyPlan.keyResults.map((kr, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.1 * idx }}
                                                            className="flex items-start gap-4 p-4 border border-white/5 bg-white/5 hover:border-cyber-yellow/40 transition-all cursor-default relative overflow-hidden group"
                                                        >
                                                            <div className="absolute top-0 left-0 w-[2px] h-full bg-cyber-yellow/20 group-hover:bg-cyber-yellow group-hover:shadow-neon-yellow transition-all" />
                                                            <div className="mt-1 flex items-center justify-center w-5 h-5 bg-cyber-yellow text-black shrink-0">
                                                                <Star size={12} fill="currentColor" />
                                                            </div>
                                                            <span className="text-white/80 text-xs font-mono font-bold leading-relaxed">{kr}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* YEAR 2 */}
                                {activeYearIndex === 1 && (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        {hasVision ? (
                                            isEditingVision && visionDraft ? (
                                                <VisionTextarea
                                                    label="Expansion_Strategic_Path"
                                                    value={visionDraft.year2}
                                                    onChange={(e) => setVisionDraft({ ...visionDraft, year2: e.target.value })}
                                                    rows={8}
                                                />
                                            ) : (
                                                <>
                                                    <div className="text-cyber-cyan font-cyber font-black text-[10px] uppercase tracking-[0.3em] mb-4">Vertical_Scaling</div>
                                                    <p className="text-3xl font-cyber font-black text-white leading-tight uppercase tracking-tight skew-x-[-5deg] mb-8">{activeProject.threeYearVision!.year2}</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-4 border border-cyber-cyan/20 bg-cyber-cyan/5">
                                                            <div className="flex items-center gap-2 mb-2 text-cyber-cyan">
                                                                <Activity size={14} />
                                                                <span className="font-cyber font-black text-[8px] uppercase tracking-widest">Growth_Rate</span>
                                                            </div>
                                                            <div className="text-xl font-mono text-white font-bold">2.4x_EXP</div>
                                                        </div>
                                                        <div className="p-4 border border-white/10 bg-white/5 opacity-50">
                                                            <div className="flex items-center gap-2 mb-2 text-white/40">
                                                                <Wifi size={14} />
                                                                <span className="font-cyber font-black text-[8px] uppercase tracking-widest">Network_Sync</span>
                                                            </div>
                                                            <div className="text-xl font-mono text-white/40 font-bold">STABLE</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                                                <motion.div
                                                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                    className="w-20 h-20 bg-black border-2 border-white/5 flex items-center justify-center mb-8 relative group"
                                                >
                                                    <div className="absolute inset-0 bg-cyber-cyan/10 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <Lock size={32} className="text-white/10" />
                                                </motion.div>
                                                <h4 className="text-3xl font-cyber font-black text-white mb-3 uppercase tracking-widest">Sector_Locked</h4>
                                                <p className="text-white/30 mb-10 max-w-sm font-mono text-xs uppercase tracking-tighter">Reach foundation protocol milestones to decrypt future trajectory paths.</p>
                                                {!isExpandingVision ? (
                                                    <Button
                                                        onClick={handleExpandVision}
                                                        className="h-14 bg-white text-black hover:bg-cyber-cyan hover:text-black border-none px-10 text-xs font-cyber font-black shadow-neon-cyan skew-x-[-10deg]"
                                                    >
                                                        <span className="skew-x-[10deg] flex items-center gap-3">
                                                            <Sparkles size={16} /> DECRYPT_VISION_ROADMAP
                                                        </span>
                                                    </Button>
                                                ) : (
                                                    <div className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-cyber font-black text-xs flex items-center gap-4 bg-cyber-cyan/5 shadow-neon-cyan">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        >
                                                            <Zap size={16} />
                                                        </motion.div>
                                                        SYNCING_NEURAL_NETWORK...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* YEAR 3 */}
                                {activeYearIndex === 2 && (
                                    <div className="w-full h-full flex flex-col">
                                        {isEditingVision && visionDraft ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <VisionTextarea
                                                    label="Domination_Strategy"
                                                    value={visionDraft.year3}
                                                    onChange={(e) => setVisionDraft({ ...visionDraft, year3: e.target.value })}
                                                    rows={8}
                                                />
                                                <VisionTextarea
                                                    label="Ultimate_End_State"
                                                    value={visionDraft.ultimateGoal}
                                                    onChange={(e) => setVisionDraft({ ...visionDraft, ultimateGoal: e.target.value })}
                                                    rows={8}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-cyber-pink font-cyber font-black text-[10px] uppercase tracking-[0.3em] mb-4">Total_Dominance</div>
                                                <p className="text-3xl font-cyber font-black text-white leading-tight uppercase tracking-tight italic skew-x-[-5deg] mb-12">
                                                    "{activeProject.threeYearVision!.year3}"
                                                </p>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-auto p-10 border-2 border-cyber-pink bg-cyber-pink/5 relative overflow-hidden shadow-neon-pink"
                                                >
                                                    <div className="absolute top-0 right-0 p-3 bg-cyber-pink text-black font-cyber font-black text-[10px] uppercase tracking-widest shadow-neon-pink">
                                                        FINAL_PROTOCOL
                                                    </div>
                                                    <div className="text-cyber-pink font-cyber font-black text-[10px] uppercase tracking-[0.4em] block mb-4 flex items-center gap-2">
                                                        <Crown size={16} className="animate-pulse" /> End_Goal_Config
                                                    </div>
                                                    <p className="text-2xl text-white font-cyber font-black leading-tight uppercase tracking-tight">{activeProject.threeYearVision!.ultimateGoal}</p>
                                                    <div className="mt-8 flex gap-4 h-1 w-full bg-white/10 overflow-hidden">
                                                        <motion.div
                                                            animate={{ x: ["-100%", "100%"] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                            className="w-1/3 h-full bg-cyber-pink shadow-neon-pink"
                                                        />
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    <div className="py-8 flex justify-center gap-6 bg-white/5 border-t border-white/5 relative z-10">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > activeYearIndex ? 1 : -1);
                                    setActiveYearIndex(idx);
                                }}
                                disabled={!hasVision && idx > 0 && idx > 1}
                                className={`group relative flex flex-col items-center gap-2
                                    ${(!hasVision && idx > 1) ? 'opacity-20 cursor-not-allowed' : ''}
                                `}
                            >
                                <div className={`h-1.5 transition-all duration-500 rounded-full
                                    ${activeYearIndex === idx ? `w-14 ${themeColors[idx].text.replace('text-', 'bg-')} shadow-neon-cyan shadow-sm` : 'w-4 bg-white/10 group-hover:bg-white/30'}
                                `} />
                                <span className={`text-[8px] font-cyber font-black uppercase tracking-tighter transition-all 
                                    ${activeYearIndex === idx ? themeColors[idx].text : 'text-white/20'}`}>
                                    Year_0{idx + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
