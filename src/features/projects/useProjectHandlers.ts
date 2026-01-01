/**
 * @file features/projects/useProjectHandlers.ts
 * 프로젝트 관련 핸들러 훅
 * 
 * App.tsx에서 분리된 프로젝트 관련 비즈니스 로직
 */

import { useState, useCallback } from 'react';
import {
    ProjectIdea,
    IdeaAnalysis,
    ProjectScheme,
    AppView,
    IdeaStatus,
    ProjectStatus,
    WeeklyMilestone,
    MonthlyGoal,
} from '../../types';
import { analyzeIdeas, generateFullPlan } from '../../services/geminiService';
import { validateAllIdeas, validateStartDate } from '../../utils/validation';

interface UseProjectHandlersProps {
    ideas: ProjectIdea[];
    analyses: IdeaAnalysis[];
    projects: ProjectScheme[];
    setIdeas: (ideas: ProjectIdea[] | ((prev: ProjectIdea[]) => ProjectIdea[])) => void;
    setAnalyses: (analyses: IdeaAnalysis[] | ((prev: IdeaAnalysis[]) => IdeaAnalysis[])) => void;
    createProject: (
        idea: ProjectIdea,
        analysis: IdeaAnalysis,
        plan: { yearlyPlan: any; monthlyPlan: MonthlyGoal[]; weeklyPlan?: WeeklyMilestone[] },
        startDate: string
    ) => ProjectScheme;
    deleteProject: (id: string) => void;
    setActiveProjectId: (id: string | null) => void;
    setSelectedMonthIndex: (index: number) => void;
    setView: (view: AppView) => void;
    projectStartDate: string;
    setTimerActive?: (active: boolean) => void;
}

export function useProjectHandlers({
    ideas,
    analyses,
    projects,
    setIdeas,
    setAnalyses,
    createProject,
    deleteProject,
    setActiveProjectId,
    setSelectedMonthIndex,
    setView,
    projectStartDate,
    setTimerActive,
}: UseProjectHandlersProps) {
    // Loading States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    // 프로젝트 선택
    const handleSelectProject = useCallback((projectId: string) => {
        setActiveProjectId(projectId);
        setSelectedMonthIndex(0);
        setView(AppView.DASHBOARD);
    }, [setActiveProjectId, setSelectedMonthIndex, setView]);

    // 퀵 스타트 (AI 분석 없이 바로 프로젝트 생성)
    const handleQuickStart = useCallback(() => {
        const validIdeas = ideas.filter(i => i.title.trim() || i.description.trim());
        if (validIdeas.length === 0) {
            alert("프로젝트로 만들 아이디어를 입력해주세요.");
            return;
        }

        let lastProjectId: string | null = null;

        validIdeas.forEach(idea => {
            const mockAnalysis: IdeaAnalysis = {
                id: crypto.randomUUID(),
                ideaId: idea.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                metrics: {
                    feasibility: 50,
                    marketPotential: 50,
                    excitement: 50,
                    speedToMVP: 50
                },
                reasoning: "AI 분석 없이 생성된 프로젝트입니다. 직접 계획을 수립하세요.",
                oneLiner: idea.description || idea.title
            };
            setAnalyses(prev => [...prev, mockAnalysis]);

            const mockPlan = {
                yearlyPlan: {
                    vision: "나만의 비전을 수립하세요.",
                    keyResults: ["주요 목표 1", "주요 목표 2", "주요 목표 3"],
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                monthlyPlan: Array.from({ length: 12 }, (_, i) => ({
                    id: crypto.randomUUID(),
                    month: i + 1,
                    theme: `${i + 1}월 목표`,
                    goals: ["목표를 설정하세요"],
                    detailedPlan: [] as WeeklyMilestone[],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })),
                weeklyPlan: [1, 2, 3, 4].map(num => ({
                    weekNumber: num,
                    theme: `${num}주차`,
                    tasks: []
                })) as WeeklyMilestone[]
            };

            const newProject = createProject(idea, mockAnalysis, mockPlan, projectStartDate);
            lastProjectId = newProject.id;
        });

        if (lastProjectId) {
            setActiveProjectId(lastProjectId);
            setSelectedMonthIndex(0);
            setView(AppView.DASHBOARD);
        }
    }, [ideas, createProject, projectStartDate, setActiveProjectId, setSelectedMonthIndex, setView, setAnalyses]);

    // AI 분석 실행
    const handleAnalyze = useCallback(async () => {
        const validation = validateAllIdeas(ideas);
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        setIsAnalyzing(true);
        try {
            const validIdeas = ideas.filter(i => i.title.trim() && i.description.trim());
            const results = await analyzeIdeas(validIdeas);
            setAnalyses(results);
            setView(AppView.ANALYSIS);
        } catch (e) {
            alert("AI 분석 중 오류가 발생했습니다.");
        } finally {
            setIsAnalyzing(false);
        }
    }, [ideas, setAnalyses, setView]);

    // 프로젝트 확정 (AI 계획 생성)
    const handleCommit = useCallback(async (ideaId: string) => {
        const idea = ideas.find(i => i.id === ideaId);
        const analysis = analyses.find(a => a.ideaId === ideaId);
        if (!idea || !analysis) return;

        const dateValidation = validateStartDate(projectStartDate);
        if (!dateValidation.isValid) {
            alert(dateValidation.message);
            return;
        }

        setIsGeneratingPlan(true);
        try {
            const plan = await generateFullPlan(idea, analysis.reasoning);
            const newProject = createProject(idea, analysis, plan, projectStartDate);

            setActiveProjectId(newProject.id);
            setSelectedMonthIndex(0);
            setView(AppView.DASHBOARD);
        } catch (e) {
            alert("로드맵 생성에 실패했습니다.");
        } finally {
            setIsGeneratingPlan(false);
        }
    }, [ideas, analyses, projectStartDate, createProject, setActiveProjectId, setSelectedMonthIndex, setView]);

    // 프로젝트 포기
    const handleAbandonQuest = useCallback((activeProjectId: string | null) => {
        if (!activeProjectId) return;
        deleteProject(activeProjectId);
        setView(AppView.PROJECT_LIST);
        setTimerActive?.(false);
    }, [deleteProject, setView, setTimerActive]);

    return {
        // States
        isAnalyzing,
        isGeneratingPlan,

        // Handlers
        handleSelectProject,
        handleQuickStart,
        handleAnalyze,
        handleCommit,
        handleAbandonQuest,
    };
}
