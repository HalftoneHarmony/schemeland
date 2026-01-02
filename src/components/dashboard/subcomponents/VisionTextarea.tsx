/**
 * @file components/dashboard/subcomponents/VisionTextarea.tsx
 * Vision 섹션의 텍스트 입력 컴포넌트
 */

import React from 'react';
import { motion } from 'framer-motion';

interface VisionTextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    label: string;
    rows?: number;
}

export function VisionTextarea({ value, onChange, label, rows = 2 }: VisionTextareaProps) {
    return (
        <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label className="text-cyber-cyan font-cyber font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">
                {label}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full bg-black border border-white/5 p-5 text-base text-white/90 focus:outline-none focus:border-cyber-cyan font-mono resize-none leading-relaxed transition-all duration-300 hover:border-white/20 cyber-clipper"
            />
        </motion.div>
    );
}
