import React from 'react';
import { BrainCircuit, ChevronRight, Sparkles, Scroll, Trophy, Zap, Terminal, Activity, Cpu } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../Button';

interface LandingViewProps {
    onStart: () => void;
    onLoadSave: () => void;
    hasProjects: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
};

export function LandingView({ onStart, onLoadSave, hasProjects }: LandingViewProps) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

    return (
        <div className="flex flex-col items-center min-h-[160vh] text-center px-4 relative overflow-hidden pb-40 bg-black font-sans">
            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_70%)]" />
            </div>

            {/* Dynamic Background Parallax Blobs */}
            <motion.div
                style={{ y: y1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-cyber-pink/20 rounded-full blur-[150px] -z-10"
            />
            <motion.div
                style={{ y: y2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 4, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-1/2 right-1/4 w-[600px] h-[600px] bg-cyber-cyan/10 rounded-full blur-[120px] -z-10"
            />

            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="mt-32 md:mt-56 max-w-6xl mx-auto z-10"
            >
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-3 px-6 py-2 bg-black border border-cyber-pink/30 text-[10px] font-cyber font-black text-cyber-pink mb-12 tracking-[0.4em] uppercase skew-x-[-15deg] shadow-neon-pink"
                >
                    <div className="skew-x-[15deg] flex items-center gap-3">
                        <Sparkles size={14} className="animate-pulse" /> AI_IMPLEMENTATION_PROTOCOL_v4.2
                    </div>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-7xl md:text-[10rem] font-cyber font-black tracking-tighter mb-12 text-white leading-[0.85] uppercase italic"
                >
                    COMMAND <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink relative inline-block">
                        REALITY
                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: "110%" }}
                            transition={{ delay: 1.2, duration: 1.5, ease: "circOut" }}
                            className="absolute -bottom-4 -left-[5%] h-3 bg-gradient-to-r from-cyber-cyan to-cyber-pink shadow-neon-cyan opacity-80"
                        />
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-white/40 mb-20 max-w-3xl mx-auto leading-relaxed font-mono uppercase tracking-widest"
                >
                    Bridging the gap between neural concepts and physical deployment. <br className="hidden md:block" />
                    Gamify your stack with <span className="text-cyber-cyan font-bold glow">Tier_One</span> execution capabilities.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-10 justify-center items-center"
                >
                    <Button
                        size="lg"
                        onClick={onStart}
                        className="h-20 px-16 text-xl shadow-neon-pink hover:bg-white hover:text-black transition-all"
                    >
                        <Zap className="mr-3" fill="currentColor" /> INITIALIZE_QUEST
                    </Button>

                    {hasProjects && (
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={onLoadSave}
                            className="h-20 px-16 text-xl group"
                        >
                            <Terminal className="mr-3 group-hover:text-black transition-colors" /> LOAD_SAVE_STATE
                        </Button>
                    )}
                </motion.div>
            </motion.div>

            {/* Tactical Grid Overlay */}
            <div className="absolute top-0 right-0 p-12 text-right opacity-10 font-mono text-[10px] space-y-2 pointer-events-none hidden lg:block">
                <div>SYS_REF: [0x544E]</div>
                <div>LOCAL_SYNC: STABLE</div>
                <div>NEURAL_LINK: ACTIVE</div>
            </div>

            {/* Feature Grid */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto mt-72 w-full px-4 relative z-10"
            >
                {[
                    { icon: <Cpu size={48} className="text-cyber-cyan" />, title: "NEURAL_CORE", desc: "Instantly evaluate technical feasibility and market potential with high-bandwidth AI precision.", color: "border-cyber-cyan/20", glow: "shadow-neon-cyan" },
                    { icon: <Activity size={48} className="text-cyber-pink" />, title: "QUEST_ENGINE", desc: "Deconstruct massive goals into manageable weekly tactical operations and daily sub-tasks.", color: "border-cyber-pink/20", glow: "shadow-neon-pink" },
                    { icon: <Trophy size={48} className="text-cyber-yellow" />, title: "XP_EVOLUTION", desc: "Track your architectural growth from Rank 01 to Apex Legend as you deploy features.", color: "border-cyber-yellow/20", glow: "shadow-neon-yellow" }
                ].map((feature, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        className={`
                            glass-panel p-12 flex flex-col items-center text-center transition-all duration-700 bg-black/60 border-2 ${feature.color} hover:bg-white/5 group h-full skew-x-[-2deg]
                        `}
                    >
                        <div className="skew-x-[2deg] flex flex-col items-center">
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                className={`w-20 h-20 bg-black border-2 ${feature.color} flex items-center justify-center mb-10 group-hover:${feature.glow} transition-all`}
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-2xl font-cyber font-black mb-6 tracking-widest text-white group-hover:text-white transition-colors uppercase italic">{feature.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed font-mono uppercase tracking-tighter">{feature.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Bottom Status Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-48 flex items-center gap-6 px-10 py-4 border-2 border-white/5 bg-white/5 backdrop-blur-3xl font-cyber font-black text-[10px] text-white/20 uppercase tracking-[0.5em] skew-x-[-15deg]"
            >
                <div className="skew-x-[15deg] flex items-center gap-10">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyber-pink animate-pulse" /> GLOBAL_SYNC_STABLE
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyber-cyan animate-pulse" /> 10,245_BUILDERS_ONLINE
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyber-yellow animate-pulse" /> SECURE_NEURAL_LINK
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
