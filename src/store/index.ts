/**
 * @file store/index.ts
 * Zustand 기반 중앙 상태 관리 스토어
 * 
 * 특징:
 * - 정규화된 데이터 구조 (O(1) 접근)
 * - localStorage 자동 동기화
 * - 레거시 데이터 자동 마이그레이션
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
    ProjectStatus,
    TaskStatus,
    Priority,
    MonthlyGoal,
    WeeklyMilestone,
    MilestoneTask,
    ThreeYearVision,
    YearlyGoal,
} from '../types';

// ============================================
// 스토어 버전 (마이그레이션용)
// ============================================
const STORE_VERSION = 2;

// ============================================
// 스토어 상태 인터페이스
// ============================================

interface StoreState {
    // 정규화된 엔티티 저장소
    ideas: Record<string, ProjectIdea>;
    analyses: Record<string, IdeaAnalysis>;
    projects: Record<string, NormalizedProjectScheme>;
    months: Record<string, NormalizedMonthlyGoal>;
    weeks: Record<string, NormalizedWeeklyMilestone>;
    tasks: Record<string, UnifiedTask>;

    // 앱 메타 상태
    activeProjectId: string | null;
    currentView: AppView;
    selectedMonthIndex: number;

    // 버전
    version: number;

    // 레거시 호환 (마이그레이션 완료 전까지)
    legacyProjects: ProjectScheme[];
    legacyIdeas: ProjectIdea[];
    legacyAnalyses: IdeaAnalysis[];
    isMigrated: boolean;
}

interface StoreActions {
    // === Idea Actions ===
    addIdea: (idea: Omit<ProjectIdea, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => ProjectIdea;
    updateIdea: (id: string, updates: Partial<ProjectIdea>) => void;
    deleteIdea: (id: string) => void;
    getIdea: (id: string) => ProjectIdea | undefined;
    getAllIdeas: () => ProjectIdea[];

    // === Analysis Actions ===
    addAnalysis: (analysis: IdeaAnalysis) => void;
    getAnalysis: (ideaId: string) => IdeaAnalysis | undefined;
    setAnalyses: (analyses: IdeaAnalysis[]) => void;

    // === Project Actions ===
    createProject: (
        idea: ProjectIdea,
        analysis: IdeaAnalysis,
        plan: {
            yearlyPlan: YearlyGoal;
            monthlyPlan: MonthlyGoal[];
            weeklyPlan?: WeeklyMilestone[];
        },
        startDate: string
    ) => NormalizedProjectScheme;
    deleteProject: (id: string) => void;
    getProject: (id: string) => NormalizedProjectScheme | undefined;
    getAllProjects: () => NormalizedProjectScheme[];
    updateProject: (id: string, updates: Partial<NormalizedProjectScheme>) => void;

    // === Task Actions ===
    addTask: (weekId: string, text?: string) => UnifiedTask;
    updateTask: (taskId: string, updates: Partial<UnifiedTask>) => void;
    deleteTask: (taskId: string) => void;
    toggleTaskStatus: (taskId: string) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
    getTasksForWeek: (weekId: string) => UnifiedTask[];
    getTasksForMonth: (monthId: string) => UnifiedTask[];
    getTasksForProject: (projectId: string) => UnifiedTask[];

    // === Week Actions ===
    updateWeekTheme: (weekId: string, theme: string) => void;
    getWeek: (weekId: string) => NormalizedWeeklyMilestone | undefined;
    getWeeksForMonth: (monthId: string) => NormalizedWeeklyMilestone[];

    // === Month Actions ===
    updateMonthTheme: (monthId: string, theme: string) => void;
    getMonth: (monthId: string) => NormalizedMonthlyGoal | undefined;
    getMonthsForProject: (projectId: string) => NormalizedMonthlyGoal[];
    initializeMonthWeeks: (monthId: string) => void;

    // === Navigation Actions ===
    setActiveProject: (projectId: string | null) => void;
    setCurrentView: (view: AppView) => void;
    setSelectedMonthIndex: (index: number) => void;

    // === Vision Actions ===
    updateThreeYearVision: (projectId: string, vision: ThreeYearVision) => void;

    // === Migration & Reset ===
    migrateFromLegacy: () => void;
    reset: () => void;

    // === Computed Helpers (레거시 호환용) ===
    getActiveProject: () => ProjectScheme | null;
    getActiveMonthPlan: () => MonthlyGoal | null;
    getActiveWeeklyPlan: () => WeeklyMilestone[];
}

type Store = StoreState & StoreActions;

// ============================================
// 초기 상태
// ============================================

const initialState: StoreState = {
    ideas: {},
    analyses: {},
    projects: {},
    months: {},
    weeks: {},
    tasks: {},
    activeProjectId: null,
    currentView: AppView.LANDING,
    selectedMonthIndex: 0,
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

/**
 * 레거시 프로젝트를 정규화된 구조로 변환
 */
