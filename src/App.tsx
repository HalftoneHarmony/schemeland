/**
 * @file App.tsx
 * 애플리케이션 메인 진입점
 * 
 * 주요 변경사항 (v2.1):
 * - DashboardView Props 연결 수정 (onMonthClick -> handleMonthClick)
 * - CampaignDetailView, KanbanView 복구 및 연결
 * - KanbanView 상태 관리 로직 개선 (App 레벨 핸들러 연결)
 */

import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

// Types & Constants
import { AppView, Priority, TaskStatus, KanbanTask } from './types';
import { APP_NAME } from './constants';

// Hooks & Store
import { useStore } from './store';
import { useInitializeStore } from './hooks/useInitializeStore';
import { useIdeaHandlers, useProjectHandlers, useTimer } from './features';

// View Components
import { LandingView } from './components/views/LandingView';
import { BrainDumpView } from './components/views/BrainDumpView';
import { AnalysisView } from './components/views/AnalysisView';
import { ProjectListView } from './components/views/ProjectListView';
import { DashboardView } from './components/views/DashboardView';
import { CampaignDetailView } from './components/views/CampaignDetailView';
import { KanbanView } from './components/views/KanbanView';

// Navigation Components
import { SideNavigation } from './components/navigation/SideNavigation';
import { QuickSearch } from './components/navigation/QuickSearch';

