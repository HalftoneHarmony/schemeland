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
    const dx = useSpring(useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30]), springConfig);
    const dy = useSpring(useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-30, 30]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Generate fixed random particles for the connectome to avoid hydration mismatches
    const particles = React.useMemo(() => [...Array(25)].map((_, i) => ({
        id: i,
        x: (i * 13) % 100,
        y: (i * 17) % 100,
        size: (i % 3) + 1.5,
        duration: 4 + (i % 6)
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Cyber Grid with pulsing intersections */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
            </div>

            {/* Neural Connectome - Moving lines between dots */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
                {particles.map((p, i) => (
                    <React.Fragment key={p.id}>
                        <motion.circle
                            cx={`${p.x}%`}
                            cy={`${p.y}%`}
                            r={p.size}
                            fill="var(--cyber-cyan)"
                            animate={{ opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: p.duration, repeat: Infinity }}
                        />
                        {/* Connect to next few particles */}
                        {particles.slice(i + 1, i + 3).map((p2, j) => (
                            <motion.line
                                key={`${p.id}-${p2.id}`}
                                x1={`${p.x}%`}
                                y1={`${p.y}%`}
                                x2={`${p2.x}%`}
                                y2={`${p2.y}%`}
                                stroke="var(--cyber-cyan)"
                                strokeWidth="0.5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.15, 0] }}
                                transition={{ duration: 4 + j, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </svg>

            {/* Floating Tactical Elements */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`hex-${i}`}
                    className="absolute text-cyber-pink/5"
                    style={{
                        left: ((i * 15) % 100) + "%",
                        top: ((i * 19) % 100) + "%",
                        x: dx,
                        y: dy,
                    }}
                    animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-48 h-48 border border-current rounded-[3rem] rotate-12 flex items-center justify-center">
                        <div className="w-24 h-24 border border-current rounded-full opacity-20" />
                    </div>
                </motion.div>
            ))}

            {/* Central Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.05, 0.1, 0.05]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-cyber-pink/10 rounded-full blur-[180px]"
            />

            {/* CRT Scanline & Glitch */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40" />
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
                    className="relative group mb-12 px-10"
                >
                    <div className="absolute -inset-20 bg-cyber-pink/10 blur-[120px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
                    <h1 className="text-8xl md:text-[11rem] font-cyber font-black tracking-tighter text-white leading-[0.8] uppercase italic relative">
                        <span className="block mb-2 text-white/90 drop-shadow-sm pr-10">SCHEME</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink relative inline-block drop-shadow-[0_0_40px_rgba(0,255,255,0.2)] pr-12">
                            LAND
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center gap-6 mb-24 relative"
                >
                    <div className="flex items-center gap-4 text-xs font-mono text-white/40 uppercase tracking-[0.4em] mb-2 bg-black/40 px-6 py-2 border border-white/5 shadow-2xl skew-x-[-10deg]">
                        <div className="skew-x-[10deg] flex items-center gap-4">
                            <Activity size={12} className="text-cyber-cyan animate-pulse" />
                            <span>Neural_Link_Protocol::Active</span>
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-neon-cyan animate-pulse" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-cyber-cyan to-transparent opacity-50" />
                        <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-loose font-mono uppercase tracking-[0.2em] relative pl-6">
                            뉴럴 개념과 실질적인 배포 사이의 간극을 해소합니다.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-10 justify-center items-center"
                >
                    <div className="relative group">
                        {/* Animated Gradient Border Layer */}
                        <motion.div
                            animate={{
                                background: [
                                    "conic-gradient(from 0deg at 50% 50%, #ff00ff, #00ffff, #ff00ff)",
                                    "conic-gradient(from 360deg at 50% 50%, #ff00ff, #00ffff, #ff00ff)"
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-[4px] blur-[10px] opacity-80 group-hover:opacity-100 group-hover:blur-[15px] transition-all duration-500 skew-x-[-10deg]"
                        />
                        <Button
                            size="lg"
                            onClick={onStart}
                            className="h-28 px-20 text-4xl bg-gradient-to-r from-cyber-pink via-cyber-pink/90 to-cyber-cyan border-none relative overflow-hidden group/btn hover:scale-105 transition-all duration-500 shadow-[0_0_50px_rgba(255,0,255,0.4)]"
                        >
                            {/* Inner Gloss Layer */}
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_200%] animate-shimmer opacity-0 group-hover/btn:opacity-100 transition-opacity" />

                            <Zap className="mr-8 group-hover/btn:rotate-12 transition-transform text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" fill="white" size={42} />
                            <span className="relative z-10 font-cyber font-black tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] group-hover/btn:scale-110 transition-transform duration-300">
                                새로운 프로젝트 추가
                            </span>

                            {/* High-speed Scanning Line */}
                            <motion.div
                                animate={{ top: ["-10%", "110%"] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-[4px] bg-white shadow-[0_0_15px_#fff] z-20 opacity-60"
                            />
                        </Button>
                    </div>

                    {hasProjects && (
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-cyber-cyan/20 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 skew-x-[-10deg]" />
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={onLoadSave}
                                className="h-28 px-20 text-4xl bg-black/60 backdrop-blur-3xl border-[3px] border-cyber-cyan/50 hover:border-cyber-cyan transition-all duration-500 hover:scale-105 overflow-hidden group/btn"
                            >
                                <div className="absolute inset-0 bg-cyber-cyan/10 group-hover/btn:bg-cyber-cyan/20 transition-colors" />
                                <Terminal className="mr-8 group-hover/btn:text-cyber-cyan group-hover/btn:scale-110 transition-all drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]" size={42} />
                                <span className="font-cyber font-black tracking-widest text-cyber-cyan group-hover/btn:text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] transition-colors">
                                    저장_데이터_로드
                                </span>

                                <motion.div
                                    className="absolute inset-0 border-[4px] border-cyber-cyan opacity-0"
                                    whileHover={{ opacity: [0, 0.5, 0], scale: [1, 1.3] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                />
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Tactical Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
            >
                <div className="text-[8px] font-cyber font-black text-white/20 uppercase tracking-[0.5em] mb-2">Scroll_to_Analyze</div>
                <div className="w-px h-16 bg-gradient-to-b from-cyber-cyan to-transparent relative overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-white"
                    />
                </div>
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
