import { useEffect, useState, useCallback, useRef } from 'react';
import { getSessionId } from '../store/storage';

interface SessionStatus {
    isOwner: boolean;
    isChecking: boolean;
    ownerInfo?: {
        sessionId: string;
        connectedAt: string;
    };
}

/**
 * 세션 관리 훅
 * - 앱 시작 시 세션 등록
 * - 주기적으로 heartbeat 전송
 * - 브라우저 닫을 때 세션 해제
 */
export const useSessionLock = () => {
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
        isOwner: true, // 낙관적 기본값
        isChecking: true
    });
    const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
    const sessionId = getSessionId();

    // 세션 등록
    const registerSession = useCallback(async () => {
        try {
            const res = await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, action: 'register' })
            });

            if (!res.ok) throw new Error('Session registration failed');

            const data = await res.json();

            setSessionStatus({
                isOwner: data.isOwner,
                isChecking: false,
                ownerInfo: data.isOwner ? undefined : {
                    sessionId: data.ownerId,
                    connectedAt: data.ownerConnectedAt
                }
            });

            console.log(`[Session] Registered: isOwner=${data.isOwner}`);
            return data.isOwner;
        } catch (error) {
            console.warn('[Session] Registration failed, assuming owner:', error);
            setSessionStatus({ isOwner: true, isChecking: false });
            return true;
        }
    }, [sessionId]);

    // Heartbeat 전송
    const sendHeartbeat = useCallback(async () => {
        try {
            const res = await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, action: 'heartbeat' })
            });

            if (res.ok) {
                const data = await res.json();
                if (!data.isOwner && sessionStatus.isOwner) {
                    // Owner 상태가 박탈됨
                    console.warn('[Session] Lost ownership!');
                    setSessionStatus(prev => ({ ...prev, isOwner: false }));
                }
            }
        } catch (error) {
            // Heartbeat 실패는 무시 (오프라인 등)
        }
    }, [sessionId, sessionStatus.isOwner]);

    // 세션 해제
    const releaseSession = useCallback(async () => {
        try {
            await fetch('/api/session', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            console.log('[Session] Released');
        } catch (error) {
            // 해제 실패는 무시 (서버가 타임아웃으로 정리함)
        }
    }, [sessionId]);

    // 초기화 및 정리
    useEffect(() => {
        registerSession();

        // 10초마다 heartbeat
        heartbeatInterval.current = setInterval(sendHeartbeat, 10000);

        // 브라우저 닫을 때 세션 해제
        const handleUnload = () => {
            if (sessionStatus.isOwner) {
                // navigator.sendBeacon으로 비동기 요청 (페이지 언로드 시에도 작동)
                navigator.sendBeacon('/api/session', JSON.stringify({
                    sessionId,
                    action: 'release'
                }));
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }
            window.removeEventListener('beforeunload', handleUnload);
            releaseSession();
        };
    }, [registerSession, sendHeartbeat, releaseSession, sessionId, sessionStatus.isOwner]);

    // Owner 권한 재요청 (다른 세션이 종료된 후)
    const requestOwnership = useCallback(async () => {
        setSessionStatus(prev => ({ ...prev, isChecking: true }));
        await registerSession();
    }, [registerSession]);

    return {
        ...sessionStatus,
        sessionId,
        requestOwnership,
        releaseSession
    };
};
