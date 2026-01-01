/**
 * @file store/slices/projectSlice.ts
 * 프로젝트 관련 상태 및 액션 슬라이스
 */

import { StateCreator } from 'zustand';
import {
    ProjectIdea,
    IdeaAnalysis,
    NormalizedProjectScheme,
    NormalizedMonthlyGoal,
    NormalizedWeeklyMilestone,
    UnifiedTask,
    MonthlyGoal,
    WeeklyMilestone,
    YearlyGoal,
    ThreeYearVision,
    ProjectScheme,
    MilestoneTask,
    ProjectStatus,
    IdeaStatus,
    TaskStatus,
    Priority,
} from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface ProjectState {
    projects: Record<string, NormalizedProjectScheme>;
}

export interface ProjectActions {
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
    updateThreeYearVision: (projectId: string, vision: ThreeYearVision) => void;
}

export type ProjectSlice = ProjectState & ProjectActions;

// 외부 상태 참조를 위한 의존성 타입
export interface ProjectSliceDependencies {
    ideas: Record<string, ProjectIdea>;
    analyses: Record<string, IdeaAnalysis>;
    months: Record<string, NormalizedMonthlyGoal>;
    weeks: Record<string, NormalizedWeeklyMilestone>;
    tasks: Record<string, UnifiedTask>;
    activeProjectId: string | null;
    selectedMonthIndex: number;
    // 액션들
    updateIdea: (id: string, updates: Partial<ProjectIdea>) => void;
    addAnalysis: (analysis: IdeaAnalysis) => void;
    addMonth: (month: NormalizedMonthlyGoal) => void;
    addWeek: (week: NormalizedWeeklyMilestone) => void;
    deleteMonth: (monthId: string) => void;
    deleteWeek: (weekId: string) => void;
}

// ============================================
// 헬퍼 함수
// ============================================

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ============================================
// 초기 상태
// ============================================

export const initialProjectState: ProjectState = {
    projects: {},
};

// ============================================
// 레거시 변환 헬퍼
// ============================================

/**
 * 정규화된 프로젝트를 레거시 형태로 역변환 (호환성용)
 */
export function denormalizeProject(
    project: NormalizedProjectScheme,
    ideas: Record<string, ProjectIdea>,
    analyses: Record<string, IdeaAnalysis>,
    months: Record<string, NormalizedMonthlyGoal>,
    weeks: Record<string, NormalizedWeeklyMilestone>,
    tasks: Record<string, UnifiedTask>
): ProjectScheme | null {
    const idea = ideas[project.ideaId];
    const analysis = analyses[project.analysisId];

    if (!idea || !analysis) return null;

    const monthlyPlan: MonthlyGoal[] = project.monthIds.map((monthId) => {
        const month = months[monthId];
        if (!month) return null;

        const detailedPlan: WeeklyMilestone[] = month.weekIds.map((weekId) => {
            const week = weeks[weekId];
            if (!week) return null;

            const taskList: MilestoneTask[] = week.taskIds.map((taskId) => {
                const task = tasks[taskId];
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
                tasks: taskList,
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
// 슬라이스 생성자
// ============================================

export const createProjectSlice: StateCreator<
    ProjectSlice & ProjectSliceDependencies,
    [],
    [],
    ProjectSlice
> = (set, get) => ({
    ...initialProjectState,

    createProject: (idea, analysis, plan, startDate) => {
        const projectId = generateId();
        const timestamp = now();
        const monthIds: string[] = [];

        // 아이디어 상태 업데이트
        get().updateIdea(idea.id, { status: IdeaStatus.ACTIVE });

        // 분석 추가
        get().addAnalysis(analysis);

        // 월별 계획 생성
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

                    const unifiedTask: UnifiedTask = {
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

                    set((state) => ({
                        tasks: { ...state.tasks, [taskId]: unifiedTask },
                    }));
                });

                const normalizedWeek: NormalizedWeeklyMilestone = {
                    id: weekId,
                    weekNumber: week.weekNumber,
                    theme: week.theme,
                    taskIds,
                    monthId,
                    projectId,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                };

                get().addWeek(normalizedWeek);
            });

            const normalizedMonth: NormalizedMonthlyGoal = {
                id: monthId,
                month: month.month,
                theme: month.theme,
                goals: month.goals || [],
                weekIds,
                projectId,
                createdAt: month.createdAt || timestamp,
                updatedAt: month.updatedAt || timestamp,
            };

            get().addMonth(normalizedMonth);
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
            projects: { ...state.projects, [projectId]: project },
        }));

        return project;
    },

    deleteProject: (id) => {
        const project = get().projects[id];
        if (!project) return;

        // 관련 월, 주, 태스크 삭제
        project.monthIds.forEach((monthId) => {
            const month = get().months[monthId];
            if (month) {
                month.weekIds.forEach((weekId) => {
                    const week = get().weeks[weekId];
                    if (week) {
                        // 태스크 삭제
                        week.taskIds.forEach((taskId) => {
                            set((state) => {
                                const { [taskId]: deleted, ...rest } = state.tasks;
                                return { tasks: rest };
                            });
                        });
                    }
                    get().deleteWeek(weekId);
                });
            }
            get().deleteMonth(monthId);
        });

        set((state) => {
            const { [id]: deletedProject, ...restProjects } = state.projects;
            return {
                projects: restProjects,
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
});
