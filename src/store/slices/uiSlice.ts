/**
 * @file store/slices/uiSlice.ts
 * UI 상태 관련 슬라이스 (네비게이션, 선택 상태 등)
 */

import { StateCreator } from 'zustand';
import { AppView } from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface UIState {
    activeProjectId: string | null;
    currentView: AppView;
    selectedMonthIndex: number;
}

export interface UIActions {
    setActiveProject: (projectId: string | null) => void;
    setCurrentView: (view: AppView) => void;
    setSelectedMonthIndex: (index: number) => void;
    resetUI: () => void;
}

export type UISlice = UIState & UIActions;

// ============================================
// 초기 상태
// ============================================

export const initialUIState: UIState = {
    activeProjectId: null,
    currentView: AppView.LANDING,
    selectedMonthIndex: 0,
};

// ============================================
// 슬라이스 생성자
// ============================================

export const createUISlice: StateCreator<
    UISlice,
    [],
    [],
    UISlice
> = (set) => ({
    ...initialUIState,

    setActiveProject: (projectId) => {
        set({ activeProjectId: projectId, selectedMonthIndex: 0 });
    },

    setCurrentView: (view) => {
        set({ currentView: view });
    },

    setSelectedMonthIndex: (index) => {
        set({ selectedMonthIndex: index });
    },

    resetUI: () => {
        set(initialUIState);
    },
});
