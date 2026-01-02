/**
 * @file components/dashboard/constants.ts
 * 대시보드 공통 상수 및 애니메이션 variants
 * 
 * 여러 컴포넌트에서 중복 사용되는 애니메이션과 스타일 상수를 통합 관리
 */

import { Variants } from 'framer-motion';

// ============================================
// 공통 애니메이션 Variants
// ============================================

/**
 * 컨테이너 stagger 애니메이션
 */
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

/**
 * 리스트 아이템 등장 애니메이션
 */
export const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

/**
 * 카드 등장 애니메이션 (사이버펑크 스타일)
 */
export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, skewX: -2 },
    visible: { opacity: 1, y: 0, skewX: -2 }
};

/**
 * 기본 아이템 등장 애니메이션
 */
export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

/**
 * 슬라이드 페이드 (좌우 전환용)
 */
export const slideFadeVariants: Variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
};

/**
 * 글로우 펄스 애니메이션 (강조용)
 */
export const glowPulseVariants: Variants = {
    animate: {
        boxShadow: [
            '0 0 20px rgba(255, 0, 255, 0.3)',
            '0 0 40px rgba(255, 0, 255, 0.5)',
            '0 0 20px rgba(255, 0, 255, 0.3)'
        ],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
};

/**
 * 로테이션 애니메이션 (로딩/동기화 아이콘용)
 */
export const rotateVariants: Variants = {
    animate: {
        rotate: 360,
        transition: { duration: 3, repeat: Infinity, ease: "linear" }
    }
};

/**
 * 쉬머 효과 (로딩 상태)
 */
export const shimmerVariants: Variants = {
    animate: {
        backgroundPosition: ["200% 0", "-200% 0"],
        transition: { duration: 3, repeat: Infinity, ease: "linear" }
    }
};

// ============================================
// 공통 스타일 클래스
// ============================================

/**
 * 사이버펑크 카드 기본 스타일
 */
export const cyberCardBase = "bg-zinc-900/60 backdrop-blur-sm border border-cyber-pink/20 p-6 skew-x-[-2deg] hover:border-cyber-pink/40 transition-all duration-300";

/**
 * 섹션 헤더 스타일
 */
export const sectionHeaderStyle = "font-cyber font-black text-xl text-white uppercase tracking-wider flex items-center gap-3 mb-6";

/**
 * 강조 텍스트 스타일
 */
export const accentTextStyle = "text-cyber-pink font-cyber font-black";

/**
 * 서브 텍스트 스타일  
 */
export const mutedTextStyle = "text-white/40 font-mono text-sm";

// ============================================
// 타이머 관련 상수
// ============================================

export const TIMER_DURATIONS = {
    FOCUS: 25 * 60,        // 25분
    SHORT_BREAK: 5 * 60,   // 5분
    LONG_BREAK: 15 * 60    // 15분
} as const;

export type TimerMode = keyof typeof TIMER_DURATIONS;

// ============================================
// 날짜/진행률 계산 헬퍼
// ============================================

/**
 * 시작일로부터 경과 일수 계산
 */
export function daysSince(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 현재 스프린트(월) 인덱스 계산
 */
export function getCurrentSprintIndex(startDate: string): number {
    const daysPassed = daysSince(startDate);
    return Math.floor(daysPassed / 30); // 30일 = 1 스프린트
}

/**
 * 스프린트 내 진행률 계산 (0-100)
 */
export function getSprintProgress(startDate: string): number {
    const daysPassed = daysSince(startDate);
    const daysInCurrentSprint = daysPassed % 30;
    return Math.min(100, Math.round((daysInCurrentSprint / 30) * 100));
}

/**
 * 연간 진행률 계산 (0-100)
 */
export function getYearProgress(startDate: string): number {
    const daysPassed = daysSince(startDate);
    return Math.min(100, Math.round((daysPassed / 365) * 100));
}
