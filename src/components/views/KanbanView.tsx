import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Kanban,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Target,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Sparkles,
    Filter,
    BarChart3,
    Zap,
    Loader2,
    Circle
} from 'lucide-react';
import { ProjectScheme, TaskStatus, Priority, KanbanTask, MilestoneTask } from '../../types';
import { KanbanBoard } from '../kanban/KanbanBoard';

interface KanbanViewProps {
    projects: ProjectScheme[];
    activeProjectId: string | null;
    onSelectProject: (projectId: string) => void;
    onBack: () => void;
    // New handlers
    onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onAddTask: (monthIndex: number, weekNumber: number, status: TaskStatus, text: string, priority: Priority) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTask: (taskId: string, updates: Partial<KanbanTask>) => void;
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// 상태별 설정
const statusConfig = {
    [TaskStatus.TODO]: {
        label: 'Todo',
        icon: <Circle size={14} />,
        color: 'text-zinc-400'
    },
    [TaskStatus.IN_PROGRESS]: {
        label: 'In Progress',
        icon: <Loader2 size={14} className="animate-spin" />,
        color: 'text-cyber-cyan'
    },
    [TaskStatus.REVIEW]: {
        label: 'Review',
        icon: <AlertTriangle size={14} />,
        color: 'text-cyber-yellow'
    },
    [TaskStatus.DONE]: {
        label: 'Done',
        icon: <CheckCircle2 size={14} />,
        color: 'text-green-400'
    },
};

export const KanbanView: React.FC<KanbanViewProps> = ({
    projects,
    activeProjectId,
    onSelectProject,
    onBack,
    onTaskStatusChange,
    onAddTask,
    onDeleteTask,
    onUpdateTask,
}) => {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [showProjectSelector, setShowProjectSelector] = useState(false);

    const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

    // 통계 계산 - 상태별로 정확하게 계산
    const stats = useMemo(() => {
        if (!activeProject) return { total: 0, completed: 0, inProgress: 0, review: 0, todo: 0, percentage: 0 };

        const month = activeProject.monthlyPlan[selectedMonthIndex];
        if (!month?.detailedPlan) return { total: 0, completed: 0, inProgress: 0, review: 0, todo: 0, percentage: 0 };

        let total = 0;
        let todo = 0;
        let inProgress = 0;
        let review = 0;
        let completed = 0;

        month.detailedPlan.forEach(week => {
            week.tasks.forEach(task => {
                total++;
                const status = task.status || (task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO);
                switch (status) {
                    case TaskStatus.TODO:
                        todo++;
                        break;
                    case TaskStatus.IN_PROGRESS:
                        inProgress++;
                        break;
                    case TaskStatus.REVIEW:
                        review++;
                        break;
                    case TaskStatus.DONE:
                        completed++;
                        break;
                }
            });
        });

        return {
            total,
            todo,
            inProgress,
            review,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }, [activeProject, selectedMonthIndex]);

    // Task 상태 변경 핸들러
    const handleTaskStatusChange = useCallback((taskId: string, newStatus: TaskStatus) => {
        onTaskStatusChange(taskId, newStatus);
    }, [onTaskStatusChange]);

    // Task 추가 핸들러
    const handleAddTask = useCallback((weekNumber: number, status: TaskStatus, text: string, priority: Priority) => {
        onAddTask(selectedMonthIndex, weekNumber, status, text, priority);
    }, [selectedMonthIndex, onAddTask]);

    // Task 삭제 핸들러
    const handleDeleteTask = useCallback((taskId: string) => {
        onDeleteTask(taskId);
    }, [onDeleteTask]);

    // Task 업데이트 핸들러
    const handleUpdateTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
        onUpdateTask(taskId, updates);
    }, [onUpdateTask]);

    // 주차 선택 핸들러
    const handleWeekSelect = (week: number | null) => {
        setSelectedWeek(week);
    };

