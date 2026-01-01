/**
 * @file constants/index.ts
 * 상수 통합 내보내기
 */

export {
    INITIAL_IDEA,
    createInitialIdea,
    createInitialIdeas,
    APP_NAME,
    APP_VERSION,
    APP_DESCRIPTION,
    STORAGE_KEYS,
    SIDEBAR_WIDTH,
    MAX_IDEAS_COUNT,
    MIN_IDEAS_COUNT,
    API_RETRY_COUNT,
    API_TIMEOUT_MS,
} from './app';

export {
    TIMER_DURATIONS,
    POMODOROS_PER_SET,
    TIMER_MODE_LABELS,
    TIMER_MODE_COLORS,
    type TimerMode,
} from './timer';
