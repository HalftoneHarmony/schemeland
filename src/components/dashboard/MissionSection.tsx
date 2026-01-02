import React, { useState } from 'react';
import { Rocket, Layers, CheckCircle2, Scroll, Sparkles, Circle, Check, Edit3, Save, Wifi, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { ProjectScheme, WeeklyPlanOption, WeeklyMilestone } from '../../types';

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

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function MissionSection({
    activeProject, activeMonthlyPlan, weeklyPlan, isPreviewMode, previewOptions, previewIndex, isGeneratingMonthDetail, selectedMonthIndex,
    setPreviewIndex, handleGeneratePlanOptions, cancelPreview, confirmPreviewPlan, toggleTask, updateTaskText, addTask, deleteTask, updateWeekTheme, initManualPlan, onAbandonQuest
}: MissionSectionProps) {

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingWeekIndex, setEditingWeekIndex] = useState<number | null>(null);

    return (
        <section className="mt-12">
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
                            <span className="text-xs font-mono text-white/40 uppercase tracking-tighter">{selectedMonthIndex + 1}월차: {activeMonthlyPlan.theme}</span>
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

            <AnimatePresence mode="wait">
                {!weeklyPlan.length ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="border border-dashed border-white/20 p-20 text-center bg-black/40 cyber-clipper-lg"
                    >
                        <div className="flex flex-col items-center">
                            <Scroll size={64} className="mx-auto text-white/10 mb-8" />
                            <h3 className="text-2xl font-cyber font-black text-white/40 mb-4 uppercase tracking-[0.2em]">Data_Corrupted: 퀘스트를_찾을_수_없음</h3>
                            <p className="text-white/20 mb-10 max-w-md mx-auto font-mono text-sm leading-relaxed">현재 섹터의 미션 로그를 생성하기 위해 새로운 전략을 초기화하십시오.</p>
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
                    <motion.div
                        key="list"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {weeklyPlan.map((week, wIndex) => (
                            <motion.div
                                key={week.weekNumber}
                                variants={itemVariants}
                                className="relative flex"
                            >
                                <div className="glass-panel border-white/5 p-8 w-full flex flex-col group/panel hover:border-cyber-cyan/30 transition-all duration-500 cyber-clipper-lg bg-zinc-950/20">
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                                            <div className="w-16 h-16 border border-white/10 flex flex-col items-center justify-center shrink-0 bg-black/40 group-hover/panel:border-cyber-cyan transition-all cyber-clipper">
                                                <span className="text-[9px] text-white/30 uppercase font-black font-cyber">Sector</span>
                                                <span className="text-2xl font-cyber font-black text-white">0{week.weekNumber}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="text-cyber-cyan font-cyber font-black text-[10px] uppercase tracking-[0.2em] mb-1">중점_분야</div>
                                                    {!isPreviewMode && (
                                                        <button
                                                            onClick={() => setEditingWeekIndex(editingWeekIndex === wIndex ? null : wIndex)}
                                                            className="text-[10px] text-white/20 hover:text-cyber-cyan font-cyber"
                                                        >
                                                            {editingWeekIndex === wIndex ? '확인' : '편집'}
                                                        </button>
                                                    )}
                                                </div>
                                                {editingWeekIndex === wIndex ? (
                                                    <input
                                                        className="bg-black/50 border-b-2 border-cyber-cyan w-full text-base font-cyber font-black text-white uppercase tracking-tight focus:outline-none"
                                                        value={week.theme}
                                                        autoFocus
                                                        onChange={(e) => updateWeekTheme(wIndex, e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && setEditingWeekIndex(null)}
                                                    />
                                                ) : (
                                                    <h3 className="font-cyber font-black text-lg text-white uppercase tracking-tight truncate" title={week.theme}>{week.theme}</h3>
                                                )}
                                            </div>
                                        </div>

                                        <ul className="space-y-4">
                                            <AnimatePresence>
                                                {week.tasks.map((task) => (
                                                    <motion.li
                                                        key={task.id}
                                                        layout
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className={`flex items-start gap-4 p-3 border-l-2 transition-all cursor-pointer group/task relative overflow-hidden
                                                                ${task.isCompleted
                                                                ? 'bg-cyber-cyan/5 border-cyber-cyan shadow-[inset_10px_0_10px_-10px_rgba(0,255,255,0.2)]'
                                                                : 'border-white/5 hover:border-white/30 hover:bg-white/5'}
                                                            `}
                                                        onClick={() => !isPreviewMode && editingTaskId !== task.id && toggleTask(wIndex, task.id)}
                                                    >
                                                        {task.isCompleted && (
                                                            <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyber-cyan text-black font-cyber font-black text-[8px] uppercase tracking-widest">완료됨</div>
                                                        )}

                                                        <motion.div
                                                            animate={{ scale: task.isCompleted ? 1.1 : 1 }}
                                                            className={`mt-0.5 transition-all ${task.isCompleted ? 'text-cyber-cyan' : 'text-white/20 group-hover/task:text-white/40'}`}
                                                        >
                                                            {task.isCompleted ? <Check size={18} strokeWidth={4} /> : <Circle size={18} />}
                                                        </motion.div>

                                                        {editingTaskId === task.id && !isPreviewMode ? (
                                                            <div className="flex-1 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                                <input
                                                                    className="bg-black/50 border-b-2 border-cyber-cyan w-full text-sm text-white focus:outline-none py-1.5 px-3 font-mono"
                                                                    value={task.text}
                                                                    autoFocus
                                                                    onChange={(e) => updateTaskText(wIndex, task.id, e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && setEditingTaskId(null)}
                                                                />
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setEditingTaskId(null); }}
                                                                    className="p-2 bg-cyber-cyan text-black hover:bg-white transition-all shadow-neon-cyan"
                                                                >
                                                                    <Save size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex-1 flex items-start justify-between gap-4 relative group/item">
                                                                <span
                                                                    className={`text-sm font-mono leading-relaxed transition-all flex-1 tracking-tight ${task.isCompleted ? 'text-white/20 italic line-through' : 'text-white/80'}`}
                                                                    onDoubleClick={(e) => { e.stopPropagation(); setEditingTaskId(task.id); }}
                                                                >
                                                                    {task.text}
                                                                </span>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-all shrink-0">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); setEditingTaskId(task.id); }}
                                                                        className="p-1 px-2 border border-white/10 text-white/20 hover:text-white hover:border-white transition-all text-[10px] font-cyber"
                                                                    >
                                                                        편집
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); deleteTask(wIndex, task.id); }}
                                                                        className="p-1 px-2 border border-white/10 text-white/20 hover:text-red-500 hover:border-red-500 transition-all text-[10px] font-cyber"
                                                                    >
                                                                        삭제
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.li>
                                                ))}
                                            </AnimatePresence>
                                            {!isPreviewMode && (
                                                <motion.button
                                                    whileHover={{ x: 5 }}
                                                    onClick={() => addTask(wIndex)}
                                                    className="w-full mt-4 p-3 border border-dashed border-white/10 text-white/20 hover:text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all flex items-center justify-center gap-2 text-[10px] font-cyber font-black uppercase tracking-widest cyber-clipper"
                                                >
                                                    <Sparkles size={12} /> 미션_추가
                                                </motion.button>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
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
