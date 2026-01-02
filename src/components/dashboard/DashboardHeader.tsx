import React from 'react';
import {
    AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectScheme } from '../../types';

interface DashboardHeaderProps {
    activeProject: ProjectScheme;
    isPreviewMode: boolean;
    onAbandonQuest: () => void;

}

export function DashboardHeader({
    activeProject, isPreviewMode, onAbandonQuest
}: DashboardHeaderProps) {

    return (
        <header className="mb-12 relative group/header">
            {/* Background Panel - Mission Control Style */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/50 via-zinc-900/20 to-transparent skew-x-[-10deg] border-t border-b border-white/5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-cyber-pink/5 to-transparent skew-x-[-10deg] pointer-events-none" />

            <div className="relative py-8 px-4 flex flex-col md:flex-row gap-8 items-start justify-between">

                <div className="flex items-start gap-8 z-10">
                    {/* Hero Icon with Holographic Effect */}
                    <div className="relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-32 h-32 relative flex items-center justify-center shrink-0 z-10"
                        >
                            {/* Rotating Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-dashed border-white/20"
                            />
                            <motion.div
                                animate={{ rotate: -180 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-2 rounded-full border border-dotted border-cyber-pink/30"
                            />

                            {/* Hexagon Clip Container for Emoji */}
                            <div className="absolute inset-4 bg-black/80 flex items-center justify-center border border-white/10 cyber-clipper shadow-2xl overflow-hidden group-hover/header:border-cyber-pink/50 transition-colors duration-500">
                                <span className="text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] filter grayscale group-hover/header:grayscale-0 transition-all duration-500 scale-110">
                                    {activeProject.selectedIdea.emoji || '🚀'}
                                </span>

                                {/* Scanline Effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-pink/10 to-transparent h-[20%] w-full animate-scanline opacity-0 group-hover/header:opacity-100 pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Floor projection */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-cyber-pink/20 blur-xl rounded-[100%] opacity-50" />
                    </div>

                    <div className="pt-1">
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                            {/* Main Title with Glitch/Gradient */}
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-500"
                            >
                                {activeProject.selectedIdea.title}
                            </motion.h1>

                            {/* Status Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="relative py-1 px-3"
                            >
                                <div className="absolute inset-0 bg-cyber-cyan/10 skew-x-[-10deg] border border-cyber-cyan/30" />
                                <div className="relative flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse shadow-[0_0_8px_cyan]" />
                                    <span className="text-[10px] font-cyber font-black text-cyber-cyan tracking-[0.2em] uppercase">
                                        Active_Protocol
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="relative max-w-3xl"
                        >
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyber-pink/30 rounded-full" />
                            <p className="pl-6 text-xl md:text-2xl text-zinc-400 font-light leading-relaxed tracking-tight group-hover/header:text-white transition-colors duration-300">
                                "{activeProject.analysis.oneLiner}"
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10"
                >
                    <motion.button
                        onClick={() => {
                            if (confirm("WARNING: ABANDONING PROTOCOL WILL PURGE ALL DATA. EXECUTE?")) {
                                onAbandonQuest();
                            }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group/btn overflow-hidden px-8 py-4 bg-black/50 border border-red-500/30 hover:border-red-500 hover:bg-red-500/5 transition-all cyber-clipper"
                    >
                        {/* Stripes Background */}
                        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#ef4444_5px,#ef4444_10px)]" />

                        <span className="relative z-10 text-xs font-cyber font-black uppercase tracking-[0.25em] text-red-500/70 group-hover/btn:text-red-500 flex items-center gap-3">
                            <AlertTriangle size={16} />
                            <span>Abandon</span>
                        </span>
                    </motion.button>
                </motion.div>
            </div>
        </header>
    );
}

