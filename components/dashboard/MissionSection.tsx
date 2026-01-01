import React from 'react';
import { Rocket, Layers, CheckCircle2, Scroll, Sparkles, Circle } from 'lucide-react';
import { Button } from '../Button';
import { ProjectScheme, WeeklyPlanOption, WeeklyPlan } from '../../types';

interface MissionSectionProps {
    activeProject: ProjectScheme;
    activeMonthlyPlan: any;
    weeklyPlan: WeeklyPlan[];
    isPreviewMode: boolean;
    previewOptions: WeeklyPlanOption[] | null;
    previewIndex: number;
    isGeneratingMonthDetail: boolean;
    isEditingMode: boolean;
    selectedMonthIndex: number;
    setPreviewIndex: (index: number) => void;
    handleGeneratePlanOptions: (index: number) => void;
    cancelPreview: () => void;
    confirmPreviewPlan: () => void;
    toggleTask: (weekIndex: number, taskId: string) => void;
    updateTaskText: (weekIndex: number, taskId: string, text: string) => void;
    onAbandonQuest: () => void;
}

export function MissionSection({
    activeProject, activeMonthlyPlan, weeklyPlan, isPreviewMode, previewOptions, previewIndex, isGeneratingMonthDetail, isEditingMode, selectedMonthIndex,
    setPreviewIndex, handleGeneratePlanOptions, cancelPreview, confirmPreviewPlan, toggleTask, updateTaskText, onAbandonQuest
}: MissionSectionProps) {

    return (
        <section className="animate-slide-up">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-3 text-white mb-1">
                            <Rocket className="text-red-500" /> MISSION LOG
                        </h2>
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold ml-9">Month {activeMonthlyPlan.month} - {activeMonthlyPlan.theme}</p>
                            <span className="text-zinc-700">|</span>
                            <span className="text-sm text-zinc-400 font-medium">Start: {new Date(activeProject.startDate).toLocaleDateString()}</span>
                            <Button variant="ghost" size="sm" className="text-xs text-zinc-600 hover:text-red-500 h-auto py-0 px-2" onClick={() => {
                                if (confirm("Are you sure you want to abandon this quest? This cannot be undone.")) {
                                    onAbandonQuest();
                                }
                            }}>
                                Abandon
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {weeklyPlan.length > 0 && !isPreviewMode && (
                            <Button variant="ghost" size="sm" onClick={() => handleGeneratePlanOptions(selectedMonthIndex)} isLoading={isGeneratingMonthDetail} className="text-xs border border-zinc-800 hover:bg-zinc-800">
                                <Layers size={14} className="mr-2" /> Strategy Options
                            </Button>
                        )}
                        {isPreviewMode && <span className="text-xs bg-accent text-zinc-900 font-black px-3 py-1.5 rounded flex items-center">PREVIEW MODE</span>}
                    </div>
                </div>

                {/* Strategy Selector Tabs (Only in Preview Mode) */}
                {isPreviewMode && previewOptions && (
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {previewOptions.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPreviewIndex(idx)}
                                className={`flex-1 min-w-[240px] p-5 rounded-xl text-left border-2 transition-all relative overflow-hidden group
                                    ${previewIndex === idx
                                        ? 'bg-primary/10 border-primary ring-1 ring-primary/50'
                                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                    }
                                `}
                            >
                                <div className="font-bold text-white mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">{idx + 1}</span>
                                    {option.strategyName}
                                </div>
                                <div className="text-xs text-zinc-400 leading-relaxed">{option.description}</div>
                                {previewIndex === idx && (
                                    <div className="absolute top-3 right-3 text-primary animate-scale-in">
                                        <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {!weeklyPlan.length ? (
                <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-16 text-center bg-zinc-900/20">
                    <Scroll size={64} className="mx-auto text-zinc-700 mb-6" />
                    <h3 className="text-2xl font-bold text-zinc-400 mb-2">Quest Log Empty</h3>
                    <p className="text-zinc-500 mb-8 max-w-md mx-auto">Generate detailed weekly quests to begin your adventure for this month.</p>
                    <Button onClick={() => handleGeneratePlanOptions(selectedMonthIndex)} isLoading={isGeneratingMonthDetail} className="h-12 px-8 text-lg bg-white text-black hover:bg-zinc-200">
                        <Sparkles size={18} className="mr-2" /> Generate Quests
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {weeklyPlan.map((week, wIndex) => (
                        <div key={week.weekNumber} className="relative group">
                            <div className="glass-panel border-zinc-800/50 rounded-2xl p-6 hover:border-zinc-700 transition-all h-full">
                                <div className="flex flex-col justify-between items-start mb-6 gap-3">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center shrink-0">
                                            <span className="text-[9px] text-zinc-500 uppercase font-bold">Week</span>
                                            <span className="text-xl font-mono font-bold text-white">0{week.weekNumber}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-primary font-bold text-xs uppercase tracking-wide mb-0.5">Focus Theme</div>
                                            <h3 className="font-bold text-base text-white truncate" title={week.theme}>{week.theme}</h3>
                                        </div>
                                    </div>
                                </div>

                                <ul className="space-y-3 pl-2">
                                    {week.tasks.map((task) => (
                                        <li
                                            key={task.id}
                                            className={`flex items-start gap-3 p-2 rounded-lg transition-all cursor-pointer group/task
                                                    ${task.isCompleted ? 'bg-emerald-500/5' : 'hover:bg-zinc-800/50'}
                                                `}
                                            onClick={() => !isPreviewMode && !isEditingMode && toggleTask(wIndex, task.id)}
                                        >
                                            <div className={`mt-0.5 transition-all ${task.isCompleted ? 'text-emerald-500 scale-110' : 'text-zinc-600 group-hover/task:text-zinc-400'}`}>
                                                {task.isCompleted ? <CheckCircle2 size={18} fill="currentColor" className="text-emerald-900" /> : <Circle size={18} />}
                                            </div>

                                            {isEditingMode && !isPreviewMode ? (
                                                <input
                                                    className="bg-transparent border-b border-zinc-700 w-full text-sm text-textMain focus:outline-none focus:border-primary py-1"
                                                    value={task.text}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateTaskText(wIndex, task.id, e.target.value)}
                                                />
                                            ) : (
                                                <span className={`text-sm font-medium leading-relaxed transition-colors ${task.isCompleted ? 'text-zinc-500 line-through decoration-zinc-700' : 'text-zinc-300'}`}>
                                                    {task.text}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Action Buttons */}
            {isPreviewMode && (
                <div className="flex justify-end gap-4 pt-6 border-t border-zinc-800 sticky bottom-6 bg-black/80 backdrop-blur-xl p-4 rounded-2xl z-20 shadow-2xl animate-slide-up mt-8">
                    <Button variant="ghost" onClick={cancelPreview} className="text-zinc-400 hover:text-white">
                        Discard
                    </Button>
                    <Button onClick={confirmPreviewPlan} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] border-none px-8">
                        <Check size={18} className="mr-2" />
                        Accept Strategy
                    </Button>
                </div>
            )}
        </section>
    );
}
