import { ValidationResult, ProjectIdea } from '../types';

/**
 * 프로젝트 아이디어 입력값 유효성 검사
 */
export const validateIdea = (idea: Partial<ProjectIdea>): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!idea.title || idea.title.trim().length === 0) {
        errors.title = "프로젝트의 이름을 입력해주세요! 멋진 이름은 시작의 절반입니다. ✨";
    } else if (idea.title.length < 2) {
        errors.title = "이름이 너무 짧아요. 최소 2글자 이상 입력해주세요.";
    }

    if (!idea.description || idea.description.trim().length === 0) {
        errors.description = "어떤 프로젝트인지 조금만 더 설명해주세요. 그래야 AI가 잘 분석할 수 있어요! ✍️";
    } else if (idea.description.length < 10) {
        errors.description = "설명이 조금 부족해요. 10자 이상 구체적으로 적어볼까요?";
    }

    const isValid = Object.keys(errors).length === 0;
    return {
        isValid,
        message: isValid ? undefined : "입력하신 정보에 수정이 필요해요.",
        errors
    };
};

/**
 * 날짜 유효성 검사
 * @param dateStr ISO 8601 또는 date string
 */
export const validateStartDate = (dateStr: string): ValidationResult => {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        return {
            isValid: false,
            message: "날짜 형식이 올바르지 않아요. 정확한 날짜를 선택해주세요! 📅"
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    // 과거 날짜는 경고 (선택 사항이지만 여기서는 허용하되 메시지만 줄 수도 있음)
    // 여기서는 미래 계획을 짜는 앱이므로 당일부터 가능하도록 함
    if (selectedDate < today) {
        return {
            isValid: false,
            message: "시작일은 오늘 이후여야 더 힘차게 시작할 수 있어요! 💪"
        };
    }

    return { isValid: true };
};

/**
 * 여러 아이디어 중 유효한 것만 필터링하거나 전체 유효성 검사
 */
export const validateAllIdeas = (ideas: ProjectIdea[]): ValidationResult => {
    const validIdeas = ideas.filter(i => i.title.trim() && i.description.trim() && i.title.length >= 2 && i.description.length >= 10);

    if (validIdeas.length === 0) {
        return {
            isValid: false,
            message: "최소한 하나의 구체적인 아이디어(이름 2자, 설명 10자 이상)를 입력해야 분석을 시작할 수 있어요! 🔍"
        };
    }

    return { isValid: true };
};

/**
 * 프로젝트 비전 유효성 검사
 */
export const validateVision = (vision: any): ValidationResult => {
    if (!vision) return { isValid: false, message: "비전 데이터가 없어요." };

    const errors: Record<string, string> = {};

    const checkYear = (yearData: any, label: string) => {
        if (!yearData || !yearData.vision || yearData.vision.trim().length < 5) {
            errors[label] = `${label} 핵심 지침을 5자 이상 입력해주세요.`;
        }
        if (!yearData.keyResults || yearData.keyResults.some((kr: string) => kr.trim().length < 2)) {
            errors[`${label}_kr`] = `${label} 마일스톤을 모두 채워주세요.`;
        }
    };

    checkYear(vision.year1, "1년차");
    checkYear(vision.year2, "2년차");
    checkYear(vision.year3, "3년차");

    if (!vision.ultimateGoal || vision.ultimateGoal.trim().length < 5) {
        errors.ultimateGoal = "최종적인 북극성 같은 목표(Ultimate Goal)를 설정해주세요.";
    }

    const isValid = Object.keys(errors).length === 0;
    return {
        isValid,
        message: isValid ? undefined : "비전을 저장하려면 모든 항목을 정성을 담아 채워주세요! 🎯",
        errors
    };
};
