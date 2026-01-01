export enum AppView {
  LANDING = 'LANDING',
  BRAIN_DUMP = 'BRAIN_DUMP',
  ANALYSIS = 'ANALYSIS',
  DASHBOARD = 'DASHBOARD',
  PROJECT_LIST = 'PROJECT_LIST',
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  emoji?: string; // Visual icon for the project
}

export interface AnalysisMetrics {
  feasibility: number; // 0-100
  marketPotential: number; // 0-100
  excitement: number; // 0-100
  speedToMVP: number; // 0-100 (Higher is faster)
}

export interface IdeaAnalysis {
  ideaId: string;
  metrics: AnalysisMetrics;
  reasoning: string;
  oneLiner: string;
}

export interface MilestoneTask {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface WeeklyMilestone {
  weekNumber: number;
  theme: string;
  tasks: MilestoneTask[];
}

// New Interface for Options
export interface WeeklyPlanOption {
  strategyName: string;
  description: string;
  plan: WeeklyMilestone[];
}

export interface YearlyGoal {
  vision: string;
  keyResults: string[];
}

export interface MonthlyGoal {
  month: number;
  theme: string;
  goals: string[];
  detailedPlan?: WeeklyMilestone[];
}

export interface ThreeYearVision {
  year1: string;
  year2: string;
  year3: string;
  ultimateGoal: string;
}

export interface ProjectScheme {
  id: string;
  selectedIdea: ProjectIdea;
  analysis: IdeaAnalysis;
  yearlyPlan: YearlyGoal;
  monthlyPlan: MonthlyGoal[];
  threeYearVision?: ThreeYearVision;
  startDate: string;
  lastUpdated: string;
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';