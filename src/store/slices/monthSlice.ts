/**
 * @file store/slices/monthSlice.ts
 * 월간 계획 관련 상태 및 액션 슬라이스
 */

import { StateCreator } from 'zustand';
import { NormalizedMonthlyGoal, NormalizedWeeklyMilestone, NormalizedProjectScheme } from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface MonthState {
    months: Record<string, NormalizedMonthlyGoal>;
}

export interface MonthActions {
    updateMonthTheme: (monthId: string, theme: string) => void;
    updateMonthGoals: (monthId: string, goals: string[]) => void;
    updateMonthWeekIds: (monthId: string, weekIds: string[]) => void;
    getMonth: (monthId: string) => NormalizedMonthlyGoal | undefined;
    getMonthsForProject: (projectId: string) => NormalizedMonthlyGoal[];
    initializeMonthWeeks: (monthId: string) => void;
    addMonth: (month: NormalizedMonthlyGoal) => void;
    deleteMonth: (monthId: string) => void;
}

export type MonthSlice = MonthState & MonthActions;

// 외부 상태 참조를 위한 의존성 타입
export interface MonthSliceDependencies {
    projects: Record<string, NormalizedProjectScheme>;
    weeks: Record<string, NormalizedWeeklyMilestone>;
    addWeek: (week: NormalizedWeeklyMilestone) => void;
}

// ============================================
// 헬퍼 함수
// ============================================

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ============================================
// 초기 상태
// ============================================

export const initialMonthState: MonthState = {
    months: {},
};

// ============================================
// 슬라이스 생성자
// ============================================

export const createMonthSlice: StateCreator<
    MonthSlice & MonthSliceDependencies,
    [],
    [],
    MonthSlice
> = (set, get) => ({
    ...initialMonthState,

    updateMonthTheme: (monthId, theme) => {
        set((state) => ({
            months: {
                ...state.months,
                [monthId]: { ...state.months[monthId], theme, updatedAt: now() },
            },
        }));
    },

    updateMonthGoals: (monthId, goals) => {
        set((state) => ({
            months: {
                ...state.months,
                [monthId]: { ...state.months[monthId], goals, updatedAt: now() },
            },
        }));
    },

    updateMonthWeekIds: (monthId, weekIds) => {
        set((state) => ({
            months: {
                ...state.months,
                [monthId]: { ...state.months[monthId], weekIds, updatedAt: now() },
            },
        }));
    },

    getMonth: (monthId) => get().months[monthId],

    getMonthsForProject: (projectId) => {
        const project = get().projects[projectId];
        if (!project) return [];
        return project.monthIds.map((id) => get().months[id]).filter(Boolean);
    },

    initializeMonthWeeks: (monthId) => {
        const month = get().months[monthId];
        if (!month || month.weekIds.length > 0) return;

        const timestamp = now();
        const weekIds: string[] = [];

        [1, 2, 3, 4].forEach((weekNumber) => {
            const weekId = generateId();
            weekIds.push(weekId);

            const week: NormalizedWeeklyMilestone = {
                id: weekId,
                weekNumber,
                theme: `Sector_${weekNumber} 작전 수립 중`,
                taskIds: [],
                monthId,
                projectId: month.projectId,
                createdAt: timestamp,
                updatedAt: timestamp,
            };

            get().addWeek(week);
        });

        set((state) => ({
            months: {
                ...state.months,
                [monthId]: { ...month, weekIds, updatedAt: timestamp },
            },
        }));
    },

    addMonth: (month) => {
        set((state) => ({
            months: { ...state.months, [month.id]: month },
        }));
    },

    deleteMonth: (monthId) => {
        set((state) => {
            const { [monthId]: deleted, ...rest } = state.months;
            return { months: rest };
        });
    },
});