    if (!activeProject) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                        <Kanban size={32} className="text-zinc-500" />
                    </div>
                    <h2 className="font-cyber text-xl text-white mb-2">NO::ACTIVE::MISSION</h2>
                    <p className="text-sm text-zinc-400 mb-6">Select a project to view its kanban board</p>
                    <button
                        onClick={onBack}
                        className="px-6 py-3 bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30 rounded-sm font-cyber hover:bg-cyber-pink/30 transition-colors"
                    >
                        GO::BACK
                    </button>
                </div>
            </div>
        );
    }

    const currentMonth = activeProject.monthlyPlan[selectedMonthIndex];
    const currentYear = new Date(activeProject.startDate).getFullYear();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Fixed Header Section - 상단 고정 */}
            <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-2xl border-b border-white/5">
                <div className="px-6 py-4">
                    <div className="max-w-[1800px] mx-auto">
                        {/* Top Row */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                {/* Project Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProjectSelector(!showProjectSelector)}
                                        className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-white/10 rounded-sm hover:border-white/20 transition-colors group"
                                    >
                                        <span className="text-2xl">{activeProject.selectedIdea.emoji || '🎯'}</span>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-white">
                                                {activeProject.selectedIdea.title || 'Untitled Mission'}
                                            </div>
                                            <div className="text-[10px] font-mono text-zinc-500">
                                                {activeProject.monthlyPlan.length} months • Active
                                            </div>
                                        </div>
                                        <ChevronDown size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                                    </button>

                                    <AnimatePresence>
                                        {showProjectSelector && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 mt-2 w-72 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50"
                                            >
                                                <div className="p-2 border-b border-white/5">
                                                    <p className="text-[10px] font-cyber text-zinc-500 px-2 tracking-wider">
                                                        SELECT::MISSION
                                                    </p>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto p-2">
                                                    {projects.map((project) => (
                                                        <button
                                                            key={project.id}
                                                            onClick={() => {
                                                                onSelectProject(project.id);
                                                                setShowProjectSelector(false);
                                                            }}
                                                            className={`w-full px-3 py-2 flex items-center gap-3 rounded-sm transition-all ${project.id === activeProjectId
                                                                ? 'bg-cyber-pink/10 text-white'
                                                                : 'hover:bg-white/5 text-zinc-400'
                                                                }`}
                                                        >
                                                            <span className="text-lg">{project.selectedIdea.emoji || '🎯'}</span>
                                                            <span className="text-sm truncate">{project.selectedIdea.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Month Navigation */}
                                <div className="flex items-center gap-2 bg-zinc-900/50 rounded-sm border border-white/10 p-1">
                                    <button
                                        onClick={() => setSelectedMonthIndex(Math.max(0, selectedMonthIndex - 1))}
                                        disabled={selectedMonthIndex === 0}
                                        className="p-2 hover:bg-white/10 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} className="text-zinc-400" />
                                    </button>

                                    <div className="flex items-center gap-2 px-3 py-1 min-w-[160px] justify-center">
                                        <CalendarDays size={14} className="text-cyber-cyan" />
                                        <span className="text-sm font-cyber text-white">
                                            {months[currentMonth?.month - 1 || 0]} {currentYear}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedMonthIndex(Math.min(activeProject.monthlyPlan.length - 1, selectedMonthIndex + 1))}
                                        disabled={selectedMonthIndex >= activeProject.monthlyPlan.length - 1}
                                        className="p-2 hover:bg-white/10 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} className="text-zinc-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Stats Pills */}
                            <div className="flex items-center gap-3">
                                <StatPill
                                    icon={<Target size={14} />}
                                    label="Total"
                                    value={stats.total}
                                    color="text-zinc-400"
                                />
                                <StatPill
                                    icon={<Circle size={14} />}
                                    label="Todo"
                                    value={stats.todo}
                                    color="text-zinc-400"
                                />
                                <StatPill
                                    icon={<Loader2 size={14} />}
                                    label="Active"
                                    value={stats.inProgress}
                                    color="text-cyber-cyan"
                                />
                                <StatPill
                                    icon={<AlertTriangle size={14} />}
                                    label="Review"
                                    value={stats.review}
                                    color="text-cyber-yellow"
                                />
                                <StatPill
                                    icon={<CheckCircle2 size={14} />}
                                    label="Done"
                                    value={stats.completed}
                                    color="text-green-400"
                                />

                                {/* Progress Bar */}
                                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stats.percentage}%` }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-cyber-pink to-cyber-cyan"
                                        />
                                    </div>
                                    <span className="text-sm font-cyber text-cyber-cyan">
                                        {stats.percentage}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Month Theme */}
                        {currentMonth && (
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-cyber text-zinc-500 tracking-wider">
                                    MONTH::OBJECTIVE
                                </span>
                                <span className="text-sm text-zinc-300">
                                    {currentMonth.theme}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-[1800px] mx-auto px-6 py-6">
                    <KanbanBoard
                        project={activeProject}
                        selectedMonthIndex={selectedMonthIndex}
                        selectedWeek={selectedWeek}
                        onWeekSelect={handleWeekSelect}
                        onTaskStatusChange={handleTaskStatusChange}
                        onAddTask={handleAddTask}
                        onDeleteTask={handleDeleteTask}
                        onUpdateTask={handleUpdateTask}
                    />
                </div>
            </div>
        </div>
    );
};

// Stat Pill Component
interface StatPillProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
}

const StatPill: React.FC<StatPillProps> = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-white/10 rounded-sm">
        <span className={color}>{icon}</span>
        <span className="text-xs text-zinc-500">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
);

export default KanbanView;
