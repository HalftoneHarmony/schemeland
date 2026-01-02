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

    // Text Decoding Effect Hook
    const useScrambleText = (text: string, trigger: boolean) => {
        const [display, setDisplay] = React.useState(text);

        React.useEffect(() => {
            if (!trigger) return;

            let iteration = 0;
            const interval = setInterval(() => {
                setDisplay(
                    text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) return text[index];
                            return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                        })
                        .join("")
                );

                if (iteration >= text.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);

            return () => clearInterval(interval);
        }, [text, trigger]);

        return display;
    };

    const titleText = useScrambleText(activeProject.selectedIdea.title, true);

    return (
        <header className="mb-20 relative group/header perspective-[2000px]">
            {/* 1. Dynamic Background Grid */}
            <div className="absolute inset-0 -mx-4 md:-mx-10 -my-4 rounded-3xl overflow-hidden pointer-events-none border border-white/5">
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />

                {/* Moving Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

                {/* Scanning Light Beam */}
                <motion.div
                    animate={{ top: ['0%', '100%', '0%'], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-cyan-500/50 blur-[2px] shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                />
            </div>

            <div className="relative py-8 px-4 flex flex-col md:flex-row gap-8 items-center justify-between z-10">

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 z-10 w-full">
                    {/* 2. Holographic Projection Icon */}
                    <div className="relative shrink-0 perspective-[1000px] group/icon">
                        <motion.div
                            initial={{ scale: 0, opacity: 0, rotateX: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                            whileHover={{ rotateY: 180, scale: 1.1 }}
                            className="w-36 h-36 relative flex items-center justify-center transform-style-3d cursor-pointer"
                        >
                            {/* Emitter Base */}
                            <div className="absolute bottom-0 w-24 h-24 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-full blur-xl animate-pulse" />

                            {/* Rotating Hologram Rings */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotateZ: [0, 360], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "linear", delay: i }}
                                    className={`absolute inset-${i * 2} rounded-full border border-cyan-500/${20 - i * 5} border-dashed`}
                                />
                            ))}

                            {/* Main Content Container */}
                            <div className="relative w-full h-full bg-black/40 backdrop-blur-md border border-white/10 cyber-clipper flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.1)] group-hover/icon:shadow-[0_0_50px_rgba(0,255,255,0.3)] transition-shadow duration-500">
                                <span className="text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] filter grayscale group-hover/icon:grayscale-0 transition-all duration-500 backface-visible">
                                    {activeProject.selectedIdea.emoji || '🚀'}
                                </span>

                                {/* Vertical Scan Beam */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-[10%] w-full animate-scanline pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Floor Reflection */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-500/20 blur-2xl rounded-[100%] opacity-0 group-hover/icon:opacity-60 transition-opacity duration-500" />
                    </div>

                    <div className="pt-2 flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            {/* 3. Decoding Title */}
                            <motion.h1
                                className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-zinc-500 uppercase"
                            >
                                {titleText}
                            </motion.h1>

                            {/* 4. Live Data Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="relative h-8 bg-cyan-950/30 border border-cyan-500/30 px-3 flex items-center gap-2 rounded-sm overflow-hidden"
                            >
                                <div className="flex gap-0.5 items-end h-4">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: ['20%', '100%', '40%'] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                                            className="w-1 bg-cyan-400"
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-cyber font-bold text-cyan-400 tracking-widest">
                                    ONLINE
                                </span>
                            </motion.div>
                        </div>

                        {/* Description with Typing Effect Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="relative max-w-3xl mx-auto md:mx-0"
                        >
                            <div className="absolute -left-6 top-1 bottom-1 w-1 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-0 md:opacity-50" />
                            <p className="md:pl-6 text-xl md:text-2xl text-zinc-400 font-light leading-relaxed tracking-tight">
                                "{activeProject.analysis.oneLiner}"
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* 5. Critical Action Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="shrink-0"
                >
                    <motion.button
                        onClick={() => {
                            if (confirm("WARNING: CRITICAL DATA PURGE INITIATED. CONFIRM?")) {
                                onAbandonQuest();
                            }
                        }}
                        className="relative group/btn overflow-hidden px-8 py-4 bg-red-950/20 border border-red-500/30 hover:border-red-500 transition-all cyber-clipper"
                    >
                        {/* Hazard Stripes Background */}
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)] animate-[shine_1s_linear_infinite]" />

                        <div className="relative z-10 flex items-center gap-3">
                            <AlertTriangle size={18} className="text-red-500 animate-pulse" />
                            <span className="text-xs font-cyber font-black uppercase tracking-[0.25em] text-red-500 group-hover/btn:text-red-400 transition-colors">
                                ABANDON_QUEST
                            </span>
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </header>
    );
}
