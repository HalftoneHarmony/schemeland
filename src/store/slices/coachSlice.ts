/**
 * @file store/slices/coachSlice.ts
 * AI Coach 대화 기록 상태 및 액션 슬라이스
 */

import { StateCreator } from 'zustand';
import { ChatMessage } from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface CoachState {
    coachMessages: ChatMessage[];
}

export interface CoachActions {
    addCoachMessage: (message: ChatMessage) => void;
    clearCoachMessages: (coachType?: string) => void;
}


export type CoachSlice = CoachState & CoachActions;

// ============================================
// 초기 상태
// ============================================

export const initialCoachState: CoachState = {
    coachMessages: [],
};

// ============================================
// 슬라이스 생성자
// ============================================

export const createCoachSlice: StateCreator<
    CoachSlice,
    [],
    [],
    CoachSlice
> = (set) => ({
    ...initialCoachState,

    addCoachMessage: (message) => {
        set((state) => ({
            coachMessages: [...state.coachMessages, message],
        }));
    },

    clearCoachMessages: (coachType?: string) => {
        set((state) => ({
            coachMessages: coachType
                ? state.coachMessages.filter(m => m.coachType !== coachType)
                : [],
        }));
    },

});
