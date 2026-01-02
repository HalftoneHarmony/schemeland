import React from 'react';
import { Swords, Clock, Crown, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
    progress: number;
    sprintDaysPassed: number;
    sprintProgress: number;
    yearDaysPassed: number;
    yearProgress: number;
    isAhead: boolean;
}

export function DashboardStats({ progress, sprintDaysPassed, sprintProgress, yearDaysPassed, yearProgress, isAhead }: DashboardStatsProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* XP Bar */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="relative p-5 overflow-hidden group cursor-default cyber-clipper bg-zinc-950/80 border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-pink/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink animate-pulse shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
                            <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">Quest Progress</span>
                        </div>
                        <Swords size={16} className="text-cyber-pink opacity-50" />
                    </div>

                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-black text-white tracking-tighter">{progress}</span>
                        <span className="text-sm font-bold text-cyber-pink">%</span>
                    </div>

                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
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

            {/* Time Bar (Year) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative p-5 overflow-hidden group cursor-default cyber-clipper bg-zinc-950/80 border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                            <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">Time Elapsed (Year)</span>
                        </div>
                        <Clock size={16} className="text-cyber-cyan opacity-50" />
                    </div>

                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-black text-white tracking-tighter">{yearDaysPassed}</span>
                        <span className="text-xs font-medium text-zinc-500">/365</span>
                        <span className="text-[9px] font-medium text-zinc-600 ml-1">days</span>
                    </div>

                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${yearProgress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full rounded-full bg-gradient-to-r from-cyber-cyan via-blue-500 to-cyber-cyan`}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Sprint Bar */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.02 }}
                className="relative p-5 overflow-hidden group cursor-default cyber-clipper bg-zinc-950/80 border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-yellow/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-yellow animate-pulse shadow-[0_0_10px_rgba(255,255,0,0.8)]" />
                            <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">Sprint Elapsed</span>
                        </div>
                        <Zap size={16} className="text-cyber-yellow opacity-50" />
                    </div>

                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-black text-white tracking-tighter">{sprintDaysPassed}</span>
                        <span className="text-xs font-medium text-zinc-500">/30</span>
                        <span className="text-[9px] font-medium text-zinc-600 ml-1">days</span>
                    </div>

                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sprintProgress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full rounded-full ${sprintProgress > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-cyber-yellow via-orange-500 to-cyber-yellow'}`}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Status */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="relative p-5 overflow-hidden group cursor-default cyber-clipper bg-zinc-950/80 border border-white/10"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${isAhead ? 'from-cyber-cyan/5' : 'from-red-500/5'} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isAhead ? 'bg-cyber-cyan' : 'bg-red-500'} animate-pulse shadow-[0_0_10px_${isAhead ? 'rgba(0,255,255,0.8)' : 'rgba(239,68,68,0.8)'}]`} />
                            <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">System Status</span>
                        </div>
                        {isAhead ? <Crown size={16} className="text-cyber-cyan opacity-50" /> : <AlertTriangle size={16} className="text-red-500 opacity-50" />}
                    </div>

                    <div>
                        <div className={`text-xl font-black ${isAhead ? 'text-cyber-cyan' : 'text-red-500'} tracking-tight uppercase italic`}>
                            {isAhead ? 'SYNC_OK' : 'DELAYED'}
                        </div>
                        <p className="text-[9px] text-zinc-500 mt-1 font-medium leading-tight">
                            {isAhead ? '목표 달성률이 시간보다 앞서고 있습니다' : '일정이 지연되고 있습니다'}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
