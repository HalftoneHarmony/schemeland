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
            <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
                <div className="relative z-10 text-center p-10 border border-white/10 bg-zinc-900/50 backdrop-blur-md cyber-clipper-lg max-w-lg w-full mx-4">
                    <div className="w-24 h-24 bg-zinc-800/50 flex items-center justify-center mx-auto mb-6 cyber-clipper border border-white/5">
                        <Kanban size={40} className="text-zinc-500 animate-pulse" />
                    </div>
                    <h2 className="font-cyber font-black text-3xl text-white mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">NO::ACTIVE::MISSION</h2>
                    <p className="text-sm text-zinc-400 mb-8 font-mono tracking-wide">Select a project to authorize kanban protocol.</p>
                    <button
                        onClick={onBack}
                        className="px-8 py-3 bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/50 font-cyber font-black tracking-widest hover:bg-cyber-pink hover:text-black transition-all cyber-clipper shadow-[0_0_20px_rgba(255,0,255,0.2)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]"
                    >
                        RETURN::TO::BASE
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
                                        className="flex items-center gap-4 px-5 py-3 bg-zinc-900/50 border border-white/10 cyber-clipper hover:border-cyber-cyan/50 transition-all group min-w-[300px]"
                                    >
                                        <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{activeProject.selectedIdea.emoji || '🎯'}</span>
                                        <div className="text-left flex-1">
                                            <div className="text-xs font-cyber font-black text-cyber-cyan tracking-widest mb-0.5">ACTIVE MISSION</div>
                                            <div className="text-sm font-bold text-white tracking-widest uppercase">
                                                {activeProject.selectedIdea.title || 'Untitled Mission'}
                                            </div>
                                        </div>
                                        <ChevronDown size={16} className={`text-zinc-400 group-hover:text-cyber-cyan transition-colors duration-300 ${showProjectSelector ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showProjectSelector && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 mt-2 w-full bg-zinc-950 border border-white/20 shadow-2xl overflow-hidden z-50 cyber-clipper-lg"
                                            >
                                                <div className="p-3 border-b border-white/10 bg-white/5">
                                                    <p className="text-[9px] font-cyber text-cyber-cyan px-2 tracking-widest uppercase">
                                                        Select_Operation
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
                                                            className={`w-full px-4 py-3 flex items-center gap-3 transition-all cyber-clipper mb-1 ${project.id === activeProjectId
                                                                ? 'bg-cyber-pink/20 text-white border border-cyber-pink/30'
                                                                : 'hover:bg-white/5 text-zinc-400 border border-transparent hover:border-white/10'
                                                                }`}
                                                        >
                                                            <span className="text-lg">{project.selectedIdea.emoji || '🎯'}</span>
                                                            <span className="text-xs font-mono uppercase tracking-wider truncate">{project.selectedIdea.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Month Navigation */}
                                <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/10 p-1 cyber-clipper">
                                    <button
                                        onClick={() => setSelectedMonthIndex(Math.max(0, selectedMonthIndex - 1))}
                                        disabled={selectedMonthIndex === 0}
                                        className="p-3 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cyber-clipper"
                                    >
                                        <ChevronLeft size={16} className="text-zinc-400" />
                                    </button>

                                    <div className="flex items-center gap-2 px-4 py-1 min-w-[160px] justify-center bg-black/40 cyber-clipper h-full">
                                        <CalendarDays size={14} className="text-cyber-cyan" />
                                        <span className="text-sm font-cyber font-bold text-white tracking-wider uppercase">
                                            {months[currentMonth?.month - 1 || 0]} {currentYear}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedMonthIndex(Math.min(activeProject.monthlyPlan.length - 1, selectedMonthIndex + 1))}
                                        disabled={selectedMonthIndex >= activeProject.monthlyPlan.length - 1}
                                        className="p-3 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cyber-clipper"
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
    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-white/10 cyber-clipper min-w-[100px] justify-between group hover:border-white/20 transition-all">
        <div className="flex items-center gap-2">
            <span className={`${color} opacity-70 group-hover:opacity-100 transition-opacity`}>{icon}</span>
            <span className="text-[10px] font-cyber font-black text-zinc-500 uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-sm font-mono font-bold ${color}`}>{value}</span>
    </div>
);

export default KanbanView;
