import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { AppView } from '../types';

/**
 * 앱의 View 상태와 브라우저의 History API를 동기화하는 훅
 * - 뒤로 가기 버튼/단축키 지원
 * - 새로고침 시에도 현재 View 복구 가능 (선택적)
 */
export const useHistorySync = () => {
    const { currentView, setCurrentView } = useStore();
    const isPopping = useRef(false); // 뒤로가기 이벤트에 의한 변경인지 체크
    const lastView = useRef<AppView>(currentView);

    useEffect(() => {
        // 1. 초기 로드 시 현재 상태를 히스토리에 replace
        // (새로고침 하더라도 현재 뷰가 유지되도록, 혹은 최소한 초기 엔트리는 있도록)
        if (!window.history.state) {
            window.history.replaceState({ view: currentView }, '', window.location.pathname);
        }

        const handlePopState = (event: PopStateEvent) => {
            if (event.state && event.state.view) {
                // 브라우저 뒤로/앞으로 가기 발생
                isPopping.current = true;
                setCurrentView(event.state.view);
                lastView.current = event.state.view;
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [setCurrentView]);

    useEffect(() => {
        // View가 변경되었을 때
        if (currentView !== lastView.current) {
            if (isPopping.current) {
                // 뒤로가기에 의한 변경이면 pushState 하지 않음
                isPopping.current = false;
            } else {
                // 사용자 액션에 의한 변경이면 history에 추가
                window.history.pushState({ view: currentView }, '', window.location.pathname);
            }
            lastView.current = currentView;
        }
    }, [currentView]);
};
