/**
 * @file types.ts
 * 데이터 엔지니어 관점에서 최적화된 엄격한 타입 정의입니다.
 */

/**
 * 모든 데이터 엔티티의 기본 구조 (서버 연동 고려)
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 앱의 주요 뷰 상태
 */
export enum AppView {
  LANDING = 'LANDING',
  BRAIN_DUMP = 'BRAIN_DUMP',
  ANALYSIS = 'ANALYSIS',
  DASHBOARD = 'DASHBOARD',
  PROJECT_LIST = 'PROJECT_LIST',
  CAMPAIGN_DETAIL = 'CAMPAIGN_DETAIL',
  KANBAN = 'KANBAN',
}

/**
 * 아이디어의 진행 상태
 */
export enum IdeaStatus {
  PENDING = 'PENDING',
  ANALYZED = 'ANALYZED',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

/**
 * 프로젝트의 전체 생명주기 상태
 */
export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  EXECUTING = 'EXECUTING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

/**
 * 프로젝트 난이도
 */
export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

/**
 * 작업 우선순위
 */
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * 칸반보드 작업 상태 (4단계)
 */
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

/**
 * 칸반보드용 작업 인터페이스
 */
export interface KanbanTask extends BaseEntity {
  text: string;
  status: TaskStatus;
  priority: Priority;
  weekNumber: number;
  monthIndex: number;
  projectId: string;
  dueDate?: string;
  tags?: string[];
  description?: string;
}

export interface ProjectIdea extends BaseEntity {
  title: string;
  description: string;
  emoji?: string;
  status: IdeaStatus;
  tags?: string[];
  metadata?: Record<string, any>; // 확장성을 위한 메타데이터 필드
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
  priority: Priority;
  status?: TaskStatus; // 칸반보드 4단계 상태 (기본값: TODO, isCompleted true면 DONE)
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

export interface YearPlan {
  vision: string;
  keyResults: string[];
}

export interface ThreeYearVision extends BaseEntity {
  year1: YearPlan;
  year2: YearPlan;
  year3: YearPlan;
  ultimateGoal: string;
}

/**
 * 전체 프로젝트 계획 스키마 (Snapshot 방식)
 */
export interface ProjectScheme extends BaseEntity {
  selectedIdea: ProjectIdea;
  analysis: IdeaAnalysis;
  yearlyPlan: YearlyGoal;
  monthlyPlan: MonthlyGoal[];
  threeYearVision?: ThreeYearVision;
  startDate: string;
  status: ProjectStatus;
  settings?: {
    isHardcoreMode: boolean;
    notificationsEnabled: boolean;
  };
}

/**
 * API 응답 표준 형식
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

/**
 * 전체 앱 상태 (O(1) 접근 최적화)
 */
export interface AppState {
  ideas: Record<string, ProjectIdea>;
  analyses: Record<string, IdeaAnalysis>;
  projects: Record<string, ProjectScheme>;
  activeProjectId: string | null;
  version: number;
}