function normalizeProject(
    project: ProjectScheme,
    state: StoreState
): {
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

    // Idea와 Analysis 추출
    const idea: ProjectIdea = {
        ...project.selectedIdea,
        status: IdeaStatus.ACTIVE,
    };

    const analysis: IdeaAnalysis = { ...project.analysis };

    // 월별 계획 정규화
    project.monthlyPlan.forEach((month, monthIndex) => {
        const monthId = generateId();
        monthIds.push(monthId);

        const weekIds: string[] = [];

        // 주간 계획 정규화
        if (month.detailedPlan) {
            month.detailedPlan.forEach((week) => {
                const weekId = generateId();
                weekIds.push(weekId);

                const taskIds: string[] = [];

                // 태스크 정규화
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

/**
 * 정규화된 프로젝트를 레거시 형태로 역변환 (호환성용)
 */
function denormalizeProject(
    project: NormalizedProjectScheme,
    state: StoreState
): ProjectScheme | null {
    const idea = state.ideas[project.ideaId];
    const analysis = state.analyses[project.analysisId];

    if (!idea || !analysis) return null;

    const monthlyPlan: MonthlyGoal[] = project.monthIds.map((monthId) => {
        const month = state.months[monthId];
        if (!month) return null;

        const detailedPlan: WeeklyMilestone[] = month.weekIds.map((weekId) => {
            const week = state.weeks[weekId];
            if (!week) return null;

            const tasks: MilestoneTask[] = week.taskIds.map((taskId) => {
                const task = state.tasks[taskId];
                if (!task) return null;
                return {
                    id: task.id,
                    text: task.text,
                    isCompleted: task.isCompleted,
                    priority: task.priority,
                    status: task.status,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                };
            }).filter(Boolean) as MilestoneTask[];

            return {
                weekNumber: week.weekNumber,
                theme: week.theme,
                tasks,
            };
        }).filter(Boolean) as WeeklyMilestone[];

        return {
            id: month.id,
            month: month.month,
            theme: month.theme,
            goals: month.goals,
            detailedPlan,
            createdAt: month.createdAt,
            updatedAt: month.updatedAt,
        };
    }).filter(Boolean) as MonthlyGoal[];

    return {
        id: project.id,
        selectedIdea: idea,
        analysis,
        yearlyPlan: project.yearlyPlan,
        monthlyPlan,
        threeYearVision: project.threeYearVision,
        startDate: project.startDate,
        status: project.status,
        settings: project.settings,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };
}

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

                set((state) => ({
                    ideas: { ...state.ideas, [id]: idea },
                }));

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
                const analyses = get().analyses;
                return Object.values(analyses).find((a) => a.ideaId === ideaId);
            },

            setAnalyses: (analysisList) => {
                const analyses: Record<string, IdeaAnalysis> = {};
                analysisList.forEach((a) => {
                    analyses[a.id] = a;
                });
                set({ analyses });
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

                    // 첫 번째 월에 주간 계획 주입
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
                    status: ProjectStatus.PLANNED,
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
                    // 프로젝트 삭제
                    const { [id]: deletedProject, ...restProjects } = state.projects;

                    // 관련 월, 주, 태스크 삭제
                    const monthsToDelete = project.monthIds;
                    const weeksToDelete: string[] = [];
                    const tasksToDelete: string[] = [];

                    monthsToDelete.forEach((monthId) => {
                        const month = state.months[monthId];
                        if (month) {
                            weeksToDelete.push(...month.weekIds);
                        }
                    });

                    weeksToDelete.forEach((weekId) => {
                        const week = state.weeks[weekId];
                        if (week) {
                            tasksToDelete.push(...week.taskIds);
                        }
                    });

                    const newMonths = { ...state.months };
                    monthsToDelete.forEach((id) => delete newMonths[id]);

                    const newWeeks = { ...state.weeks };
                    weeksToDelete.forEach((id) => delete newWeeks[id]);

                    const newTasks = { ...state.tasks };
                    tasksToDelete.forEach((id) => delete newTasks[id]);

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
                    monthIndex: 0, // Will be calculated
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

                    // 주에서 taskId 제거
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

            getWeek: (weekId) => get().weeks[weekId],

            getWeeksForMonth: (monthId) => {
                const month = get().months[monthId];
                if (!month) return [];
                return month.weekIds.map((id) => get().weeks[id]).filter(Boolean);
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

            // ========== Vision Actions ==========

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

            // ========== Migration ==========

            migrateFromLegacy: () => {
                const state = get();
                if (state.isMigrated) return;

                // localStorage에서 레거시 데이터 로드
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

                    // 레거시 아이디어 변환
                    legacyIdeas.forEach((idea) => {
                        ideas[idea.id] = idea;
                    });

                    // 레거시 분석 변환
                    legacyAnalyses.forEach((analysis) => {
                        analyses[analysis.id] = analysis;
                    });

                    // 레거시 프로젝트 정규화
                    legacyProjects.forEach((project) => {
                        const result = normalizeProject(project, state);

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

                return denormalizeProject(project, state);
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
            storage: createJSONStorage(() => localStorage),
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
