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
                        className="w-28 h-28 bg-black border-2 border-white/10 flex items-center justify-center text-7xl shadow-2xl shrink-0 cursor-default relative overflow-hidden group cyber-clipper"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* XP Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative p-7 overflow-hidden group cursor-default cyber-clipper"
                >
                    {/* Card Background with glassmorphism */}
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xl border border-white/10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-pink/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Decorative Icon */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Swords size={48} className="text-cyber-pink" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
                            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Quest Progress</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-5xl font-black text-white tracking-tighter">{progress}</span>
                            <span className="text-2xl font-bold text-cyber-pink">%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-cyber-pink via-purple-500 to-cyber-pink rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Time Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative p-7 overflow-hidden group cursor-default cyber-clipper"
                >
                    {/* Card Background with glassmorphism */}
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xl border border-white/10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Decorative Icon */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Clock size={48} className="text-cyber-cyan" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Time Elapsed</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-5xl font-black text-white tracking-tighter">{daysPassed}</span>
                            <span className="text-xl font-medium text-zinc-500">/30</span>
                            <span className="text-sm font-medium text-zinc-600 ml-1">days</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${timeProgress}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={`h-full rounded-full ${timeProgress > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyber-cyan via-blue-500 to-cyber-cyan'}`}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative p-7 overflow-hidden group cursor-default cyber-clipper"
                >
                    {/* Card Background with glassmorphism */}
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xl border border-white/10" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${isAhead ? 'from-cyber-cyan/10' : 'from-red-500/10'} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Decorative Icon */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        {isAhead ? <Crown size={48} className="text-cyber-cyan" /> : <AlertTriangle size={48} className="text-red-500" />}
                    </div>

                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`w-2 h-2 rounded-full ${isAhead ? 'bg-cyber-cyan' : 'bg-red-500'} animate-pulse shadow-[0_0_10px_${isAhead ? 'rgba(0,255,255,0.8)' : 'rgba(239,68,68,0.8)'}]`} />
                                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">System Status</span>
                            </div>
                            <div className={`text-3xl font-black ${isAhead ? 'text-cyber-cyan' : 'text-red-500'} tracking-tight uppercase italic`}>
                                {isAhead ? 'SYNC_OK' : 'DELAYED'}
                            </div>
                            <p className="text-xs text-zinc-500 mt-2 font-medium">
                                {isAhead ? '목표 달성률이 시간보다 앞서고 있습니다' : '일정이 지연되고 있습니다'}
                            </p>
                        </div>
                        <motion.div
                            animate={isAhead ? { rotate: [0, 5, -5, 0] } : { scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`p-3 rounded-xl border-2 ${isAhead ? 'border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan' : 'border-red-500/50 bg-red-500/10 text-red-500'}`}
                        >
                            {isAhead ? <Crown size={28} /> : <AlertTriangle size={28} />}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}

