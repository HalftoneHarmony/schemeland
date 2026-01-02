/**
 * @file App.tsx
 * 애플리케이션 메인 진입점
 * 
 * 주요 변경사항 (v2.2):
 * - Task 핸들러를 useTaskHandlers 훅으로 분리
 * - 코드 가독성 및 유지보수성 향상
 */

import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

// Types & Constants
import { AppView } from './types';
import { APP_NAME } from './constants';

// Hooks & Store
import { useStore } from './store';
import { useInitializeStore } from './hooks/useInitializeStore';
import { useHistorySync } from './hooks/useHistorySync';
import { useConflictDetection } from './hooks/useConflictDetection';
import { useSessionLock } from './hooks/useSessionLock';
import { useTaskHandlers } from './hooks/useTaskHandlers';
import { useIdeaHandlers, useProjectHandlers, useTimer } from './features';

// View Components
import { LandingView } from './components/views/LandingView';
import { BrainDumpView } from './components/views/BrainDumpView';
import { AnalysisView } from './components/views/AnalysisView';
import { ProjectListView } from './components/views/ProjectListView';
import { DashboardView } from './components/views/DashboardView';
import { CampaignDetailView } from './components/views/CampaignDetailView';
import { KanbanView } from './components/views/KanbanView';
import { CoachView } from './components/views/CoachView';

// Navigation Components
import { SideNavigation } from './components/navigation/SideNavigation';
import { QuickSearch } from './components/navigation/QuickSearch';


// UI Components
import { ConflictWarning, MergeNotice, ReadOnlyBanner } from './components/ui/ConflictWarning';

export default function App() {
    // 1. Store Initialization (Data Migration)
    const { isInitialized, isMigrating } = useInitializeStore();

    // 1.5 History Sync (Back button support)
    useHistorySync();

    // 1.6 Conflict Detection (Multi-browser protection)
    const conflictDetection = useConflictDetection();

    // 1.7 Session Lock (Prevent concurrent writes)
    const sessionLock = useSessionLock();

    // 2. Zustand Store (Global State)
    const store = useStore();
    const { currentView, activeProjectId, selectedMonthIndex } = store;

    // 3. Feature Hooks (Business Logic)
    const ideaFeature = useIdeaHandlers();
    const projectFeature = useProjectHandlers();
    const timerFeature = useTimer();

    // 4. Task Handlers (Extracted to custom hook)
    const taskHandlers = useTaskHandlers();



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
            {/* Conflict Warning Banner */}
            <ConflictWarning
                isVisible={conflictDetection.isWarningVisible}
                onDismiss={conflictDetection.dismissWarning}
                onReload={conflictDetection.reloadPage}
                sessionId={conflictDetection.sessionId}
            />

            {/* Merge Success Notice */}
            <MergeNotice
                isVisible={conflictDetection.isMergeNoticeVisible}
                onDismiss={conflictDetection.dismissMergeNotice}
            />

            {/* Read-Only Mode Banner */}
            <ReadOnlyBanner
                isVisible={!sessionLock.isOwner && !sessionLock.isChecking}
                ownerSessionId={sessionLock.ownerInfo?.sessionId}
                ownerConnectedAt={sessionLock.ownerInfo?.connectedAt}
                onRequestOwnership={sessionLock.requestOwnership}
                onReload={() => window.location.reload()}
            />

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
                            recentProject={(() => {
                                const projectList = projectFeature.projects;
                                if (projectList.length === 0) return null;

                                let targetProject = null;

                                // 1. Try active project
                                if (activeProjectId && store.projects[activeProjectId]) {
                                    targetProject = store.projects[activeProjectId];
                                } else {
                                    // 2. Try most recently updated
                                    // Use Array.from to avoid mutating if it's read-only, though slice or spread is fine
                                    targetProject = [...projectList].sort((a, b) =>
                                        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                                    )[0];
                                }

                                if (!targetProject) return null;

                                // Denormalize data for LandingView
                                const idea = store.ideas[targetProject.ideaId];
                                return {
                                    id: targetProject.id,
                                    title: idea ? idea.title : 'Unknown Project',
                                    emoji: idea?.emoji,
                                    vision: targetProject.yearlyPlan.vision,
                                    updatedAt: targetProject.updatedAt
                                };
                            })()}
                            onResume={(projectId) => {
                                projectFeature.handleSelectProject(projectId);
                                handleNavigate(AppView.DASHBOARD);
                            }}
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
                            handleUpdateMonthObjectives={projectFeature.handleUpdateMonthObjectives}
                            onSave={store.save}
                            onOpenCampaignDetail={() => handleNavigate(AppView.CAMPAIGN_DETAIL)}
                        />
                    )}

                    {currentView === AppView.CAMPAIGN_DETAIL && projectFeature.activeProject && (
                        <CampaignDetailView
                            activeProject={projectFeature.activeProject}
                            selectedMonthIndex={selectedMonthIndex}
                            onBack={() => handleNavigate(AppView.DASHBOARD)}

                            toggleTask={taskHandlers.handleToggleTask}
                            addTask={taskHandlers.handleAddTask}
                            deleteTask={taskHandlers.handleDeleteTaskWrapper}
                            updateTaskText={taskHandlers.handleUpdateTaskText}
                            updateWeekTheme={taskHandlers.handleUpdateWeekTheme}
                            updateTaskStatus={taskHandlers.handleUpdateTaskStatusWrapper}
                            moveTask={taskHandlers.handleMoveTask}
                            onSelectMonth={projectFeature.handleMonthClick}
                        />
                    )}

                    {currentView === AppView.KANBAN && projectFeature.activeProject && (
                        <KanbanView
                            projects={projectFeature.projects}
                            activeProjectId={activeProjectId}
                            onSelectProject={projectFeature.handleSelectProject}
                            onBack={() => handleNavigate(AppView.DASHBOARD)}

                            // New Handlers
                            onTaskStatusChange={taskHandlers.handleUpdateTaskStatus}
                            onAddTask={taskHandlers.handleKanbanAddTask}
                            onDeleteTask={taskHandlers.handleDeleteTask}
                            onUpdateTask={taskHandlers.handleKanbanUpdateTask}
                        />
                    )}

                    {currentView === AppView.COACH && (
                        <CoachView
                            onBack={() => handleNavigate(AppView.DASHBOARD)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}