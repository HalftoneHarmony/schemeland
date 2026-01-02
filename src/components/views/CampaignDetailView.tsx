import React, { useState } from 'react';
import { ProjectScheme, MonthlyGoal, Priority, TaskStatus } from '../../types';
import { Button } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Map, Calendar, Flag, Zap, Plus, Shield, Activity, Terminal, Trash2, Edit3,
    Circle, Loader2, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Wand2
} from 'lucide-react';

interface CampaignDetailViewProps {
    activeProject: ProjectScheme;
    selectedMonthIndex: number;
    onBack: () => void;
    toggleTask: (weekIndex: number, taskId: string) => void;
    addTask: (weekIndex: number, text?: string, monthIndex?: number) => void;
    deleteTask: (weekIndex: number, taskId: string) => void;
    updateTaskText: (weekIndex: number, taskId: string, text: string) => void;
    updateWeekTheme: (weekIndex: number, theme: string) => void;
    updateTaskStatus?: (weekIndex: number, taskId: string, status: TaskStatus) => void;
    moveTask?: (taskId: string, sourceWeekIndex: number, targetWeekIndex: number) => void;
    onSelectMonth: (index: number) => void;
    updateMonthGoals?: (monthIndex: number, goals: string[]) => void;
    onInitializeMonth?: (monthIndex: number) => void;
    onGenerateWeekTheme?: (monthIndex: number, weekIndex: number) => void;
    onGenerateWeekTasks?: (monthIndex: number, weekIndex: number) => void;
    onGenerateEntireSprint?: (monthIndex: number) => void;
    isGeneratingEntireSprint?: boolean;
}

// 상태별 설정
const statusConfig: Record<TaskStatus, {
    label: string;
    labelKo: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
}> = {
    [TaskStatus.TODO]: {
        label: 'TODO',
        labelKo: '대기중',
        color: 'text-zinc-400',
        bgColor: 'bg-zinc-700/30',
        borderColor: 'border-zinc-600/30',
        icon: <Circle size={12} />
    },
    [TaskStatus.IN_PROGRESS]: {
        label: 'ACTIVE',
        labelKo: '진행중',
        color: 'text-cyber-cyan',
        bgColor: 'bg-cyber-cyan/10',
        borderColor: 'border-cyber-cyan/30',
        icon: <Loader2 size={12} className="animate-spin" />
    },
    [TaskStatus.REVIEW]: {
        label: 'REVIEW',
        labelKo: '검토중',
        color: 'text-cyber-yellow',
        bgColor: 'bg-cyber-yellow/10',
        borderColor: 'border-cyber-yellow/30',
        icon: <AlertCircle size={12} />
    },
    [TaskStatus.DONE]: {
        label: 'DONE',
        labelKo: '완료됨',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        icon: <CheckCircle2 size={12} />
    },
};

