import React from 'react';
import { ProjectScheme, MonthlyGoal } from '../../types';
import { Button } from '../Button';
import { ArrowLeft, Map, Calendar, Flag, Zap, Plus } from 'lucide-react';

interface CampaignDetailViewProps {
    activeProject: ProjectScheme;
    selectedMonthIndex: number;
    onBack: () => void;
}

export function CampaignDetailView({ activeProject, selectedMonthIndex, onBack }: CampaignDetailViewProps) {
    const monthPlan = activeProject.monthlyPlan[selectedMonthIndex];

    // Safety check for monthPlan
    if (!monthPlan) return null;

    const weeks = monthPlan.detailedPlan || [];
    const hasPlan = weeks.length > 0;

    // Helper to calculate load
    // Assuming 5 tasks is "100%" capacity for visual reference
    const getLoadPercentage = (taskCount: number) => Math.min(100, (taskCount / 5) * 100);
    const getLoadColor = (percent: number) => {
        if (percent >= 80) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        if (percent >= 60) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
        return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up pb-32">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white pl-0 group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    BACK TO OPS CENTER
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
                    <Zap size={16} className="text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tactical Mode Active</span>
                </div>
            </div>

            <div className="mb-12 text-center">
                <div className="inline-block mb-4">
                    <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_0_15px_-5px_rgba(37,99,235,0.5)]">
                        Month 0{monthPlan.month} Protocol
                    </span>
                </div>
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
                    {monthPlan.theme}
                </h1>
            </div>

            {/* Scale-like Timeline Visualization */}
            <div className="relative mb-16 px-12">
                {/* Connecting Line Track */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -translate-y-1/2 -z-10 rounded-full"></div>

                {/* Connection Line Progress (Static for now, could be dynamic based on current date) */}
                <div className="absolute top-1/2 left-0 w-1/4 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 -translate-y-1/2 -z-10 rounded-full opacity-50"></div>

                <div className="flex justify-between relative z-10">
                    {hasPlan ? weeks.map((week, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-4 group cursor-pointer">
                            <div className={`
                                w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300
                                ${idx === 0
                                    ? 'bg-zinc-900 border-emerald-500 scale-125 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                                    : 'bg-zinc-950 border-zinc-700 hover:border-blue-500 hover:scale-110'
                                }
                            `}>
                                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Week 0{week.weekNumber}</div>
                            </div>
                        </div>
                    )) : (
                        [1, 2, 3, 4].map((w) => (
                            <div key={w} className="w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-700"></div>
                        ))
                    )}
                </div>
            </div>

            {/* Weekly Tactical Columns */}
            {hasPlan ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {weeks.map((week, idx) => {
                        const loadPercent = getLoadPercentage(week.tasks.length);
                        const loadColor = getLoadColor(loadPercent);

                        return (
                            <div key={idx} className="flex flex-col h-full">
                                {/* Loadout Gauge */}
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${loadColor} transition-all duration-1000 ease-out`}
                                            style={{ width: `${loadPercent}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-[10px] font-black ${loadPercent > 80 ? 'text-red-500 blink' : 'text-zinc-500'}`}>
                                        {Math.round(loadPercent)}% LOAD
                                    </span>
                                </div>

                                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col flex-1 hover:border-zinc-700/80 transition-colors group backdrop-blur-sm">
                                    <div className="p-5 border-b border-zinc-800/60 bg-gradient-to-b from-white/[0.02] to-transparent rounded-t-2xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">Week 0{week.weekNumber}</span>
                                            {idx === 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>}
                                        </div>
                                        <h3 className="font-bold text-lg text-zinc-200 leading-tight group-hover:text-white transition-colors">
                                            {week.theme}
                                        </h3>
                                    </div>

                                    <div className="p-4 flex-1">
                                        <div className="space-y-3">
                                            {week.tasks.map((task, tIdx) => (
                                                <div
                                                    key={tIdx}
                                                    className={`
                                                        p-3 rounded-lg border text-sm transition-all cursor-grab active:cursor-grabbing hover:-translate-y-0.5
                                                        ${task.isCompleted
                                                            ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-500 line-through'
                                                            : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:shadow-lg hover:border-zinc-600'
                                                        }
                                                    `}
                                                >
                                                    {task.text}
                                                </div>
                                            ))}
                                            {week.tasks.length === 0 && (
                                                <div className="text-center py-8 border-2 border-dashed border-zinc-800/50 rounded-xl">
                                                    <span className="text-zinc-600 text-xs uppercase font-bold">No Ops Assigned</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Actions (Placeholder) */}
                                    <div className="p-3 border-t border-zinc-800/40 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1">
                                            <Plus size={10} /> Add Task
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State / Generator Link */
                <div className="text-center py-32 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                    <Map size={64} className="mx-auto text-zinc-700 mb-6 opacity-50" />
                    <h3 className="text-2xl font-bold text-zinc-400 mb-2">Sector Uncharted</h3>
                    <p className="text-zinc-500 max-w-md mx-auto mb-8">
                        This month's tactical map has not been generated yet. <br />
                        Initialize weekly operations to view the tactical board.
                    </p>
                    <Button onClick={onBack} variant="primary">
                        Initialize in Dashboard
                    </Button>
                </div>
            )}
        </div>
    );
}
