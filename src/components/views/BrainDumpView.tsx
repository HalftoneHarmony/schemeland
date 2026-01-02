import React from 'react';
import { ArrowLeft, Lightbulb, Plus, Sparkles, Database, Cpu, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { IdeaCard } from '../IdeaCard';
import { ProjectIdea } from '../../types';

interface BrainDumpViewProps {
    ideas: ProjectIdea[];
    onBack: () => void;
    onSuggestion: () => void;
    isSuggesting: boolean;
    onAddIdea: () => void;
    onUpdateIdea: (id: string, field: keyof ProjectIdea, value: string) => void;
    onDeleteIdea: (id: string) => void;
    onMagic: (id: string) => void;
    isRefiningMap: Record<string, boolean>;
    onAnalyze: () => void;
    onQuickStart: () => void;
    isAnalyzing: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        },
    },
};

const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
        },
    },
};

export function BrainDumpView({
    ideas,
    onBack,
    onSuggestion,
    isSuggesting,
    onAddIdea,
    onUpdateIdea,
    onDeleteIdea,
    onMagic,
    isRefiningMap,
    onAnalyze,
    onQuickStart,
    isAnalyzing
}: BrainDumpViewProps) {
    return (
        <>
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
                    >
                        <div className="text-center relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 0],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 -z-10 bg-cyber-pink/20 blur-[100px] rounded-full"
                            />

                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="mb-8 flex justify-center"
                            >
                                <Sparkles size={80} className="text-cyber-pink animate-pulse" />
                            </motion.div>

                            <h2 className="text-3xl font-cyber font-black text-white mb-2 tracking-[0.5em] uppercase italic">
                                ANALYZING_NEURAL_DATA...
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{ width: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="h-1 bg-cyber-cyan shadow-neon-cyan max-w-[300px]"
                                />
                            </div>
                            <p className="mt-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                Processing_Synaptic_Bursts_and_Refining_Roadmap_Protocols
                            </p>

                            <div className="mt-12 grid grid-cols-3 gap-4 opacity-20">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-1 bg-white/10 animate-pulse stagger-i" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="max-w-5xl mx-auto px-4 py-12"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="mb-16">
                    <motion.button
                        onClick={onBack}
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-white/20 hover:text-cyber-pink mb-8 flex items-center text-[10px] font-cyber font-black tracking-[0.2em] uppercase transition-colors group"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        RETURN_TO_CORE::코어로_귀환
                    </motion.button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-cyber-pink pl-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="text-cyber-pink animate-pulse" size={20} />
                                <span className="text-xs font-cyber font-black text-cyber-pink uppercase tracking-widest">Input_Buffer::입력_버퍼</span>
                            </div>
                            <h2 className="text-5xl font-cyber font-black mb-4 text-white uppercase tracking-tighter italic">Brain_Archive::브레인_아카이브</h2>
                            <p className="text-white/40 max-w-xl font-mono text-sm leading-relaxed">
                                여기에 당신의 원시 시냅스 데이터를 덤프하세요.
                                <span className="text-cyber-cyan font-bold mx-2 inline-flex items-center gap-1 border-b border-cyber-cyan/30">
                                    <Cpu size={14} className="animate-pulse" /> REFINER.EXE
                                </span>
                                를 사용하여 이 뉴럴 파편들을 실행 가능한 계획으로 안정화합니다.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Button
                                variant="ghost"
                                onClick={onSuggestion}
                                isLoading={isSuggesting}
                                className="shrink-0 h-14 px-8 border-2 border-cyber-yellow/20 text-cyber-yellow hover:border-cyber-yellow hover:bg-cyber-yellow/10 transition-all font-cyber font-black text-xs tracking-[0.2em] skew-x-[-10deg]"
                            >
                                <span className="skew-x-[10deg] flex items-center gap-3">
                                    <Lightbulb size={20} className={isSuggesting ? 'animate-pulse' : ''} /> SYNC_INSPIRATION::영감_동기화
                                </span>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 mb-12">
                    {ideas.map((idea, idx) => (
                        <motion.div
                            key={idea.id}
                            variants={itemVariants}
                            custom={idx}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <IdeaCard
                                idea={idea}
                                onChange={onUpdateIdea}
                                onDelete={onDeleteIdea}
                                onMagic={onMagic}
                                isMagicLoading={isRefiningMap[idea.id]}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="sticky bottom-10 z-30 flex gap-6 backdrop-blur-3xl p-6 rounded-none border-2 border-white/5 bg-black/80 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] skew-x-[-2deg]"
                    variants={footerVariants}
                >
                    <div className="skew-x-[2deg] flex gap-4 w-full">
                        <motion.div
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="ghost"
                                onClick={onAddIdea}
                                className="w-full h-16 border-2 border-white/10 hover:border-white/30 text-white font-cyber font-black tracking-widest text-xs"
                            >
                                <Plus className="mr-3" size={24} /> NEW_DATA_SLOT
                            </Button>
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="ghost"
                                onClick={onQuickStart}
                                className="w-full h-16 border-2 border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan hover:shadow-neon-cyan font-cyber font-black tracking-widest text-xs transition-all"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Zap size={20} /> SKIP_AI::바로_시작
                                </span>
                            </Button>
                        </motion.div>
                        <motion.div
                            className="flex-[2]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={onAnalyze}
                                isLoading={isAnalyzing}
                                disabled={isAnalyzing}
                                className="w-full h-16 bg-cyber-pink text-white font-cyber font-black tracking-[0.2em] text-xs border-none shadow-neon-pink hover:bg-white hover:text-black transition-all skew-x-[-5deg]"
                            >
                                <span className="skew-x-[5deg] flex items-center justify-center gap-4">
                                    <Sparkles size={24} className={isAnalyzing ? 'animate-spin' : 'animate-pulse'} /> 분석_시퀀스_초기화
                                </span>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