export default function App() {
    // 1. Store Initialization (Data Migration)
    const { isInitialized, isMigrating } = useInitializeStore();

    // 2. Zustand Store (Global State)
    const store = useStore();
    const { currentView, activeProjectId, selectedMonthIndex } = store;

    // 3. Feature Hooks (Business Logic)
    const ideaFeature = useIdeaHandlers();
    const projectFeature = useProjectHandlers();
    const timerFeature = useTimer();

    // 4. Task Handlers (Bridge to Store)
    const handleToggleTask = (weekIndex: number, taskId: string) => {
        store.toggleTaskStatus(taskId);
    };

    const handleUpdateTaskText = (weekIndex: number, taskId: string, text: string) => {
        store.updateTask(taskId, { text });
    };

    const handleAddTask = (weekIndex: number) => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;

        const month = store.months[activeMonth.id];
        if (!month || !month.weekIds[weekIndex]) return;

        const weekId = month.weekIds[weekIndex];
        store.addTask(weekId);
    };

    const handleDeleteTask = (taskId: string) => {
        store.deleteTask(taskId);
    };
    // App.tsx 내부 래퍼 (weekIndex 무시, taskId만 사용)
    const handleDeleteTaskWrapper = (weekIndex: number, taskId: string) => handleDeleteTask(taskId);

    const handleUpdateWeekTheme = (weekIndex: number, theme: string) => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        const month = store.months[activeMonth.id];
        if (!month || !month.weekIds[weekIndex]) return;

        store.updateWeekTheme(month.weekIds[weekIndex], theme);
    };

    const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
        store.updateTaskStatus(taskId, status);
    };
    // CampaignDetailView용 래퍼
    const handleUpdateTaskStatusWrapper = (weekIndex: number, taskId: string, status: TaskStatus) => handleUpdateTaskStatus(taskId, status);


    const handleInitManualPlan = () => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        store.initializeMonthWeeks(activeMonth.id);
    };

    // Kanban Specific Handlers
    const handleKanbanAddTask = (monthIndex: number, weekNumber: number, status: TaskStatus, text: string, priority: Priority) => {
        if (!activeProjectId) return;
        const project = store.projects[activeProjectId];
        if (!project) return;

        const monthId = project.monthIds[monthIndex];
        const month = store.months[monthId];
        if (!month) return;

        // weekNumber is 1-based, array is 0-based
        const weekId = month.weekIds[weekNumber - 1];
        if (!weekId) return;

        // 1. Add Placehoder Task
        store.addTask(weekId);

        // 2. Find the newly added task (Assuming last one)
        // We need to re-fetch the week from store to get updated taskIds
        const updatedWeek = useStore.getState().weeks[weekId];
        if (!updatedWeek || updatedWeek.taskIds.length === 0) return;

        const newTaskId = updatedWeek.taskIds[updatedWeek.taskIds.length - 1]; // Last added

        // 3. Update Content
        store.updateTask(newTaskId, {
            text,
            status,
            priority,
            isCompleted: status === TaskStatus.DONE
        });
    };

    const handleKanbanUpdateTask = (taskId: string, updates: Partial<KanbanTask>) => {
        store.updateTask(taskId, updates);
    };

    const handleMoveTask = (taskId: string, sourceWeekIndex: number, targetWeekIndex: number) => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        const month = store.months[activeMonth.id];
        if (!month) return;

        const sourceWeekId = month.weekIds[sourceWeekIndex];
        const targetWeekId = month.weekIds[targetWeekIndex];

        if (sourceWeekId && targetWeekId) {
            store.moveTask(taskId, sourceWeekId, targetWeekId);
        }
    };


    // 5. Global Keyboard Shortcuts
    const [isQuickSearchOpen, setIsQuickSearchOpen] = React.useState(false);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsQuickSearchOpen(prev => !prev);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 6. Navigation Handlers
    const handleNavigate = (view: AppView) => store.setCurrentView(view);

    const showSidebar = currentView !== AppView.LANDING &&
        currentView !== AppView.BRAIN_DUMP &&
        currentView !== AppView.ANALYSIS;

    // Loading View
    if (!isInitialized || isMigrating) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-cyber-pink flex items-center justify-center text-white shadow-neon-pink mx-auto mb-6 animate-pulse skew-x-[-10deg]">
                        <Zap size={32} fill="currentColor" className="skew-x-[10deg]" />
                    </div>
                    <h2 className="font-cyber font-black text-2xl text-white uppercase mb-2">
                        {isMigrating ? 'DATA::MIGRATION' : 'SYSTEM::BOOT'}
                    </h2>
                    <p className="text-white/40 font-mono text-sm">
                        {isMigrating ? '데이터 구조 업그레이드 중...' : '시스템 초기화 중...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-textMain font-sans selection:bg-cyber-pink/30">
            {/* Quick Search Modal */}
            <QuickSearch
                isOpen={isQuickSearchOpen}
                onClose={() => setIsQuickSearchOpen(false)}
                projects={projectFeature.projects}
                onNavigate={handleNavigate}
                onSelectProject={projectFeature.handleSelectProject}
            />

            {/* Side Navigation */}
            {showSidebar && (
                <SideNavigation
                    currentView={currentView}
                    projects={projectFeature.projects}
                    activeProjectId={activeProjectId}
                    onNavigate={handleNavigate}
                    onSelectProject={projectFeature.handleSelectProject}
                />
            )}

            {/* Main Content Wrapper */}
            <div className={showSidebar ? 'ml-[260px] transition-all duration-300' : ''}>
                {/* Header (Non-sidebar views) */}
                {!showSidebar && (
                    <nav className="border-b border-cyber-pink/20 bg-background/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
                        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                            <div
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => {
                                    if (projectFeature.projects.length > 0) handleNavigate(AppView.PROJECT_LIST);
                                    else handleNavigate(AppView.LANDING);
                                }}
                            >
                                <div className="w-10 h-10 bg-cyber-pink flex items-center justify-center text-white shadow-neon-pink group-hover:scale-110 transition-transform skew-x-[-10deg]">
                                    <Zap size={20} fill="currentColor" className="skew-x-[10deg]" />
                                </div>
                                <span className="font-cyber font-black text-2xl tracking-tighter text-white uppercase italic">{APP_NAME}</span>
                            </div>
                        </div>
                    </nav>
                )}

                {/* Main Content */}
                <main className="pb-20">
                    {currentView === AppView.LANDING && (
                        <LandingView
                            onStart={() => handleNavigate(AppView.BRAIN_DUMP)}
                            onLoadSave={() => handleNavigate(AppView.PROJECT_LIST)}
                            hasProjects={projectFeature.projects.length > 0}
                        />
                    )}

                    {currentView === AppView.PROJECT_LIST && (
                        <ProjectListView
                            projects={projectFeature.projects}
                            onSelectProject={projectFeature.handleSelectProject}
                            onNewAdventure={() => {
                                handleNavigate(AppView.BRAIN_DUMP);
                            }}
                        />
                    )}

                    {currentView === AppView.BRAIN_DUMP && (
                        <BrainDumpView
                            ideas={ideaFeature.ideas}
                            onBack={() => handleNavigate(AppView.LANDING)}

                            // Idea Feature Handlers
                            onAddIdea={ideaFeature.handleAddIdea}
                            onUpdateIdea={ideaFeature.handleUpdateIdea}
                            onDeleteIdea={ideaFeature.handleDeleteIdea}
                            onMagic={ideaFeature.handleMagicRefine}
                            onSuggestion={ideaFeature.handleSuggestIdeas}

                            // States
                            isSuggesting={ideaFeature.isSuggesting}
                            isRefiningMap={ideaFeature.isRefiningMap}

                            // Project Feature Handlers (Bridge)
                            onAnalyze={projectFeature.handleAnalyze}
                            onQuickStart={projectFeature.handleQuickStart}
                            isAnalyzing={projectFeature.isAnalyzing}
                        />
                    )}

                    {currentView === AppView.ANALYSIS && (
                        <AnalysisView
                            analyses={Object.values(store.analyses)}
                            ideas={ideaFeature.ideas}
                            onBack={() => handleNavigate(AppView.BRAIN_DUMP)}

                            // Project Feature Handlers
                            onCommit={projectFeature.handleCommit}
                            startDate={projectFeature.projectStartDate}
                            onStartDateChange={projectFeature.setProjectStartDate}
                            isGeneratingPlan={projectFeature.isGeneratingPlan}
                        />
                    )}

                    {currentView === AppView.DASHBOARD && (
                        <DashboardView
                            // Data
                            activeProject={projectFeature.activeProject}
                            selectedMonthIndex={selectedMonthIndex}

                            // Timer Feature
                            timerActive={timerFeature.timerActive}
                            timeLeft={timerFeature.timeLeft}
                            timerMode={timerFeature.timerMode}
                            pomodoroCount={timerFeature.pomodoroCount}
                            setTimerActive={timerFeature.setTimerActive}
                            setTimerMode={timerFeature.setTimerMode}
                            setTimeLeft={timerFeature.setTimeLeft}

                            // Project/Dashboard UI States
                            previewOptions={projectFeature.previewOptions}
                            previewIndex={projectFeature.previewIndex}
                            visionDraft={projectFeature.visionDraft}

                            compressModalOpen={projectFeature.compressModalOpen}
                            adjustmentModalOpen={projectFeature.adjustmentModalOpen}

                            isCompressing={projectFeature.isCompressing}
                            isAdjustingPlan={projectFeature.isAdjustingPlan}
                            isGeneratingMonthDetail={projectFeature.isGeneratingMonthDetail}
                            isExpandingVision={projectFeature.isExpandingVision}
                            isExtending={projectFeature.isExtending}
                            isEditingVision={projectFeature.isEditingVision}
                            isRefiningVision={projectFeature.isRefiningVision}

                            // Setters (Bridge)
                            setCompressModalOpen={projectFeature.setCompressModalOpen}
                            setAdjustmentModalOpen={projectFeature.setAdjustmentModalOpen}
                            setVisionDraft={projectFeature.setVisionDraft}
                            setPreviewIndex={projectFeature.setPreviewIndex}

                            // Handlers - Project Feature
                            handleMonthClick={projectFeature.handleMonthClick} // Fixed Prop Name
                            triggerSmartAdjustment={projectFeature.triggerSmartAdjustment}
                            onConfirmAdjustment={projectFeature.confirmAdjustment}
                            handleExpandVision={projectFeature.handleExpandVision}
                            // handleGeneratePlanOptions={projectFeature.handleGeneratePlanOptions} // DashboardView doesn't use this directly
                            // confirmPreviewPlan={projectFeature.confirmPreviewPlan}
                            // cancelPreview={projectFeature.cancelPreview}
                            handleExtendRoadmap={projectFeature.handleExtendRoadmap}
                            onCompressRoadmap={projectFeature.handleCompressRoadmap}
                            handleEditVision={projectFeature.handleEditVision}
                            handleCancelEditVision={projectFeature.handleCancelEditVision}
                            handleSaveVision={projectFeature.handleSaveVision}
                            handleRefineVision={projectFeature.handleRefineVision}
                            onAbandonQuest={projectFeature.handleAbandonQuest}
                            handleUpdateMonthGoal={projectFeature.handleUpdateMonthGoal}

                            onOpenCampaignDetail={() => handleNavigate(AppView.CAMPAIGN_DETAIL)}
                        />
                    )}

                    {currentView === AppView.CAMPAIGN_DETAIL && projectFeature.activeProject && (
                        <CampaignDetailView
                            activeProject={projectFeature.activeProject}
                            selectedMonthIndex={selectedMonthIndex}
                            onBack={() => handleNavigate(AppView.DASHBOARD)}

                            toggleTask={handleToggleTask}
                            addTask={handleAddTask}
                            deleteTask={handleDeleteTaskWrapper}
                            updateTaskText={handleUpdateTaskText}
                            updateWeekTheme={handleUpdateWeekTheme}
                            updateTaskStatus={handleUpdateTaskStatusWrapper}
                            moveTask={handleMoveTask}
                        />
                    )}

                    {currentView === AppView.KANBAN && projectFeature.activeProject && (
                        <KanbanView
                            projects={projectFeature.projects}
                            activeProjectId={activeProjectId}
                            onSelectProject={projectFeature.handleSelectProject}
                            onBack={() => handleNavigate(AppView.DASHBOARD)}

                            // New Handlers
                            onTaskStatusChange={handleUpdateTaskStatus}
                            onAddTask={handleKanbanAddTask}
                            onDeleteTask={handleDeleteTask}
                            onUpdateTask={handleKanbanUpdateTask}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}