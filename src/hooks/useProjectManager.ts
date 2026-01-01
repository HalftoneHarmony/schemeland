/**
 * @file hooks/useProjectManager.ts
 * 프로젝트 관리 훅 (Zustand Store 브릿지)
 * 
 * 기존 컴포넌트와의 호환성을 유지하면서
 * 새로운 Zustand 스토어를 사용합니다.
 * 
 * @deprecated 향후 직접 useStore 사용 권장
 */

import { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import {
    ProjectIdea,
    IdeaAnalysis,
    ProjectScheme,
    IdeaStatus,
    ProjectStatus,
    MonthlyGoal,
    WeeklyMilestone,
    YearlyGoal,
} from '../types';

/**
 * 레거시 호환 프로젝트 관리 훅
 * 
 * 기존 배열 기반 인터페이스를 유지하면서
 * 내부적으로 정규화된 스토어를 사용합니다.
 */
export const useProjectManager = (initialIdeas: ProjectIdea[] = []) => {
    // Zustand 스토어 연결
    const store = useStore();

    // ========== Ideas ==========

    const ideas = useMemo(() => {
        const storeIdeas = Object.values(store.ideas);

        // 초기 아이디어가 있고 스토어가 비어있으면 초기화
        if (storeIdeas.length === 0 && initialIdeas.length > 0) {
            return initialIdeas;
        }

        return storeIdeas;
    }, [store.ideas, initialIdeas]);

    const setIdeas = useCallback((newIdeas: ProjectIdea[] | ((prev: ProjectIdea[]) => ProjectIdea[])) => {
        const resolvedIdeas = typeof newIdeas === 'function'
            ? newIdeas(Object.values(store.ideas))
            : newIdeas;

        // 기존 아이디어 모두 삭제 후 새로 추가
        const currentIds = Object.keys(store.ideas);
        currentIds.forEach((id) => store.deleteIdea(id));

        resolvedIdeas.forEach((idea) => {
            if (store.ideas[idea.id]) {
                store.updateIdea(idea.id, idea);
            } else {
                // 기존 ID 유지하며 추가
                useStore.setState((state) => ({
                    ideas: { ...state.ideas, [idea.id]: idea },
                }));
            }
        });
    }, [store]);

    const addIdea = useCallback((ideaData: Omit<ProjectIdea, keyof import('../types').BaseEntity | 'status'>) => {
        return store.addIdea(ideaData);
    }, [store]);

    const updateIdea = useCallback((id: string, updates: Partial<ProjectIdea>) => {
        store.updateIdea(id, updates);
    }, [store]);

    const deleteIdea = useCallback((id: string) => {
        store.deleteIdea(id);
    }, [store]);

    // ========== Analyses ==========

    const analyses = useMemo(() => Object.values(store.analyses), [store.analyses]);

    const setAnalyses = useCallback((newAnalyses: IdeaAnalysis[] | ((prev: IdeaAnalysis[]) => IdeaAnalysis[])) => {
        const resolvedAnalyses = typeof newAnalyses === 'function'
            ? newAnalyses(Object.values(store.analyses))
            : newAnalyses;

        store.setAnalyses(resolvedAnalyses);
    }, [store]);

    // ========== Projects ==========

    const projects = useMemo(() => {
        // 정규화된 프로젝트를 레거시 형식으로 역변환
        return Object.values(store.projects)
            .map((project) => {
                const idea = store.ideas[project.ideaId];
                const analysis = store.analyses[project.analysisId];

                if (!idea || !analysis) return null;

                // 월별 계획 역변환
                const monthlyPlan: MonthlyGoal[] = project.monthIds.map((monthId) => {
                    const month = store.months[monthId];
                    if (!month) return null;

                    // 주간 계획 역변환
                    const detailedPlan: WeeklyMilestone[] = month.weekIds.map((weekId) => {
                        const week = store.weeks[weekId];
                        if (!week) return null;

                        // 태스크 역변환
                        const tasks = week.taskIds
                            .map((taskId) => store.tasks[taskId])
                            .filter(Boolean)
                            .map((task) => ({
                                id: task.id,
                                text: task.text,
                                isCompleted: task.isCompleted,
                                priority: task.priority,
                                status: task.status,
                                createdAt: task.createdAt,
                                updatedAt: task.updatedAt,
                            }));

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
                } as ProjectScheme;
            })
            .filter(Boolean) as ProjectScheme[];
    }, [store.projects, store.ideas, store.analyses, store.months, store.weeks, store.tasks]);

    const setProjects = useCallback((newProjects: ProjectScheme[] | ((prev: ProjectScheme[]) => ProjectScheme[])) => {
        // 이 함수는 복잡한 업데이트를 위해 유지되지만,
        // 실제로는 개별 업데이트 함수 사용 권장
        console.warn('[useProjectManager] setProjects는 deprecated입니다. 개별 업데이트 함수를 사용하세요.');

        const resolvedProjects = typeof newProjects === 'function'
            ? newProjects(projects)
            : newProjects;

        // 각 프로젝트를 스토어에 동기화
        resolvedProjects.forEach((project) => {
            const existingProject = store.projects[project.id];

            if (existingProject) {
                // 기존 프로젝트 업데이트
                store.updateProject(project.id, {
                    yearlyPlan: project.yearlyPlan,
                    threeYearVision: project.threeYearVision,
                    startDate: project.startDate,
                    status: project.status,
                    settings: project.settings,
                });

                // 태스크 업데이트는 복잡하므로 별도 처리
                project.monthlyPlan.forEach((month, monthIndex) => {
                    const monthId = existingProject.monthIds[monthIndex];
                    if (!monthId) return;

                    const existingMonth = store.months[monthId];
                    if (!existingMonth) return;

                    // 주간 계획 업데이트
                    (month.detailedPlan || []).forEach((week, weekIdx) => {
                        const weekId = existingMonth.weekIds[weekIdx];
                        if (!weekId) return;

                        const existingWeek = store.weeks[weekId];
                        if (!existingWeek) return;

                        // 주 테마 업데이트
                        if (week.theme !== existingWeek.theme) {
                            store.updateWeekTheme(weekId, week.theme);
                        }

                        // 태스크 업데이트
                        week.tasks.forEach((task) => {
                            if (store.tasks[task.id]) {
                                store.updateTask(task.id, {
                                    text: task.text,
                                    isCompleted: task.isCompleted,
                                    priority: task.priority,
                                    status: task.status,
                                });
                            }
                        });
                    });
                });
            }
        });
    }, [store, projects]);

    const createProject = useCallback((
        idea: ProjectIdea,
        analysis: IdeaAnalysis,
        plan: {
            yearlyPlan: YearlyGoal;
            monthlyPlan: MonthlyGoal[];
            weeklyPlan?: WeeklyMilestone[];
        },
        startDate: string
    ) => {
        const project = store.createProject(idea, analysis, plan, startDate);

        // 레거시 형식으로 반환
        return {
            id: project.id,
            selectedIdea: { ...idea, status: IdeaStatus.ACTIVE },
            analysis,
            yearlyPlan: plan.yearlyPlan,
            monthlyPlan: plan.monthlyPlan,
            startDate,
            status: ProjectStatus.PLANNED,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        } as ProjectScheme;
    }, [store]);

    const deleteProject = useCallback((id: string) => {
        store.deleteProject(id);
    }, [store]);

    return {
        // Ideas
        ideas,
        setIdeas,
        addIdea,
        updateIdea,
        deleteIdea,

        // Analyses
        analyses,
        setAnalyses,

        // Projects
        projects,
        setProjects,
        createProject,
        deleteProject,
    };
};

export default useProjectManager;
