
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Plus } from 'lucide-react';
import { cardVariants } from '../constants';

interface AddMonthCardProps {
    isExtending: boolean;
    onExtend: () => void;
}

export function AddMonthCard({ isExtending, onExtend }: AddMonthCardProps) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            onClick={onExtend}
            className="w-[150px] shrink-0 border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-cyber-pink hover:bg-cyber-pink/5 transition-all group h-[460px] cyber-clipper-lg"
        >
            <div className="flex flex-col items-center gap-6">
                {isExtending ? (
                    <RefreshCw className="animate-spin text-cyber-pink" size={32} />
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyber-pink group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all bg-black">
                            <Plus className="text-white/20 group-hover:text-cyber-pink" size={24} />
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] font-cyber font-black text-white/20 group-hover:text-cyber-pink uppercase tracking-[0.2em] block rotate-90 whitespace-nowrap origin-center translate-y-8">
                                EXTEND_ROADMAP
                            </span>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
