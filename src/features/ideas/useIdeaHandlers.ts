/**
 * @file features/ideas/useIdeaHandlers.ts
 * 아이디어 관련 핸들러 훅
 * 
 * App.tsx에서 분리된 아이디어 관련 비즈니스 로직
 */

import { useState, useCallback } from 'react';
import { ProjectIdea, IdeaStatus } from '../../types';
import { refineIdea, suggestIdeas } from '../../services/geminiService';

interface UseIdeaHandlersProps {
    ideas: ProjectIdea[];
    setIdeas: (ideas: ProjectIdea[] | ((prev: ProjectIdea[]) => ProjectIdea[])) => void;
    addIdea: (ideaData: Omit<ProjectIdea, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => ProjectIdea;
    updateIdea: (id: string, updates: Partial<ProjectIdea>) => void;
    deleteIdea: (id: string) => void;
}

export function useIdeaHandlers({
    ideas,
    setIdeas,
    addIdea,
    updateIdea,
    deleteIdea,
}: UseIdeaHandlersProps) {
    // Loading States
    const [isRefiningMap, setIsRefiningMap] = useState<Record<string, boolean>>({});
    const [isSuggesting, setIsSuggesting] = useState(false);

    // 아이디어 추가
    const handleAddIdea = useCallback(() => {
        addIdea({ title: '', description: '' });
    }, [addIdea]);

    // 아이디어 수정
    const handleUpdateIdea = useCallback((id: string, field: keyof ProjectIdea, value: string) => {
        updateIdea(id, { [field]: value });
    }, [updateIdea]);

    // 아이디어 삭제
    const handleDeleteIdea = useCallback((id: string) => {
        if (ideas.length <= 1) return;
        deleteIdea(id);
    }, [ideas.length, deleteIdea]);

    // AI 아이디어 구체화
    const handleMagicRefine = useCallback(async (id: string) => {
        const idea = ideas.find(i => i.id === id);
        if (!idea) return;

        const textToRefine = idea.title + (idea.description ? ` - ${idea.description}` : "");
        if (textToRefine.trim().length < 2) {
            alert("키워드나 대략적인 설명을 먼저 입력해주세요!");
            return;
        }

        setIsRefiningMap(prev => ({ ...prev, [id]: true }));
        try {
            const refined = await refineIdea(textToRefine);
            setIdeas(prev => prev.map(i =>
                i.id === id
                    ? { ...i, title: refined.title, description: refined.description, emoji: refined.emoji }
                    : i
            ));
        } catch (e) {
            alert("아이디어 구체화에 실패했습니다.");
        } finally {
            setIsRefiningMap(prev => ({ ...prev, [id]: false }));
        }
    }, [ideas, setIdeas]);

    // AI 아이디어 제안
    const handleSuggestIdeas = useCallback(async () => {
        setIsSuggesting(true);
        try {
            const suggestions = await suggestIdeas();
            const now = new Date().toISOString();
            const newIdeas: ProjectIdea[] = suggestions.map(s => ({
                id: crypto.randomUUID(),
                title: s.title,
                description: s.description,
                emoji: s.emoji,
                status: IdeaStatus.PENDING,
                createdAt: now,
                updatedAt: now
            }));
            const cleanIdeas = ideas.filter(i => i.title.trim() !== '' || i.description.trim() !== '');
            setIdeas([...cleanIdeas, ...newIdeas]);
        } catch (e) {
            alert("아이디어 제안을 가져오는데 실패했습니다.");
        } finally {
            setIsSuggesting(false);
        }
    }, [ideas, setIdeas]);

    return {
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
