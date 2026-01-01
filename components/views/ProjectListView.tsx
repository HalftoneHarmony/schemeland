import React from 'react';
import { Briefcase, Plus, ArrowRight } from 'lucide-react';
import { ProjectScheme } from '../../types';

interface ProjectListViewProps {
    projects: ProjectScheme[];
    onSelectProject: (id: string) => void;
    onNewAdventure: () => void;
}

export function ProjectListView({ projects, onSelectProject, onNewAdventure }: ProjectListViewProps) {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up">
            <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
                <Briefcase className="text-primary" size={40} /> SELECT YOUR QUEST
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div
                    onClick={onNewAdventure}
                    className="border-2 border-dashed border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-zinc-900/30 transition-all min-h-[300px] group"
                >
                    <div className="bg-zinc-800 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <Plus className="text-zinc-400 group-hover:text-primary" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-400 group-hover:text-white">New Adventure</h3>
                </div>

                {projects.map(project => {
                    const totalTasks = project.monthlyPlan.reduce((acc, m) =>
                        acc + (m.detailedPlan?.reduce((tAcc, w) => tAcc + w.tasks.length, 0) || 0), 0);
                    const completedTasks = project.monthlyPlan.reduce((acc, m) =>
                        acc + (m.detailedPlan?.reduce((tAcc, w) => tAcc + w.tasks.filter(t => t.isCompleted).length, 0) || 0), 0);
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                        <div
                            key={project.id}
                            onClick={() => onSelectProject(project.id)}
                            className="glass-panel rounded-2xl p-8 cursor-pointer hover:border-primary transition-all relative overflow-hidden group min-h-[300px] flex flex-col"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>

                            <div className="flex-1 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-4xl">{project.selectedIdea.emoji || '🚀'}</div>
                                    <span className="bg-zinc-900/80 px-3 py-1 rounded-full text-xs font-mono text-zinc-400 border border-zinc-700">
                                        LVL {Math.floor(progress / 10) + 1}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">{project.selectedIdea.title}</h3>
                                <p className="text-sm text-textMuted line-clamp-3 leading-relaxed mb-6">{project.analysis.oneLiner}</p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                            <span className="text-zinc-500">Quest Progress</span>
                                            <span className="text-accent">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                                            <div className="bg-accent h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-zinc-800/50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-zinc-500 font-mono">{new Date(project.startDate).toLocaleDateString()}</span>
                                <div className="text-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Resume <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
