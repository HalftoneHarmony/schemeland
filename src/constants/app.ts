/**
 * @file constants/app.ts
 * 앱 전역 상수 정의
 */

import { IdeaStatus, ProjectIdea } from '../types';

// ============================================
// 초기값
// ============================================

/**
 * 초기 아이디어 템플릿
 */
export const INITIAL_IDEA: ProjectIdea = {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    status: IdeaStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

/**
 * 초기 아이디어 생성 함수
 */
export function createInitialIdea(): ProjectIdea {
    return {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        status: IdeaStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

/**
 * 초기 아이디어 목록 생성 함수
 */
export function createInitialIdeas(): ProjectIdea[] {
    return [createInitialIdea()];
}

// ============================================
// 앱 메타데이터
// ============================================

export const APP_NAME = 'SchemeLand';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'AI-Powered Project Planning';

// ============================================
// 저장소 키
// ============================================

export const STORAGE_KEYS = {
    PROJECTS: 'schemeland_projects',
    IDEAS: 'schemeland_ideas',
    ANALYSES: 'schemeland_analyses',
    ACTIVE_ID: 'schemeland_active_id',
    VIEW: 'schemeland_view',
    START_DATE: 'schemeland_start_date',
    STORE: 'schemeland-store',
} as const;

// ============================================
// UI 상수
// ============================================

export const SIDEBAR_WIDTH = 260;
export const MAX_IDEAS_COUNT = 20;
export const MIN_IDEAS_COUNT = 1;

// ============================================
// API 관련
// ============================================

export const API_RETRY_COUNT = 3;
export const API_TIMEOUT_MS = 30000;
