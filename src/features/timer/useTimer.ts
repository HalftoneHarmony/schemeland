/**
 * @file features/timer/useTimer.ts
 * 포모도로 타이머 관련 훅
 * 
 * App.tsx에서 분리된 타이머 비즈니스 로직
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================
// 상수
// ============================================

export const TIMER_DURATIONS = {
    FOCUS: 25 * 60,        // 25분
    SHORT_BREAK: 5 * 60,   // 5분
    LONG_BREAK: 20 * 60,   // 20분
} as const;

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

// ============================================
// 타이머 훅
// ============================================

export function useTimer() {
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.FOCUS);
    const [timerMode, setTimerMode] = useState<TimerMode>('FOCUS');
    const [pomodoroCount, setPomodoroCount] = useState(1);

    // 타이머 이펙트
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);

            if (timerMode === 'FOCUS') {
                // Focus session ended
                if (pomodoroCount < 4) {
                    alert(`Focus Session ${pomodoroCount} Complete! Take a short break.`);
                    setTimerMode('SHORT_BREAK');
                    setTimeLeft(TIMER_DURATIONS.SHORT_BREAK);
                } else {
                    alert("Set Complete! 4 Pomodoros finished. Take a long break.");
                    setTimerMode('LONG_BREAK');
                    setTimeLeft(TIMER_DURATIONS.LONG_BREAK);
                }
            } else {
                // Break ended
                if (timerMode === 'LONG_BREAK') {
                    alert("Long break over! Set reset. Ready for a new set?");
                    setPomodoroCount(1);
                    setTimerMode('FOCUS');
                    setTimeLeft(TIMER_DURATIONS.FOCUS);
                } else {
                    alert("Short break over! Back to work.");
                    setPomodoroCount(prev => prev + 1);
                    setTimerMode('FOCUS');
                    setTimeLeft(TIMER_DURATIONS.FOCUS);
                }
            }
        }

        return () => clearInterval(interval);
    }, [timerActive, timeLeft, timerMode, pomodoroCount]);

    // 타이머 시작/정지 토글
    const toggleTimer = useCallback(() => {
        setTimerActive(prev => !prev);
    }, []);

    // 타이머 리셋
    const resetTimer = useCallback(() => {
        setTimerActive(false);
        setTimeLeft(TIMER_DURATIONS.FOCUS);
        setTimerMode('FOCUS');
        setPomodoroCount(1);
    }, []);

    // 타이머 모드 변경
    const changeMode = useCallback((mode: TimerMode) => {
        setTimerActive(false);
        setTimerMode(mode);
        setTimeLeft(TIMER_DURATIONS[mode]);
    }, []);

    // 시간 포맷팅
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        // States
        timerActive,
        timeLeft,
        timerMode,
        pomodoroCount,

        // Setters (레거시 호환용)
        setTimerActive,
        setTimeLeft,
        setTimerMode,

        // Actions
        toggleTimer,
        resetTimer,
        changeMode,

        // Utils
        formatTime,
    };
}
