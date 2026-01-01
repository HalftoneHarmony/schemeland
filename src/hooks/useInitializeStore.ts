/**
 * @file hooks/useInitializeStore.ts
 * 스토어 초기화 및 마이그레이션 훅
 * 
 * 앱 시작 시 레거시 데이터를 자동으로 마이그레이션합니다.
 */

import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { checkMigrationNeeded, migrateFromLocalStorage } from '../store/migration';

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
