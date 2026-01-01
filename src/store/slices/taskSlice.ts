/**
 * @file store/slices/taskSlice.ts
 * 태스크(할 일) 관련 상태 및 액션 슬라이스
 */

import { StateCreator } from 'zustand';
import { UnifiedTask, TaskStatus, Priority, NormalizedWeeklyMilestone, NormalizedMonthlyGoal } from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface TaskState {
    tasks: Record<string, UnifiedTask>;
}

export interface TaskActions {
    addTask: (weekId: string, text?: string) => UnifiedTask;
    updateTask: (taskId: string, updates: Partial<UnifiedTask>) => void;
    deleteTask: (taskId: string) => void;
    toggleTaskStatus: (taskId: string) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
    getTask: (taskId: string) => UnifiedTask | undefined;
    getTasksForWeek: (weekId: string) => UnifiedTask[];
    getTasksForMonth: (monthId: string) => UnifiedTask[];
    getTasksForProject: (projectId: string) => UnifiedTask[];
}

export type TaskSlice = TaskState & TaskActions;

// 외부 상태 참조를 위한 의존성 타입
export interface TaskSliceDependencies {
    weeks: Record<string, NormalizedWeeklyMilestone>;
    months: Record<string, NormalizedMonthlyGoal>;
}

// ============================================
// 헬퍼 함수
// ============================================

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ============================================
// 초기 상태
// ============================================

export const initialTaskState: TaskState = {
    tasks: {},
};

// ============================================
// 슬라이스 생성자
// ============================================

export const createTaskSlice: StateCreator<
    TaskSlice & TaskSliceDependencies & { updateWeekTaskIds: (weekId: string, taskIds: string[]) => void },
    [],
    [],
    TaskSlice
> = (set, get) => ({
    ...initialTaskState,

    addTask: (weekId, text = '신규 미션 데이터 입력...') => {
        const week = get().weeks[weekId];
        if (!week) throw new Error(`Week not found: ${weekId}`);

        const taskId = generateId();
        const timestamp = now();

        const task: UnifiedTask = {
            id: taskId,
            text,
            status: TaskStatus.TODO,
            priority: Priority.MEDIUM,
            isCompleted: false,
            projectId: week.projectId,
            monthIndex: 0,
            weekNumber: week.weekNumber,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        set((state) => ({
            tasks: { ...state.tasks, [taskId]: task },
        }));

        // 주에 태스크 ID 추가
        get().updateWeekTaskIds(weekId, [...week.taskIds, taskId]);

        return task;
    },

    updateTask: (taskId, updates) => {
        set((state) => {
            const task = state.tasks[taskId];
            if (!task) return state;

            // status와 isCompleted 동기화
            let syncedUpdates = { ...updates };
            if (updates.status !== undefined) {
                syncedUpdates.isCompleted = updates.status === TaskStatus.DONE;
            } else if (updates.isCompleted !== undefined) {
                syncedUpdates.status = updates.isCompleted ? TaskStatus.DONE : TaskStatus.TODO;
            }

            return {
                tasks: {
                    ...state.tasks,
                    [taskId]: { ...task, ...syncedUpdates, updatedAt: now() },
                },
            };
        });
    },

    deleteTask: (taskId) => {
        const task = get().tasks[taskId];
        if (!task) return;

        set((state) => {
            const { [taskId]: deleted, ...restTasks } = state.tasks;
            return { tasks: restTasks };
        });

        // 주에서 태스크 ID 제거
        const weeks = get().weeks;
        Object.keys(weeks).forEach((weekId) => {
            const week = weeks[weekId];
            if (week.taskIds.includes(taskId)) {
                get().updateWeekTaskIds(weekId, week.taskIds.filter((id) => id !== taskId));
            }
        });
    },

    toggleTaskStatus: (taskId) => {
        const task = get().tasks[taskId];
        if (!task) return;

        const newIsCompleted = !task.isCompleted;
        get().updateTask(taskId, {
            isCompleted: newIsCompleted,
            status: newIsCompleted ? TaskStatus.DONE : TaskStatus.TODO,
        });
    },

    updateTaskStatus: (taskId, status) => {
        get().updateTask(taskId, {
            status,
            isCompleted: status === TaskStatus.DONE,
        });
    },

    getTask: (taskId) => get().tasks[taskId],

    getTasksForWeek: (weekId) => {
        const week = get().weeks[weekId];
        if (!week) return [];
        return week.taskIds.map((id) => get().tasks[id]).filter(Boolean);
    },

    getTasksForMonth: (monthId) => {
        const month = get().months[monthId];
        if (!month) return [];
        return month.weekIds.flatMap((weekId) => get().getTasksForWeek(weekId));
    },

    getTasksForProject: (projectId) => {
        return Object.values(get().tasks).filter((t) => t.projectId === projectId);
    },
});
