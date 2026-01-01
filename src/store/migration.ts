/**
 * @file store/migration.ts
 * 데이터 마이그레이션 유틸리티
 * 
 * 레거시 데이터 구조를 새로운 정규화된 구조로 안전하게 변환합니다.
 */

import {
    ProjectScheme,
    ProjectIdea,
    IdeaAnalysis,
    NormalizedProjectScheme,
    NormalizedMonthlyGoal,
    NormalizedWeeklyMilestone,
    UnifiedTask,
    TaskStatus,
    Priority,
    IdeaStatus,
    ProjectStatus,
} from '../types';

// ============================================
// 버전 상수
// ============================================

export const CURRENT_VERSION = 2;

export const VERSION_HISTORY = {
    1: '초기 버전 - 중첩된 배열 구조',
    2: '정규화된 구조 - Record 기반 O(1) 접근',
};

// ============================================
// 마이그레이션 결과 타입
// ============================================

export interface MigrationResult {
    success: boolean;
    version: number;
    message: string;
    data?: {
        ideas: Record<string, ProjectIdea>;
        analyses: Record<string, IdeaAnalysis>;
        projects: Record<string, NormalizedProjectScheme>;
        months: Record<string, NormalizedMonthlyGoal>;
        weeks: Record<string, NormalizedWeeklyMilestone>;
        tasks: Record<string, UnifiedTask>;
    };
    errors?: string[];
}

// ============================================
// 헬퍼 함수
// ============================================

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ============================================
// 레거시 데이터 검증
// ============================================

export function validateLegacyData(data: unknown): data is ProjectScheme[] {
    if (!Array.isArray(data)) return false;

    return data.every((item) => {
        if (typeof item !== 'object' || item === null) return false;

        const project = item as Record<string, unknown>;

        return (
            typeof project.id === 'string' &&
            typeof project.selectedIdea === 'object' &&
            typeof project.analysis === 'object' &&
            Array.isArray(project.monthlyPlan)
        );
    });
}

// ============================================
// 단일 프로젝트 변환
// ============================================

export function migrateProject(project: ProjectScheme): {
    project: NormalizedProjectScheme;
    idea: ProjectIdea;
    analysis: IdeaAnalysis;
    months: NormalizedMonthlyGoal[];
    weeks: NormalizedWeeklyMilestone[];
    tasks: UnifiedTask[];
} {
    const timestamp = now();
    const months: NormalizedMonthlyGoal[] = [];
    const weeks: NormalizedWeeklyMilestone[] = [];
    const tasks: UnifiedTask[] = [];
    const monthIds: string[] = [];

    // 아이디어 추출
    const idea: ProjectIdea = {
        ...project.selectedIdea,
        status: IdeaStatus.ACTIVE,
        updatedAt: timestamp,
    };

    // 분석 추출
    const analysis: IdeaAnalysis = {
        ...project.analysis,
        updatedAt: timestamp,
    };

    // 월별 계획 변환
    project.monthlyPlan.forEach((month, monthIndex) => {
        const monthId = month.id || generateId();
        monthIds.push(monthId);

        const weekIds: string[] = [];

        // 주간 계획 변환
        (month.detailedPlan || []).forEach((week) => {
            const weekId = generateId();
            weekIds.push(weekId);

            const taskIds: string[] = [];

            // 태스크 변환
            week.tasks.forEach((task) => {
                const taskId = task.id || generateId();
                taskIds.push(taskId);

                tasks.push({
                    id: taskId,
                    text: task.text,
                    status: task.status || (task.isCompleted ? TaskStatus.DONE : TaskStatus.TODO),
                    priority: task.priority || Priority.MEDIUM,
                    isCompleted: task.isCompleted,
                    projectId: project.id,
                    monthIndex,
                    weekNumber: week.weekNumber,
                    createdAt: task.createdAt || timestamp,
                    updatedAt: task.updatedAt || timestamp,
                });
            });

            weeks.push({
                id: weekId,
                weekNumber: week.weekNumber,
                theme: week.theme,
                taskIds,
                monthId,
                projectId: project.id,
                createdAt: timestamp,
                updatedAt: timestamp,
            });
        });

        months.push({
            id: monthId,
            month: month.month,
            theme: month.theme,
            goals: month.goals || [],
            weekIds,
            projectId: project.id,
            createdAt: month.createdAt || timestamp,
            updatedAt: month.updatedAt || timestamp,
        });
    });

    // 정규화된 프로젝트 생성
    const normalizedProject: NormalizedProjectScheme = {
        id: project.id,
        ideaId: idea.id,
        analysisId: analysis.id,
        yearlyPlan: project.yearlyPlan,
        monthIds,
        threeYearVision: project.threeYearVision,
        startDate: project.startDate,
        status: project.status || ProjectStatus.PLANNED,
        settings: project.settings,
        createdAt: project.createdAt,
        updatedAt: timestamp,
    };

    return {
        project: normalizedProject,
        idea,
        analysis,
        months,
        weeks,
        tasks,
    };
}

// ============================================
// 전체 마이그레이션
// ============================================

