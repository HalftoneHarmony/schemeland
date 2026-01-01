/**
 * @file store/slices/index.ts
 * 모든 슬라이스 통합 내보내기
 */

// Idea 슬라이스
export {
    type IdeaState,
    type IdeaActions,
    type IdeaSlice,
    initialIdeaState,
    createIdeaSlice,
} from './ideaSlice';

// Analysis 슬라이스
export {
    type AnalysisState,
    type AnalysisActions,
    type AnalysisSlice,
    initialAnalysisState,
    createAnalysisSlice,
} from './analysisSlice';

// Task 슬라이스
export {
    type TaskState,
    type TaskActions,
    type TaskSlice,
    type TaskSliceDependencies,
    initialTaskState,
    createTaskSlice,
} from './taskSlice';

// Week 슬라이스
export {
    type WeekState,
    type WeekActions,
    type WeekSlice,
    type WeekSliceDependencies,
    initialWeekState,
    createWeekSlice,
} from './weekSlice';

// Month 슬라이스
export {
    type MonthState,
    type MonthActions,
    type MonthSlice,
    type MonthSliceDependencies,
    initialMonthState,
    createMonthSlice,
} from './monthSlice';

// Project 슬라이스
export {
    type ProjectState,
    type ProjectActions,
    type ProjectSlice,
    type ProjectSliceDependencies,
    initialProjectState,
    createProjectSlice,
    denormalizeProject,
} from './projectSlice';

// UI 슬라이스
export {
    type UIState,
    type UIActions,
    type UISlice,
    initialUIState,
    createUISlice,
} from './uiSlice';
