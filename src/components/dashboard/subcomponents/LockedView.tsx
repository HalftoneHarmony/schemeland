
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Zap } from 'lucide-react';
import { Button } from '../../ui';

interface LockedViewProps {
    isExpandingVision: boolean;
    handleExpandVision: () => void;
}

export function LockedView({ isExpandingVision, handleExpandVision }: LockedViewProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <motion.div
                animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                    boxShadow: [
                        "0 0 0px rgba(0,255,255,0)",
                        "0 0 30px rgba(0,255,255,0.3)",
                        "0 0 0px rgba(0,255,255,0)"
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 bg-black border-2 border-white/5 flex items-center justify-center mb-8 relative group cyber-clipper"
            >
                <motion.div
                    className="absolute inset-0 bg-cyber-cyan/10 blur-[30px]"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <Lock size={36} className="text-white/20 group-hover:text-cyber-cyan group-hover:animate-glitch-skew transition-colors" />
                </motion.div>
            </motion.div>
            <motion.h4
                className="text-3xl font-cyber font-black text-white mb-3 uppercase tracking-widest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Sector_Locked::섹터_잠김
            </motion.h4>
            <motion.p
                className="text-white/30 mb-10 max-w-sm font-mono text-xs uppercase tracking-tighter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                미래 궤적 경로를 해독하기 위해 기반 프로토콜 마일스톤을 달성하세요.
            </motion.p>
            {!isExpandingVision ? (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={handleExpandVision}
                        className="h-14 bg-white text-black hover:bg-cyber-cyan hover:text-black border-none px-10 text-xs font-cyber font-black shadow-neon-cyan skew-x-[-10deg]"
                    >
                        <span className="skew-x-[10deg] flex items-center gap-3">
                            <Sparkles size={16} /> 비전_로드맵_해독_시작
                        </span>
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-cyber font-black text-xs flex items-center gap-4 bg-cyber-cyan/5 shadow-neon-cyan"
                    animate={{ borderColor: ["rgba(0,255,255,0.5)", "rgba(0,255,255,1)", "rgba(0,255,255,0.5)"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Zap size={16} />
                    </motion.div>
                    뉴럴_네트워크_동기화_중...
                </motion.div>
            )}
        </div>
    );
}
