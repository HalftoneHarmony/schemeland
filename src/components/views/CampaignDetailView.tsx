import React, { useState } from 'react';
import { ProjectScheme, MonthlyGoal, Priority } from '../../types';
import { Button } from '../Button';
import { ArrowLeft, Map, Calendar, Flag, Zap, Plus, Shield, Activity, Terminal, Trash2, Edit3 } from 'lucide-react';

interface CampaignDetailViewProps {
    activeProject: ProjectScheme;
    selectedMonthIndex: number;
    onBack: () => void;
    toggleTask: (weekIndex: number, taskId: string) => void;
    addTask: (weekIndex: number) => void;
    deleteTask: (weekIndex: number, taskId: string) => void;
    updateTaskText: (weekIndex: number, taskId: string, text: string) => void;
    updateWeekTheme: (weekIndex: number, theme: string) => void;
}

export function CampaignDetailView({
    activeProject, selectedMonthIndex, onBack,
    toggleTask, addTask, deleteTask, updateTaskText, updateWeekTheme
}: CampaignDetailViewProps) {
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingWeekIndex, setEditingWeekIndex] = useState<number | null>(null);
    const monthPlan = activeProject.monthlyPlan[selectedMonthIndex];

    // Safety check for monthPlan
    if (!monthPlan) return null;

    const weeks = monthPlan.detailedPlan || [];
    const hasPlan = weeks.length > 0;

    // Helper to calculate load
    // Assuming 5 tasks is "100%" capacity for visual reference
    const getLoadPercentage = (taskCount: number) => Math.min(100, (taskCount / 5) * 100);
    const getLoadColor = (percent: number) => {
        if (percent >= 80) return 'bg-red-500 shadow-[0_0_15px_#ef4444]';
        if (percent >= 60) return 'bg-cyber-yellow shadow-neon-yellow';
        return 'bg-cyber-cyan shadow-neon-cyan';
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
                            {Math.round((weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.isCompleted).length, 0) / (weeks.reduce((acc, w) => acc + w.tasks.length, 0) || 1)) * 100)}%
                        </span>
                    </div>
                    <div className="h-4 bg-white/5 border border-white/10 p-1 skew-x-[-15deg]">
                        <div
                            className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-pink shadow-neon-cyan transition-all duration-1000 ease-out relative overflow-hidden"
                            style={{ width: `${(weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.isCompleted).length, 0) / (weeks.reduce((acc, w) => acc + w.tasks.length, 0) || 1)) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[scanline_2s_linear_infinite] w-24"></div>
                        </div>
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

                    <div className="inline-block mb-6 skew-x-[-10deg]">
                        <span className="bg-cyber-pink text-white font-cyber font-black text-[10px] px-6 py-2 uppercase tracking-[0.4em] shadow-neon-pink">
                            Sector_0{monthPlan.month}_Protocol::섹터_{monthPlan.month}_프로토콜
                        </span>
                    </div>

                    <div className="relative inline-block">
                        <h1 className="text-8xl font-cyber font-black text-white mb-6 tracking-tighter uppercase italic scale-y-110 drop-shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                            {monthPlan.theme}
                        </h1>
                        <div className="absolute -right-12 top-0 animate-bounce">
                            <Zap className="text-cyber-yellow" fill="currentColor" size={32} style={{ filter: 'drop-shadow(0 0 10px #fce70a)' }} />
                        </div>
                    </div>

                    {/* Sector Stats Dashboard */}
                    <div className="flex justify-center flex-wrap gap-8 my-10 px-8">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-cyber font-black text-white/30 uppercase tracking-[0.2em]">Weeks_Active::활성_주차</span>
                            <div className="text-3xl font-cyber font-black text-cyber-cyan italic">{weeks.length}</div>
                            <div className="w-12 h-0.5 bg-cyber-cyan shadow-neon-cyan"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-cyber font-black text-white/30 uppercase tracking-[0.2em]">Tactical_Goals::전술_목표</span>
                            <div className="text-3xl font-cyber font-black text-white italic">
                                {weeks.reduce((acc, w) => acc + w.tasks.length, 0)}
                            </div>
                            <div className="w-12 h-0.5 bg-white/20"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-cyber font-black text-white/30 uppercase tracking-[0.2em]">Sync_Status::동기화_학습</span>
                            <div className="text-3xl font-cyber font-black text-cyber-pink italic">
                                {weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.isCompleted).length, 0)}
                            </div>
                            <div className="w-12 h-0.5 bg-cyber-pink shadow-neon-pink"></div>
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
                                w-10 h-10 flex items-center justify-center transition-all duration-500 border-2 skew-x-[-10deg]
                                ${idx === 0
                                        ? 'bg-cyber-cyan border-white shadow-neon-cyan scale-125'
                                        : 'bg-black border-white/10 group-hover:border-cyber-cyan group-hover:shadow-neon-cyan group-hover:scale-110'
                                    }
                            `}>
                                    <div className={`skew-x-[10deg] font-cyber font-black text-xs ${idx === 0 ? 'text-black' : 'text-white/20 group-hover:text-cyber-cyan'}`}>
                                        0{week.weekNumber}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className={`text-[10px] font-cyber font-black uppercase tracking-widest transition-colors ${idx === 0 ? 'text-cyber-cyan' : 'text-white/20'}`}>W{week.weekNumber}</span>
                                </div>
                            </div>
                        )) : (
                            [1, 2, 3, 4].map((w) => (
                                <div key={w} className="w-4 h-4 bg-black border-2 border-white/5"></div>
                            ))
                        )}
                    </div>
                </div>

                {/* Weekly Tactical Columns */}
                {hasPlan ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {weeks.map((week, idx) => {
                            const totalTasks = week.tasks.length;
                            const completedTasks = week.tasks.filter(t => t.isCompleted).length;
                            const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                            const loadPercent = getLoadPercentage(totalTasks);
                            const loadColor = getLoadColor(loadPercent);

                            return (
                                <div key={idx} className="flex flex-col h-full group">
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
                                                    <span className="text-[9px] font-cyber font-black text-white/20 uppercase tracking-[0.3em]">섹터_업데이트</span>
                                                    <button
                                                        onClick={() => setEditingWeekIndex(editingWeekIndex === idx ? null : idx)}
                                                        className="ml-auto text-[10px] text-white/20 hover:text-cyber-cyan font-cyber mr-8"
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
                                                    <h3 className="font-cyber font-black text-lg text-white leading-tight uppercase tracking-tight group-hover:text-cyber-cyan transition-colors h-14 line-clamp-2">
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
                                                    {week.tasks.map((task, tIdx) => (
                                                        <div
                                                            key={task.id}
                                                            onClick={() => toggleTask(idx, task.id)}
                                                            className={`
                                                            p-4 border text-[11px] font-mono transition-all relative overflow-hidden group/item cursor-pointer
                                                            ${task.isCompleted
                                                                    ? 'bg-cyber-cyan/5 border-cyber-cyan/20 text-white/20 italic'
                                                                    : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-cyber-cyan/30'
                                                                }
                                                        `}
                                                        >
                                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.isCompleted ? 'bg-cyber-cyan shadow-neon-cyan' : 'bg-white/10'}`}></div>
                                                            {task.isCompleted && (
                                                                <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyber-cyan text-black text-[8px] font-cyber font-black uppercase">동기화됨</div>
                                                            )}
                                                            <div className="pl-2 flex justify-between items-center group/task">
                                                                {editingTaskId === task.id ? (
                                                                    <input
                                                                        className="bg-black/50 border-b border-cyber-cyan w-full text-white focus:outline-none"
                                                                        value={task.text}
                                                                        autoFocus
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        onBlur={() => setEditingTaskId(null)}
                                                                        onChange={(e) => updateTaskText(idx, task.id, e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && setEditingTaskId(null)}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-center">
                                                                            {task.isCompleted && <span className="mr-2 text-cyber-cyan opacity-40">✓</span>}
                                                                            {task.text}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-all">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); setEditingTaskId(task.id); }}
                                                                                className="p-1 hover:text-cyber-cyan transition-all"
                                                                            >
                                                                                <Edit3 size={12} />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); deleteTask(idx, task.id); }}
                                                                                className="p-1 hover:text-red-500 transition-all"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {week.tasks.length === 0 && (
                                                        <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.02]">
                                                            <span className="text-white/10 text-[10px] uppercase font-cyber font-black tracking-widest">할당된_작전_없음</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Visual Footer for each week */}
                                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex gap-1">
                                                        {week.tasks.map((task, i) => (
                                                            <div
                                                                key={task.id}
                                                                className={`w-2 h-3 skew-x-[-20deg] transition-all duration-500 ${task.isCompleted ? 'bg-cyber-cyan shadow-neon-cyan' : 'bg-white/10'}`}
                                                                title={task.text}
                                                            ></div>
                                                        ))}
                                                        {week.tasks.length === 0 && (
                                                            <div className="w-4 h-1 bg-white/5"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-[8px] font-cyber text-white/10 uppercase tracking-tighter italic">시스템_정상</span>
                                                </div>
                                            </div>

                                            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => addTask(idx)}
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
                    <div className="text-center py-32 border-2 border-dashed border-white/5 bg-black/40 skew-x-[-1deg]">
                        <div className="skew-x-[1deg]">
                            <Map size={64} className="mx-auto text-white/5 mb-8" />
                            <h3 className="text-3xl font-cyber font-black text-white/20 mb-4 uppercase tracking-[0.3em]">섹터_데이터_누락</h3>
                            <p className="text-white/20 max-w-md mx-auto mb-10 font-mono text-sm uppercase">
                                이 섹터 프로토콜이 초기화되지 않았습니다. <br />
                                생성 시퀀스를 시작하려면 지휘 본부로 귀환하십시오.
                            </p>
                            <Button onClick={onBack} className="bg-cyber-pink text-white font-cyber font-black text-xs px-10 py-5 shadow-neon-pink border-none skew-x-[-10deg]">
                                <span className="skew-x-[10deg]">지휘_본부에서_초기화</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
