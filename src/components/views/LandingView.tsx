import React from 'react';
import { BrainCircuit, ChevronRight, Sparkles, Scroll, Trophy } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
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
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);

    return (
        <div className="flex flex-col items-center min-h-[140vh] text-center px-4 relative overflow-hidden pb-40">
            {/* Dynamic Background Parallax Blobs */}
            <motion.div
                style={{ y: y1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10"
            />
            <motion.div
                style={{ y: y2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 4, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-1/2 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10"
            />

            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="mt-32 md:mt-48 max-w-5xl mx-auto z-10"
            >
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-sm text-primary font-bold mb-10 tracking-[0.2em] uppercase"
                >
                    <Sparkles size={16} className="text-primary animate-pulse" /> AI-Powered Implementation Suite
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-7xl md:text-9xl font-black tracking-tightest mb-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-600 leading-[1.05]"
                >
                    TURN IDEAS INTO <br />
                    <span className="text-glow text-primary relative inline-block">
                        REALITY
                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 1.2, duration: 1, ease: "circOut" }}
                            className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                        />
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-textMuted mb-16 max-w-3xl mx-auto leading-relaxed"
                >
                    SchemeLand gamifies your side projects. <br className="hidden md:block" />
                    Bridge the gap between vision and reality with <span className="text-white font-bold decoration-primary/50 underline underline-offset-8">Level 100</span> execution.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-8 justify-center items-center"
                >
                    {/* Main Action Button - Highly tactile */}
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 50px rgba(139, 92, 246, 0.6)",
                            backgroundColor: "#fff"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="group relative px-12 py-7 bg-white text-black font-black text-2xl rounded-2xl overflow-hidden transition-all shadow-2xl"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            START NEW QUEST
                            <ChevronRight className="group-hover:translate-x-2 transition-transform duration-300" strokeWidth={3} />
                        </span>
                        <motion.div
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-12"
                        />
                    </motion.button>

                    {hasProjects && (
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(39, 39, 42, 1)",
                                borderColor: "rgba(139, 92, 246, 0.5)",
                                color: "#fff"
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLoadSave}
                            className="px-12 py-7 bg-zinc-900 border border-zinc-800 text-white/70 font-bold text-2xl rounded-2xl transition-all backdrop-blur-sm"
                        >
                            LOAD SAVE
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>

            {/* Feature Grid with Entrance on Scroll */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-64 w-full px-4"
            >
                {[
                    { icon: <BrainCircuit size={44} className="text-primary" />, title: "Neural Analysis", desc: "Instantly evaluate technical feasibility and market potential with AI precision." },
                    { icon: <Scroll size={44} className="text-accent" />, title: "Quest Engine", desc: "Deconstruct massive goals into manageable weekly quests and daily tasks." },
                    { icon: <Trophy size={44} className="text-yellow-500" />, title: "XP Progression", desc: "Track your growth from Level 1 to 100 as you ship features and hit milestones." }
                ].map((feature, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -20, borderColor: "rgba(139, 92, 246, 0.4)", backgroundColor: "rgba(24, 24, 27, 0.8)" }}
                        className="glass-panel p-12 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 group cursor-default relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        <motion.div
                            whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.15 }}
                            className="bg-black/40 p-6 rounded-3xl mb-8 ring-1 ring-white/10 shadow-2xl backdrop-blur-md"
                        >
                            {feature.icon}
                        </motion.div>
                        <h3 className="text-3xl font-black mb-5 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                        <p className="text-textMuted text-xl leading-relaxed font-medium">{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Social Proof / Trust Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-40 text-zinc-500 font-mono text-sm tracking-[0.3em] uppercase underline-offset-8 underline decoration-white/5"
            >
                Trusted by 10,000+ Independent Builders
            </motion.div>
        </div>
    );
}
