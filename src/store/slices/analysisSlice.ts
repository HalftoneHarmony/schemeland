/**
 * @file store/slices/analysisSlice.ts
 * AI 분석 관련 상태 및 액션 슬라이스
 */

import { StateCreator } from 'zustand';
import { IdeaAnalysis } from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface AnalysisState {
    analyses: Record<string, IdeaAnalysis>;
}

export interface AnalysisActions {
    addAnalysis: (analysis: IdeaAnalysis) => void;
    getAnalysis: (ideaId: string) => IdeaAnalysis | undefined;
    setAnalyses: (analyses: IdeaAnalysis[]) => void;
    deleteAnalysis: (id: string) => void;
}

export type AnalysisSlice = AnalysisState & AnalysisActions;

// ============================================
// 초기 상태
// ============================================

export const initialAnalysisState: AnalysisState = {
    analyses: {},
};

// ============================================
// 슬라이스 생성자
// ============================================

export const createAnalysisSlice: StateCreator<
    AnalysisSlice,
    [],
    [],
    AnalysisSlice
> = (set, get) => ({
    ...initialAnalysisState,

    addAnalysis: (analysis) => {
        set((state) => ({
            analyses: { ...state.analyses, [analysis.id]: analysis },
        }));
    },

    getAnalysis: (ideaId) => {
        const analyses = get().analyses;
        return Object.values(analyses).find((a) => a.ideaId === ideaId);
    },

    setAnalyses: (analysisList) => {
        const analyses: Record<string, IdeaAnalysis> = {};
        analysisList.forEach((a) => {
            analyses[a.id] = a;
        });
        set({ analyses });
    },

    deleteAnalysis: (id) => {
        set((state) => {
            const { [id]: deleted, ...rest } = state.analyses;
            return { analyses: rest };
        });
    },
});
