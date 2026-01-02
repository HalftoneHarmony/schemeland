
import React from 'react';
import { motion } from 'framer-motion';
import { ThreeYearVision } from '../../../types';
import { VisionTextarea } from './VisionTextarea';

interface VisionFormProps {
    visionDraft: ThreeYearVision;
    setVisionDraft: (vision: ThreeYearVision) => void;
    activeYearIndex: number;
}

export function VisionForm({ visionDraft, setVisionDraft, activeYearIndex }: VisionFormProps) {

    // 데이터 추출 헬퍼
    const getYearValue = (yearData: any): { vision: string, keyResults: string[] } => {
        if (!yearData) return { vision: '', keyResults: [] };
        if (typeof yearData === 'string') return { vision: yearData, keyResults: [] };
        return { vision: yearData.vision || '', keyResults: yearData.keyResults || [] };
    };

    // 현재 연도의 키 (year1, year2, year3)
    const yearKey = activeYearIndex === 0 ? 'year1' : activeYearIndex === 1 ? 'year2' : 'year3';
    const currentData = getYearValue(visionDraft[yearKey]);

    const handleVisionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setVisionDraft({
            ...visionDraft,
            [yearKey]: { ...currentData, vision: e.target.value }
        });
    };

    const handleKeyResultChange = (index: number, value: string) => {
        const krs = [...currentData.keyResults];
        while (krs.length <= index) krs.push('');
        krs[index] = value;
        setVisionDraft({
            ...visionDraft,
            [yearKey]: { ...currentData, keyResults: krs }
        });
    };

    const handleUltimateGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setVisionDraft({ ...visionDraft, ultimateGoal: e.target.value });
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <VisionTextarea
                label={`${activeYearIndex + 1}년_후의_나는 (R=VD)`}
                value={currentData.vision}
                onChange={handleVisionChange}
                rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                    <motion.div
                        key={idx}
                        className="flex flex-col gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <label className="text-white/20 font-cyber font-black text-[8px] uppercase tracking-widest">Milestone_0{idx + 1}</label>
                        <textarea
                            className="w-full bg-black border border-white/10 p-3 text-xs text-white/80 focus:outline-none focus:border-cyber-cyan font-mono resize-none h-24 transition-all duration-300 hover:border-white/30 cyber-clipper"
                            value={currentData.keyResults[idx] || ''}
                            onChange={(e) => handleKeyResultChange(idx, e.target.value)}
                        />
                    </motion.div>
                ))}
            </div>
            {activeYearIndex === 2 && (
                <VisionTextarea
                    label="궁극적_상태 (Ultimate Goal)"
                    value={visionDraft.ultimateGoal || ''}
                    onChange={handleUltimateGoalChange}
                    rows={2}
                />
            )}
        </motion.div>
    );
}
