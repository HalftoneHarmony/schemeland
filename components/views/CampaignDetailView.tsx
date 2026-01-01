import React from 'react';
import { ProjectScheme, MonthlyGoal } from '../../types';
import { Button } from '../Button';
import { ArrowLeft, Map, Calendar, Flag, Zap } from 'lucide-react';

interface CampaignDetailViewProps {
    activeProject: ProjectScheme;
    selectedMonthIndex: number;
    onBack: () => void;
}

export function CampaignDetailView({ activeProject, selectedMonthIndex, onBack }: CampaignDetailViewProps) {
    const monthPlan = activeProject.monthlyPlan[selectedMonthIndex];
    if (!monthPlan) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white pl-0">
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </Button>
            </div>

            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Month {monthPlan.month}
                    </span>
                    <h1 className="text-4xl font-black text-white">{monthPlan.theme}</h1>
                </div>
                <p className="text-zinc-400 max-w-2xl text-lg">
                    Detailed tactical map for this month's campaign.
                </p>
            </div>

            {/* Visual Roadmap Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Stage 1: Goals */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Flag className="text-blue-500" /> Objectives
                    </h3>
                    <div className="space-y-4">
                        {monthPlan.goals.map((goal, idx) => (
                            <div key={idx} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                    {idx + 1}
                                </div>
                                <span className="text-zinc-300 font-medium">{goal}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stage 2: Timeline / Weekly Flow (Placeholder) */}
                <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Map className="text-emerald-500" /> Tactical Roadmap
                    </h3>

                    {/* Visual Timeline SVG or similar */}
                    <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
                        <div className="text-center text-zinc-500">
                            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Interactive Timeline Visualization Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
