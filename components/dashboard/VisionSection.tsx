import React from 'react';
import { Target, Edit3, Save, Sparkles, Flag, Star, Rocket, Crown } from 'lucide-react';
import { Button } from '../Button';
import { ProjectScheme, ThreeYearVision } from '../../types';

interface VisionSectionProps {
    activeProject: ProjectScheme;
    isEditingMode: boolean; // Global layout edit mode (also enables editing)
    isEditingVision: boolean; // Specific vision editing mode
    visionDraft: ThreeYearVision | null;
    isExpandingVision: boolean;
    handleEditVision: () => void;
    handleCancelEditVision: () => void;
    handleSaveVision: () => void;
    handleExpandVision: () => void;
    setVisionDraft: (vision: ThreeYearVision | null) => void;
}

export function VisionSection({
    activeProject, isEditingMode, isEditingVision, visionDraft, isExpandingVision,
    handleEditVision, handleCancelEditVision, handleSaveVision, handleExpandVision, setVisionDraft
}: VisionSectionProps) {

    const VisionTextarea = ({ value, onChange, label, rows = 2 }: { value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, label: string, rows?: number }) => (
        <div>
            <label className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-2 block">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full bg-zinc-900/50 p-3 rounded-lg text-sm text-zinc-300 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
        </div>
    );

    // Determines if we are in an editable state for vision
    const isEditable = isEditingMode || isEditingVision;

    return (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Target className="text-yellow-500" /> STRATEGIC VISION
                </h2>
                {/* Specific Save/Cancel controls if specifically editing vision or just feeling granularity */}
                {isEditable && activeProject.threeYearVision && (
                    <div className="flex gap-2 animate-scale-in">
                        {isEditingVision && <Button variant="ghost" size="sm" onClick={handleCancelEditVision} className="text-xs h-9 text-zinc-400 hover:text-white">Cancel</Button>}
                        <Button size="sm" onClick={handleSaveVision} className="text-xs h-9 bg-primary hover:bg-primaryHover text-white border-none shadow-lg shadow-primary/20">
                            <Save size={14} className="mr-2" /> Save Vision
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Year 1 Card */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-t-4 border-t-yellow-500 flex flex-col group">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Flag size={120} /></div>

                    {/* Hover Edit Button */}
                    {!isEditable && (
                        <button
                            onClick={handleEditVision}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white z-20"
                            title="Edit Vision"
                        >
                            <Edit3 size={14} />
                        </button>
                    )}

                    <div className="relative z-10 flex-1">
                        <div className="inline-block px-3 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4 border border-yellow-500/20">Year 1: Foundation</div>

                        {isEditable && visionDraft ? (
                            <VisionTextarea
                                label="Year 1 Objective"
                                value={visionDraft.year1 || activeProject.yearlyPlan.vision}
                                onChange={(e) => setVisionDraft({ ...visionDraft, year1: e.target.value })}
                                rows={4}
                            />
                        ) : (
                            <>
                                <p className="text-lg font-serif italic text-white/90 mb-6 leading-relaxed">"{activeProject.yearlyPlan.vision}"</p>
                                <ul className="space-y-3">
                                    {activeProject.yearlyPlan.keyResults.map((kr, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-xs text-zinc-300">
                                            <Star size={14} className="text-yellow-500 mt-0.5 shrink-0" fill="currentColor" />
                                            {kr}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                {/* Year 2 Card */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-t-4 border-t-blue-500 flex flex-col group">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Rocket size={120} /></div>

                    {/* Hover Edit Button */}
                    {activeProject.threeYearVision && !isEditable && (
                        <button
                            onClick={handleEditVision}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white z-20"
                            title="Edit Vision"
                        >
                            <Edit3 size={14} />
                        </button>
                    )}

                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/20">Year 2: Growth</div>

                        {activeProject.threeYearVision ? (
                            isEditable && visionDraft ? (
                                <VisionTextarea
                                    label="Year 2 Goal"
                                    value={visionDraft.year2}
                                    onChange={(e) => setVisionDraft({ ...visionDraft, year2: e.target.value })}
                                    rows={8}
                                />
                            ) : (
                                <p className="text-sm text-zinc-300 leading-relaxed">{activeProject.threeYearVision.year2}</p>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                <p className="text-xs text-zinc-500 mb-4">Complete previous levels to unlock</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Year 3 Card */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-t-4 border-t-purple-500 flex flex-col group">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Crown size={120} /></div>

                    {/* Hover Edit Button */}
                    {activeProject.threeYearVision && !isEditable && (
                        <button
                            onClick={handleEditVision}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700 hover:text-white z-20"
                            title="Edit Vision"
                        >
                            <Edit3 size={14} />
                        </button>
                    )}

                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="inline-block px-3 py-1 rounded bg-purple-500/10 text-purple-500 text-xs font-bold uppercase tracking-widest mb-4 border border-purple-500/20">Year 3: Dominance</div>

                        {activeProject.threeYearVision ? (
                            isEditable && visionDraft ? (
                                <>
                                    <VisionTextarea
                                        label="Year 3 Goal"
                                        value={visionDraft.year3}
                                        onChange={(e) => setVisionDraft({ ...visionDraft, year3: e.target.value })}
                                        rows={5}
                                    />
                                    <div className="mt-4">
                                        <VisionTextarea
                                            label="Ultimate Goal"
                                            value={visionDraft.ultimateGoal}
                                            onChange={(e) => setVisionDraft({ ...visionDraft, ultimateGoal: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-zinc-300 leading-relaxed mb-4">{activeProject.threeYearVision.year3}</p>
                                    <div className="mt-auto pt-4 border-t border-white/5">
                                        <span className="text-purple-400 font-bold text-xs uppercase tracking-wider block mb-1">Ultimate Goal</span>
                                        <p className="text-xs italic text-white/70">{activeProject.threeYearVision.ultimateGoal}</p>
                                    </div>
                                </>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                {!isExpandingVision ? (
                                    <Button variant="ghost" size="sm" onClick={handleExpandVision} className="border border-zinc-700 hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500 transition-all group">
                                        <Sparkles size={16} className="mr-2 group-hover:animate-spin" /> Unlock Future
                                    </Button>
                                ) : (
                                    <div className="text-xs text-purple-400 animate-pulse">Designing Future...</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
