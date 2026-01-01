import { useState, useEffect } from 'react';

/**
 * 로컬 저장소와 상태를 동기화하는 커스텀 훅입니다.
 * @template T 저장할 데이터의 타입
 * @param key localStorage에 사용할 키
 * @param initialValue 초기값
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // 상태 초기화
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            // 저장된 데이터가 있으면 파싱하고, 없으면 초기값을 반환합니다.
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`localStorage key "${key}"를 읽는 중 오류 발생:`, error);
            return initialValue;
        }
    });

    // 상태가 바뀔 때마다 localStorage를 업데이트합니다.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // 함수형 업데이트 지원
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`localStorage key "${key}"를 저장하는 중 오류 발생:`, error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
