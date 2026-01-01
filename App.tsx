import React, { useState, useEffect } from 'react';
import { AppView, ProjectIdea, IdeaAnalysis, ProjectScheme, Difficulty, WeeklyPlanOption, ThreeYearVision } from './types';
import { Zap, Briefcase } from 'lucide-react';
import { analyzeIdeas, generateFullPlan, refineIdea, suggestIdeas, adjustWeeklyPlan, expandToThreeYears, generateMonthPlanOptions, extendRoadmap, compressRoadmap, refineThreeYearVision } from './services/geminiService';

// View Components
import { LandingView } from './components/views/LandingView';
import { BrainDumpView } from './components/views/BrainDumpView';
import { AnalysisView } from './components/views/AnalysisView';
import { ProjectListView } from './components/views/ProjectListView';
import { DashboardView } from './components/views/DashboardView';
import { CampaignDetailView } from './components/views/CampaignDetailView';

const INITIAL_IDEAS: ProjectIdea[] = [
    { id: '1', title: '', description: '' },
];

export default function App() {
    const [view, setView] = useState<AppView>(AppView.LANDING);

    // -- Persistence Logic --
    // Lazy initialization for state to read from localStorage just once on mount
    const [ideas, setIdeas] = useState<ProjectIdea[]>(() => {
        const saved = localStorage.getItem('schemeland_ideas');
        return saved ? JSON.parse(saved) : INITIAL_IDEAS;
    });

    const [analyses, setAnalyses] = useState<IdeaAnalysis[]>(() => {
        const saved = localStorage.getItem('schemeland_analyses');
        return saved ? JSON.parse(saved) : [];
    });

    // Data State
    const [projects, setProjects] = useState<ProjectScheme[]>(() => {
        const saved = localStorage.getItem('schemeland_projects');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('schemeland_ideas', JSON.stringify(ideas));
    }, [ideas]);

    useEffect(() => {
        localStorage.setItem('schemeland_analyses', JSON.stringify(analyses));
    }, [analyses]);

    useEffect(() => {
        localStorage.setItem('schemeland_projects', JSON.stringify(projects));
    }, [projects]);
    // -- End Persistence Logic --

    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

    // Computed: Active Project
    const activeProject = projects.find(p => p.id === activeProjectId) || null;

    // Loading States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [isRefiningMap, setIsRefiningMap] = useState<Record<string, boolean>>({});
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [isGeneratingMonthDetail, setIsGeneratingMonthDetail] = useState(false);
    const [isExtending, setIsExtending] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    // Dashboard Interactive States
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [isAdjustingPlan, setIsAdjustingPlan] = useState(false);
    const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
    const [compressModalOpen, setCompressModalOpen] = useState(false);
    const [isExpandingVision, setIsExpandingVision] = useState(false);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
    const [isEditingVision, setIsEditingVision] = useState(false);
    const [isRefiningVision, setIsRefiningVision] = useState(false);
    const [visionDraft, setVisionDraft] = useState<ThreeYearVision | null>(null);


    // Preview Mode State
    const [previewOptions, setPreviewOptions] = useState<WeeklyPlanOption[] | null>(null);
    const [previewIndex, setPreviewIndex] = useState<number>(0);

    // Focus Timer States
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min
    const [timerMode, setTimerMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

    // Timer Effect
    useEffect(() => {
        let interval: number;
        if (timerActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
            if (timerMode === 'FOCUS') {
                alert("Focus Session Complete! Take a break.");
                setTimerMode('BREAK');
                setTimeLeft(5 * 60);
            } else {
                alert("Break over! Ready to focus?");
                setTimerMode('FOCUS');
                setTimeLeft(25 * 60);
            }
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft, timerMode]);

    // --- Handlers ---

    const handleAddIdea = () => {
        setIdeas([...ideas, { id: crypto.randomUUID(), title: '', description: '' }]);
    };

    const handleUpdateIdea = (id: string, field: keyof ProjectIdea, value: string) => {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const handleDeleteIdea = (id: string) => {
        if (ideas.length <= 1) return;
        setIdeas(prev => prev.filter(i => i.id !== id));
    };

    const handleMagicRefine = async (id: string) => {
        const idea = ideas.find(i => i.id === id);
        if (!idea) return;

        const textToRefine = idea.title + (idea.description ? ` - ${idea.description}` : "");
        if (textToRefine.trim().length < 2) {
            alert("키워드나 대략적인 설명을 먼저 입력해주세요!");
            return;
        }

        setIsRefiningMap(prev => ({ ...prev, [id]: true }));
        try {
            const refined = await refineIdea(textToRefine);
            setIdeas(prev => prev.map(i => i.id === id ? { ...i, title: refined.title, description: refined.description, emoji: refined.emoji } : i));
        } catch (e) {
            alert("아이디어 구체화에 실패했습니다.");
        } finally {
            setIsRefiningMap(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleSuggestIdeas = async () => {
        setIsSuggesting(true);
        try {
            const suggestions = await suggestIdeas();
            const newIdeas = suggestions.map(s => ({
                id: crypto.randomUUID(),
                title: s.title,
                description: s.description,
                emoji: s.emoji
            }));
            const cleanIdeas = ideas.filter(i => i.title.trim() !== '' || i.description.trim() !== '');
            setIdeas([...cleanIdeas, ...newIdeas]);
        } catch (e) {
            alert("아이디어 제안을 가져오는데 실패했습니다.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleAnalyze = async () => {
        const validIdeas = ideas.filter(i => i.title.trim() && i.description.trim());
        if (validIdeas.length === 0) return alert("최소한 하나의 구체적인 아이디어를 입력해주세요.");

        setIsAnalyzing(true);
        try {
            const results = await analyzeIdeas(validIdeas);
            setAnalyses(results);
            setView(AppView.ANALYSIS);
        } catch (e) {
            alert("AI 분석 중 오류가 발생했습니다.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCommit = async (ideaId: string) => {
        const idea = ideas.find(i => i.id === ideaId);
        const analysis = analyses.find(a => a.ideaId === ideaId);
        if (!idea || !analysis) return;

        setIsGeneratingPlan(true);
        try {
            const plan = await generateFullPlan(idea, analysis.reasoning);

            // Inject Week 1 detailed plan into Month 1
            const monthlyPlan = plan.monthlyPlan;
            if (monthlyPlan.length > 0) {
                monthlyPlan[0].detailedPlan = plan.weeklyPlan;
            }

            const newProject: ProjectScheme = {
                id: crypto.randomUUID(),
                selectedIdea: idea,
                analysis: analysis,
                yearlyPlan: plan.yearlyPlan,
                monthlyPlan: monthlyPlan,
                startDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
            };

            setProjects(prev => [...prev, newProject]);
            setActiveProjectId(newProject.id);
            setSelectedMonthIndex(0); // Default to Month 1
            setView(AppView.DASHBOARD);
        } catch (e) {
            alert("로드맵 생성에 실패했습니다.");
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const handleSelectProject = (projectId: string) => {
        setActiveProjectId(projectId);
        setSelectedMonthIndex(0);
        setPreviewOptions(null); // Reset preview
        setView(AppView.DASHBOARD);
    };

    const toggleTask = (weekIndex: number, taskId: string) => {
        if (!activeProject) return;

        const updatedProjects = projects.map(p => {
            if (p.id === activeProject.id) {
                const newMonthly = [...p.monthlyPlan];
                const activeMonth = newMonthly[selectedMonthIndex];
                if (activeMonth && activeMonth.detailedPlan) {
                    const newWeekly = [...activeMonth.detailedPlan];
                    const task = newWeekly[weekIndex].tasks.find(t => t.id === taskId);
                    if (task) {
                        task.isCompleted = !task.isCompleted;
                    }
                    activeMonth.detailedPlan = newWeekly;
                }
                return { ...p, monthlyPlan: newMonthly };
            }
            return p;
        });
        setProjects(updatedProjects);
    };

    const updateTaskText = (weekIndex: number, taskId: string, text: string) => {
        if (!activeProject) return;
        const updatedProjects = projects.map(p => {
            if (p.id === activeProject.id) {
                const newMonthly = [...p.monthlyPlan];
                const newWeekly = [...(newMonthly[selectedMonthIndex].detailedPlan || [])];
                const taskToEdit = newWeekly[weekIndex].tasks.find(t => t.id === taskId);
                if (taskToEdit) taskToEdit.text = text;
                return { ...p, monthlyPlan: newMonthly };
            }
            return p;
        });
        setProjects(updatedProjects);
    }

    // --- Smart Adjustment Handlers ---

    const handleUpdateMonthGoal = (newText: string) => {
        if (!activeProject) return;
        const updatedProjects = projects.map(p => {
            if (p.id === activeProject.id) {
                const newMonthly = [...p.monthlyPlan];
                newMonthly[selectedMonthIndex].theme = newText;
                return { ...p, monthlyPlan: newMonthly };
            }
            return p;
        });
        setProjects(updatedProjects);
    };

    const triggerSmartAdjustment = () => {
        setAdjustmentModalOpen(true);
    };

    const confirmAdjustment = async (difficulty: Difficulty) => {
        if (!activeProject) return;
        setAdjustmentModalOpen(false);
        setIsAdjustingPlan(true);

        try {
            const currentMonthTheme = activeProject.monthlyPlan[selectedMonthIndex].theme;
            const newWeeklyPlan = await adjustWeeklyPlan(activeProject.selectedIdea, currentMonthTheme, difficulty);

            const updatedProjects = projects.map(p => {
                if (p.id === activeProject.id) {
                    const newMonthly = [...p.monthlyPlan];
                    newMonthly[selectedMonthIndex].detailedPlan = newWeeklyPlan;
                    return { ...p, monthlyPlan: newMonthly };
                }
                return p;
            });
            setProjects(updatedProjects);
            setIsEditingMode(false);
        } catch (e) {
            alert("AI 조정에 실패했습니다.");
        } finally {
            setIsAdjustingPlan(false);
        }
    };

    const handleExpandVision = async () => {
        if (!activeProject) return;
        setIsExpandingVision(true);
        try {
            const threeYear = await expandToThreeYears(activeProject.selectedIdea, activeProject.yearlyPlan.vision);
            const updatedProjects = projects.map(p => {
                if (p.id === activeProject.id) {
                    return { ...p, threeYearVision: threeYear };
                }
                return p;
            });
            setProjects(updatedProjects);
        } catch (e) {
            alert("비전 확장에 실패했습니다.");
        } finally {
            setIsExpandingVision(false);
        }
    };

    const handleMonthClick = async (index: number) => {
        if (!activeProject) return;

        // If switching months, reset preview
        if (selectedMonthIndex !== index) {
            setPreviewOptions(null);
        }

        setSelectedMonthIndex(index);
    };

    const handleGeneratePlanOptions = async (monthIndex: number) => {
        if (!activeProject) return;
        const targetMonth = activeProject.monthlyPlan[monthIndex];

        setIsGeneratingMonthDetail(true);
        setPreviewOptions(null);
        try {
            const options = await generateMonthPlanOptions(activeProject.selectedIdea, targetMonth);
            setPreviewOptions(options);
            setPreviewIndex(0); // Default to first option
        } catch (e) {
            alert("상세 계획 옵션을 생성하는데 실패했습니다.");
        } finally {
            setIsGeneratingMonthDetail(false);
        }
    };

    const confirmPreviewPlan = () => {
        if (!activeProject || !previewOptions) return;

        const selectedPlan = previewOptions[previewIndex].plan;

        const updatedProjects = projects.map(p => {
            if (p.id === activeProject.id) {
                const newMonthly = [...p.monthlyPlan];
                newMonthly[selectedMonthIndex].detailedPlan = selectedPlan;
                return { ...p, monthlyPlan: newMonthly };
            }
            return p;
        });
        setProjects(updatedProjects);
        setPreviewOptions(null); // Exit preview mode
    };

    const cancelPreview = () => {
        setPreviewOptions(null);
    }

    const handleExtendRoadmap = async () => {
        if (!activeProject) return;
        setIsExtending(true);
        try {
            const lastMonth = activeProject.monthlyPlan[activeProject.monthlyPlan.length - 1].month;
            const newMonths = await extendRoadmap(activeProject.selectedIdea, lastMonth);

            const updatedProjects = projects.map(p => {
                if (p.id === activeProject.id) {
                    return { ...p, monthlyPlan: [...p.monthlyPlan, ...newMonths] };
                }
                return p;
            });
            setProjects(updatedProjects);
        } catch (e) {
            alert("로드맵 확장에 실패했습니다.");
        } finally {
            setIsExtending(false);
        }
    };

    const handleCompressRoadmap = async (targetMonths: number) => {
        if (!activeProject) return;
        setCompressModalOpen(false);
        setIsCompressing(true);
        try {
            const newMonthlyPlan = await compressRoadmap(activeProject.selectedIdea, activeProject.monthlyPlan, targetMonths);

            const updatedProjects = projects.map(p => {
                if (p.id === activeProject.id) {
                    return { ...p, monthlyPlan: newMonthlyPlan };
                }
                return p;
            });
            setProjects(updatedProjects);
            setSelectedMonthIndex(0);
        } catch (e) {
            alert("타임라인 압축에 실패했습니다.");
        } finally {
            setIsCompressing(false);
        }
    }

    const handleEditVision = () => {
        if (!activeProject || !activeProject.threeYearVision) return;
        setVisionDraft(JSON.parse(JSON.stringify(activeProject.threeYearVision))); // Deep copy
        setIsEditingVision(true);
    };

    const handleCancelEditVision = () => {
        setIsEditingVision(false);
        setVisionDraft(null);
    };

    const handleSaveVision = () => {
        if (!activeProject || !visionDraft) return;
        const updatedProjects = projects.map(p => {
            if (p.id === activeProject.id) {
                return { ...p, threeYearVision: visionDraft };
            }
            return p;
        });
        setProjects(updatedProjects);
        setIsEditingVision(false);
        setVisionDraft(null);
    };

    const handleRefineVision = async () => {
        if (!activeProject || !visionDraft) return;
        setIsRefiningVision(true);
        try {
            const refinedVision = await refineThreeYearVision(activeProject.selectedIdea, visionDraft);
            setVisionDraft(refinedVision);
        } catch (e) {
            alert("비전 구체화에 실패했습니다.");
        } finally {
            setIsRefiningVision(false);
        }
    };

    const handleAbandonQuest = () => {
        if (!activeProject) return;
        setProjects(prev => prev.filter(p => p.id !== activeProject.id));
        setView(AppView.PROJECT_LIST);
        setTimerActive(false);
    };

    return (
        <div className="min-h-screen text-textMain font-sans selection:bg-primary/30">
            {/* Header */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-40 transition-all">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => {
                            if (projects.length > 0) setView(AppView.PROJECT_LIST);
                            else setView(AppView.LANDING);
                        }}
                    >
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.6)] group-hover:scale-110 transition-transform">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-white">SchemeLand</span>
                    </div>
                    {view === AppView.DASHBOARD && (
                        <div className="text-[10px] font-black tracking-widest text-emerald-500 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            SYSTEM ONLINE
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="pb-20">
                {view === AppView.LANDING && (
                    <LandingView
                        onStart={() => setView(AppView.BRAIN_DUMP)}
                        onLoadSave={() => setView(AppView.PROJECT_LIST)}
                        hasProjects={projects.length > 0}
                    />
                )}

                {view === AppView.PROJECT_LIST && (
                    <ProjectListView
                        projects={projects}
                        onSelectProject={handleSelectProject}
                        onNewAdventure={() => {
                            setIdeas(INITIAL_IDEAS);
                            setAnalyses([]);
                            setView(AppView.BRAIN_DUMP);
                        }}
                    />
                )}

                {view === AppView.BRAIN_DUMP && (
                    <BrainDumpView
                        ideas={ideas}
                        onBack={() => setView(AppView.LANDING)}
                        onSuggestion={handleSuggestIdeas}
                        isSuggesting={isSuggesting}
                        onAddIdea={handleAddIdea}
                        onUpdateIdea={handleUpdateIdea}
                        onDeleteIdea={handleDeleteIdea}
                        onMagic={handleMagicRefine}
                        isRefiningMap={isRefiningMap}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={isAnalyzing}
                    />
                )}

                {view === AppView.ANALYSIS && (
                    <AnalysisView
                        analyses={analyses}
                        ideas={ideas}
                        onBack={() => setView(AppView.BRAIN_DUMP)}
                        onCommit={handleCommit}
                        isGeneratingPlan={isGeneratingPlan}
                    />
                )}

                {view === AppView.DASHBOARD && (
                    <DashboardView
                        activeProject={activeProject}
                        selectedMonthIndex={selectedMonthIndex}
                        previewOptions={previewOptions}
                        previewIndex={previewIndex}
                        timerActive={timerActive}
                        timeLeft={timeLeft}
                        timerMode={timerMode}
                        isEditingMode={isEditingMode}
                        compressModalOpen={compressModalOpen}
                        adjustmentModalOpen={adjustmentModalOpen}
                        isCompressing={isCompressing}
                        isAdjustingPlan={isAdjustingPlan}
                        isGeneratingMonthDetail={isGeneratingMonthDetail}
                        isExpandingVision={isExpandingVision}
                        isExtending={isExtending}
                        isEditingVision={isEditingVision}
                        visionDraft={visionDraft}
                        isRefiningVision={isRefiningVision}

                        setTimerActive={setTimerActive}
                        setTimerMode={setTimerMode}
                        setTimeLeft={setTimeLeft}
                        setCompressModalOpen={setCompressModalOpen}
                        setAdjustmentModalOpen={setAdjustmentModalOpen}
                        setIsEditingMode={setIsEditingMode}
                        setPreviewIndex={setPreviewIndex}
                        setVisionDraft={setVisionDraft}

                        onCompressRoadmap={handleCompressRoadmap}
                        onConfirmAdjustment={confirmAdjustment}
                        handleExpandVision={handleExpandVision}
                        handleEditVision={handleEditVision}
                        handleCancelEditVision={handleCancelEditVision}
                        handleSaveVision={handleSaveVision}
                        handleRefineVision={handleRefineVision}
                        handleMonthClick={handleMonthClick}
                        handleUpdateMonthGoal={handleUpdateMonthGoal}
                        triggerSmartAdjustment={triggerSmartAdjustment}
                        handleExtendRoadmap={handleExtendRoadmap}
                        handleGeneratePlanOptions={handleGeneratePlanOptions}
                        cancelPreview={cancelPreview}
                        confirmPreviewPlan={confirmPreviewPlan}
                        toggleTask={toggleTask}
                        updateTaskText={updateTaskText}
                        onAbandonQuest={handleAbandonQuest}
                        onOpenCampaignDetail={() => setView(AppView.CAMPAIGN_DETAIL)}
                    />
                )}

                {view === AppView.CAMPAIGN_DETAIL && activeProject && (
                    <CampaignDetailView
                        activeProject={activeProject}
                        selectedMonthIndex={selectedMonthIndex}
                        onBack={() => setView(AppView.DASHBOARD)}
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-auto py-12 text-center">
                <div className="flex justify-center items-center gap-2 text-zinc-600 text-sm font-medium">
                    <Briefcase size={16} />
                    <span>Built for Indie Hackers</span>
                    <span className="mx-2">•</span>
                    <span>Powered by Gemini</span>
                </div>
            </footer>
        </div>
    );
}