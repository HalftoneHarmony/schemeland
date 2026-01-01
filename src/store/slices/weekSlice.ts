/**
 * @file store/slices/weekSlice.ts
 * 주간 계획 관련 상태 및 액션 슬라이스
 */

import { StateCreator } from 'zustand';
import { NormalizedWeeklyMilestone, NormalizedMonthlyGoal } from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface WeekState {
    weeks: Record<string, NormalizedWeeklyMilestone>;
}

export interface WeekActions {
    updateWeekTheme: (weekId: string, theme: string) => void;
    updateWeekTaskIds: (weekId: string, taskIds: string[]) => void;
    getWeek: (weekId: string) => NormalizedWeeklyMilestone | undefined;
    getWeeksForMonth: (monthId: string) => NormalizedWeeklyMilestone[];
    addWeek: (week: NormalizedWeeklyMilestone) => void;
    deleteWeek: (weekId: string) => void;
}

export type WeekSlice = WeekState & WeekActions;

// 외부 상태 참조를 위한 의존성 타입
export interface WeekSliceDependencies {
    months: Record<string, NormalizedMonthlyGoal>;
}

// ============================================
// 헬퍼 함수
// ============================================

const now = () => new Date().toISOString();

// ============================================
// 초기 상태
// ============================================

export const initialWeekState: WeekState = {
    weeks: {},
};

// ============================================
// 슬라이스 생성자
// ============================================

export const createWeekSlice: StateCreator<
    WeekSlice & WeekSliceDependencies,
    [],
    [],
    WeekSlice
> = (set, get) => ({
    ...initialWeekState,

    updateWeekTheme: (weekId, theme) => {
        set((state) => ({
            weeks: {
                ...state.weeks,
                [weekId]: { ...state.weeks[weekId], theme, updatedAt: now() },
            },
        }));
    },

    updateWeekTaskIds: (weekId, taskIds) => {
        set((state) => ({
            weeks: {
                ...state.weeks,
                [weekId]: { ...state.weeks[weekId], taskIds, updatedAt: now() },
            },
        }));
    },

    getWeek: (weekId) => get().weeks[weekId],

    getWeeksForMonth: (monthId) => {
        const month = get().months[monthId];
        if (!month) return [];
        return month.weekIds.map((id) => get().weeks[id]).filter(Boolean);
    },

    addWeek: (week) => {
        set((state) => ({
            weeks: { ...state.weeks, [week.id]: week },
        }));
    },

    deleteWeek: (weekId) => {
        set((state) => {
            const { [weekId]: deleted, ...rest } = state.weeks;
            return { weeks: rest };
        });
    },
});
