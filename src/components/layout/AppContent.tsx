
import React from 'react';
import { AppView } from '../../types';
import { LandingView } from '../views/LandingView';
import { BrainDumpView } from '../views/BrainDumpView';
import { AnalysisView } from '../views/AnalysisView';
import { ProjectListView } from '../views/ProjectListView';
import { DashboardView } from '../views/DashboardView';
import { CampaignDetailView } from '../views/CampaignDetailView';
import { KanbanView } from '../views/KanbanView';
import { CoachView } from '../views/CoachView';

import { useProjectHandlers, useIdeaHandlers, useTimer } from '../../features';
import { useTaskHandlers } from '../../hooks/useTaskHandlers';
import { Store } from '../../store';

interface AppContentProps {
    currentView: AppView;
    store: Store;
    selectedMonthIndex: number;
    activeProjectId: string | null;
    handleNavigate: (view: AppView) => void;

    projectFeature: ReturnType<typeof useProjectHandlers>;
    ideaFeature: ReturnType<typeof useIdeaHandlers>;
    taskHandlers: ReturnType<typeof useTaskHandlers>;
    timerFeature: ReturnType<typeof useTimer>;
}

export function AppContent({
    currentView,
    store,
    selectedMonthIndex,
    activeProjectId,
    handleNavigate,
    projectFeature,
    ideaFeature,
    taskHandlers,
    timerFeature
}: AppContentProps) {

    return (
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

                        if (activeProjectId && store.projects[activeProjectId]) {
                            targetProject = store.projects[activeProjectId];
                        } else {
                            targetProject = [...projectList].sort((a, b) =>
                                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                            )[0];
                        }

                        if (!targetProject) return null;

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
                    onAddIdea={ideaFeature.handleAddIdea}
                    onUpdateIdea={ideaFeature.handleUpdateIdea}
                    onDeleteIdea={ideaFeature.handleDeleteIdea}
                    onMagic={ideaFeature.handleMagicRefine}
                    onSuggestion={ideaFeature.handleSuggestIdeas}
                    isSuggesting={ideaFeature.isSuggesting}
                    isRefiningMap={ideaFeature.isRefiningMap}
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
                    onCommit={projectFeature.handleCommit}
                    startDate={projectFeature.projectStartDate}
                    onStartDateChange={projectFeature.setProjectStartDate}
                    isGeneratingPlan={projectFeature.isGeneratingPlan}
                />
            )}

            {currentView === AppView.DASHBOARD && (
                <DashboardView
                    activeProject={projectFeature.activeProject}
                    selectedMonthIndex={selectedMonthIndex}
                    timerActive={timerFeature.timerActive}
                    timeLeft={timerFeature.timeLeft}
                    timerMode={timerFeature.timerMode}
                    pomodoroCount={timerFeature.pomodoroCount}
                    setTimerActive={timerFeature.setTimerActive}
                    setTimerMode={timerFeature.setTimerMode}
                    setTimeLeft={timerFeature.setTimeLeft}
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
                    setCompressModalOpen={projectFeature.setCompressModalOpen}
                    setAdjustmentModalOpen={projectFeature.setAdjustmentModalOpen}
                    setVisionDraft={projectFeature.setVisionDraft}
                    setPreviewIndex={projectFeature.setPreviewIndex}
                    handleMonthClick={projectFeature.handleMonthClick}
                    triggerSmartAdjustment={projectFeature.triggerSmartAdjustment}
                    onConfirmAdjustment={projectFeature.confirmAdjustment}
                    handleExpandVision={projectFeature.handleExpandVision}
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
                    updateMonthGoals={projectFeature.handleUpdateMonthGoalsByIndex}
                    onInitializeMonth={projectFeature.handleInitializeMonth}
                    onGenerateWeekTheme={projectFeature.handleGenerateWeekTheme}
                    onGenerateWeekTasks={projectFeature.handleGenerateWeekTasks}
                    onGenerateEntireSprint={projectFeature.handleGenerateEntireSprint}
                    isGeneratingEntireSprint={projectFeature.isGeneratingEntireSprint}
                />
            )}

            {currentView === AppView.KANBAN && projectFeature.activeProject && (
                <KanbanView
                    projects={projectFeature.projects}
                    activeProjectId={activeProjectId}
                    onSelectProject={projectFeature.handleSelectProject}
                    onBack={() => handleNavigate(AppView.DASHBOARD)}
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
    );
}
