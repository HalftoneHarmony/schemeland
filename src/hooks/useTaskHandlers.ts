/**
 * @file hooks/useTaskHandlers.ts
 * Task 관련 핸들러 훅
 * 
 * App.tsx에서 분리된 Task CRUD 및 상태 변경 로직
 */

import { useCallback } from 'react';
import { useStore } from '../store';
import { TaskStatus, Priority, KanbanTask } from '../types';

export function useTaskHandlers() {
    const store = useStore();

    /**
     * Task 완료 상태 토글
     */
    const handleToggleTask = useCallback((weekIndex: number, taskId: string) => {
        store.toggleTaskStatus(taskId);
    }, [store]);

    /**
     * Task 텍스트 업데이트
     */
    const handleUpdateTaskText = useCallback((weekIndex: number, taskId: string, text: string) => {
        store.updateTask(taskId, { text });
    }, [store]);

    /**
     * 새 Task 추가
     */
    const handleAddTask = useCallback((weekIndex: number, text?: string) => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;

        const month = store.months[activeMonth.id];
        if (!month || !month.weekIds[weekIndex]) return;

        const weekId = month.weekIds[weekIndex];
        store.addTask(weekId, text);
    }, [store]);

    /**
     * Task 삭제
     */
    const handleDeleteTask = useCallback((taskId: string) => {
        store.deleteTask(taskId);
    }, [store]);

    /**
     * Task 삭제 (weekIndex 포함 래퍼)
     */
    const handleDeleteTaskWrapper = useCallback((weekIndex: number, taskId: string) => {
        store.deleteTask(taskId);
    }, [store]);

    /**
     * 주간 테마 업데이트
     */
    const handleUpdateWeekTheme = useCallback((weekIndex: number, theme: string) => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        const month = store.months[activeMonth.id];
        if (!month || !month.weekIds[weekIndex]) return;

        store.updateWeekTheme(month.weekIds[weekIndex], theme);
    }, [store]);

    /**
     * Task 상태(칸반) 업데이트
     */
    const handleUpdateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
        store.updateTaskStatus(taskId, status);
    }, [store]);

    /**
     * Task 상태 업데이트 (weekIndex 포함 래퍼)
     */
    const handleUpdateTaskStatusWrapper = useCallback((weekIndex: number, taskId: string, status: TaskStatus) => {
        store.updateTaskStatus(taskId, status);
    }, [store]);

    /**
     * 수동 계획 초기화
     */
    const handleInitManualPlan = useCallback(() => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        store.initializeMonthWeeks(activeMonth.id);
    }, [store]);

    /**
     * Task 이동 (주간 간 이동)
     */
    const handleMoveTask = useCallback((taskId: string, sourceWeekIndex: number, targetWeekIndex: number) => {
        const activeMonth = store.getActiveMonthPlan();
        if (!activeMonth) return;
        const month = store.months[activeMonth.id];
        if (!month) return;

        const sourceWeekId = month.weekIds[sourceWeekIndex];
        const targetWeekId = month.weekIds[targetWeekIndex];

        if (sourceWeekId && targetWeekId) {
            store.moveTask(taskId, sourceWeekId, targetWeekId);
        }
    }, [store]);

    /**
     * 칸반용 Task 추가
     */
    const handleKanbanAddTask = useCallback((
        monthIndex: number,
        weekNumber: number,
        status: TaskStatus,
        text: string,
        priority: Priority
    ) => {
        const { activeProjectId, projects, months, weeks } = store;
        if (!activeProjectId) return;

        const project = projects[activeProjectId];
        if (!project) return;

        const monthId = project.monthIds[monthIndex];
        const month = months[monthId];
        if (!month) return;

        // weekNumber is 1-based, array is 0-based
        const weekId = month.weekIds[weekNumber - 1];
        if (!weekId) return;

        // 1. Add Placeholder Task
        store.addTask(weekId);

        // 2. Find the newly added task
        const updatedWeek = useStore.getState().weeks[weekId];
        if (!updatedWeek || updatedWeek.taskIds.length === 0) return;

        const newTaskId = updatedWeek.taskIds[updatedWeek.taskIds.length - 1];

        // 3. Update Content
        store.updateTask(newTaskId, {
            text,
            status,
            priority,
            isCompleted: status === TaskStatus.DONE
        });
    }, [store]);

    /**
     * 칸반용 Task 업데이트
     */
    const handleKanbanUpdateTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
        store.updateTask(taskId, updates);
    }, [store]);

    return {
        // Basic Task Operations
        handleToggleTask,
        handleUpdateTaskText,
        handleAddTask,
        handleDeleteTask,
        handleDeleteTaskWrapper,

        // Week Operations
        handleUpdateWeekTheme,
        handleInitManualPlan,
        handleMoveTask,

        // Status Operations
        handleUpdateTaskStatus,
        handleUpdateTaskStatusWrapper,

        // Kanban Operations
        handleKanbanAddTask,
        handleKanbanUpdateTask,
    };
}

export default useTaskHandlers;
