import React from 'react';
import {
    Swords, Clock, Crown, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectScheme } from '../../types';

interface DashboardHeaderProps {
    activeProject: ProjectScheme;
    progress: number;
    daysPassed: number;
    timeProgress: number;
    isAhead: boolean;
    statusColor: string;
    statusMessage: string;
    isPreviewMode: boolean;
}

export function DashboardHeader({
    activeProject, progress, daysPassed, timeProgress, isAhead, statusColor, statusMessage,
    isPreviewMode
}: DashboardHeaderProps) {

    return (
        <header className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-10">
                <div className="flex items-start gap-6">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-6xl shadow-inner shrink-0 cursor-default"
                    >
                        {activeProject.selectedIdea.emoji || '🚀'}
                    </motion.div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{activeProject.selectedIdea.title}</h1>
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="px-3 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider"
                            >
                                활성 퀘스트
                            </motion.span>
                        </div>
                        <p className="text-xl text-zinc-400 font-medium max-w-3xl leading-relaxed">
                            "{activeProject.analysis.oneLiner}"
                        </p>
                    </div>
                </div>
            </div>


            {/* HUD / Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* XP Bar */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-panel p-6 relative group border-cyber-pink/30 shadow-neon-pink/10"
                >
                    <div className="flex justify-between items-end mb-3 relative z-10">
                        <div className="flex items-center gap-2">
                            <Swords className="text-cyber-pink" size={18} />
                            <span className="text-[10px] font-cyber font-black text-zinc-500 uppercase tracking-[0.2em]">퀘스트 진행률</span>
                        </div>
                        <span className="text-3xl font-cyber font-black text-cyber-pink">{progress}%</span>
                    </div>
                    <div className="w-full bg-black/50 h-2 border border-cyber-pink/20 relative z-10 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-cyber-pink h-full relative shadow-[0_0_15px_#ff00ff]"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Time Bar */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-panel p-6 relative group border-cyber-cyan/30 shadow-neon-cyan/10"
                >
                    <div className="flex justify-between items-end mb-3 relative z-10">
                        <div className="flex items-center gap-2">
                            <Clock className="text-cyber-cyan" size={18} />
                            <span className="text-[10px] font-cyber font-black text-zinc-500 uppercase tracking-[0.2em]">시간 경과</span>
                        </div>
                        <span className="text-3xl font-cyber font-black text-cyber-cyan">{daysPassed}<span className="text-xs text-zinc-600 font-normal ml-1">/30일</span></span>
                    </div>
                    <div className="w-full bg-black/50 h-2 border border-cyber-cyan/20 relative z-10 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${timeProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full shadow-[0_0_15px_rgba(var(--cyber-cyan),1)] ${timeProgress > 80 ? 'bg-red-500 shadow-red-500' : 'bg-cyber-cyan'}`}
                        ></motion.div>
                    </div>
                </motion.div>

                {/* Status */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-panel p-6 relative group border-cyber-yellow/20 flex items-center justify-between"
                >
                    <div className="relative z-10">
                        <div className="text-[10px] font-cyber font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">시스템 상태</div>
                        <div className={`text-2xl font-cyber font-black ${statusColor} italic tracking-widest uppercase`}>{statusMessage}</div>
                    </div>
                    <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className={`p-4 bg-black/40 border-2 ${isAhead ? 'border-cyber-cyan text-cyber-cyan shadow-neon-cyan' : 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
                    >
                        {isAhead ? <Crown size={28} /> : <AlertTriangle size={28} />}
                    </motion.div>
                </motion.div>
            </div>
        </header>
    );
}

