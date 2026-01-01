/**
 * @file App.tsx
 * 애플리케이션 메인 진입점
 * 
 * 주요 변경사항 (v2.0):
 * - Zustand Store 기반 상태 관리
 * - Feature Hook 패턴 적용 (로직 분리)
 * - God Component 해소
 */

import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

// Types & Constants
import { AppView, Priority, TaskStatus } from './types';
import { INITIAL_IDEAS, APP_NAME } from './constants';

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
        // 현재 선택된 월의 weekId를 찾아야 함
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;

        // Month의 weekIds 중 weekIndex에 해당하는 ID 찾기
        const month = store.months[activeMonth.id];
        if (!month || !month.weekIds[weekIndex]) return;

        const weekId = month.weekIds[weekIndex];
        store.addTask(weekId);
    };

    const handleDeleteTask = (weekIndex: number, taskId: string) => {
        store.deleteTask(taskId);
    };

    const handleUpdateWeekTheme = (weekIndex: number, theme: string) => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        const month = store.months[activeMonth.id];
        if (!month || !month.weekIds[weekIndex]) return;

        store.updateWeekTheme(month.weekIds[weekIndex], theme);
    };

    const handleUpdateTaskStatus = (weekIndex: number, taskId: string, status: TaskStatus) => {
        store.updateTaskStatus(taskId, status);
    };

    const handleInitManualPlan = () => {
        // 현재 월에 주간 계획이 없으면 생성
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        store.initializeMonthWeeks(activeMonth.id);
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
                                // Reset ideas/analyses logic needs to be in store if we want to "clear" state
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

                            // Handlers - Project Feature
                            onMonthClick={projectFeature.handleMonthClick}
                            triggerSmartAdjustment={projectFeature.triggerSmartAdjustment}
                            confirmAdjustment={projectFeature.confirmAdjustment}
                            handleExpandVision={projectFeature.handleExpandVision}
                            handleGeneratePlanOptions={projectFeature.handleGeneratePlanOptions}
                            confirmPreviewPlan={projectFeature.confirmPreviewPlan}
                            cancelPreview={projectFeature.cancelPreview}
                            handleExtendRoadmap={projectFeature.handleExtendRoadmap}
                            handleCompressRoadmap={projectFeature.handleCompressRoadmap}
                            handleEditVision={projectFeature.handleEditVision}
                            handleCancelEditVision={projectFeature.handleCancelEditVision}
                            handleSaveVision={projectFeature.handleSaveVision}
                            handleRefineVision={projectFeature.handleRefineVision}
                            handleAbandonQuest={projectFeature.handleAbandonQuest}
                            handleUpdateMonthGoal={projectFeature.handleUpdateMonthGoal}

                            // Handlers - Tasks (App Bridge)
                            toggleTask={handleToggleTask}
                            updateTaskText={handleUpdateTaskText}
                            addTask={handleAddTask}
                            deleteTask={handleDeleteTask}
                            updateWeekTheme={handleUpdateWeekTheme}
                            updateTaskStatus={handleUpdateTaskStatus}
                            initManualPlan={handleInitManualPlan}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}