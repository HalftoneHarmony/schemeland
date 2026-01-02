import { useEffect, useState } from 'react';
import { setConflictCallback, ConflictInfo, getSessionId } from '../store/storage';

/**
 * 데이터 충돌 감지 훅
 * 다른 브라우저/탭에서 데이터를 변경했을 때 경고를 표시합니다.
 */
export const useConflictDetection = () => {
    const [conflict, setConflict] = useState<ConflictInfo | null>(null);
    const [isWarningVisible, setIsWarningVisible] = useState(false);

    useEffect(() => {
        setConflictCallback((info) => {
            console.warn('[ConflictDetection] Conflict detected:', info);
            setConflict(info);
            setIsWarningVisible(true);
        });

        return () => setConflictCallback(() => { });
    }, []);

    const dismissWarning = () => {
        setIsWarningVisible(false);
        setConflict(null);
    };

    const reloadPage = () => {
        window.location.reload();
    };

    return {
        conflict,
        isWarningVisible,
        dismissWarning,
        reloadPage,
        sessionId: getSessionId()
    };
};
