/**
 * @file store/slices/ideaSlice.ts
 * 아이디어 관련 상태 및 액션 슬라이스
 */

import { StateCreator } from 'zustand';
import { ProjectIdea, IdeaStatus } from '../../types';

// ============================================
// 상태 인터페이스
// ============================================

export interface IdeaState {
    ideas: Record<string, ProjectIdea>;
}

export interface IdeaActions {
    addIdea: (idea: Omit<ProjectIdea, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => ProjectIdea;
    updateIdea: (id: string, updates: Partial<ProjectIdea>) => void;
    deleteIdea: (id: string) => void;
    getIdea: (id: string) => ProjectIdea | undefined;
    getAllIdeas: () => ProjectIdea[];
}

export type IdeaSlice = IdeaState & IdeaActions;

// ============================================
// 헬퍼 함수
// ============================================

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ============================================
// 초기 상태
// ============================================

export const initialIdeaState: IdeaState = {
    ideas: {},
};

// ============================================
// 슬라이스 생성자
// ============================================

export const createIdeaSlice: StateCreator<
    IdeaSlice,
    [],
    [],
    IdeaSlice
> = (set, get) => ({
    ...initialIdeaState,

    addIdea: (ideaData) => {
        const id = generateId();
        const timestamp = now();
        const idea: ProjectIdea = {
            ...ideaData,
            id,
            status: IdeaStatus.PENDING,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        set((state) => ({
            ideas: { ...state.ideas, [id]: idea },
        }));

        return idea;
    },

    updateIdea: (id, updates) => {
        set((state) => ({
            ideas: {
                ...state.ideas,
                [id]: { ...state.ideas[id], ...updates, updatedAt: now() },
            },
        }));
    },

    deleteIdea: (id) => {
        set((state) => {
            const { [id]: deleted, ...rest } = state.ideas;
            return { ideas: rest };
        });
    },

    getIdea: (id) => get().ideas[id],

    getAllIdeas: () => Object.values(get().ideas),
});
