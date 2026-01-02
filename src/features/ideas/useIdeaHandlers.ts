/**
 * @file features/ideas/useIdeaHandlers.ts
 * 아이디어 관련 핸들러 훅
 * 
 * Zustand Store와 직접 연동하여 아이디어 비즈니스 로직 처리
 */

import { useState, useCallback } from 'react';
import { ProjectIdea, IdeaStatus } from '../../types';
import { refineIdea, suggestIdeas } from '../../services/geminiService';
import { useStore } from '../../store';

export function useIdeaHandlers() {
    const store = useStore();
    const ideas = Object.values(store.ideas)
        .filter(idea => idea.status !== IdeaStatus.ACTIVE && idea.status !== IdeaStatus.ARCHIVED)
        .sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

    // Loading States
    const [isRefiningMap, setIsRefiningMap] = useState<Record<string, boolean>>({});
    const [isSuggesting, setIsSuggesting] = useState(false);

    // 아이디어 추가
    const handleAddIdea = useCallback(() => {
        store.addIdea({ title: '', description: '' });
    }, [store.addIdea]);

    // 아이디어 수정
    const handleUpdateIdea = useCallback((id: string, field: keyof ProjectIdea, value: string) => {
        store.updateIdea(id, { [field]: value });
    }, [store.updateIdea]);

    // 아이디어 삭제
    const handleDeleteIdea = useCallback((id: string) => {
        if (Object.keys(store.ideas).length <= 1) return;
        store.deleteIdea(id);
    }, [store.ideas, store.deleteIdea]);

    // AI 아이디어 구체화
    const handleMagicRefine = useCallback(async (id: string) => {
        const idea = store.ideas[id];
        if (!idea) return;

        const textToRefine = idea.title + (idea.description ? ` - ${idea.description}` : "");
        if (textToRefine.trim().length < 2) {
            alert("키워드나 대략적인 설명을 먼저 입력해주세요!");
            return;
        }

        setIsRefiningMap(prev => ({ ...prev, [id]: true }));
        try {
            const refined = await refineIdea(textToRefine);
            store.updateIdea(id, {
                title: refined.title,
                description: refined.description,
                emoji: refined.emoji
            });
        } catch (e) {
            alert("아이디어 구체화에 실패했습니다.");
        } finally {
            setIsRefiningMap(prev => ({ ...prev, [id]: false }));
        }
    }, [store.ideas, store.updateIdea]);

    // AI 아이디어 제안
    const handleSuggestIdeas = useCallback(async () => {
        setIsSuggesting(true);
        try {
            const suggestions = await suggestIdeas();

            // 빈 아이디어 정리 (선택사항, 스토어 로직에 따라 다름. 여기선 생략하거나 유지)
            // 기존 스토어에는 'setIdeas'가 없으므로 deleteIdea로 빈거 지우고 addIdea로 추가해야 함.
            // 하지만 UX상 빈 아이디어가 있어도 큰 문제 없음. 단순히 추가만 수행.

            suggestions.forEach(s => {
                store.addIdea({
                    title: s.title,
                    description: s.description,
                    emoji: s.emoji
                });
            });

        } catch (e) {
            alert("아이디어 제안을 가져오는데 실패했습니다.");
        } finally {
            setIsSuggesting(false);
        }
    }, [store.addIdea]);

    return {
        // Data
        ideas, // 정렬된 아이디어 목록 반환

        // States
        isRefiningMap,
        isSuggesting,

        // Handlers
        handleAddIdea,
        handleUpdateIdea,
        handleDeleteIdea,
        handleMagicRefine,
        handleSuggestIdeas,
    };
}
