/**
 * @file components/dashboard/MissionSection.tsx
 * Mission 섹션 컴포넌트 (리팩토링됨)
 * 
 * 주간 미션 로그를 표시하고 관리하는 섹션
 * WeekCard와 TaskItem 서브컴포넌트 사용
 */

import React from 'react';
import { Rocket, Layers, CheckCircle2, Scroll, Sparkles, Edit3, Wifi, Activity, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { ProjectScheme, WeeklyPlanOption, WeeklyMilestone } from '../../types';
import { WeekCard } from './subcomponents';
import { listVariants } from './constants';

interface MissionSectionProps {
    activeProject: ProjectScheme;
    activeMonthlyPlan: any;
    weeklyPlan: WeeklyMilestone[];
    isPreviewMode: boolean;
    previewOptions: WeeklyPlanOption[] | null;
    previewIndex: number;
    isGeneratingMonthDetail: boolean;
    selectedMonthIndex: number;
    setPreviewIndex: (index: number) => void;
    handleGeneratePlanOptions: (index: number) => void;
    cancelPreview: () => void;
    confirmPreviewPlan: () => void;
    toggleTask: (weekIndex: number, taskId: string) => void;
    updateTaskText: (weekIndex: number, taskId: string, text: string) => void;
    addTask: (weekIndex: number) => void;
    deleteTask: (weekIndex: number, taskId: string) => void;
    updateWeekTheme: (weekIndex: number, theme: string) => void;
    initManualPlan: () => void;
    onAbandonQuest: () => void;
}

export function MissionSection({
    activeProject, activeMonthlyPlan, weeklyPlan, isPreviewMode, previewOptions, previewIndex, isGeneratingMonthDetail, selectedMonthIndex,
    setPreviewIndex, handleGeneratePlanOptions, cancelPreview, confirmPreviewPlan, toggleTask, updateTaskText, addTask, deleteTask, updateWeekTheme, initManualPlan, onAbandonQuest
}: MissionSectionProps) {

    return (
        <section className="mt-12">
            {/* Header */}
            <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-cyber font-black flex items-center gap-4 text-white mb-2 uppercase tracking-[0.1em]">
                            <Rocket className="text-cyber-pink shadow-neon-pink" />
                            MISSION_LOG::미션_로그
                        </h2>
                        <div className="flex items-center gap-4 ml-10">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyber-pink/10 border border-cyber-pink/20 rounded">
                                <Activity size={12} className="text-cyber-pink animate-pulse" />
                                <span className="text-[10px] font-cyber font-black text-cyber-pink uppercase tracking-widest">활성_퀘스트</span>
                            </div>
                            <span className="text-white/20">/</span>
                            <span className="text-xs font-mono text-white/40 uppercase tracking-tighter">
                                {selectedMonthIndex + 1}월차: {activeMonthlyPlan.theme}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        {weeklyPlan.length > 0 && !isPreviewMode && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGeneratePlanOptions(selectedMonthIndex)}
                                isLoading={isGeneratingMonthDetail}
                                className="text-[10px] font-cyber font-black border-white/10 hover:border-cyber-cyan hover:text-cyber-cyan tracking-[0.2em]"
                            >
                                <Layers size={14} className="mr-2" /> 전략_재보정
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] font-cyber font-black text-white/20 hover:text-red-500 tracking-[0.2em]"
                            onClick={() => {
                                if (confirm("위험: 미션 로그를 종료하면 모든 진행 상황이 삭제됩니다. 프로젝트를 포기하시겠습니까?")) {
                                    onAbandonQuest();
                                }
                            }}
                        >
                            종료
                        </Button>

                        {isPreviewMode && (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex items-center gap-2 px-4 py-2 bg-cyber-yellow text-black font-cyber font-black text-[10px] uppercase tracking-[0.2em] shadow-neon-yellow"
                            >
                                <Wifi size={14} className="animate-pulse" /> 미리보기_전용
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Strategy Selector Tabs */}
                {isPreviewMode && previewOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar"
                    >
                        {previewOptions.map((option, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setPreviewIndex(idx)}
                                className={`flex-1 min-w-[280px] p-6 border transition-all relative overflow-hidden flex flex-col items-start cyber-clipper
                                    ${previewIndex === idx
                                        ? 'bg-cyber-pink/5 border-cyber-pink shadow-neon-pink'
                                        : 'bg-black border-white/10 hover:border-white/30'
                                    }
                                `}
                            >
                                <div className={`text-[10px] font-cyber font-black mb-3 px-2 py-0.5 ${previewIndex === idx ? 'bg-cyber-pink text-black' : 'bg-white/10 text-white/40'} cyber-clipper`}>
                                    전략_0{idx + 1}
                                </div>
                                <div className="font-cyber font-black text-white mb-2 uppercase tracking-tight">{option.strategyName}</div>
                                <div className="text-xs text-white/40 leading-relaxed font-mono">{option.description}</div>
                                {previewIndex === idx && (
                                    <div className="absolute top-2 right-2 text-cyber-pink">
                                        <CheckCircle2 size={16} fill="currentColor" className="text-black" />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {!weeklyPlan.length ? (
                    /* Empty State */
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="border border-dashed border-white/20 p-20 text-center bg-black/40 cyber-clipper-lg"
                    >
                        <div className="flex flex-col items-center">
                            <Scroll size={64} className="mx-auto text-white/10 mb-8" />
                            <h3 className="text-2xl font-cyber font-black text-white/40 mb-4 uppercase tracking-[0.2em]">
                                Data_Corrupted: 퀘스트를_찾을_수_없음
                            </h3>
                            <p className="text-white/20 mb-10 max-w-md mx-auto font-mono text-sm leading-relaxed">
                                현재 섹터의 미션 로그를 생성하기 위해 새로운 전략을 초기화하십시오.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <Button
                                    onClick={() => handleGeneratePlanOptions(selectedMonthIndex)}
                                    isLoading={isGeneratingMonthDetail}
                                    className="h-14 px-10 text-xs bg-cyber-pink text-white hover:bg-transparent hover:text-cyber-pink border-2 border-cyber-pink shadow-neon-pink cyber-clipper"
                                >
                                    <span className="flex items-center font-cyber font-black tracking-widest gap-3">
                                        <Sparkles size={18} /> 퀘스트_체인_초기화
                                    </span>
                                </Button>
                                <Button
                                    onClick={initManualPlan}
                                    variant="ghost"
                                    className="h-14 px-10 text-xs border-2 border-white/10 text-white/40 hover:text-white hover:border-white cyber-clipper"
                                >
                                    <span className="flex items-center font-cyber font-black tracking-widest gap-3">
                                        <Edit3 size={18} /> 수동_퀘스트_설계
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Week Cards Grid */
                    <motion.div
                        key="list"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {weeklyPlan.map((week, wIndex) => (
                            <React.Fragment key={week.weekNumber}>
                                <WeekCard
                                    week={week}
                                    weekIndex={wIndex}
                                    isPreviewMode={isPreviewMode}
                                    onToggleTask={toggleTask}
                                    onUpdateTaskText={updateTaskText}
                                    onAddTask={addTask}
                                    onDeleteTask={deleteTask}
                                    onUpdateWeekTheme={updateWeekTheme}
                                />
                            </React.Fragment>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Action Buttons */}
            {isPreviewMode && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-end gap-6 pt-10 border-t border-white/10 sticky bottom-8 bg-black/90 backdrop-blur-2xl p-6 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] mt-12 cyber-clipper-lg"
                >
                    <div className="flex gap-6">
                        <Button variant="ghost" onClick={cancelPreview} className="text-[10px] font-cyber font-black text-white/40 hover:text-white tracking-[0.2em] cyber-clipper">
                            변경_취소
                        </Button>
                        <Button
                            onClick={confirmPreviewPlan}
                            className="bg-cyber-cyan text-black font-cyber font-black text-xs px-10 shadow-neon-cyan hover:bg-white border-none tracking-[0.2em] cyber-clipper"
                        >
                            <span className="flex items-center gap-2">
                                <Check size={18} /> 전략_확정
                            </span>
                        </Button>
                    </div>
                </motion.div>
            )}
        </section>
    );
}