export function migrateAllProjects(legacyProjects: ProjectScheme[]): MigrationResult {
    const errors: string[] = [];

    const ideas: Record<string, ProjectIdea> = {};
    const analyses: Record<string, IdeaAnalysis> = {};
    const projects: Record<string, NormalizedProjectScheme> = {};
    const months: Record<string, NormalizedMonthlyGoal> = {};
    const weeks: Record<string, NormalizedWeeklyMilestone> = {};
    const tasks: Record<string, UnifiedTask> = {};

    legacyProjects.forEach((legacyProject, index) => {
        try {
            const result = migrateProject(legacyProject);

            // 결과를 Record에 추가
            ideas[result.idea.id] = result.idea;
            analyses[result.analysis.id] = result.analysis;
            projects[result.project.id] = result.project;

            result.months.forEach((m) => { months[m.id] = m; });
            result.weeks.forEach((w) => { weeks[w.id] = w; });
            result.tasks.forEach((t) => { tasks[t.id] = t; });

        } catch (error) {
            errors.push(`프로젝트 ${index + 1} (${legacyProject.id}) 변환 실패: ${error}`);
        }
    });

    if (errors.length > 0 && Object.keys(projects).length === 0) {
        return {
            success: false,
            version: CURRENT_VERSION,
            message: '마이그레이션 실패',
            errors,
        };
    }

    return {
        success: true,
        version: CURRENT_VERSION,
        message: errors.length > 0
            ? `${Object.keys(projects).length}개 프로젝트 마이그레이션 완료 (${errors.length}개 오류)`
            : `${Object.keys(projects).length}개 프로젝트 마이그레이션 완료`,
        data: { ideas, analyses, projects, months, weeks, tasks },
        errors: errors.length > 0 ? errors : undefined,
    };
}

// ============================================
// localStorage에서 마이그레이션 실행
// ============================================

export function migrateFromLocalStorage(): MigrationResult {
    try {
        const projectsStr = localStorage.getItem('schemeland_projects');

        if (!projectsStr) {
            return {
                success: true,
                version: CURRENT_VERSION,
                message: '마이그레이션할 레거시 데이터 없음',
                data: {
                    ideas: {},
                    analyses: {},
                    projects: {},
                    months: {},
                    weeks: {},
                    tasks: {},
                },
            };
        }

        const legacyProjects = JSON.parse(projectsStr);

        if (!validateLegacyData(legacyProjects)) {
            return {
                success: false,
                version: CURRENT_VERSION,
                message: '레거시 데이터 형식이 올바르지 않습니다',
                errors: ['데이터 검증 실패'],
            };
        }

        // 아이디어와 분석도 마이그레이션
        const ideasStr = localStorage.getItem('schemeland_ideas');
        const analysesStr = localStorage.getItem('schemeland_analyses');

        const result = migrateAllProjects(legacyProjects);

        // 독립적인 아이디어도 추가 (프로젝트에 포함되지 않은 것들)
        if (ideasStr && result.data) {
            try {
                const legacyIdeas: ProjectIdea[] = JSON.parse(ideasStr);
                legacyIdeas.forEach((idea) => {
                    if (!result.data!.ideas[idea.id]) {
                        result.data!.ideas[idea.id] = idea;
                    }
                });
            } catch {
                // 무시
            }
        }

        // 독립적인 분석도 추가
        if (analysesStr && result.data) {
            try {
                const legacyAnalyses: IdeaAnalysis[] = JSON.parse(analysesStr);
                legacyAnalyses.forEach((analysis) => {
                    if (!result.data!.analyses[analysis.id]) {
                        result.data!.analyses[analysis.id] = analysis;
                    }
                });
            } catch {
                // 무시
            }
        }

        return result;

    } catch (error) {
        return {
            success: false,
            version: CURRENT_VERSION,
            message: '마이그레이션 중 오류 발생',
            errors: [String(error)],
        };
    }
}

// ============================================
// 역변환 (정규화 → 레거시)
// ============================================

export function denormalizeToLegacy(
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

    const monthlyPlan = project.monthIds.map((monthId) => {
        const month = months[monthId];
        if (!month) return null;

        const detailedPlan = month.weekIds.map((weekId) => {
            const week = weeks[weekId];
            if (!week) return null;

            const weekTasks = week.taskIds
                .map((taskId) => tasks[taskId])
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
                tasks: weekTasks,
            };
        }).filter(Boolean);

        return {
            id: month.id,
            month: month.month,
            theme: month.theme,
            goals: month.goals,
            detailedPlan,
            createdAt: month.createdAt,
            updatedAt: month.updatedAt,
        };
    }).filter(Boolean);

    return {
        id: project.id,
        selectedIdea: idea,
        analysis,
        yearlyPlan: project.yearlyPlan,
        monthlyPlan: monthlyPlan as any,
        threeYearVision: project.threeYearVision,
        startDate: project.startDate,
        status: project.status,
        settings: project.settings,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };
}

// ============================================
// 마이그레이션 상태 확인
// ============================================

export function checkMigrationNeeded(): boolean {
    const storeStr = localStorage.getItem('schemeland-store');

    if (storeStr) {
        try {
            const store = JSON.parse(storeStr);
            if (store.state?.isMigrated === true) {
                return false;
            }
        } catch {
            // 파싱 실패 시 마이그레이션 필요
        }
    }

    // 레거시 데이터 존재 여부 확인
    const hasLegacy = localStorage.getItem('schemeland_projects') !== null;
    return hasLegacy;
}

// ============================================
// 레거시 데이터 정리 (마이그레이션 후)
// ============================================

export function cleanupLegacyData(): void {
    const keysToRemove = [
        'schemeland_projects',
        'schemeland_ideas',
        'schemeland_analyses',
        'schemeland_view',
        'schemeland_active_id',
        'schemeland_start_date',
    ];

    keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
    });

    console.log('✅ Legacy data cleaned up');
}
