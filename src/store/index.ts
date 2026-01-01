/**
 * @file store/index.ts
 * Zustand 기반 중앙 상태 관리 스토어
 * 
 * 특징:
 * - 슬라이스 기반 모듈화 (도메인별 분리)
 * - 정규화된 데이터 구조 (O(1) 접근)
 * - localStorage 자동 동기화
 * - 레거시 데이터 자동 마이그레이션
 * 
 * v2.1 변경사항:
 * - 슬라이스 패턴으로 리팩토링 (923줄 → ~300줄)
 * - 각 도메인별 슬라이스 분리 (ideaSlice, taskSlice 등)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { serverStorage } from './storage';
import {
    ProjectIdea,
    IdeaAnalysis,
    ProjectScheme,
    NormalizedProjectScheme,
    NormalizedMonthlyGoal,
    NormalizedWeeklyMilestone,
    UnifiedTask,
    AppView,
    IdeaStatus,
    MonthlyGoal,
    WeeklyMilestone,
    MilestoneTask,
    TaskStatus,
    Priority,
} from '../types';

// 슬라이스 임포트
import {
    IdeaSlice,
    AnalysisSlice,
    TaskSlice,
    WeekSlice,
    MonthSlice,
    ProjectSlice,
    UISlice,
    initialIdeaState,
    initialAnalysisState,
    initialTaskState,
    initialWeekState,
    initialMonthState,
    initialProjectState,
    initialUIState,
    denormalizeProject,
} from './slices';

// ============================================
// 스토어 버전 (마이그레이션용)
// ============================================
const STORE_VERSION = 2;

// ============================================
// 통합 스토어 타입
// ============================================

interface StoreState {
    // 슬라이스 상태
    ideas: Record<string, ProjectIdea>;
    analyses: Record<string, IdeaAnalysis>;
    projects: Record<string, NormalizedProjectScheme>;
    months: Record<string, NormalizedMonthlyGoal>;
    weeks: Record<string, NormalizedWeeklyMilestone>;
    tasks: Record<string, UnifiedTask>;
    activeProjectId: string | null;
    currentView: AppView;
    selectedMonthIndex: number;

    // 버전 및 마이그레이션
    version: number;
    legacyProjects: ProjectScheme[];
    legacyIdeas: ProjectIdea[];
    legacyAnalyses: IdeaAnalysis[];
    isMigrated: boolean;
}

interface StoreActions
    extends Omit<IdeaSlice, keyof StoreState>,
    Omit<AnalysisSlice, keyof StoreState>,
    Omit<TaskSlice, keyof StoreState>,
    Omit<WeekSlice, keyof StoreState>,
    Omit<MonthSlice, keyof StoreState>,
    Omit<ProjectSlice, keyof StoreState>,
    Omit<UISlice, keyof StoreState> {
    // Migration & Reset
    migrateFromLegacy: () => void;
    reset: () => void;
    moveTask: (taskId: string, sourceWeekId: string, targetWeekId: string) => void;

    // Computed Helpers (레거시 호환용)
    getActiveProject: () => ProjectScheme | null;
    getActiveMonthPlan: () => MonthlyGoal | null;
    getActiveWeeklyPlan: () => WeeklyMilestone[];
}

export type Store = StoreState & StoreActions;

// ============================================
// 초기 상태
// ============================================

const initialState: StoreState = {
    ...initialIdeaState,
    ...initialAnalysisState,
    ...initialTaskState,
    ...initialWeekState,
    ...initialMonthState,
    ...initialProjectState,
    ...initialUIState,
    version: STORE_VERSION,
    legacyProjects: [],
    legacyIdeas: [],
    legacyAnalyses: [],
    isMigrated: false,
};

// ============================================
// 헬퍼 함수
// ============================================

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ============================================
// Zustand 스토어 생성
// ============================================

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            ...initialState,

            // ========== Idea Actions ==========
            addIdea: (ideaData) => {
                const id = generateId();
                const timestamp = now();
                const idea: ProjectIdea = {
                    ...ideaData,
                    id,
                    status: IdeaStatus.PENDING,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                };
                set((state) => ({ ideas: { ...state.ideas, [id]: idea } }));
                return idea;
            },

            updateIdea: (id, updates) => {
                set((state) => ({
                    ideas: {
                        ...state.ideas,
                        [id]: { ...state.ideas[id], ...updates, updatedAt: now() },
                    },
                }));
            },

            deleteIdea: (id) => {
                set((state) => {
                    const { [id]: deleted, ...rest } = state.ideas;
                    return { ideas: rest };
                });
            },

            getIdea: (id) => get().ideas[id],
            getAllIdeas: () => Object.values(get().ideas),

            // ========== Analysis Actions ==========
            addAnalysis: (analysis) => {
                set((state) => ({
                    analyses: { ...state.analyses, [analysis.id]: analysis },
                }));
            },

            getAnalysis: (ideaId) => {
                return Object.values(get().analyses).find((a) => a.ideaId === ideaId);
            },

            setAnalyses: (analysisList) => {
                const analyses: Record<string, IdeaAnalysis> = {};
                analysisList.forEach((a) => { analyses[a.id] = a; });
                set({ analyses });
            },

            deleteAnalysis: (id) => {
                set((state) => {
                    const { [id]: deleted, ...rest } = state.analyses;
                    return { analyses: rest };
                });
            },

            // ========== Task Actions ==========
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
                    weeks: {
                        ...state.weeks,
                        [weekId]: {
                            ...state.weeks[weekId],
                            taskIds: [...state.weeks[weekId].taskIds, taskId],
                            updatedAt: timestamp,
                        },
                    },
                }));

                return task;
            },

            updateTask: (taskId, updates) => {
                set((state) => {
                    const task = state.tasks[taskId];
                    if (!task) return state;

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
                    const newWeeks = { ...state.weeks };
                    Object.keys(newWeeks).forEach((weekId) => {
                        const week = newWeeks[weekId];
                        if (week.taskIds.includes(taskId)) {
                            newWeeks[weekId] = {
                                ...week,
                                taskIds: week.taskIds.filter((id) => id !== taskId),
                                updatedAt: now(),
                            };
                        }
                    });
                    return { tasks: restTasks, weeks: newWeeks };
                });
            },

            toggleTaskStatus: (taskId) => {
                const task = get().tasks[taskId];
                if (!task) return;
                get().updateTask(taskId, {
                    isCompleted: !task.isCompleted,
                    status: !task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO,
                });
            },

            updateTaskStatus: (taskId, status) => {
                get().updateTask(taskId, { status, isCompleted: status === TaskStatus.DONE });
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

            // ========== Week Actions ==========
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
                set((state) => ({ weeks: { ...state.weeks, [week.id]: week } }));
            },

            deleteWeek: (weekId) => {
                set((state) => {
                    const { [weekId]: deleted, ...rest } = state.weeks;
                    return { weeks: rest };
                });
            },

            moveTask: (taskId, sourceWeekId, targetWeekId) => {
                const state = get();
                const sourceWeek = state.weeks[sourceWeekId];
                const targetWeek = state.weeks[targetWeekId];
                const task = state.tasks[taskId];

                if (!sourceWeek || !targetWeek || !task) return;

                // 1. Remove from source
                const newSourceTaskIds = sourceWeek.taskIds.filter(id => id !== taskId);

                // 2. Add to target
                const newTargetTaskIds = [...targetWeek.taskIds, taskId];

                set({
                    weeks: {
                        ...state.weeks,
                        [sourceWeekId]: { ...sourceWeek, taskIds: newSourceTaskIds, updatedAt: now() },
                        [targetWeekId]: { ...targetWeek, taskIds: newTargetTaskIds, updatedAt: now() },
                    },
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...task,
                            weekNumber: targetWeek.weekNumber, // Update Metadata
                            updatedAt: now()
                        }
                    }
                });
            },

            // ========== Month Actions ==========
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
                const weeks: Record<string, NormalizedWeeklyMilestone> = {};
                const weekIds: string[] = [];

                [1, 2, 3, 4].forEach((weekNumber) => {
                    const weekId = generateId();
                    weekIds.push(weekId);
                    weeks[weekId] = {
                        id: weekId,
                        weekNumber,
                        theme: `Sector_${weekNumber} 작전 수립 중`,
                        taskIds: [],
                        monthId,
                        projectId: month.projectId,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                    };
                });

                set((state) => ({
                    weeks: { ...state.weeks, ...weeks },
                    months: {
                        ...state.months,
                        [monthId]: { ...month, weekIds, updatedAt: timestamp },
                    },
                }));
            },

            addMonth: (month) => {
                set((state) => ({ months: { ...state.months, [month.id]: month } }));
            },

            deleteMonth: (monthId) => {
                set((state) => {
                    const { [monthId]: deleted, ...rest } = state.months;
                    return { months: rest };
                });
            },

            // ========== Project Actions ==========
            createProject: (idea, analysis, plan, startDate) => {
                const projectId = generateId();
                const timestamp = now();
                const monthIds: string[] = [];
                const months: Record<string, NormalizedMonthlyGoal> = {};
                const weeks: Record<string, NormalizedWeeklyMilestone> = {};
                const tasks: Record<string, UnifiedTask> = {};

                // 아이디어 상태 업데이트
                const updatedIdea: ProjectIdea = {
                    ...idea,
                    status: IdeaStatus.ACTIVE,
                    updatedAt: timestamp,
                };

                // 월별 계획 정규화
                plan.monthlyPlan.forEach((month, monthIndex) => {
                    const monthId = generateId();
                    monthIds.push(monthId);
                    const weekIds: string[] = [];

                    const weeklyPlan = monthIndex === 0 && plan.weeklyPlan
                        ? plan.weeklyPlan
                        : month.detailedPlan || [];

                    weeklyPlan.forEach((week) => {
                        const weekId = generateId();
                        weekIds.push(weekId);
                        const taskIds: string[] = [];

                        week.tasks.forEach((task) => {
                            const taskId = task.id || generateId();
                            taskIds.push(taskId);
                            tasks[taskId] = {
                                id: taskId,
                                text: task.text,
                                status: task.status || (task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO),
                                priority: task.priority || Priority.MEDIUM,
                                isCompleted: task.isCompleted,
                                projectId,
                                monthIndex,
                                weekNumber: week.weekNumber,
                                createdAt: task.createdAt || timestamp,
                                updatedAt: task.updatedAt || timestamp,
                            };
                        });

                        weeks[weekId] = {
                            id: weekId,
                            weekNumber: week.weekNumber,
                            theme: week.theme,
                            taskIds,
                            monthId,
                            projectId,
                            createdAt: timestamp,
                            updatedAt: timestamp,
                        };
                    });

                    months[monthId] = {
                        id: monthId,
                        month: month.month,
                        theme: month.theme,
                        goals: month.goals || [],
                        weekIds,
                        projectId,
                        createdAt: month.createdAt || timestamp,
                        updatedAt: month.updatedAt || timestamp,
                    };
                });

                const project: NormalizedProjectScheme = {
                    id: projectId,
                    ideaId: idea.id,
                    analysisId: analysis.id,
                    yearlyPlan: plan.yearlyPlan,
                    monthIds,
                    startDate,
                    status: 'PLANNED' as any,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                };

                set((state) => ({
                    ideas: { ...state.ideas, [idea.id]: updatedIdea },
                    analyses: { ...state.analyses, [analysis.id]: analysis },
                    projects: { ...state.projects, [projectId]: project },
                    months: { ...state.months, ...months },
                    weeks: { ...state.weeks, ...weeks },
                    tasks: { ...state.tasks, ...tasks },
                }));

                return project;
            },

            deleteProject: (id) => {
                const project = get().projects[id];
                if (!project) return;

                set((state) => {
                    const monthsToDelete = project.monthIds;
                    const weeksToDelete: string[] = [];
                    const tasksToDelete: string[] = [];

                    monthsToDelete.forEach((monthId) => {
                        const month = state.months[monthId];
                        if (month) weeksToDelete.push(...month.weekIds);
                    });

                    weeksToDelete.forEach((weekId) => {
                        const week = state.weeks[weekId];
                        if (week) tasksToDelete.push(...week.taskIds);
                    });

                    const newMonths = { ...state.months };
                    monthsToDelete.forEach((mid) => delete newMonths[mid]);

                    const newWeeks = { ...state.weeks };
                    weeksToDelete.forEach((wid) => delete newWeeks[wid]);

                    const newTasks = { ...state.tasks };
                    tasksToDelete.forEach((tid) => delete newTasks[tid]);

                    const { [id]: deletedProject, ...restProjects } = state.projects;

                    return {
                        projects: restProjects,
                        months: newMonths,
                        weeks: newWeeks,
                        tasks: newTasks,
                        activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
                    };
                });
            },

            getProject: (id) => get().projects[id],
            getAllProjects: () => Object.values(get().projects),

            updateProject: (id, updates) => {
                set((state) => ({
                    projects: {
                        ...state.projects,
                        [id]: { ...state.projects[id], ...updates, updatedAt: now() },
                    },
                }));
            },

            updateThreeYearVision: (projectId, vision) => {
                set((state) => ({
                    projects: {
                        ...state.projects,
                        [projectId]: {
                            ...state.projects[projectId],
                            threeYearVision: vision,
                            updatedAt: now(),
                        },
                    },
                }));
            },

            // ========== Navigation Actions ==========
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
                set({
                    activeProjectId: null,
                    currentView: AppView.LANDING,
                    selectedMonthIndex: 0,
                });
            },

            // ========== Migration ==========
            migrateFromLegacy: () => {
                const state = get();
                if (state.isMigrated) return;

                const legacyProjectsStr = localStorage.getItem('schemeland_projects');
                const legacyIdeasStr = localStorage.getItem('schemeland_ideas');
                const legacyAnalysesStr = localStorage.getItem('schemeland_analyses');
                const legacyActiveId = localStorage.getItem('schemeland_active_id');
                const legacyView = localStorage.getItem('schemeland_view');

                if (!legacyProjectsStr) {
                    set({ isMigrated: true });
                    return;
                }

                try {
                    const legacyProjects: ProjectScheme[] = JSON.parse(legacyProjectsStr);
                    const legacyIdeas: ProjectIdea[] = legacyIdeasStr ? JSON.parse(legacyIdeasStr) : [];
                    const legacyAnalyses: IdeaAnalysis[] = legacyAnalysesStr ? JSON.parse(legacyAnalysesStr) : [];

                    const ideas: Record<string, ProjectIdea> = {};
                    const analyses: Record<string, IdeaAnalysis> = {};
                    const projects: Record<string, NormalizedProjectScheme> = {};
                    const months: Record<string, NormalizedMonthlyGoal> = {};
                    const weeks: Record<string, NormalizedWeeklyMilestone> = {};
                    const tasks: Record<string, UnifiedTask> = {};

                    legacyIdeas.forEach((idea) => { ideas[idea.id] = idea; });
                    legacyAnalyses.forEach((analysis) => { analyses[analysis.id] = analysis; });

                    legacyProjects.forEach((project) => {
                        const result = normalizeProjectHelper(project);
                        ideas[result.idea.id] = result.idea;
                        analyses[result.analysis.id] = result.analysis;
                        projects[result.normalizedProject.id] = result.normalizedProject;
                        Object.assign(months, result.months);
                        Object.assign(weeks, result.weeks);
                        Object.assign(tasks, result.tasks);
                    });

                    set({
                        ideas,
                        analyses,
                        projects,
                        months,
                        weeks,
                        tasks,
                        activeProjectId: legacyActiveId ? JSON.parse(legacyActiveId) : null,
                        currentView: legacyView ? JSON.parse(legacyView) : AppView.LANDING,
                        isMigrated: true,
                        legacyProjects,
                        legacyIdeas,
                        legacyAnalyses,
                    });

                    console.log('✅ Migration completed successfully');
                } catch (error) {
                    console.error('❌ Migration failed:', error);
                    set({ isMigrated: true });
                }
            },

            reset: () => {
                set(initialState);
                localStorage.removeItem('schemeland-store');
            },

            // ========== Computed Helpers (레거시 호환) ==========
            getActiveProject: () => {
                const state = get();
                if (!state.activeProjectId) return null;
                const project = state.projects[state.activeProjectId];
                if (!project) return null;
                return denormalizeProject(
                    project,
                    state.ideas,
                    state.analyses,
                    state.months,
                    state.weeks,
                    state.tasks
                );
            },

            getActiveMonthPlan: () => {
                const state = get();
                const activeProject = get().getActiveProject();
                if (!activeProject) return null;
                return activeProject.monthlyPlan[state.selectedMonthIndex] || null;
            },

            getActiveWeeklyPlan: () => {
                const monthPlan = get().getActiveMonthPlan();
                return monthPlan?.detailedPlan || [];
            },
        }),
        {
            name: 'schemeland-store',
            storage: createJSONStorage(() => serverStorage),
            partialize: (state) => ({
                ideas: state.ideas,
                analyses: state.analyses,
                projects: state.projects,
                months: state.months,
                weeks: state.weeks,
                tasks: state.tasks,
                activeProjectId: state.activeProjectId,
                currentView: state.currentView,
                selectedMonthIndex: state.selectedMonthIndex,
                version: state.version,
                isMigrated: state.isMigrated,
            }),
        }
    )
);

// ============================================
// 마이그레이션 헬퍼 (인라인)
// ============================================

function normalizeProjectHelper(project: ProjectScheme): {
    normalizedProject: NormalizedProjectScheme;
    months: Record<string, NormalizedMonthlyGoal>;
    weeks: Record<string, NormalizedWeeklyMilestone>;
    tasks: Record<string, UnifiedTask>;
    idea: ProjectIdea;
    analysis: IdeaAnalysis;
} {
    const months: Record<string, NormalizedMonthlyGoal> = {};
    const weeks: Record<string, NormalizedWeeklyMilestone> = {};
    const tasks: Record<string, UnifiedTask> = {};
    const monthIds: string[] = [];

    const idea: ProjectIdea = { ...project.selectedIdea, status: IdeaStatus.ACTIVE };
    const analysis: IdeaAnalysis = { ...project.analysis };

    project.monthlyPlan.forEach((month, monthIndex) => {
        const monthId = generateId();
        monthIds.push(monthId);
        const weekIds: string[] = [];

        if (month.detailedPlan) {
            month.detailedPlan.forEach((week) => {
                const weekId = generateId();
                weekIds.push(weekId);
                const taskIds: string[] = [];

                week.tasks.forEach((task) => {
                    const taskId = task.id || generateId();
                    taskIds.push(taskId);
                    tasks[taskId] = {
                        id: taskId,
                        text: task.text,
                        status: task.status || (task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO),
                        priority: task.priority || Priority.MEDIUM,
                        isCompleted: task.isCompleted,
                        projectId: project.id,
                        monthIndex,
                        weekNumber: week.weekNumber,
                        createdAt: task.createdAt || now(),
                        updatedAt: task.updatedAt || now(),
                    };
                });

                weeks[weekId] = {
                    id: weekId,
                    weekNumber: week.weekNumber,
                    theme: week.theme,
                    taskIds,
                    monthId,
                    projectId: project.id,
                    createdAt: now(),
                    updatedAt: now(),
                };
            });
        }

        months[monthId] = {
            id: monthId,
            month: month.month,
            theme: month.theme,
            goals: month.goals,
            weekIds,
            projectId: project.id,
            createdAt: month.createdAt || now(),
            updatedAt: month.updatedAt || now(),
        };
    });

    const normalizedProject: NormalizedProjectScheme = {
        id: project.id,
        ideaId: idea.id,
        analysisId: analysis.id,
        yearlyPlan: project.yearlyPlan,
        monthIds,
        threeYearVision: project.threeYearVision,
        startDate: project.startDate,
        status: project.status,
        settings: project.settings,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };

    return { normalizedProject, months, weeks, tasks, idea, analysis };
}

// ============================================
// 셀렉터 (성능 최적화)
// ============================================

export const selectIdeas = (state: Store) => state.ideas;
export const selectProjects = (state: Store) => state.projects;
export const selectTasks = (state: Store) => state.tasks;
export const selectActiveProjectId = (state: Store) => state.activeProjectId;
export const selectCurrentView = (state: Store) => state.currentView;
export const selectSelectedMonthIndex = (state: Store) => state.selectedMonthIndex;

// ============================================
// 편의 훅
// ============================================

export const useActiveProject = () => useStore((state) => state.getActiveProject());
export const useActiveMonthPlan = () => useStore((state) => state.getActiveMonthPlan());
export const useActiveWeeklyPlan = () => useStore((state) => state.getActiveWeeklyPlan());

// 슬라이스 re-export
export { denormalizeProject } from './slices';
