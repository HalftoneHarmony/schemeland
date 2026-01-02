/**
 * @file types.ts
 * 데이터 엔지니어 관점에서 최적화된 엄격한 타입 정의입니다.
 * 
 * v2.0 변경사항:
 * - 정규화된 Store 구조 추가 (NormalizedState)
 * - 통합 Task 모델 (UnifiedTask)로 MilestoneTask + KanbanTask 통합
 * - ID 참조 방식으로 데이터 중복 제거
 */

// ============================================
// 기본 타입 및 Enum
// ============================================

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
  COACH = 'COACH',
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

// ============================================
// 통합 Task 모델 (개선: MilestoneTask + KanbanTask 통합)
// ============================================

/**
 * 통합된 작업 인터페이스
 * - MilestoneTask와 KanbanTask를 하나로 통합
 * - 모든 뷰(Campaign, Kanban)에서 동일하게 사용
 */
export interface UnifiedTask extends BaseEntity {
  /** 작업 내용 */
  text: string;

  /** 칸반보드 4단계 상태 */
  status: TaskStatus;

  /** 우선순위 */
  priority: Priority;

  /** 완료 여부 (status === DONE과 자동 동기화) */
  isCompleted: boolean;

  // 위치 정보 (정규화를 위한 역참조)
  /** 소속 프로젝트 ID */
  projectId: string;

  /** 소속 월 인덱스 (0-based) */
  monthIndex: number;

  /** 소속 주차 번호 (1-based) */
  weekNumber: number;

  // 선택적 메타데이터
  /** 마감일 */
  dueDate?: string;

  /** 태그 목록 */
  tags?: string[];

  /** 상세 설명 */
  description?: string;
}

// ============================================
// 기존 호환성을 위한 레거시 타입 (점진적 마이그레이션용)
// ============================================

/**
 * @deprecated UnifiedTask 사용 권장
 * 칸반보드용 작업 인터페이스 (레거시 호환)
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

/**
 * @deprecated UnifiedTask 사용 권장
 * 마일스톤 작업 인터페이스 (레거시 호환)
 */
export interface MilestoneTask extends BaseEntity {
  text: string;
  isCompleted: boolean;
  priority: Priority;
  status?: TaskStatus;
}

// ============================================
// 아이디어 및 분석
// ============================================

export interface ProjectIdea extends BaseEntity {
  title: string;
  description: string;
  emoji?: string;
  status: IdeaStatus;
  tags?: string[];
  metadata?: Record<string, any>;
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

// ============================================
// 계획 구조
// ============================================

/**
 * 주간 마일스톤 (레거시 - 중첩 구조)
 */
export interface WeeklyMilestone {
  weekNumber: number;
  theme: string;
  tasks: MilestoneTask[];
}

/**
 * 주간 마일스톤 (정규화 - ID 참조)
 */
export interface NormalizedWeeklyMilestone extends BaseEntity {
  weekNumber: number;
  theme: string;
  taskIds: string[];  // Task ID 배열로 참조
  monthId: string;    // 소속 월 ID
  projectId: string;  // 소속 프로젝트 ID
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

/**
 * 월간 목표 (레거시 - 중첩 구조)
 */
export interface MonthlyGoal extends BaseEntity {
  month: number;
  theme: string;
  goals: string[];
  detailedPlan?: WeeklyMilestone[];
}

/**
 * 월간 목표 (정규화 - ID 참조)
 */
export interface NormalizedMonthlyGoal extends BaseEntity {
  month: number;
  theme: string;
  goals: string[];
  weekIds: string[];  // Week ID 배열로 참조
  projectId: string;  // 소속 프로젝트 ID
}

export interface YearPlan {
  vision: string;
  keyResults: string[];
  /** Base64 인코딩된 비전 이미지 (선택) */
  visionImage?: string;
}

export interface ThreeYearVision extends BaseEntity {
  year1: YearPlan;
  year2: YearPlan;
  year3: YearPlan;
  ultimateGoal: string;
}

// ============================================
// 프로젝트 스키마
// ============================================

/**
 * 전체 프로젝트 계획 스키마 (레거시 - Snapshot 방식)
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
 * 정규화된 프로젝트 스키마 (ID 참조 방식)
 */
export interface NormalizedProjectScheme extends BaseEntity {
  /** 연결된 아이디어 ID (중복 제거) */
  ideaId: string;

  /** 연결된 분석 ID (중복 제거) */
  analysisId: string;

  /** 연간 계획 */
  yearlyPlan: YearlyGoal;

  /** 월별 계획 ID 목록 */
  monthIds: string[];

  /** 3년 비전 */
  threeYearVision?: ThreeYearVision;

  /** 시작일 */
  startDate: string;

  /** 프로젝트 상태 */
  status: ProjectStatus;

  /** 설정 */
  settings?: {
    isHardcoreMode: boolean;
    notificationsEnabled: boolean;
  };
}

// ============================================
// API 및 유효성 검사
// ============================================

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

// ============================================
// 정규화된 Store 구조 (새로운 아키텍처)
// ============================================

/**
 * 정규화된 앱 상태 (O(1) 접근 최적화)
 * - 모든 엔티티를 Record<id, entity>로 저장
 * - 관계는 ID 배열로 표현
 */
export interface NormalizedState {
  // 엔티티 저장소 (O(1) 접근)
  ideas: Record<string, ProjectIdea>;
  analyses: Record<string, IdeaAnalysis>;
  projects: Record<string, NormalizedProjectScheme>;
  months: Record<string, NormalizedMonthlyGoal>;
  weeks: Record<string, NormalizedWeeklyMilestone>;
  tasks: Record<string, UnifiedTask>;

  // 앱 메타 상태
  activeProjectId: string | null;
  currentView: AppView;
  selectedMonthIndex: number;

  // 버전 관리 (마이그레이션용)
  version: number;
}

/**
 * 레거시 앱 상태 (기존 호환)
 * @deprecated NormalizedState 사용 권장
 */
export interface AppState {
  ideas: Record<string, ProjectIdea>;
  analyses: Record<string, IdeaAnalysis>;
  projects: Record<string, ProjectScheme>;
  activeProjectId: string | null;
  version: number;
}

// ============================================
// 유틸리티 타입
// ============================================

/**
 * 엔티티 ID만 추출하는 타입
 */
export type EntityId = string;

/**
 * Record를 배열로 변환하는 헬퍼
 */
export type RecordToArray<T> = T[];

/**
 * 부분 업데이트를 위한 타입
 */
export type PartialUpdate<T> = Partial<Omit<T, keyof BaseEntity>> & { id: string };

// ============================================
// AI Coach Feature
// ============================================

export enum CoachType {
  ELON = 'ELON',
  GOGGINS = 'GOGGINS',
  CBUM = 'CBUM'
}

export interface ChatMessage extends BaseEntity {
  sender: 'user' | 'ai';
  text: string;
  coachType: CoachType;
  timestamp: string;
}

export interface CoachPersona {
  type: CoachType;
  name: string;
  title: string;
  description: string;
  avatar: string; // URL or Emoji
  themeColor: string;
  /** Base64 인코딩된 커스텀 아바타 이미지 (선택) */
  customAvatar?: string;
}