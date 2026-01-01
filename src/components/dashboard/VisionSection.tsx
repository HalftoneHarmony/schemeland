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

    const getYearValue = (yearData: any): { vision: string, keyResults: string[] } => {
        if (!yearData) return { vision: '', keyResults: [] };
        if (typeof yearData === 'string') return { vision: yearData, keyResults: [] };
        return { vision: yearData.vision || '', keyResults: yearData.keyResults || [] };
    };

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
        { border: 'border-cyber-yellow', text: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', shadow: 'shadow-neon-yellow', icon: <Flag size={20} />, label: '기반_구축_단계' },
        { border: 'border-cyber-cyan', text: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', shadow: 'shadow-neon-cyan', icon: <Rocket size={20} />, label: '시장_확장_단계' },
        { border: 'border-cyber-pink', text: 'text-cyber-pink', bg: 'bg-cyber-pink/10', shadow: 'shadow-neon-pink', icon: <Crown size={20} />, label: '지배_및_정점_단계' },
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
                    <Target className="text-white/20" /> STRATEGIC_VISION::전략적_비전
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
                                VISION_SEQUENCE::{activeYearIndex + 1}년차
                            </div>
                            <div className={`w-2 h-2 rounded-full ${currentTheme.text.replace('text-', 'bg-')} animate-pulse`} />
                            <div className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-widest">{currentTheme.label}</div>
                        </div>

                        <div className="flex items-center gap-4">
                            {isEditingVision ? (
                                <>
                                    <Button variant="ghost" size="sm" onClick={handleCancelEditVision} className="text-[10px] font-cyber font-black text-white/20 hover:text-white uppercase tracking-widest">중단</Button>
                                    <Button size="sm" onClick={handleSaveVision} className="bg-cyber-cyan text-black font-cyber font-black text-[10px] uppercase tracking-widest px-6 shadow-neon-cyan border-none">
                                        <Save size={14} className="mr-2" /> 데이터_동기화
                                    </Button>
                                </>
                            ) : hasVision ? (
                                <button
                                    onClick={handleEditVision}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white transition-all text-[10px] font-cyber font-black uppercase tracking-widest"
                                >
                                    <Edit3 size={12} /> 재보정
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-12 py-10 flex-1 relative z-10 flex flex-col justify-center skew-x-[1deg]">
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
                                {((activeYearIndex === 0) || (activeYearIndex > 0 && hasVision)) ? (
                                    <div className="w-full">
                                        {isEditingVision && visionDraft ? (
                                            <div className="space-y-6">
                                                <VisionTextarea
                                                    label={`${activeYearIndex + 1}년차_핵심_지침 (Core Directive)`}
                                                    value={getYearValue(activeYearIndex === 0 ? visionDraft.year1 : activeYearIndex === 1 ? visionDraft.year2 : visionDraft.year3).vision}
                                                    onChange={(e) => {
                                                        const key = activeYearIndex === 0 ? 'year1' : activeYearIndex === 1 ? 'year2' : 'year3';
                                                        const current = getYearValue(visionDraft[key]);
                                                        setVisionDraft({ ...visionDraft, [key]: { ...current, vision: e.target.value } });
                                                    }}
                                                    rows={3}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {[0, 1, 2].map((idx) => (
                                                        <div key={idx} className="flex flex-col gap-2">
                                                            <label className="text-white/20 font-cyber font-black text-[8px] uppercase tracking-widest">Milestone_0{idx + 1}</label>
                                                            <textarea
                                                                className="w-full bg-black border border-white/10 p-3 text-xs text-white/80 focus:outline-none focus:border-cyber-cyan font-mono resize-none h-24"
                                                                value={getYearValue(activeYearIndex === 0 ? visionDraft.year1 : activeYearIndex === 1 ? visionDraft.year2 : visionDraft.year3).keyResults[idx] || ''}
                                                                onChange={(e) => {
                                                                    const key = activeYearIndex === 0 ? 'year1' : activeYearIndex === 1 ? 'year2' : 'year3';
                                                                    const current = getYearValue(visionDraft[key]);
                                                                    const krs = [...current.keyResults];
                                                                    while (krs.length <= idx) krs.push('');
                                                                    krs[idx] = e.target.value;
                                                                    setVisionDraft({ ...visionDraft, [key]: { ...current, keyResults: krs } });
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                {activeYearIndex === 2 && (
                                                    <VisionTextarea
                                                        label="궁극적_상태 (Ultimate Goal)"
                                                        value={visionDraft.ultimateGoal}
                                                        onChange={(e) => setVisionDraft({ ...visionDraft, ultimateGoal: e.target.value })}
                                                        rows={2}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-8">
                                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                                    <div className="flex-1">
                                                        <div className={`font-cyber font-black text-[10px] uppercase tracking-[0.3em] mb-4 ${currentTheme.text}`}>Core_Directive::핵심_지침</div>
                                                        <motion.h3
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="text-3xl md:text-4xl font-cyber font-black text-white leading-tight uppercase tracking-tight skew-x-[-5deg]"
                                                        >
                                                            "{getYearValue(activeYearIndex === 0
                                                                ? (activeProject.threeYearVision?.year1 || activeProject.yearlyPlan)
                                                                : activeYearIndex === 1
                                                                    ? activeProject.threeYearVision?.year2
                                                                    : activeProject.threeYearVision?.year3).vision}"
                                                        </motion.h3>
                                                    </div>

                                                    <div className="w-full md:w-5/12 flex flex-col gap-3">
                                                        <div className="text-[9px] font-cyber font-black text-white/20 uppercase tracking-[0.4em] mb-2">Milestone_Checkpoints::마일스톤</div>
                                                        {getYearValue(activeYearIndex === 0
                                                            ? (activeProject.threeYearVision?.year1 || activeProject.yearlyPlan)
                                                            : activeYearIndex === 1
                                                                ? activeProject.threeYearVision?.year2
                                                                : activeProject.threeYearVision?.year3
                                                        ).keyResults.map((kr, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.1 * idx }}
                                                                className={`flex items-start gap-4 p-4 border border-white/5 bg-white/5 hover:border-white/20 transition-all cursor-default relative overflow-hidden group`}
                                                            >
                                                                <div className={`absolute top-0 left-0 w-[2px] h-full ${currentTheme.bg.replace('/10', '')} opacity-20 group-hover:opacity-100 transition-all`} />
                                                                <div className={`mt-1 flex items-center justify-center w-5 h-5 ${currentTheme.text.replace('text-', 'bg-')} text-black shrink-0`}>
                                                                    <Star size={12} fill="currentColor" />
                                                                </div>
                                                                <span className="text-white/80 text-xs font-mono font-bold leading-relaxed">{kr}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Ultimate Goal Footer for Year 3 */}
                                                {activeYearIndex === 2 && activeProject.threeYearVision?.ultimateGoal && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-6 p-6 border-2 border-cyber-pink bg-cyber-pink/5 relative overflow-hidden shadow-neon-pink"
                                                    >
                                                        <div className="absolute top-0 right-0 p-2 bg-cyber-pink text-black font-cyber font-black text-[8px] uppercase tracking-widest shadow-neon-pink">
                                                            FINAL_PROTOCOL
                                                        </div>
                                                        <div className="text-cyber-pink font-cyber font-black text-[10px] uppercase tracking-[0.4em] block mb-2 flex items-center gap-2">
                                                            <Crown size={14} className="animate-pulse" /> Ultimate_Goal::궁극적_목표
                                                        </div>
                                                        <p className="text-xl text-white font-cyber font-black leading-tight uppercase tracking-tight">{activeProject.threeYearVision.ultimateGoal}</p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                        <h4 className="text-3xl font-cyber font-black text-white mb-3 uppercase tracking-widest">Sector_Locked::섹터_잠김</h4>
                                        <p className="text-white/30 mb-10 max-w-sm font-mono text-xs uppercase tracking-tighter">미래 궤적 경로를 해독하기 위해 기반 프로토콜 마일스톤을 달성하세요.</p>
                                        {!isExpandingVision ? (
                                            <Button
                                                onClick={handleExpandVision}
                                                className="h-14 bg-white text-black hover:bg-cyber-cyan hover:text-black border-none px-10 text-xs font-cyber font-black shadow-neon-cyan skew-x-[-10deg]"
                                            >
                                                <span className="skew-x-[10deg] flex items-center gap-3">
                                                    <Sparkles size={16} /> 비전_로드맵_해독_시작
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
                                                뉴럴_네트워크_동기화_중...
                                            </div>
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
                                    {idx + 1}년차
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
