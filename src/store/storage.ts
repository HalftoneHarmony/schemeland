/**
 * @file store/storage.ts
 * 저장소 추상화 레이어 (v2.1 - Conflict Detection)
 * 
 * 다양한 저장소 백엔드를 지원하기 위한 추상화:
 * - localStorage (현재)
 * - IndexedDB (대용량 데이터용, 향후)
 * - 클라우드 동기화 (향후)
 * 
 * v2.1 변경사항:
 * - 세션 기반 충돌 감지 기능 추가
 * - 다중 브라우저 동시 접근 시 데이터 보호
 */

// ============================================
// Session Management
// ============================================

const SESSION_ID = crypto.randomUUID();
let lastKnownServerTimestamp: string | null = null;
let conflictCallback: ((conflict: ConflictInfo) => void) | null = null;

export interface ConflictInfo {
    type: 'EXTERNAL_CHANGE' | 'DATA_OVERWRITTEN';
    localTimestamp: string;
    serverTimestamp: string;
    sessionId: string;
    serverSessionId?: string;
}

export function setConflictCallback(cb: (conflict: ConflictInfo) => void) {
    conflictCallback = cb;
}

export function getSessionId(): string {
    return SESSION_ID;
}

// ============================================
// Storage Adapter Interface
// ============================================

export interface StorageAdapter {
    /**
     * 키에 해당하는 값을 가져옵니다
     */
    get<T>(key: string): Promise<T | null>;

    /**
     * 키에 값을 저장합니다
     */
    set<T>(key: string, value: T): Promise<void>;

    /**
     * 키에 해당하는 값을 삭제합니다
     */
    remove(key: string): Promise<void>;

    /**
     * 모든 키를 가져옵니다
     */
    keys(): Promise<string[]>;

    /**
     * 저장소를 비웁니다
     */
    clear(): Promise<void>;

    /**
     * 변경 사항을 구독합니다 (선택적)
     */
    subscribe?(key: string, callback: (value: unknown) => void): () => void;
}

// ============================================
// LocalStorage Adapter
// ============================================

export class LocalStorageAdapter implements StorageAdapter {
    private prefix: string;

    constructor(prefix: string = 'schemeland_') {
        this.prefix = prefix;
    }

    private getKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const item = localStorage.getItem(this.getKey(key));
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`[LocalStorageAdapter] Error reading key "${key}":`, error);
            return null;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        try {
            localStorage.setItem(this.getKey(key), JSON.stringify(value));
        } catch (error) {
            console.error(`[LocalStorageAdapter] Error writing key "${key}":`, error);

            // 용량 초과 시 처리
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.warn('[LocalStorageAdapter] Storage quota exceeded');
                throw new Error('저장 공간이 부족합니다. 일부 데이터를 삭제해주세요.');
            }
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        localStorage.removeItem(this.getKey(key));
    }

    async keys(): Promise<string[]> {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keys.push(key.slice(this.prefix.length));
            }
        }
        return keys;
    }

    async clear(): Promise<void> {
        const keys = await this.keys();
        keys.forEach((key) => {
            localStorage.removeItem(this.getKey(key));
        });
    }

    /**
     * storage 이벤트를 통해 다른 탭의 변경 사항을 구독
     */
    subscribe(key: string, callback: (value: unknown) => void): () => void {
        const handler = (event: StorageEvent) => {
            if (event.key === this.getKey(key) && event.newValue !== null) {
                try {
                    callback(JSON.parse(event.newValue));
                } catch {
                    callback(null);
                }
            }
        };

        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }
}

// ============================================
// IndexedDB Adapter (향후 대용량 데이터용)
// ============================================

export class IndexedDBAdapter implements StorageAdapter {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null = null;

    constructor(dbName: string = 'schemeland', storeName: string = 'data') {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    private async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result ?? null);
        });
    }

    async set<T>(key: string, value: T): Promise<void> {
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async remove(key: string): Promise<void> {
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async keys(): Promise<string[]> {
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result as string[]);
        });
    }

    async clear(): Promise<void> {
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}

// ============================================
// Memory Adapter (테스트용)
// ============================================

export class MemoryAdapter implements StorageAdapter {
    private data: Map<string, unknown> = new Map();

    async get<T>(key: string): Promise<T | null> {
        return (this.data.get(key) as T) ?? null;
    }

    async set<T>(key: string, value: T): Promise<void> {
        this.data.set(key, value);
    }

    async remove(key: string): Promise<void> {
        this.data.delete(key);
    }

    async keys(): Promise<string[]> {
        return Array.from(this.data.keys());
    }

    async clear(): Promise<void> {
        this.data.clear();
    }
}

// ============================================
// Storage Factory
// ============================================

export type StorageType = 'localStorage' | 'indexedDB' | 'memory';

