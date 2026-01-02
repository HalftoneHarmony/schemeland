import React from 'react';
import { Briefcase, Plus, ArrowRight, Database, Terminal, Shield, Activity, Zap } from 'lucide-react';
import { ProjectScheme } from '../../types';
import { motion } from 'framer-motion';

interface ProjectListViewProps {
    projects: ProjectScheme[];
    onSelectProject: (id: string) => void;
    onNewAdventure: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        },
    },
};

export function ProjectListView({ projects, onSelectProject, onNewAdventure }: ProjectListViewProps) {
    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 py-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="mb-16 border-l-4 border-cyber-cyan pl-8"
                variants={itemVariants}
            >
                <div className="flex items-center gap-3 mb-2">
                    <Database className="text-cyber-cyan animate-pulse" size={20} />
                    <span className="text-xs font-cyber font-black text-cyber-cyan uppercase tracking-widest">Storage_Unit::저장_데이터_유닛</span>
                </div>
                <h2 className="text-5xl font-cyber font-black text-white uppercase tracking-tighter italic">Select_Operation::작전_선택</h2>
                <p className="text-white/40 font-mono text-sm mt-4 uppercase tracking-[0.2em]">뉴럴 데이터베이스에서 활성 스레드를 재개합니다.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <motion.div
                    variants={itemVariants}
                    onClick={onNewAdventure}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="border border-dashed border-white/20 bg-white/5 p-10 flex flex-col items-center justify-center cursor-pointer hover:border-cyber-pink hover:bg-cyber-pink/5 transition-all min-h-[340px] group cyber-clipper"
                >
                    <div className="flex flex-col items-center">
                        <motion.div
                            className="w-20 h-20 border border-white/10 flex items-center justify-center mb-8 group-hover:border-cyber-pink group-hover:shadow-neon-pink transition-all bg-black cyber-clipper"
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Plus className="text-white/20 group-hover:text-cyber-pink" size={40} />
                        </motion.div>
                        <h3 className="text-xs font-cyber font-black text-white/40 group-hover:text-white uppercase tracking-[0.3em]">새로운_퀘스트_초기화</h3>
                    </div>
                </motion.div>

                {projects.map((project, idx) => {
                    const totalTasks = project.monthlyPlan.reduce((acc, m) =>
                        acc + (m.detailedPlan?.reduce((tAcc, w) => tAcc + w.tasks.length, 0) || 0), 0);
                    const completedTasks = project.monthlyPlan.reduce((acc, m) =>
                        acc + (m.detailedPlan?.reduce((tAcc, w) => tAcc + w.tasks.filter(t => t.isCompleted).length, 0) || 0), 0);
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            onClick={() => onSelectProject(project.id)}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className="border border-white/10 p-10 cursor-pointer hover:border-cyber-cyan transition-all relative overflow-hidden group min-h-[340px] flex flex-col bg-zinc-950/80 cyber-clipper-lg"
                        >
                            {/* Animated Background Element */}
                            <motion.div
                                className="absolute -top-20 -right-20 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-[100px]"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/0 to-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="flex-1 relative z-10 flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <motion.div
                                        className="w-16 h-16 border border-white/10 bg-black flex items-center justify-center text-4xl group-hover:border-cyber-cyan transition-all cyber-clipper"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {project.selectedIdea.emoji || '🚀'}
                                    </motion.div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="bg-black border border-white/10 px-3 py-1 text-[10px] font-cyber font-black text-white/40 uppercase tracking-widest cyber-clipper">
                                            등급_{Math.floor(progress / 10) + 1}
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
                                            <span className="text-white/20">Sync_Progress::진행률</span>
                                            <span className="text-cyber-cyan">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-black h-1.5 border border-white/5 relative overflow-hidden">
                                            <motion.div
                                                className="bg-cyber-cyan h-full shadow-neon-cyan"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                            />
                                            {/* Shimmer effect on progress bar */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2">
                                    <Terminal size={14} className="text-cyber-cyan" />
                                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                                <motion.div
                                    className="text-[10px] font-cyber font-black text-cyber-cyan flex items-center gap-3"
                                    whileHover={{ x: 5 }}
                                >
                                    프로세스_재개 <ArrowRight size={16} />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
