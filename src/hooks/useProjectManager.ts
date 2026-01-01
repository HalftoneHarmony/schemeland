import { ProjectIdea, IdeaAnalysis, ProjectScheme, IdeaStatus, ProjectStatus } from '../types';
import useLocalStorage from './useLocalStorage';

/**
 * 프로젝트 관련 데이터 로직을 전담하는 데이터 엔지니어용 커스텀 훅
 */
export const useProjectManager = (initialIdeas: ProjectIdea[] = []) => {
    const [ideas, setIdeas] = useLocalStorage<ProjectIdea[]>('schemeland_ideas', initialIdeas);
    const [analyses, setAnalyses] = useLocalStorage<IdeaAnalysis[]>('schemeland_analyses', []);
    const [projects, setProjects] = useLocalStorage<ProjectScheme[]>('schemeland_projects', []);

    const addIdea = (idea: Omit<ProjectIdea, keyof import('../types').BaseEntity | 'status'>) => {
        const now = new Date().toISOString();
        const newIdea: ProjectIdea = {
            ...idea,
            id: crypto.randomUUID(),
            status: IdeaStatus.PENDING,
            createdAt: now,
            updatedAt: now,
        };
        setIdeas([...ideas, newIdea]);
        return newIdea;
    };

    const updateIdea = (id: string, updates: Partial<ProjectIdea>) => {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
    };

    const deleteIdea = (id: string) => {
        setIdeas(prev => prev.filter(i => i.id !== id));
    };

    const createProject = (idea: ProjectIdea, analysis: IdeaAnalysis, plan: any, startDate: string) => {
        const now = new Date().toISOString();

        // Month 1 주간 계획 주입
        const monthlyPlan = [...plan.monthlyPlan];
        if (monthlyPlan.length > 0) {
            monthlyPlan[0].detailedPlan = plan.weeklyPlan;
        }

        const newProject: ProjectScheme = {
            id: crypto.randomUUID(),
            selectedIdea: { ...idea, status: IdeaStatus.ACTIVE, updatedAt: now },
            analysis: analysis,
            yearlyPlan: plan.yearlyPlan,
            monthlyPlan: monthlyPlan,
            startDate: startDate,
            createdAt: now,
            updatedAt: now,
            status: ProjectStatus.PLANNED
        };

        setProjects(prev => [...prev, newProject]);
        return newProject;
    };

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    return {
        ideas,
        setIdeas,
        analyses,
        setAnalyses,
        projects,
        setProjects,
        addIdea,
        updateIdea,
        deleteIdea,
        createProject,
        deleteProject
    };
};
