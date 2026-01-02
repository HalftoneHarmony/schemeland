import { useEffect, useState, useCallback } from 'react';
import { setConflictCallback, ConflictInfo, getSessionId } from '../store/storage';

/**
 * 데이터 충돌 감지 훅 (v2.2)
 * - 다른 브라우저/탭에서 데이터가 변경되면 경고
 * - 데이터 병합이 발생하면 알림
 */
export const useConflictDetection = () => {
    const [conflict, setConflict] = useState<ConflictInfo | null>(null);
    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const [isMergeNoticeVisible, setIsMergeNoticeVisible] = useState(false);

    useEffect(() => {
        setConflictCallback((info) => {
            console.log('[ConflictDetection] Event:', info.type, info);
            setConflict(info);

            if (info.type === 'DATA_MERGED') {
                // 병합이 발생하면 병합 알림 표시
                setIsMergeNoticeVisible(true);
                // 5초 후 자동으로 사라짐
                setTimeout(() => setIsMergeNoticeVisible(false), 5000);
            } else if (info.type === 'EXTERNAL_CHANGE' || info.type === 'SAVE_BLOCKED') {
                // 충돌 경고 표시
                setIsWarningVisible(true);
            }
        });

        return () => setConflictCallback(() => { });
    }, []);

    const dismissWarning = useCallback(() => {
        setIsWarningVisible(false);
        setConflict(null);
    }, []);

    const dismissMergeNotice = useCallback(() => {
        setIsMergeNoticeVisible(false);
    }, []);

    const reloadPage = useCallback(() => {
        window.location.reload();
    }, []);

    return {
        conflict,
        isWarningVisible,
        isMergeNoticeVisible,
        dismissWarning,
        dismissMergeNotice,
        reloadPage,
        sessionId: getSessionId()
    };
};
