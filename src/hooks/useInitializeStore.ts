/**
 * @file hooks/useInitializeStore.ts
 * 스토어 초기화 및 마이그레이션 훅
 * 
 * 앱 시작 시 레거시 데이터를 자동으로 마이그레이션하고,
 * 손상된 데이터를 감지하여 자동 복구합니다.
 */

import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { checkMigrationNeeded, migrateFromLocalStorage, cleanupLegacyData } from '../store/migration';
import { scanForCorruption, repairCorruptedData, CorruptionReport } from '../utils/dataValidator';


interface InitializationState {
    isInitialized: boolean;
    isMigrating: boolean;
    migrationResult: {
        success: boolean;
        message: string;
    } | null;
    error: string | null;
}

/**
 * 스토어 초기화 및 마이그레이션 훅
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { isInitialized, isMigrating } = useInitializeStore();
 *   
 *   if (!isInitialized || isMigrating) {
 *     return <LoadingScreen />;
 *   }
 *   
 *   return <MainApp />;
 * }
 * ```
 */
export function useInitializeStore(): InitializationState {
    const [state, setState] = useState<InitializationState>({
        isInitialized: false,
        isMigrating: false,
        migrationResult: null,
        error: null,
    });

    const store = useStore();

    useEffect(() => {
        const initialize = async () => {
            try {
                // 이미 마이그레이션 되었는지 확인
                if (store.isMigrated) {
                    // 이미 마이그레이션됨 - 손상 데이터 검사
                    const currentState = useStore.getState();
                    const report = scanForCorruption({
                        ideas: currentState.ideas,
                        projects: currentState.projects,
                        months: currentState.months,
                        weeks: currentState.weeks,
                        tasks: currentState.tasks,
                    });

                    if (report.isCorrupted) {
                        console.warn('⚠️ 손상된 데이터 감지:', report.totalIssues, '개의 문제 발견');
                        console.table(report.issues);

                        // 자동 복구
                        const repaired = repairCorruptedData({
                            ideas: currentState.ideas,
                            projects: currentState.projects,
                            months: currentState.months,
                            weeks: currentState.weeks,
                            tasks: currentState.tasks,
                        });

                        useStore.setState({
                            ideas: repaired.ideas,
                            projects: repaired.projects,
                            months: repaired.months,
                            weeks: repaired.weeks,
                            tasks: repaired.tasks,
                        });

                        console.log('🔧 데이터 복구 완료:', repaired.repairCount, '개 항목 복구됨');

                        // 복구된 데이터를 로컬 스토리지에 즉시 저장
                        try {
                            await useStore.getState().save();
                            console.log('💾 복구된 데이터 저장 완료');
                        } catch (saveError) {
                            console.warn('⚠️ 복구된 데이터 저장 실패 (다음 저장 시 재시도됨):', saveError);
                        }
                    }


                    setState({
                        isInitialized: true,
                        isMigrating: false,
                        migrationResult: { success: true, message: '이미 마이그레이션됨' },
                        error: null,
                    });
                    return;
                }


                // 마이그레이션 필요 여부 확인
                const needsMigration = checkMigrationNeeded();

                if (!needsMigration) {
                    // 마이그레이션 필요 없음 - 새로운 사용자
                    useStore.setState({ isMigrated: true });
                    setState({
                        isInitialized: true,
                        isMigrating: false,
                        migrationResult: { success: true, message: '새로운 사용자' },
                        error: null,
                    });
                    return;
                }

                // 마이그레이션 시작
                setState((prev) => ({ ...prev, isMigrating: true }));

                console.log('🔄 Starting data migration...');

                const result = migrateFromLocalStorage();

                if (result.success && result.data) {
                    // 스토어에 마이그레이션된 데이터 적용
                    useStore.setState({
                        ideas: result.data.ideas,
                        analyses: result.data.analyses,
                        projects: result.data.projects,
                        months: result.data.months,
                        weeks: result.data.weeks,
                        tasks: result.data.tasks,
                        isMigrated: true,
                        version: result.version,
                    });

                    console.log('✅ Migration completed:', result.message);

                    // 🔥 레거시 데이터 삭제 (중복 마이그레이션 방지)
                    cleanupLegacyData();

                    setState({
                        isInitialized: true,
                        isMigrating: false,
                        migrationResult: { success: true, message: result.message },
                        error: null,
                    });
                } else {
                    console.error('❌ Migration failed:', result.message);

                    // 마이그레이션 실패해도 앱은 동작하도록
                    useStore.setState({ isMigrated: true });

                    setState({
                        isInitialized: true,
                        isMigrating: false,
                        migrationResult: { success: false, message: result.message },
                        error: result.errors?.join(', ') || result.message,
                    });
                }

            } catch (error) {
                console.error('❌ Initialization error:', error);

                setState({
                    isInitialized: true,
                    isMigrating: false,
                    migrationResult: null,
                    error: String(error),
                });
            }
        };

        initialize();
    }, []);

    return state;
}

export default useInitializeStore;
