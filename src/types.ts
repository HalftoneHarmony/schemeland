/**
 * @file types.ts
 * 데이터 엔지니어 관점에서 정의된 엄격한 타입 정의입니다.
 * 모든 데이터 구조는 미래의 서버(API) 연동을 고려하여 설계되었습니다.
 */

/**
 * 모든 데이터 엔티티의 기본 구조입니다.
 * 서버 DB에 저장될 때 필수적인 필드들을 포함합니다.
 */
export interface BaseEntity {
  id: string;
  createdAt: string; // ISO 8601 형식
  updatedAt: string; // ISO 8601 형식
}

export enum AppView {
  LANDING = 'LANDING',
  BRAIN_DUMP = 'BRAIN_DUMP',
  ANALYSIS = 'ANALYSIS',
  DASHBOARD = 'DASHBOARD',
  PROJECT_LIST = 'PROJECT_LIST',
  CAMPAIGN_DETAIL = 'CAMPAIGN_DETAIL',
}

export interface ProjectIdea extends BaseEntity {
  title: string;
  description: string;
  emoji?: string;
  status: 'PENDING' | 'ANALYZED' | 'ACTIVE'; // 상태를 엄격하게 제한
}

export interface AnalysisMetrics {
  feasibility: number;      // 0-100
  marketPotential: number;  // 0-100
  excitement: number;       // 0-100
  speedToMVP: number;       // 0-100
}

export interface IdeaAnalysis extends BaseEntity {
  ideaId: string;
  metrics: AnalysisMetrics;
  reasoning: string;
  oneLiner: string;
}

export interface MilestoneTask extends BaseEntity {
  text: string;
  isCompleted: boolean;
}

export interface WeeklyMilestone {
  weekNumber: number;
  theme: string;
  tasks: MilestoneTask[];
}

export interface WeeklyPlanOption {
  strategyName: string;
  description: string;
  plan: WeeklyMilestone[];
}

export interface YearlyGoal extends BaseEntity {
  vision: string;
  keyResults: string[];
}

export interface MonthlyGoal extends BaseEntity {
  month: number;
  theme: string;
  goals: string[];
  detailedPlan?: WeeklyMilestone[];
}

export interface ThreeYearVision extends BaseEntity {
  year1: string;
  year2: string;
  year3: string;
  ultimateGoal: string;
}

/**
 * 전체 프로젝트 계획을 총괄하는 스키마입니다.
 */
export interface ProjectScheme extends BaseEntity {
  selectedIdea: ProjectIdea;
  analysis: IdeaAnalysis;
  yearlyPlan: YearlyGoal;
  monthlyPlan: MonthlyGoal[];
  threeYearVision?: ThreeYearVision;
  startDate: string;
  status: 'DRAFT' | 'PLANNED' | 'EXECUTING' | 'COMPLETED'; // 프로젝트 진행 상태
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

/**
 * API 응답 표준 형식 (미래 서버 연동용)
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * 유효성 검사 결과 형식
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: Record<string, string>;
}