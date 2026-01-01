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
    onAbandonQuest: () => void;

}

export function DashboardHeader({
    activeProject, progress, daysPassed, timeProgress, isAhead, statusColor, statusMessage,
    isPreviewMode, onAbandonQuest
}: DashboardHeaderProps) {

    return (
        <header className="mb-20">
            <div className="flex flex-col md:flex-row gap-10 items-start justify-between mb-16 relative">

                {/* Decorative Line */}
                <div className="absolute -bottom-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="flex items-start gap-8">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-28 h-28 rounded-2xl bg-black border-2 border-white/10 flex items-center justify-center text-7xl shadow-2xl shrink-0 cursor-default relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-cyber-pink/5 group-hover:bg-cyber-pink/10 transition-colors" />
                        <span className="relative z-10">{activeProject.selectedIdea.emoji || '🚀'}</span>
                    </motion.div>

                    <div className="pt-2">
                        <div className="flex items-center gap-4 mb-3">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none"
                            >
                                {activeProject.selectedIdea.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-accent blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                                <span className="relative px-3 py-1 bg-black border border-accent/30 text-accent text-[10px] font-cyber font-black uppercase tracking-widest hover:bg-accent/10 transition-colors cursor-default">
                                    Active_Quest
                                </span>
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl text-zinc-400 font-light max-w-4xl leading-relaxed tracking-tight"
                        >
                            "{activeProject.analysis.oneLiner}"
                        </motion.p>
                    </div>
                </div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => {
                        if (confirm("경고: 프로젝트를 포기하면 모든 진행 상황이 삭제됩니다. 계속하시겠습니까?")) {
                            onAbandonQuest();
                        }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-6 py-3 bg-black border border-red-500/30 text-red-500/50 hover:text-red-500 hover:border-red-500 hover:bg-red-500/5 transition-all skew-x-[-10deg] shadow-[0_0_20px_rgba(239,68,68,0)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                    <span className="skew-x-[10deg] text-[10px] font-cyber font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertTriangle size={14} /> ABANDON_PROTOCOL
                    </span>
                </motion.button>
            </div>


            {/* HUD / Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* XP Bar */}
                <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(255,0,255,0.2)" }}
                    className="glass-panel p-8 relative group border-cyber-pink/30 shadow-neon-pink/5 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Swords size={80} />
                    </div>
                    <div className="flex justify-between items-end mb-6 relative z-10">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-cyber font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse" /> Quest_Progress
                            </span>
                            <div className="text-4xl font-black text-white tracking-tighter">
                                {progress}<span className="text-xl text-cyber-pink ml-1">%</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden relative z-10 backdrop-blur-sm border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="bg-gradient-to-r from-cyber-pink to-purple-500 h-full relative shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:10px_10px]" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Time Bar */}
                <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,255,255,0.2)" }}
                    className="glass-panel p-8 relative group border-cyber-cyan/30 shadow-neon-cyan/5 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Clock size={80} />
                    </div>
                    <div className="flex justify-between items-end mb-6 relative z-10">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-cyber font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" /> Time_Elapsed
                            </span>
                            <div className="text-4xl font-black text-white tracking-tighter">
                                {daysPassed}<span className="text-xl text-zinc-500 ml-1 font-medium">/{30} Days</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden relative z-10 backdrop-blur-sm border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${timeProgress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full relative shadow-[0_0_15px_rgba(var(--cyber-cyan),0.5)] ${timeProgress > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyber-cyan to-blue-500'}`}
                        />
                    </div>
                </motion.div>

                {/* Status */}
                <motion.div
                    whileHover={{ y: -5, boxShadow: isAhead ? "0 10px 30px -10px rgba(0,255,255,0.2)" : "0 10px 30px -10px rgba(239,68,68,0.2)" }}
                    className={`glass-panel p-8 relative group flex items-start justify-between overflow-hidden
                        ${isAhead ? 'border-cyber-cyan/30 shadow-neon-cyan/5' : 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]'}
                    `}
                >
                    <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                        {isAhead ? <Crown size={120} /> : <AlertTriangle size={120} />}
                    </div>

                    <div className="relative z-10">
                        <span className="text-[10px] font-cyber font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full ${isAhead ? 'bg-cyber-cyan' : 'bg-red-500'} animate-pulse`} /> System_Status
                        </span>
                        <div className={`text-2xl font-black ${statusColor} italic tracking-wider uppercase leading-tight max-w-[150px]`}>
                            {statusMessage}
                        </div>
                    </div>
                    <motion.div
                        initial={{ rotate: 10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className={`p-3 bg-black/40 border-2 rounded-xl backdrop-blur-md relative z-10
                            ${isAhead ? 'border-cyber-cyan text-cyber-cyan shadow-neon-cyan' : 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}
                        `}
                    >
                        {isAhead ? <Crown size={32} /> : <AlertTriangle size={32} />}
                    </motion.div>
                </motion.div>
            </div>
        </header>
    );
}

