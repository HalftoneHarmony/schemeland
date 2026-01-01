import React from 'react';
import { Briefcase, Plus, ArrowRight, Database, Terminal, Shield, Activity } from 'lucide-react';
import { ProjectScheme } from '../../types';

interface ProjectListViewProps {
    projects: ProjectScheme[];
    onSelectProject: (id: string) => void;
    onNewAdventure: () => void;
}

export function ProjectListView({ projects, onSelectProject, onNewAdventure }: ProjectListViewProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-slide-up">
            <div className="mb-16 border-l-4 border-cyber-cyan pl-8">
                <div className="flex items-center gap-3 mb-2">
                    <Database className="text-cyber-cyan" size={20} />
                    <span className="text-xs font-cyber font-black text-cyber-cyan uppercase tracking-widest">Storage_Unit_01</span>
                </div>
                <h2 className="text-5xl font-cyber font-black text-white uppercase tracking-tighter italic">Select_Operation</h2>
                <p className="text-white/40 font-mono text-sm mt-4 uppercase tracking-[0.2em]">Resuming active threads from neural database.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div
                    onClick={onNewAdventure}
                    className="border-2 border-dashed border-white/5 bg-white/5 p-10 flex flex-col items-center justify-center cursor-pointer hover:border-cyber-pink hover:bg-cyber-pink/5 transition-all min-h-[340px] group skew-x-[-2deg]"
                >
                    <div className="skew-x-[2deg] flex flex-col items-center">
                        <div className="w-20 h-20 border-2 border-white/10 flex items-center justify-center mb-8 group-hover:border-cyber-pink group-hover:shadow-neon-pink group-hover:scale-110 transition-all bg-black">
                            <Plus className="text-white/20 group-hover:text-cyber-pink" size={40} />
                        </div>
                        <h3 className="text-xs font-cyber font-black text-white/40 group-hover:text-white uppercase tracking-[0.3em]">Initialize_New_Quest</h3>
                    </div>
                </div>

                {projects.map((project, idx) => {
                    const totalTasks = project.monthlyPlan.reduce((acc, m) =>
                        acc + (m.detailedPlan?.reduce((tAcc, w) => tAcc + w.tasks.length, 0) || 0), 0);
                    const completedTasks = project.monthlyPlan.reduce((acc, m) =>
                        acc + (m.detailedPlan?.reduce((tAcc, w) => tAcc + w.tasks.filter(t => t.isCompleted).length, 0) || 0), 0);
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                        <div
                            key={project.id}
                            onClick={() => onSelectProject(project.id)}
                            className="glass-panel border-2 border-white/5 p-10 cursor-pointer hover:border-cyber-cyan transition-all relative overflow-hidden group min-h-[340px] flex flex-col bg-black skew-x-[-1deg] shadow-2xl"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Animated Background Element */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-[100px] group-hover:bg-cyber-cyan/10 transition-colors" />

                            <div className="skew-x-[1deg] flex-1 relative z-10 flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 border-2 border-white/10 bg-black flex items-center justify-center text-4xl group-hover:border-cyber-cyan transition-all">
                                        {project.selectedIdea.emoji || '🚀'}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="bg-black border border-white/10 px-3 py-1 text-[10px] font-cyber font-black text-white/40 uppercase tracking-widest">
                                            RANK_{Math.floor(progress / 10) + 1}
                                        </div>
                                        <Activity size={14} className="text-cyber-cyan animate-pulse" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-cyber font-black text-white group-hover:text-cyber-cyan transition-colors line-clamp-1 mb-4 uppercase tracking-tighter italic">
                                    {project.selectedIdea.title}
                                </h3>
                                <p className="text-xs font-mono text-white/40 line-clamp-3 leading-relaxed mb-10 overflow-hidden uppercase tracking-tighter">
                                    {project.analysis.oneLiner}
                                </p>

                                <div className="mt-auto space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-cyber font-black uppercase tracking-[0.2em]">
                                            <span className="text-white/20">Sync_Progress</span>
                                            <span className="text-cyber-cyan">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-black h-1.5 border border-white/5 relative overflow-hidden">
                                            <div
                                                className="bg-cyber-cyan h-full transition-all duration-1000 shadow-neon-cyan"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity skew-x-[1deg]">
                                <div className="flex items-center gap-2">
                                    <Terminal size={14} className="text-white/20" />
                                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="text-[10px] font-cyber font-black text-cyber-cyan flex items-center gap-3 transition-all group-hover:gap-5">
                                    RESUME_PROCESS <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
