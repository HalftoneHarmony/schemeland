/**
 * @file App.tsx
 * 애플리케이션 메인 진입점
 * 
 * v2.3 변경사항:
 * - 뷰 렌더링 로직을 AppContent로 분리하여 App.tsx 다이어트
 * - 가독성 및 유지보수성 향상
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

// Navigation & Layout Components
import { SideNavigation } from './components/navigation/SideNavigation';
import { QuickSearch } from './components/navigation/QuickSearch';
import { AppContent } from './components/layout/AppContent';

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

    // 4. Task Handlers
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
                <AppContent
                    currentView={currentView}
                    store={store}
                    selectedMonthIndex={selectedMonthIndex}
                    activeProjectId={activeProjectId}
                    handleNavigate={handleNavigate}
                    projectFeature={projectFeature}
                    ideaFeature={ideaFeature}
                    taskHandlers={taskHandlers}
                    timerFeature={timerFeature}
                />
            </div>
        </div>
    );
}