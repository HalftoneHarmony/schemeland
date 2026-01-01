import React from 'react';
import {
    Swords, Clock, Crown, AlertTriangle, Edit3, X
} from 'lucide-react';
import { Button } from '../Button';
import { ProjectScheme } from '../../types';

interface DashboardHeaderProps {
    activeProject: ProjectScheme;
    progress: number;
    daysPassed: number;
    timeProgress: number;
    isAhead: boolean;
    statusColor: string;
    statusMessage: string;
    isEditingMode: boolean;
    setIsEditingMode: (edit: boolean) => void;
    isPreviewMode: boolean;
}

export function DashboardHeader({
    activeProject, progress, daysPassed, timeProgress, isAhead, statusColor, statusMessage,
    isEditingMode, setIsEditingMode, isPreviewMode
}: DashboardHeaderProps) {

    return (
        <header className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-10">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-6xl shadow-inner shrink-0">
                        {activeProject.selectedIdea.emoji || '🚀'}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{activeProject.selectedIdea.title}</h1>
                            <span className="px-3 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">Active Quest</span>
                        </div>
                        <p className="text-xl text-zinc-400 font-medium max-w-3xl leading-relaxed">
                            "{activeProject.analysis.oneLiner}"
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isPreviewMode && (
                        isEditingMode ? (
                            <Button variant="secondary" onClick={() => setIsEditingMode(false)}><X size={16} className="mr-2" /> Done Editing</Button>
                        ) : (
                            <Button variant="ghost" onClick={() => setIsEditingMode(true)} className="border border-zinc-800 hover:bg-zinc-800">
                                <Edit3 size={16} className="mr-2" /> Layout Edit
                            </Button>
                        )
                    )}
                </div>
            </div>

            {/* HUD / Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* XP Bar */}
                <div className="glass-panel p-5 rounded-xl relative overflow-hidden group">
                    <div className="flex justify-between items-end mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                            <Swords className="text-primary" size={20} />
                            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Quest XP</span>
                        </div>
                        <span className="text-2xl font-black text-white">{progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-900/50 rounded-full h-3 border border-zinc-700/50 relative z-10">
                        <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full" style={{ width: `${progress}%` }}></div>
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full rounded-full transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>
                </div>

                {/* Time Bar */}
                <div className="glass-panel p-5 rounded-xl relative overflow-hidden group">
                    <div className="flex justify-between items-end mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                            <Clock className="text-blue-500" size={20} />
                            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Time Elapsed</span>
                        </div>
                        <span className="text-2xl font-black text-white">{daysPassed} <span className="text-xs text-zinc-500 font-normal">/ 30 Days</span></span>
                    </div>
                    <div className="w-full bg-zinc-900/50 rounded-full h-3 border border-zinc-700/50 relative z-10">
                        <div className={`h-full rounded-full transition-all duration-1000 ${timeProgress > 80 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-blue-500 shadow-[0_0_10px_blue]'}`} style={{ width: `${timeProgress}%` }}></div>
                    </div>
                </div>

                {/* Status */}
                <div className="glass-panel p-5 rounded-xl relative overflow-hidden flex items-center justify-between">
                    <div className="relative z-10">
                        <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Current State</div>
                        <div className={`text-3xl font-black ${statusColor} italic tracking-wide`}>{statusMessage}</div>
                    </div>
                    <div className={`p-3 rounded-full border ${isAhead ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                        {isAhead ? <Crown size={32} /> : <AlertTriangle size={32} />}
                    </div>
                </div>
            </div>
        </header>
    );
}
