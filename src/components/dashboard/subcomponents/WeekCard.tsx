/**
 * @file components/dashboard/subcomponents/WeekCard.tsx
 * Mission 섹션의 주간 카드 컴포넌트
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { WeeklyMilestone } from '../../../types';
import { itemVariants } from '../constants';

interface WeekCardProps {
    week: WeeklyMilestone;
    weekIndex: number;
    isPreviewMode: boolean;
    onToggleTask: (weekIndex: number, taskId: string) => void;
    onUpdateTaskText: (weekIndex: number, taskId: string, text: string) => void;
    onAddTask: (weekIndex: number) => void;
    onDeleteTask: (weekIndex: number, taskId: string) => void;
    onUpdateWeekTheme: (weekIndex: number, theme: string) => void;
}

export function WeekCard({
    week,
    weekIndex,
    isPreviewMode,
    onToggleTask,
    onUpdateTaskText,
    onAddTask,
    onDeleteTask,
    onUpdateWeekTheme,
}: WeekCardProps) {
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [isEditingTheme, setIsEditingTheme] = useState(false);

    return (
        <motion.div
            variants={itemVariants}
            className="relative flex"
        >
            <div className="glass-panel border-white/5 p-8 w-full flex flex-col group/panel hover:border-cyber-cyan/30 transition-all duration-500 cyber-clipper-lg bg-zinc-950/20">
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                        <div className="w-16 h-16 border border-white/10 flex flex-col items-center justify-center shrink-0 bg-black/40 group-hover/panel:border-cyber-cyan transition-all cyber-clipper">
                            <span className="text-[9px] text-white/30 uppercase font-black font-cyber">Sector</span>
                            <span className="text-2xl font-cyber font-black text-white">0{week.weekNumber}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div className="text-cyber-cyan font-cyber font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                                    중점_분야
                                </div>
                                {!isPreviewMode && (
                                    <button
                                        onClick={() => setIsEditingTheme(!isEditingTheme)}
                                        className="text-[10px] text-white/20 hover:text-cyber-cyan font-cyber"
                                    >
                                        {isEditingTheme ? '확인' : '편집'}
                                    </button>
                                )}
                            </div>
                            {isEditingTheme ? (
                                <input
                                    className="bg-black/50 border-b-2 border-cyber-cyan w-full text-base font-cyber font-black text-white uppercase tracking-tight focus:outline-none"
                                    value={week.theme}
                                    autoFocus
                                    onChange={(e) => onUpdateWeekTheme(weekIndex, e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTheme(false)}
                                />
                            ) : (
                                <h3 className="font-cyber font-black text-lg text-white uppercase tracking-tight truncate" title={week.theme}>
                                    {week.theme}
                                </h3>
                            )}
                        </div>
                    </div>

                    {/* Tasks List */}
                    <ul className="space-y-4">
                        <AnimatePresence>
                            {week.tasks.map((task) => (
                                <React.Fragment key={task.id}>
                                    <TaskItem
                                        task={task}
                                        weekIndex={weekIndex}
                                        isEditing={editingTaskId === task.id}
                                        isPreviewMode={isPreviewMode}
                                        onToggle={() => onToggleTask(weekIndex, task.id)}
                                        onEdit={() => setEditingTaskId(task.id)}
                                        onSave={() => setEditingTaskId(null)}
                                        onTextChange={(text) => onUpdateTaskText(weekIndex, task.id, text)}
                                        onDelete={() => onDeleteTask(weekIndex, task.id)}
                                    />
                                </React.Fragment>
                            ))}
                        </AnimatePresence>

                        {/* Add Task Button */}
                        {!isPreviewMode && (
                            <motion.button
                                whileHover={{ x: 5 }}
                                onClick={() => onAddTask(weekIndex)}
                                className="w-full mt-4 p-3 border border-dashed border-white/10 text-white/20 hover:text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all flex items-center justify-center gap-2 text-[10px] font-cyber font-black uppercase tracking-widest cyber-clipper"
                            >
                                <Sparkles size={12} /> 미션_추가
                            </motion.button>
                        )}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}
