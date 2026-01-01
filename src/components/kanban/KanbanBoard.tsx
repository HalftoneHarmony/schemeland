import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    GripVertical,
    Plus,
    MoreHorizontal,
    Clock,
    Flag,
    ChevronDown,
    X,
    Edit3,
    Trash2,
    Calendar,
    Tag,
    CheckCircle2,
    Circle,
    Loader2,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { TaskStatus, Priority, KanbanTask, ProjectScheme } from '../../types';

interface KanbanBoardProps {
    project: ProjectScheme;
    selectedMonthIndex: number;
    selectedWeek: number | null;
    onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onAddTask: (weekNumber: number, status: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTask: (taskId: string, updates: Partial<KanbanTask>) => void;
}

const statusConfig: Record<TaskStatus, {
    title: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
    gradient: string;
}> = {
    [TaskStatus.TODO]: {
        title: 'QUEUE::TODO',
        color: 'text-zinc-400',
        bgColor: 'bg-zinc-800/50',
        borderColor: 'border-zinc-700/50',
        icon: <Circle size={14} />,
        gradient: 'from-zinc-600/20 to-zinc-800/20'
    },
    [TaskStatus.IN_PROGRESS]: {
        title: 'ACTIVE::WIP',
        color: 'text-cyber-cyan',
        bgColor: 'bg-cyber-cyan/10',
        borderColor: 'border-cyber-cyan/30',
        icon: <Loader2 size={14} className="animate-spin" />,
        gradient: 'from-cyber-cyan/20 to-cyber-blue/10'
    },
    [TaskStatus.REVIEW]: {
        title: 'VERIFY::CHECK',
        color: 'text-cyber-yellow',
        bgColor: 'bg-cyber-yellow/10',
        borderColor: 'border-cyber-yellow/30',
        icon: <AlertCircle size={14} />,
        gradient: 'from-cyber-yellow/20 to-orange-500/10'
    },
    [TaskStatus.DONE]: {
        title: 'COMPLETE::OK',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        icon: <CheckCircle2 size={14} />,
        gradient: 'from-green-500/20 to-emerald-600/10'
    },
};

const priorityConfig: Record<Priority, {
    label: string;
    color: string;
    icon: React.ReactNode;
}> = {
    [Priority.LOW]: {
        label: 'Low',
        color: 'text-zinc-500',
        icon: <Flag size={12} className="text-zinc-500" />
    },
    [Priority.MEDIUM]: {
        label: 'Medium',
        color: 'text-blue-400',
        icon: <Flag size={12} className="text-blue-400" />
    },
    [Priority.HIGH]: {
        label: 'High',
        color: 'text-orange-400',
        icon: <Flag size={12} className="text-orange-400" />
    },
    [Priority.CRITICAL]: {
        label: 'Critical',
        color: 'text-red-400',
        icon: <Flag size={12} className="text-red-400 fill-red-400" />
    },
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
    project,
    selectedMonthIndex,
    selectedWeek,
    onTaskStatusChange,
    onAddTask,
    onDeleteTask,
    onUpdateTask,
}) => {
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [showTaskModal, setShowTaskModal] = useState<{ weekNumber: number; status: TaskStatus } | null>(null);
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);

    // 현재 월의 주차별 태스크를 칸반 형식으로 변환
    const getKanbanTasks = useCallback(() => {
        const month = project.monthlyPlan[selectedMonthIndex];
        if (!month?.detailedPlan) return [];

        const tasks: KanbanTask[] = [];
        month.detailedPlan.forEach((week) => {
            if (selectedWeek !== null && week.weekNumber !== selectedWeek) return;

            week.tasks.forEach((task) => {
                tasks.push({
                    id: task.id,
                    text: task.text,
                    status: task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO,
                    priority: task.priority,
                    weekNumber: week.weekNumber,
                    monthIndex: selectedMonthIndex,
                    projectId: project.id,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                });
            });
        });

        return tasks;
    }, [project, selectedMonthIndex, selectedWeek]);

    const kanbanTasks = getKanbanTasks();

    const getTasksByStatus = (status: TaskStatus) => {
        return kanbanTasks.filter(task => task.status === status);
    };

    const handleDragStart = (taskId: string) => {
        setDraggedTask(taskId);
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleDrop = (status: TaskStatus) => {
        if (draggedTask) {
            onTaskStatusChange(draggedTask, status);
            setDraggedTask(null);
        }
    };

    const handleAddNewTask = () => {
        if (showTaskModal && newTaskText.trim()) {
            onAddTask(showTaskModal.weekNumber, showTaskModal.status);
            setNewTaskText('');
            setNewTaskPriority(Priority.MEDIUM);
            setShowTaskModal(null);
        }
    };

    const weekNumbers = project.monthlyPlan[selectedMonthIndex]?.detailedPlan?.map(w => w.weekNumber) || [1, 2, 3, 4];

    return (
        <div className="w-full h-full">
            {/* Week Filter */}
            <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
                <span className="text-[10px] font-cyber text-zinc-500 tracking-wider whitespace-nowrap">
                    SECTOR::FILTER
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => {/* Handle all weeks */ }}
                        className={`px-4 py-2 rounded-sm border transition-all text-xs font-cyber ${selectedWeek === null
                                ? 'bg-cyber-pink/20 border-cyber-pink/50 text-cyber-pink shadow-neon-pink'
                                : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                    >
                        ALL::SECTORS
                    </button>
                    {weekNumbers.map((week) => (
                        <button
                            key={week}
                            className={`px-4 py-2 rounded-sm border transition-all text-xs font-cyber ${selectedWeek === week
                                    ? 'bg-cyber-cyan/20 border-cyber-cyan/50 text-cyber-cyan shadow-neon-cyan'
                                    : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/20'
                                }`}
                        >
                            WEEK_{String(week).padStart(2, '0')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-4 gap-4 h-[calc(100vh-300px)] min-h-[500px]">
                {Object.values(TaskStatus).map((status) => {
                    const config = statusConfig[status];
                    const tasksInColumn = getTasksByStatus(status);

                    return (
                        <motion.div
                            key={status}
                            className={`flex flex-col rounded-lg border ${config.borderColor} bg-gradient-to-b ${config.gradient} backdrop-blur-sm overflow-hidden`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(status)}
                        >
                            {/* Column Header */}
                            <div className={`px-4 py-3 border-b ${config.borderColor} backdrop-blur-xl`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={config.color}>{config.icon}</span>
                                        <span className={`text-xs font-cyber font-bold tracking-wider ${config.color}`}>
                                            {config.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-mono ${config.color} bg-white/5 px-2 py-0.5 rounded-sm`}>
                                            {tasksInColumn.length}
                                        </span>
                                        <button
                                            onClick={() => setShowTaskModal({ weekNumber: weekNumbers[0] || 1, status })}
                                            className={`p-1 rounded-sm hover:bg-white/10 ${config.color} transition-colors`}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tasks Container */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                <AnimatePresence mode="popLayout">
                                    {tasksInColumn.map((task) => (
                                        <KanbanCard
                                            key={task.id}
                                            task={task}
                                            isDragging={draggedTask === task.id}
                                            isEditing={editingTaskId === task.id}
                                            onDragStart={() => handleDragStart(task.id)}
                                            onDragEnd={handleDragEnd}
                                            onEdit={() => setEditingTaskId(task.id)}
                                            onDelete={() => onDeleteTask(task.id)}
                                            onUpdate={(updates) => onUpdateTask(task.id, updates)}
                                            onCancelEdit={() => setEditingTaskId(null)}
                                        />
                                    ))}
                                </AnimatePresence>

                                {tasksInColumn.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
                                            {config.icon}
                                        </div>
                                        <p className="text-xs text-zinc-500 font-cyber">
                                            NO::TASKS
                                        </p>
                                        <p className="text-[10px] text-zinc-600 mt-1">
                                            Drag tasks here or create new
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Add Button */}
                            <div className="p-3 border-t border-white/5">
                                <button
                                    onClick={() => setShowTaskModal({ weekNumber: weekNumbers[0] || 1, status })}
                                    className={`w-full py-2 rounded-sm border border-dashed ${config.borderColor} text-xs font-cyber ${config.color} hover:bg-white/5 transition-colors flex items-center justify-center gap-2`}
                                >
                                    <Plus size={14} />
                                    <span>ADD::TASK</span>
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showTaskModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowTaskModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 rounded-lg p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-cyber text-lg text-white">NEW::TASK</h3>
                                <button
                                    onClick={() => setShowTaskModal(null)}
                                    className="p-1 hover:bg-white/10 rounded-sm transition-colors"
                                >
                                    <X size={18} className="text-zinc-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-cyber text-zinc-500 mb-2 tracking-wider">
                                        TASK::DESCRIPTION
                                    </label>
                                    <textarea
                                        value={newTaskText}
                                        onChange={(e) => setNewTaskText(e.target.value)}
                                        placeholder="Enter task description..."
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-cyber-pink/50 resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-cyber text-zinc-500 mb-2 tracking-wider">
                                        PRIORITY::LEVEL
                                    </label>
                                    <div className="flex gap-2">
                                        {Object.values(Priority).map((priority) => (
                                            <button
                                                key={priority}
                                                onClick={() => setNewTaskPriority(priority)}
                                                className={`flex-1 py-2 rounded-sm border text-xs font-cyber transition-all ${newTaskPriority === priority
                                                        ? `${priorityConfig[priority].color} border-current bg-current/10`
                                                        : 'border-white/10 text-zinc-400 hover:border-white/20'
                                                    }`}
                                            >
                                                {priorityConfig[priority].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-cyber text-zinc-500 mb-2 tracking-wider">
                                        WEEK::SECTOR
                                    </label>
                                    <select
                                        value={showTaskModal.weekNumber}
                                        onChange={(e) => setShowTaskModal({ ...showTaskModal, weekNumber: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-cyber-pink/50"
                                    >
                                        {weekNumbers.map((week) => (
                                            <option key={week} value={week}>
                                                Week {week}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowTaskModal(null)}
                                    className="flex-1 py-3 rounded-sm border border-white/10 text-zinc-400 text-sm font-cyber hover:bg-white/5 transition-colors"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleAddNewTask}
                                    disabled={!newTaskText.trim()}
                                    className="flex-1 py-3 rounded-sm bg-gradient-to-r from-cyber-pink to-cyber-purple text-white text-sm font-cyber hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={14} />
                                    CREATE::TASK
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Kanban Card Component
interface KanbanCardProps {
    task: KanbanTask;
    isDragging: boolean;
    isEditing: boolean;
    onDragStart: () => void;
    onDragEnd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onUpdate: (updates: Partial<KanbanTask>) => void;
    onCancelEdit: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
    task,
    isDragging,
    isEditing,
    onDragStart,
    onDragEnd,
    onEdit,
    onDelete,
    onUpdate,
    onCancelEdit,
}) => {
    const [editText, setEditText] = useState(task.text);
    const [showMenu, setShowMenu] = useState(false);

    const handleSave = () => {
        if (editText.trim()) {
            onUpdate({ text: editText });
            onCancelEdit();
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: isDragging ? 0.5 : 1,
                y: 0,
                scale: isDragging ? 1.05 : 1,
                rotate: isDragging ? 2 : 0
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`group bg-zinc-900/80 border border-white/10 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all ${isDragging ? 'shadow-2xl shadow-cyber-pink/20' : ''
                }`}
        >
            {/* Drag Handle */}
            <div className="flex items-start gap-2">
                <div className="mt-1 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab">
                    <GripVertical size={14} className="text-zinc-500" />
                </div>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full px-2 py-1 bg-zinc-800 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyber-pink/50 resize-none"
                                rows={2}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-cyber-pink/20 text-cyber-pink text-xs rounded hover:bg-cyber-pink/30 transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={onCancelEdit}
                                    className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-white leading-snug">{task.text}</p>

                            {/* Task Meta */}
                            <div className="flex items-center gap-3 mt-3">
                                {/* Week Badge */}
                                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                                    W{task.weekNumber}
                                </span>

                                {/* Priority */}
                                <span className="flex items-center gap-1">
                                    {priorityConfig[task.priority].icon}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions Menu */}
                {!isEditing && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all"
                        >
                            <MoreHorizontal size={14} className="text-zinc-400" />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute right-0 top-full mt-1 bg-zinc-800 border border-white/10 rounded-lg shadow-xl overflow-hidden z-10"
                                >
                                    <button
                                        onClick={() => { onEdit(); setShowMenu(false); }}
                                        className="w-full px-4 py-2 text-xs text-left text-zinc-300 hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <Edit3 size={12} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => { onDelete(); setShowMenu(false); }}
                                        className="w-full px-4 py-2 text-xs text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                    >
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default KanbanBoard;
