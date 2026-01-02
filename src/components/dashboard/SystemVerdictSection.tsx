import React from 'react';
import { motion } from 'framer-motion';
import { IdeaAnalysis } from '../../types';
import { ShieldCheck, TrendingUp, Zap, Gauge, Terminal } from 'lucide-react';

interface SystemVerdictProps {
    analysis: IdeaAnalysis;
}

export function SystemVerdictSection({ analysis }: SystemVerdictProps) {
    if (!analysis) return null;

    const { feasibility, marketPotential, excitement, speedToMVP } = analysis.metrics;

    // Radar Chart Helper
    const center = 100;
    const radius = 80;
    const maxVal = 100;

    const getPoint = (value: number, angleDeg: number) => {
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const r = (value / maxVal) * radius;
        const x = center + r * Math.cos(angleRad);
        const y = center + r * Math.sin(angleRad);
        return `${x},${y}`;
    };

    // 4축: 상(실현성), 우(시장성), 하(흥미도), 좌(신속성)
    const p1 = getPoint(feasibility, 0);    // Top
    const p2 = getPoint(marketPotential, 90); // Right
    const p3 = getPoint(excitement, 180);   // Bottom
    const p4 = getPoint(speedToMVP, 270);   // Left

    const polygonPoints = `${p1} ${p2} ${p3} ${p4}`;

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[320px]">
            {/* Left: Radar Chart & Metrics */}
            <div className="w-full lg:w-1/3 min-w-[300px] glass-panel border border-cyber-pink/30 p-6 relative flex flex-col items-center justify-center bg-black/40">
                <div className="absolute top-0 left-0 p-2 opacity-50">
                    <span className="text-[10px] font-cyber text-cyber-pink tracking-widest">METRICS_VISUALIZER</span>
                </div>

                <div className="relative w-[200px] h-[200px] mt-4">
                    {/* Background Grid */}
                    <svg width="200" height="200" className="opacity-20 overflow-visible">
                        <circle cx="100" cy="100" r="20" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" />

                        {/* Cross Lines */}
                        <line x1="100" y1="20" x2="100" y2="180" stroke="white" strokeWidth="1" />
                        <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeWidth="1" />

                        {/* Labels */}
                        <text x="100" y="15" textAnchor="middle" fill="white" fontSize="10" className="font-mono">실현성</text>
                        <text x="190" y="105" textAnchor="middle" fill="white" fontSize="10" className="font-mono">시장성</text>
                        <text x="100" y="195" textAnchor="middle" fill="white" fontSize="10" className="font-mono">흥미도</text>
                        <text x="10" y="105" textAnchor="middle" fill="white" fontSize="10" className="font-mono">신속성</text>
                    </svg>

                    {/* Data Polygon */}
                    <svg width="200" height="200" className="absolute top-0 left-0 overflow-visible">
                        <motion.polygon
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.6, scale: 1 }}
                            transition={{ duration: 1, type: 'spring' }}
                            points={polygonPoints}
                            fill="rgba(255, 0, 255, 0.3)"
                            stroke="#ff00ff"
                            strokeWidth="2"
                            className="drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                        />
                        {/* Points */}
                        {[p1, p2, p3, p4].map((point, i) => {
                            const [cx, cy] = point.split(',');
                            return (
                                <motion.circle
                                    key={i}
                                    cx={cx}
                                    cy={cy}
                                    r="3"
                                    fill="#fff"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                />
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Right: Verdict Text */}
            <div className="flex-1 glass-panel border border-cyber-yellow/30 p-6 relative flex flex-col bg-black/40">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                    <Terminal size={18} className="text-cyber-yellow" />
                    <h3 className="font-cyber font-black text-lg text-white/90 tracking-wider">SYSTEM_VERDICT::시스템_판결</h3>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {analysis.oneLiner && (
                        <div className="mb-4 p-4 bg-cyber-yellow/5 border-l-2 border-cyber-yellow">
                            <p className="text-cyber-yellow font-bold text-sm tracking-wide">"{analysis.oneLiner}"</p>
                        </div>
                    )}

                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line font-mono">
                        {analysis.reasoning}
                    </div>
                </div>

                <div className="mt-4 flex gap-4 text-[10px] text-white/30 font-mono pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1">
                        <ShieldCheck size={12} /> VERIFIED_DATA
                    </div>
                    <div className="flex items-center gap-1">
                        <Zap size={12} /> AI_GENERATED
                    </div>
                    <div className="flex-1 text-right">
                        ID: {analysis.id.slice(0, 8)}...
                    </div>
                </div>
            </div>
        </div>
    );
}
