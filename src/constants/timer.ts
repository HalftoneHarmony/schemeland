/**
 * @file constants/timer.ts
 * 타이머 관련 상수
 */

// ============================================
// 포모도로 타이머 설정
// ============================================

/**
 * 타이머 지속 시간 (초)
 */
export const TIMER_DURATIONS = {
    /** 집중 세션 (25분) */
    FOCUS: 25 * 60,
    /** 짧은 휴식 (5분) */
    SHORT_BREAK: 5 * 60,
    /** 긴 휴식 (20분) */
    LONG_BREAK: 20 * 60,
} as const;

/**
 * 한 세트당 포모도로 횟수
 */
export const POMODOROS_PER_SET = 4;

/**
 * 타이머 모드
 */
export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

/**
 * 타이머 모드 레이블
 */
export const TIMER_MODE_LABELS: Record<TimerMode, string> = {
    FOCUS: '집중',
    SHORT_BREAK: '짧은 휴식',
    LONG_BREAK: '긴 휴식',
};

/**
 * 타이머 모드 색상
 */
export const TIMER_MODE_COLORS: Record<TimerMode, string> = {
    FOCUS: 'bg-cyber-pink',
    SHORT_BREAK: 'bg-emerald-500',
    LONG_BREAK: 'bg-blue-500',
};
