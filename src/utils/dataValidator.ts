/**
 * @file utils/dataValidator.ts
 * 데이터 유효성 검사 및 손상된 데이터 정리 유틸리티
 * 
 * 손상된 데이터 패턴을 감지하고 정리하는 함수들
 */

/**
 * 반복 문자열 패턴 감지 (예: "가가가가가가가가가가" - 10회 이상)
 * 연속된 동일 문자가 10개 이상이면 손상된 것으로 판단
 * 짧은 반복(8자 미만)은 사용자가 의도적으로 입력했을 수 있음
 */
export function detectRepeatingPattern(text: string): boolean {
    if (!text || text.length < 20) return false; // 20자 미만은 무시

    // 연속 반복 패턴 체크 (같은 문자 10회 이상 연속)
    const repeatingPattern = /(.)\1{9,}/;
    if (repeatingPattern.test(text)) {
        return true;
    }

    // 2-3자 패턴의 과도한 반복 (5회 이상)
    const twoCharRepeat = /(.{2,3})\1{4,}/;
    if (twoCharRepeat.test(text)) {
        return true;
    }

    return false;
}


/**
 * 문자열이 손상되었는지 종합 검사
 */
export function isCorruptedString(text: string): boolean {
    if (!text) return false;

    // 반복 패턴 감지
    if (detectRepeatingPattern(text)) {
        return true;
    }

    // 비정상적으로 긴 단일 "단어" (공백 없이 100자 이상)
    if (text.length > 100 && !text.includes(' ')) {
        return true;
    }

    return false;
}

/**
 * 손상된 텍스트를 기본값으로 대체
 */
export function sanitizeText(text: string, defaultValue: string = '데이터 복구 필요'): string {
    if (isCorruptedString(text)) {
        console.warn('📛 손상된 데이터 감지:', text.substring(0, 50) + '...');
        return defaultValue;
    }
    return text;
}

/**
 * 프로젝트 데이터 전체 스캔 및 손상 보고서 생성
 */
export interface CorruptionReport {
    isCorrupted: boolean;
    totalIssues: number;
    issues: {
        entityType: string;
        entityId: string;
        field: string;
        value: string;
    }[];
}

export function scanForCorruption(state: {
    ideas: Record<string, any>;
    projects: Record<string, any>;
    months: Record<string, any>;
    weeks: Record<string, any>;
    tasks: Record<string, any>;
}): CorruptionReport {
    const issues: CorruptionReport['issues'] = [];

    // Ideas 검사
    Object.entries(state.ideas || {}).forEach(([id, idea]) => {
        if (isCorruptedString(idea.title)) {
            issues.push({ entityType: 'idea', entityId: id, field: 'title', value: idea.title });
        }
        if (isCorruptedString(idea.description)) {
            issues.push({ entityType: 'idea', entityId: id, field: 'description', value: idea.description });
        }
    });

    // Projects 검사 (yearlyPlan.vision)
    Object.entries(state.projects || {}).forEach(([id, project]) => {
        if (project.yearlyPlan && isCorruptedString(project.yearlyPlan.vision)) {
            issues.push({ entityType: 'project', entityId: id, field: 'yearlyPlan.vision', value: project.yearlyPlan.vision });
        }
    });

    // Months 검사
    Object.entries(state.months || {}).forEach(([id, month]) => {
        if (isCorruptedString(month.theme)) {
            issues.push({ entityType: 'month', entityId: id, field: 'theme', value: month.theme });
        }
        (month.goals || []).forEach((goal: string, index: number) => {
            if (isCorruptedString(goal)) {
                issues.push({ entityType: 'month', entityId: id, field: `goals[${index}]`, value: goal });
            }
        });
    });

    // Weeks 검사
    Object.entries(state.weeks || {}).forEach(([id, week]) => {
        if (isCorruptedString(week.theme)) {
            issues.push({ entityType: 'week', entityId: id, field: 'theme', value: week.theme });
        }
    });

    // Tasks 검사
    Object.entries(state.tasks || {}).forEach(([id, task]) => {
        if (isCorruptedString(task.text)) {
            issues.push({ entityType: 'task', entityId: id, field: 'text', value: task.text });
        }
    });

    return {
        isCorrupted: issues.length > 0,
        totalIssues: issues.length,
        issues
    };
}

/**
 * 손상된 데이터 자동 수정
 */
export function repairCorruptedData(state: {
    ideas: Record<string, any>;
    projects: Record<string, any>;
    months: Record<string, any>;
    weeks: Record<string, any>;
    tasks: Record<string, any>;
}): {
    ideas: Record<string, any>;
    projects: Record<string, any>;
    months: Record<string, any>;
    weeks: Record<string, any>;
    tasks: Record<string, any>;
    repairCount: number;
} {
    let repairCount = 0;

    const repairedIdeas = { ...state.ideas };
    Object.entries(repairedIdeas).forEach(([id, idea]) => {
        if (isCorruptedString(idea.title)) {
            repairedIdeas[id] = { ...idea, title: '📛 복구된 아이디어' };
            repairCount++;
        }
        if (isCorruptedString(idea.description)) {
            repairedIdeas[id] = { ...repairedIdeas[id], description: '설명 데이터가 손상되어 복구되었습니다.' };
            repairCount++;
        }
    });

    const repairedProjects = { ...state.projects };
    Object.entries(repairedProjects).forEach(([id, project]) => {
        if (project.yearlyPlan && isCorruptedString(project.yearlyPlan.vision)) {
            repairedProjects[id] = {
                ...project,
                yearlyPlan: { ...project.yearlyPlan, vision: '비전을 다시 설정해주세요.' }
            };
            repairCount++;
        }
    });

    const repairedMonths = { ...state.months };
    Object.entries(repairedMonths).forEach(([id, month]) => {
        let needsUpdate = false;
        const updatedMonth = { ...month };

        if (isCorruptedString(month.theme)) {
            updatedMonth.theme = `Sprint ${month.month || '?'} 목표`;
            needsUpdate = true;
            repairCount++;
        }

        if (month.goals) {
            const repairedGoals = month.goals.map((goal: string, index: number) => {
                if (isCorruptedString(goal)) {
                    repairCount++;
                    return `목표 ${index + 1} (복구됨)`;
                }
                return goal;
            });
            if (JSON.stringify(repairedGoals) !== JSON.stringify(month.goals)) {
                updatedMonth.goals = repairedGoals;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            repairedMonths[id] = updatedMonth;
        }
    });

    const repairedWeeks = { ...state.weeks };
    Object.entries(repairedWeeks).forEach(([id, week]) => {
        if (isCorruptedString(week.theme)) {
            repairedWeeks[id] = { ...week, theme: `Week ${week.weekNumber || '?'} (복구됨)` };
            repairCount++;
        }
    });

    const repairedTasks = { ...state.tasks };
    Object.entries(repairedTasks).forEach(([id, task]) => {
        if (isCorruptedString(task.text)) {
            repairedTasks[id] = { ...task, text: '📛 복구된 태스크' };
            repairCount++;
        }
    });

    return {
        ideas: repairedIdeas,
        projects: repairedProjects,
        months: repairedMonths,
        weeks: repairedWeeks,
        tasks: repairedTasks,
        repairCount
    };
}