export function createStorage(type: StorageType = 'localStorage'): StorageAdapter {
    switch (type) {
        case 'indexedDB':
            return new IndexedDBAdapter();
        case 'memory':
            return new MemoryAdapter();
        case 'localStorage':
        default:
            return new LocalStorageAdapter();
    }
}

// ============================================
// 기본 인스턴스 내보내기
// ============================================

export const storage = createStorage('localStorage');

// ============================================
// Zustand-compatible Server Storage (with Conflict Detection)
// ============================================

interface ServerDBMeta {
    _meta?: {
        lastUpdatedAt: string;
        lastUpdatedBy: string; // session ID
    };
    [key: string]: any;
}

/**
 * Zustand persist 미들웨어를 위한 서버 사이드 스토리지 어댑터
 * - 로컬 파일 시스템(via Vite API)에 데이터를 저장합니다.
 * - 오프라인 시 localStorage를 폴백으로 사용합니다.
 * - 최초 실행 시 localStorage 데이터를 서버로 자동 마이그레이션합니다.
 * - v2.1: 충돌 감지 기능 추가
 */
export const serverStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            // 1. 서버에서 데이터 로드
            const res = await fetch('/api/storage');
            if (!res.ok) throw new Error('Server unreachable');

            const db: ServerDBMeta = await res.json();

            // 메타데이터 저장 (충돌 감지용)
            if (db._meta?.lastUpdatedAt) {
                lastKnownServerTimestamp = db._meta.lastUpdatedAt;
            }

            // 2. 서버에 데이터가 존재하면 반환
            if (db[name]) {
                // 로컬스토리지도 업데이트 (캐시)
                localStorage.setItem(name, db[name]);
                return db[name];
            }

            // 3. 서버에 없다면 로컬스토리지 확인 (마이그레이션)
            const localData = localStorage.getItem(name);
            if (localData) {
                console.log(`[mnt] Migrating ${name} to server storage...`);
                // 서버로 업로드 (with meta)
                const newDb: ServerDBMeta = {
                    ...db,
                    [name]: localData,
                    _meta: {
                        lastUpdatedAt: new Date().toISOString(),
                        lastUpdatedBy: SESSION_ID
                    }
                };
                fetch('/api/storage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDb)
                }).catch(e => console.error('Migration failed:', e));

                return localData;
            }

            return null;
        } catch (error) {
            console.warn('[ServerStorage] Fetch failed, using local cache', error);
            return localStorage.getItem(name);
        }
    },

    setItem: async (name: string, value: string): Promise<void> => {
        try {
            // 1. 로컬 캐시 업데이트
            localStorage.setItem(name, value);

            // 2. 서버 DB 조회 (충돌 감지)
            const res = await fetch('/api/storage');
            const db: ServerDBMeta = res.ok ? await res.json() : {};

            // 충돌 감지: 다른 세션이 변경했는지 확인
            if (db._meta && lastKnownServerTimestamp) {
                const serverTime = db._meta.lastUpdatedAt;
                const serverSession = db._meta.lastUpdatedBy;

                // 다른 세션이 변경했고, 우리가 알던 시간보다 새로운 경우
                if (serverSession !== SESSION_ID && serverTime > lastKnownServerTimestamp) {
                    console.warn(`[ServerStorage] ⚠️ CONFLICT DETECTED!`);
                    console.warn(`  - Our last known: ${lastKnownServerTimestamp}`);
                    console.warn(`  - Server has: ${serverTime} (by session ${serverSession.slice(0, 8)}...)`);

                    // 충돌 콜백 호출
                    if (conflictCallback) {
                        conflictCallback({
                            type: 'EXTERNAL_CHANGE',
                            localTimestamp: lastKnownServerTimestamp,
                            serverTimestamp: serverTime,
                            sessionId: SESSION_ID,
                            serverSessionId: serverSession
                        });
                    }

                    // 일단 저장은 진행하되, 사용자에게는 알림
                }
            }

            // 동일한 값이면 스킵
            if (db[name] === value) return;

            // 3. 새로운 타임스탬프와 함께 저장
            const newTimestamp = new Date().toISOString();
            db[name] = value;
            db._meta = {
                lastUpdatedAt: newTimestamp,
                lastUpdatedBy: SESSION_ID
            };

            await fetch('/api/storage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(db)
            });

            // 로컬 타임스탬프 업데이트
            lastKnownServerTimestamp = newTimestamp;

        } catch (error) {
            console.error('[ServerStorage] Save failed:', error);
        }
    },

    removeItem: async (name: string): Promise<void> => {
        localStorage.removeItem(name);
        try {
            const res = await fetch('/api/storage');
            const db: ServerDBMeta = res.ok ? await res.json() : {};
            delete db[name];
            db._meta = {
                lastUpdatedAt: new Date().toISOString(),
                lastUpdatedBy: SESSION_ID
            };
            await fetch('/api/storage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(db)
            });
        } catch (error) {
            console.error('[ServerStorage] Remove failed:', error);
        }
    },
};
