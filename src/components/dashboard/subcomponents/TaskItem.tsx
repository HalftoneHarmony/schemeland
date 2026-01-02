/**
 * @file components/dashboard/subcomponents/TaskItem.tsx
 * Mission 섹션의 개별 Task 아이템 컴포넌트
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Circle, Check, Save } from 'lucide-react';

interface TaskItemProps {
    task: {
        id: string;
        text: string;
        isCompleted: boolean;
    };
    weekIndex: number;
    isEditing: boolean;
    isPreviewMode: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onSave: () => void;
    onTextChange: (text: string) => void;
    onDelete: () => void;
}

export function TaskItem({
    task,
    weekIndex,
    isEditing,
    isPreviewMode,
    onToggle,
    onEdit,
    onSave,
    onTextChange,
    onDelete,
}: TaskItemProps) {
    return (
        <motion.li
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-4 p-3 border-l-2 transition-all cursor-pointer group/task relative overflow-hidden
                ${task.isCompleted
                    ? 'bg-cyber-cyan/5 border-cyber-cyan shadow-[inset_10px_0_10px_-10px_rgba(0,255,255,0.2)]'
                    : 'border-white/5 hover:border-white/30 hover:bg-white/5'}`}
            onClick={() => !isPreviewMode && !isEditing && onToggle()}
        >
            {task.isCompleted && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyber-cyan text-black font-cyber font-black text-[8px] uppercase tracking-widest">
                    완료됨
                </div>
            )}

            <motion.div
                animate={{ scale: task.isCompleted ? 1.1 : 1 }}
                className={`mt-0.5 transition-all ${task.isCompleted ? 'text-cyber-cyan' : 'text-white/20 group-hover/task:text-white/40'}`}
            >
                {task.isCompleted ? <Check size={18} strokeWidth={4} /> : <Circle size={18} />}
            </motion.div>

            {isEditing && !isPreviewMode ? (
                <div className="flex-1 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <input
                        className="bg-black/50 border-b-2 border-cyber-cyan w-full text-sm text-white focus:outline-none py-1.5 px-3 font-mono"
                        value={task.text}
                        autoFocus
                        onChange={(e) => onTextChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSave()}
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); onSave(); }}
                        className="p-2 bg-cyber-cyan text-black hover:bg-white transition-all shadow-neon-cyan"
                    >
                        <Save size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex items-start justify-between gap-4 relative group/item">
                    <span
                        className={`text-sm font-mono leading-relaxed transition-all flex-1 tracking-tight ${task.isCompleted ? 'text-white/20 italic line-through' : 'text-white/80'}`}
                        onDoubleClick={(e) => { e.stopPropagation(); onEdit(); }}
                    >
                        {task.text}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-all shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            className="p-1 px-2 border border-white/10 text-white/20 hover:text-white hover:border-white transition-all text-[10px] font-cyber"
                        >
                            편집
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="p-1 px-2 border border-white/10 text-white/20 hover:text-red-500 hover:border-red-500 transition-all text-[10px] font-cyber"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            )}
        </motion.li>
    );
}
