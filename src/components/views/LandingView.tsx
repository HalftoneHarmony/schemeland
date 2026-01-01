import React, { useState, useEffect } from 'react';
import { BrainCircuit, ChevronRight, Sparkles, Scroll, Trophy, Zap, Terminal, Activity, Cpu } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
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

const NeuralBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const dx = useSpring(useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-20, 20]), springConfig);
    const dy = useSpring(useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-20, 20]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Animated Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--cyber-cyan)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--cyber-cyan)" stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--cyber-cyan)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[...Array(15)].map((_, i) => (
                    <motion.line
                        key={i}
                        x1={((i * 7) % 100) + "%"}
                        y1="-10%"
                        x2={((i * 7 + 5) % 100) + "%"}
                        y2="110%"
                        stroke="url(#lineGrad)"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 1, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: 5 + (i % 5),
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5
                        }}
                    />
                ))}
            </svg>

            {/* Floating Particles */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
                    style={{
                        left: ((i * 13) % 100) + "%",
                        top: ((i * 17) % 100) + "%",
                        x: dx,
                        y: dy,
                    }}
                    animate={{
                        opacity: [0.1, 0.5, 0.1],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 3 + (i % 4),
                        repeat: Infinity,
                        delay: i * 0.1
                    }}
                />
            ))}

            {/* Floating Hexagons with Mouse Parallax */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-cyber-pink/10"
                    style={{
                        left: ((i * 23) % 100) + "%",
                        top: ((i * 29) % 100) + "%",
                        x: useSpring(useTransform(mouseX, [0, 1920], [-(i + 1) * 5, (i + 1) * 5]), springConfig),
                        y: useSpring(useTransform(mouseY, [0, 1080], [-(i + 1) * 5, (i + 1) * 5]), springConfig),
                    }}
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 360],
                        opacity: [0.05, 0.15, 0.05],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 15 + (i % 10),
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className={`border border-current rounded-3xl rotate-45 ${i % 2 === 0 ? 'w-32 h-32' : 'w-16 h-16'}`} />
                </motion.div>
            ))}

            {/* Pulse Orb behind Text */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyber-pink/5 rounded-full blur-[150px]"
            />

            {/* Scanline flickering effect */}
            <motion.div
                animate={{ opacity: [0.02, 0.08, 0.02] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"
            />
        </div>
    );
};

export function LandingView({ onStart, onLoadSave, hasProjects }: LandingViewProps) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

    return (
        <div className="flex flex-col items-center min-h-[160vh] text-center px-4 relative overflow-hidden pb-40 bg-black font-sans">
            <NeuralBackground />

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
                        <Sparkles size={14} className="animate-pulse" /> AI_실행_프로토콜_v4.2
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="relative group mb-8"
                >
                    <div className="absolute -inset-10 bg-cyber-pink/20 blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
                    <h1 className="text-8xl md:text-[11rem] font-cyber font-black tracking-tighter text-white leading-[0.8] uppercase italic relative">
                        <span className="block mb-2 text-white/90">SCHEME</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink relative inline-block drop-shadow-[0_0_30px_rgba(255,0,255,0.3)]">
                            LAND
                            <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: "115%" }}
                                transition={{ delay: 1.2, duration: 1.5, ease: "circOut" }}
                                className="absolute -bottom-4 -left-[7.5%] h-3 bg-gradient-to-r from-cyber-cyan to-cyber-pink shadow-neon-cyan opacity-80"
                            />
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-white/50 mb-20 max-w-2xl mx-auto leading-relaxed font-mono uppercase tracking-[0.2em] relative"
                >
                    <span className="block mb-2 border-l-2 border-cyber-cyan pl-4 text-left mx-auto w-fit">
                        뉴럴 개념과 실질적인 배포 사이의 간극을 해소합니다.
                    </span>
                    <span className="block text-cyber-cyan font-bold glow tracking-[0.3em]">
                        TIER_ONE_EXECUTION_LEVEL_100
                    </span>
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-10 justify-center items-center"
                >
                    <Button
                        size="lg"
                        onClick={onStart}
                        className="h-24 px-16 text-2xl shadow-neon-pink hover:bg-white hover:text-black transition-all hover:scale-110 group relative overflow-hidden"
                    >
                        <Zap className="mr-4 group-hover:rotate-12 transition-transform" fill="currentColor" size={28} />
                        <span className="relative z-10">새로운 프로젝트 추가</span>
                        <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 opacity-10" />
                    </Button>

                    {hasProjects && (
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={onLoadSave}
                            className="h-24 px-16 text-2xl group hover:scale-110 bg-black/40 backdrop-blur-xl border-cyber-cyan/30"
                        >
                            <Terminal className="mr-4 group-hover:text-cyber-cyan transition-colors" size={28} />
                            <span>저장_데이터_로드</span>
                        </Button>
                    )}
                </motion.div>
            </motion.div>

            {/* Tactical Grid Overlay */}
            <div className="absolute top-0 right-0 p-12 text-right opacity-10 font-mono text-[10px] space-y-2 pointer-events-none hidden lg:block">
                <div>시스템_참조: [0x544E]</div>
                <div>로컬_동기화: 안정</div>
                <div>뉴럴_링크: 활성화</div>
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
                    { icon: <Cpu size={48} className="text-cyber-cyan" />, title: "뉴럴_코어", desc: "고대역폭 AI 정밀도로 기술적 타당성과 시장 잠재력을 즉각적으로 평가합니다.", color: "border-cyber-cyan/20", glow: "shadow-neon-cyan" },
                    { icon: <Activity size={48} className="text-cyber-pink" />, title: "퀘스트_엔진", desc: "거대한 목표를 관리 가능한 주간 전술 운영 및 일일 하위 작업으로 해체합니다.", color: "border-cyber-pink/20", glow: "shadow-neon-pink" },
                    { icon: <Trophy size={48} className="text-cyber-yellow" />, title: "XP_진화", desc: "기능을 배포하면서 랭크 01부터 에이펙스 레전드까지 아키텍처 성장을 추적하세요.", color: "border-cyber-yellow/20", glow: "shadow-neon-yellow" }
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
                        <div className="w-1.5 h-1.5 bg-cyber-pink animate-pulse" /> 글로벌_동기화_안정
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyber-cyan animate-pulse" /> 10,245_빌더_접속_중
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyber-yellow animate-pulse" /> 보안_뉴럴_링크_활성
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