export function CampaignDetailView({
    activeProject, selectedMonthIndex, onBack,
    toggleTask, addTask, deleteTask, updateTaskText, updateWeekTheme, updateTaskStatus, moveTask, onSelectMonth, updateMonthGoals,
    onInitializeMonth, onGenerateWeekTheme, onGenerateWeekTasks, onGenerateEntireSprint, isGeneratingEntireSprint
}: CampaignDetailViewProps) {
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingWeekIndex, setEditingWeekIndex] = useState<number | null>(null);
    const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
    // Drag and Drop State
    const [dragOverWeekIndex, setDragOverWeekIndex] = useState<number | null>(null);

    const monthPlan = activeProject.monthlyPlan[selectedMonthIndex];

    // Safety check for monthPlan
    if (!monthPlan) return null;

    const weeks = monthPlan.detailedPlan || [];
    const hasPlan = weeks.length > 0;

    // Auto-initialize if plan is missing
    React.useEffect(() => {
        if (!hasPlan && onInitializeMonth) {
            onInitializeMonth(selectedMonthIndex);
        }
    }, [selectedMonthIndex, hasPlan, onInitializeMonth]);

    // 상태별 통계
    const getStatusStats = () => {
        let todo = 0, inProgress = 0, review = 0, done = 0;
        weeks.forEach(week => {
            week.tasks.forEach(task => {
                const status = task.status || (task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO);
                switch (status) {
                    case TaskStatus.TODO: todo++; break;
                    case TaskStatus.IN_PROGRESS: inProgress++; break;
                    case TaskStatus.REVIEW: review++; break;
                    case TaskStatus.DONE: done++; break;
                }
            });
        });
        return { todo, inProgress, review, done, total: todo + inProgress + review + done };
    };

    const stats = getStatusStats();

    // Helper to calculate load
    const getLoadPercentage = (taskCount: number) => Math.min(100, (taskCount / 5) * 100);
    const getLoadColor = (percent: number) => {
        if (percent >= 80) return 'bg-red-500 shadow-[0_0_15px_#ef4444]';
        if (percent >= 60) return 'bg-cyber-yellow shadow-neon-yellow';
        return 'bg-cyber-cyan shadow-neon-cyan';
    };

    // 태스크의 실제 상태를 가져옴
    const getTaskStatus = (task: { status?: TaskStatus; isCompleted: boolean }): TaskStatus => {
        return task.status || (task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO);
    };

    // 다음 상태로 이동
    const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
        const statusOrder = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE];
        const currentIndex = statusOrder.indexOf(currentStatus);
        return statusOrder[(currentIndex + 1) % statusOrder.length];
    };

    // 상태 변경 핸들러
    const handleStatusChange = (weekIndex: number, taskId: string, newStatus: TaskStatus) => {
        if (updateTaskStatus) {
            updateTaskStatus(weekIndex, taskId, newStatus);
        } else {
            // Fallback: toggleTask를 사용하여 완료 상태만 토글
            if (newStatus === TaskStatus.DONE) {
                toggleTask(weekIndex, taskId);
            }
        }
        setShowStatusMenu(null);
    };

    // Calculate unassigned goals
    const allTasks = weeks.flatMap(w => w.tasks);
    const unassignedGoals = monthPlan.goals.filter(goal =>
        !allTasks.some(t => t.text.trim() === goal.trim())
    );

    // 목표를 자동으로 채우는 함수
    const handleAutoPopulateGoals = () => {
        if (!updateMonthGoals) return;

        // 모든 태스크에서 고유한 목표 추출
        const uniqueGoals = Array.from(new Set(
            weeks.flatMap(week => week.tasks.map(task => task.text.trim()))
        )).filter(text => text && text !== '신규 미션 데이터 입력...');

        updateMonthGoals(selectedMonthIndex, uniqueGoals);
    };

    // 체크리스트를 자동으로 채우는 함수 (각 주의 태스크를 목표로 추가)
    const handleAutoPopulateChecklist = () => {
        if (!updateMonthGoals) return;

        // 각 주의 태스크들을 수집
        const checklistItems: string[] = [];
        weeks.forEach(week => {
            week.tasks.forEach(task => {
                if (task.text && task.text !== '신규 미션 데이터 입력...') {
                    checklistItems.push(task.text.trim());
                }
            });
        });

        // 중복 제거
        const uniqueChecklist = Array.from(new Set(checklistItems));
        updateMonthGoals(selectedMonthIndex, uniqueChecklist);
    };


    return (
        <div className="min-h-screen relative overflow-hidden bg-black">
            {/* Cyberpunk Grid Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,black_90%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 animate-slide-up pb-40 relative z-10">
                {/* Tactical Progress Bar */}
                <div className="mb-8 max-w-5xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-cyber font-black text-cyber-cyan tracking-[0.3em] uppercase">TACTICAL_MISSION_PROGRESS::전술_미션_진행률</span>
                        <span className="text-xl font-cyber font-black text-white italic">
                            {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%
                        </span>
                    </div>
                    <div className="data-progress-v2 h-5 skew-x-[-15deg] border border-white/10 p-[2px]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }}
                            className="fill h-full bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-pink shadow-neon-cyan"
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Header / Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={onBack}
                        className="text-white/20 hover:text-cyber-pink flex items-center text-[10px] font-cyber font-black tracking-[0.3em] uppercase transition-all group"
                    >
                        <ArrowLeft size={18} className="mr-3 group-hover:-translate-x-2 transition-transform" />
                        BACK_TO_OPS_CENTER::작전_본부로_귀환
                    </button>
                    <div className="flex items-center gap-4 px-6 py-2 bg-black border-2 border-cyber-cyan/30 text-cyber-cyan shadow-neon-cyan skew-x-[-15deg]">
                        <Activity size={16} className="animate-pulse skew-x-[15deg]" />
                        <span className="text-[10px] font-cyber font-black uppercase tracking-widest skew-x-[15deg]">전술_모드_활성화됨</span>
                    </div>
                </div>

                <div className="mb-20 text-center relative group py-10">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 -z-20 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 255, 0.1)" strokeWidth="0.5" />
                                    <circle cx="0" cy="0" r="1" fill="rgba(0, 255, 255, 0.4)" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03] scale-[2.5] pointer-events-none group-hover:scale-[2.7] transition-transform duration-1000">
                        <Terminal size={400} />
                    </div>

                    <div className="inline-block mb-3 animate-pulse">
                        <div className="flex items-center gap-2 px-4 py-1 border border-cyber-cyan/30 bg-cyber-cyan/5 skew-x-[-15deg]">
                            <Activity size={12} className="text-cyber-cyan skew-x-[15deg]" />
                            <span className="text-[8px] font-cyber font-black text-cyber-cyan uppercase tracking-[0.3em] skew-x-[15deg]">DATA_STREAMING_ACTIVE::데이터_활성</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-6">
                        <button
                            onClick={() => selectedMonthIndex > 0 && onSelectMonth(selectedMonthIndex - 1)}
                            disabled={selectedMonthIndex <= 0}
                            className={`p-2 transition-all duration-300 ${selectedMonthIndex <= 0 ? 'opacity-20 cursor-not-allowed text-white' : 'text-white hover:text-cyber-cyan hover:scale-125 hover:shadow-neon-cyan bg-black border border-white/10'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="inline-block skew-x-[-10deg]">
                            <span className="bg-cyber-pink text-white font-cyber font-black text-[10px] px-6 py-2 uppercase tracking-[0.4em] shadow-neon-pink cyber-clipper">
                                SPRINT_0{monthPlan.month}_PROTOCOL::스프린트_0{monthPlan.month}_프로토콜
                            </span>
                        </div>

                        <button
                            onClick={() => selectedMonthIndex < activeProject.monthlyPlan.length - 1 && onSelectMonth(selectedMonthIndex + 1)}
                            disabled={selectedMonthIndex >= activeProject.monthlyPlan.length - 1}
                            className={`p-2 transition-all duration-300 ${selectedMonthIndex >= activeProject.monthlyPlan.length - 1 ? 'opacity-20 cursor-not-allowed text-white' : 'text-white hover:text-cyber-cyan hover:scale-125 hover:shadow-neon-cyan bg-black border border-white/10'}`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="relative inline-block max-w-full px-4">
                        <h1 className="text-4xl md:text-6xl font-cyber font-black text-white mb-6 tracking-tighter uppercase italic scale-y-110 drop-shadow-[0_0_30px_rgba(0,255,255,0.2)] whitespace-normal break-words leading-[0.85] max-w-full">
                            {monthPlan.theme}
                        </h1>
                        <div className="absolute -right-4 -top-2 animate-bounce">
                            <Zap className="text-cyber-yellow" fill="currentColor" size={32} style={{ filter: 'drop-shadow(0 0 10px #fce70a)' }} />
                        </div>
                    </div>

                    {/* Sector Stats Dashboard - 상태별로 표시 */}
                    <div className="flex justify-center flex-wrap gap-8 my-10 px-8">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-cyber font-black text-white/30 uppercase tracking-[0.2em]">TODO::대기중</span>
                            <div className="text-3xl font-cyber font-black text-zinc-400 italic">{stats.todo}</div>
                            <div className="w-12 h-0.5 bg-zinc-500"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-cyber font-black text-white/30 uppercase tracking-[0.2em]">ACTIVE::진행중</span>
                            <div className="text-3xl font-cyber font-black text-cyber-cyan italic">{stats.inProgress}</div>
                            <div className="w-12 h-0.5 bg-cyber-cyan shadow-neon-cyan"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-cyber font-black text-white/30 uppercase tracking-[0.2em]">REVIEW::검토중</span>
                            <div className="text-3xl font-cyber font-black text-cyber-yellow italic">{stats.review}</div>
                            <div className="w-12 h-0.5 bg-cyber-yellow shadow-neon-yellow"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-cyber font-black text-white/30 uppercase tracking-[0.2em]">DONE::완료됨</span>
                            <div className="text-3xl font-cyber font-black text-green-400 italic">{stats.done}</div>
                            <div className="w-12 h-0.5 bg-green-400 shadow-[0_0_10px_#22c55e]"></div>
                        </div>
                    </div>

                    {/* PRIMARY_OBJECTIVES Section */}
                    <div className="max-w-4xl mx-auto mb-12 mt-8">
                        <div className="border-2 border-cyber-cyan/30 bg-black/60 p-8 relative overflow-hidden">
                            {/* Background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-cyber-cyan animate-pulse rounded-full shadow-neon-cyan"></div>
                                        <h3 className="text-[12px] font-cyber font-black text-cyber-cyan uppercase tracking-[0.3em]">
                                            PRIMARY_OBJECTIVES::주요_목표
                                        </h3>
                                    </div>

                                    {/* Action Buttons */}
                                    {updateMonthGoals && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleAutoPopulateGoals}
                                                className="px-4 py-2 bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/20 hover:shadow-neon-pink transition-all text-[9px] font-cyber font-black uppercase tracking-wider skew-x-[-10deg]"
                                                title="태스크에서 고유한 전략 추출"
                                            >
                                                <span className="skew-x-[10deg] inline-block">STRATEGY_SYNC::핵심_전략_동기화</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Goals List */}
                                <div className="space-y-3">
                                    {monthPlan.goals && monthPlan.goals.length > 0 ? (
                                        monthPlan.goals.map((goal, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 p-4 bg-black/40 border border-cyber-cyan/20 hover:border-cyber-cyan/40 transition-all cyber-clipper group"
                                            >
                                                <div className="w-2 h-2 bg-cyber-cyan rotate-45 mt-2 group-hover:shadow-neon-cyan transition-all"></div>
                                                <span className="flex-1 text-white/90 font-mono text-sm leading-relaxed">
                                                    {goal}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 border border-dashed border-white/10 bg-white/[0.02]">
                                            <Flag size={32} className="mx-auto text-white/10 mb-3" />
                                            <p className="text-white/20 text-[10px] uppercase font-cyber font-black tracking-widest">
                                                목표가_설정되지_않았습니다
                                            </p>
                                            {updateMonthGoals && (
                                                <p className="text-white/10 text-[9px] font-mono mt-2">
                                                    위의 버튼을 사용하여 목표를 채워보세요
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-4 text-white/20 font-mono text-xs uppercase tracking-[0.2em]">
                        <span className="w-12 h-[1px] bg-white/10" />
                        Strategic_Drill_Down::전략적_상세_분석
                        <span className="w-12 h-[1px] bg-white/10" />
                    </div>
                </div>

                {/* Scale-like Timeline Visualization */}
                <div className="relative mb-24 px-16 max-w-5xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 -z-10"></div>
                    <div className="absolute top-1/2 left-0 w-1/3 h-[2px] bg-cyber-cyan shadow-neon-cyan -translate-y-1/2 -z-10 opacity-40 transition-all duration-1000"></div>

                    <div className="flex justify-between relative z-10">
                        {hasPlan ? weeks.map((week, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-6 group">
                                <div className={`
                                w-12 h-12 flex items-center justify-center transition-all duration-500 border-2 cyber-clipper-lg
                                ${idx === 0
                                        ? 'bg-cyber-cyan border-white shadow-neon-cyan scale-110'
                                        : 'bg-black border-white/10 group-hover:border-cyber-cyan group-hover:shadow-neon-cyan group-hover:scale-105'
                                    }
                            `}>
                                    <div className={`font-cyber font-black text-sm ${idx === 0 ? 'text-black' : 'text-white/20 group-hover:text-cyber-cyan'}`}>
                                        0{week.weekNumber}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className={`text-[10px] font-cyber font-black uppercase tracking-widest transition-colors ${idx === 0 ? 'text-cyber-cyan' : 'text-white/20'}`}>S{week.weekNumber}</span>
                                </div>
                            </div>
                        )) : (
                            [1, 2, 3, 4].map((w) => (
                                <div key={w} className="w-4 h-4 bg-black border-2 border-white/5"></div>
                            ))
                        )}
                    </div>
                </div>


                {/* AI Auto-Fill Sprint Button */}
                {hasPlan && onGenerateEntireSprint && (
                    <div className="mb-8 max-w-4xl mx-auto">
                        <div className="border-2 border-dashed border-cyber-yellow/30 bg-cyber-yellow/5 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-yellow/10 to-transparent pointer-events-none"></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap size={16} className="text-cyber-yellow" />
                                        <h3 className="text-[11px] font-cyber font-black text-cyber-yellow uppercase tracking-[0.25em]">
                                            TACTICAL_DEPLOYMENT_OVERRIDE::전술_데이터_전구역_강제_주입
                                        </h3>
                                    </div>
                                    <p className="text-[9px] text-white/40 font-mono">
                                        중앙 전술망(AI)으로부터 1~4주차 전체 작전 계획을 일괄 수신하여 프로젝트를 초기화합니다
                                    </p>
                                </div>

                                <button
                                    onClick={() => onGenerateEntireSprint(selectedMonthIndex)}
                                    disabled={isGeneratingEntireSprint}
                                    className="px-8 py-4 bg-cyber-yellow text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[10px] font-cyber font-black uppercase tracking-wider skew-x-[-10deg] border-2 border-cyber-yellow flex items-center gap-2"
                                    title="전체 스프린트 자동 생성"
                                >
                                    <span className="skew-x-[10deg] inline-flex items-center gap-2">
                                        {isGeneratingEntireSprint ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                OVERRIDING...
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={14} />
                                                AUTO_FILL_SEQUENCE::일괄_전개
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Objective Staging Area */}
                {/* Sub Task Queue (Previously Objective Staging Area) */}
                {hasPlan && (
                    <div className="mb-12 max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-1.5 h-1.5 bg-cyber-pink animate-pulse shadow-neon-pink rounded-full" />
                            <h3 className="text-[10px] font-cyber font-black text-cyber-pink uppercase tracking-[0.2em]">SUB_TASK_QUEUE::서브_태스크_대기열</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-cyber-pink/50 to-transparent" />
                        </div>
                        <div className="flex flex-wrap gap-4 p-6 border-2 border-dashed border-white/10 bg-white/[0.02] rounded-lg min-h-[120px] items-center justify-center">
                            <span className="text-white/10 text-[10px] uppercase font-cyber font-black tracking-widest">
                                대기중인_서브_태스크_없음
                            </span>
                        </div>
                        <p className="mt-2 text-[10px] text-white/30 font-mono flex items-center gap-2">
                            DRAG_TO_SPRINT::스프린트로_드래그하여_할당하십시오
                        </p>
                    </div>
                )}

                {/* Weekly Tactical Columns */}
                {hasPlan ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {weeks.map((week, idx) => {
                            const totalTasks = week.tasks.length;
                            const completedTasks = week.tasks.filter(t => {
                                const status = getTaskStatus(t);
                                return status === TaskStatus.DONE;
                            }).length;
                            const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                            const loadPercent = getLoadPercentage(totalTasks);
                            const loadColor = getLoadColor(loadPercent);

                            return (
                                <div
                                    key={idx}
                                    className={`flex flex-col h-full group ${dragOverWeekIndex === idx ? 'ring-2 ring-cyber-cyan ring-opacity-50 bg-cyber-cyan/5' : ''}`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOverWeekIndex(idx);
                                    }}
                                    onDragLeave={() => setDragOverWeekIndex(null)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragOverWeekIndex(null);
                                        setDragOverWeekIndex(null);

                                        const type = e.dataTransfer.getData('type');
                                        if (type === 'goal') {
                                            const text = e.dataTransfer.getData('text');
                                            if (text) addTask(idx, text, selectedMonthIndex);
                                            return;
                                        }

                                        const taskId = e.dataTransfer.getData('taskId');
                                        const sourceWeekIndex = parseInt(e.dataTransfer.getData('sourceWeekIndex'), 10);

                                        if (taskId && !isNaN(sourceWeekIndex) && sourceWeekIndex !== idx && moveTask) {
                                            moveTask(taskId, sourceWeekIndex, idx);
                                        }
                                    }}
                                >
                                    {/* Loadout Gauge */}
                                    <div className="mb-4 flex items-center justify-between px-2">
                                        <div className="flex items-center gap-2">
                                            <Shield size={12} className={progressPercent === 100 ? 'text-cyber-cyan shadow-neon-cyan' : progressPercent > 0 ? 'text-cyber-cyan' : 'text-white/20'} />
                                            <span className={`text-[10px] font-cyber font-black tracking-widest ${progressPercent === 100 ? 'text-cyber-cyan' : 'text-white/40'}`}>
                                                PROGRESS::미션_진행률
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-mono font-bold ${progressPercent === 100 ? 'text-cyber-cyan shadow-neon-cyan' : 'text-white/60'}`}>
                                            {Math.round(progressPercent)}%
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 mb-6 overflow-hidden">
                                        <div
                                            className={`h-full ${progressPercent === 100 ? 'bg-cyber-cyan shadow-neon-cyan' : 'bg-cyber-pink shadow-neon-pink'} transition-all duration-1000 ease-out`}
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>

                                    <div className="glass-panel border-2 border-white/5 flex flex-col flex-1 hover:border-white/20 transition-all duration-500 bg-black/40 skew-x-[-1deg]">
                                        <div className="skew-x-[1deg] flex-1 flex flex-col">
                                            <div className="p-6 border-b border-white/5 bg-white/5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 font-cyber font-black flex items-center justify-center text-[10px] text-white/10 group-hover:text-cyber-cyan transition-colors">
                                                    S0{week.weekNumber}
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-cyber-cyan animate-pulse shadow-neon-cyan' : 'bg-white/10'}`}></div>
                                                    <span className="text-[9px] font-cyber font-black text-white/20 uppercase tracking-[0.3em] flex-1">스프린트_업데이트</span>

                                                    {onGenerateWeekTheme && (
                                                        <button
                                                            onClick={() => onGenerateWeekTheme(selectedMonthIndex, idx)}
                                                            className="text-[10px] text-cyber-pink hover:text-white font-cyber mr-3 flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                                                            title="전술망 신호 동기화"
                                                        >
                                                            <Wand2 size={10} /> SYNC_SIGNAL
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => setEditingWeekIndex(editingWeekIndex === idx ? null : idx)}
                                                        className="text-[10px] text-white/20 hover:text-cyber-cyan font-cyber mr-4"
                                                    >
                                                        {editingWeekIndex === idx ? '확인' : '편집'}
                                                    </button>
                                                </div>
                                                {editingWeekIndex === idx ? (
                                                    <input
                                                        className="bg-black/50 border-b-2 border-cyber-cyan w-full text-lg font-cyber font-black text-white uppercase tracking-tight focus:outline-none"
                                                        value={week.theme}
                                                        autoFocus
                                                        onChange={(e) => updateWeekTheme(idx, e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && setEditingWeekIndex(null)}
                                                    />
                                                ) : (
                                                    <h3 className="font-cyber font-black text-lg text-white leading-tight uppercase tracking-tight group-hover:text-cyber-cyan transition-colors min-h-[3.5rem]">
                                                        {week.theme}
                                                    </h3>
                                                )}
                                            </div>

                                            <div className="p-6 flex-1 bg-black/20 flex flex-col">
                                                <div className="space-y-3 mb-6">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Flag size={10} className="text-cyber-cyan" />
                                                        <span className="text-[8px] font-cyber font-black text-white/30 uppercase tracking-widest">목표_체크리스트</span>
                                                    </div>
                                                    {week.tasks.map((task, tIdx) => {
                                                        const taskStatus = getTaskStatus(task);
                                                        const config = statusConfig[taskStatus];

                                                        return (
                                                            <div
                                                                key={task.id}
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData('taskId', task.id);
                                                                    e.dataTransfer.setData('sourceWeekIndex', idx.toString());
                                                                }}
                                                                onClick={() => {
                                                                    if (editingTaskId !== task.id) {
                                                                        const nextStatus = getNextStatus(taskStatus);
                                                                        handleStatusChange(idx, task.id, nextStatus);
                                                                    }
                                                                }}
                                                                className={`
                                                                    p-5 border text-[12px] font-mono transition-all relative overflow-hidden group/item cursor-pointer cyber-clipper
                                                                    ${config.bgColor} ${config.borderColor}
                                                                    ${taskStatus === TaskStatus.DONE ? 'opacity-60' : 'hover:opacity-100 hover:border-cyber-cyan/50 hover:shadow-neon-cyan'}
                                                                    ${editingTaskId === task.id ? 'ring-2 ring-cyber-pink shadow-neon-pink' : 'hover:bg-white/[0.03]'}
                                                                `}
                                                            >
                                                                {/* Status indicator bar */}
                                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${taskStatus === TaskStatus.DONE ? 'bg-green-400' :
                                                                    taskStatus === TaskStatus.REVIEW ? 'bg-cyber-yellow' :
                                                                        taskStatus === TaskStatus.IN_PROGRESS ? 'bg-cyber-cyan' :
                                                                            'bg-zinc-600'
                                                                    }`}></div>

                                                                {/* Status badge */}
                                                                <div className={`absolute top-0 right-0 px-2 py-0.5 ${config.bgColor} ${config.color} text-[8px] font-cyber font-black uppercase flex items-center gap-1`}>
                                                                    {config.icon}
                                                                    {config.labelKo}
                                                                </div>

                                                                <div className="pl-2 flex justify-between items-start group/task mt-3">
                                                                    {editingTaskId === task.id ? (
                                                                        <textarea
                                                                            className="bg-black/50 border-b border-cyber-cyan w-full text-white focus:outline-none resize-none"
                                                                            value={task.text}
                                                                            autoFocus
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            onBlur={() => setEditingTaskId(null)}
                                                                            onChange={(e) => updateTaskText(idx, task.id, e.target.value)}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                                    e.preventDefault();
                                                                                    setEditingTaskId(null);
                                                                                }
                                                                            }}
                                                                            rows={2}
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <div className={`flex-1 min-w-0 break-words pb-2 leading-relaxed ${taskStatus === TaskStatus.DONE ? 'line-through text-white/40' : 'text-white/90'}`}>
                                                                                {task.text}
                                                                            </div>
                                                                            <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-3 bg-black/40 p-1.5 rounded-sm border border-white/5">
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); setEditingTaskId(task.id); }}
                                                                                    className="p-1.5 hover:text-cyber-cyan hover:bg-white/5 transition-all rounded-sm"
                                                                                    title="Edit Task"
                                                                                >
                                                                                    <Edit3 size={14} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); deleteTask(idx, task.id); }}
                                                                                    className="p-1.5 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm"
                                                                                    title="Delete Task"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {week.tasks.length === 0 && (
                                                        <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.02]">
                                                            <span className="text-white/10 text-[10px] uppercase font-cyber font-black tracking-widest">할당된_작전_없음</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Visual Footer for each week - 상태별로 색상 표시 */}
                                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex gap-1">
                                                        {week.tasks.map((task, i) => {
                                                            const taskStatus = getTaskStatus(task);
                                                            return (
                                                                <div
                                                                    key={task.id}
                                                                    className={`w-2 h-3 skew-x-[-20deg] transition-all duration-500 ${taskStatus === TaskStatus.DONE ? 'bg-green-400 shadow-[0_0_5px_#22c55e]' :
                                                                        taskStatus === TaskStatus.REVIEW ? 'bg-cyber-yellow shadow-neon-yellow' :
                                                                            taskStatus === TaskStatus.IN_PROGRESS ? 'bg-cyber-cyan shadow-neon-cyan' :
                                                                                'bg-zinc-600'
                                                                        }`}
                                                                    title={`${task.text} (${statusConfig[taskStatus].labelKo})`}
                                                                ></div>
                                                            );
                                                        })}
                                                        {week.tasks.length === 0 && (
                                                            <div className="w-4 h-1 bg-white/5"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-[8px] font-cyber text-white/10 uppercase tracking-tighter italic">시스템_정상</span>
                                                </div>
                                            </div>

                                            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all gap-2">
                                                {onGenerateWeekTasks && (
                                                    <button
                                                        onClick={() => onGenerateWeekTasks(selectedMonthIndex, idx)}
                                                        className="text-[10px] font-cyber font-black text-cyber-yellow/50 hover:text-cyber-yellow transition-all uppercase flex items-center gap-1 px-2 py-1 hover:bg-cyber-yellow/10 rounded"
                                                        title="분산 작전 데이터 전개"
                                                    >
                                                        <Wand2 size={10} /> DEPLOY_OPS
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => addTask(idx, undefined, selectedMonthIndex)}
                                                    className="text-[10px] font-cyber font-black text-white/20 hover:text-cyber-pink hover:tracking-widest transition-all uppercase flex items-center gap-2"
                                                >
                                                    <Plus size={12} /> 서브_태스크_추가
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State / Generator Link */
                    /* Loading State (Initializing) */
                    <div className="text-center py-32 border-2 border-dashed border-white/5 bg-black/40 skew-x-[-1deg] flex flex-col items-center justify-center">
                        <div className="skew-x-[1deg] flex flex-col items-center">
                            <Loader2 size={48} className="text-cyber-cyan animate-spin mb-6" />
                            <h3 className="text-xl font-cyber font-black text-cyber-cyan mb-2 uppercase tracking-[0.3em] animate-pulse">
                                INITIALIZING_SECTOR...
                            </h3>
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
                                작전 구역 자동 생성 및 전개 중
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
