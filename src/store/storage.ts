/**
 * @file store/storage.ts
 * 저장소 추상화 레이어 (v2.2 - Deep Merge Protection)
 * 
 * v2.2 변경사항:
 * - 다중 브라우저 충돌 시 데이터 병합(Merge) 전략 적용
 * - 기존 프로젝트 보호: 새 세션에서 기존 데이터를 덮어쓰지 않음
 * - 세션 기반 충돌 감지 강화
 */

// ============================================
// Session Management
// ============================================

const SESSION_ID = crypto.randomUUID();
let lastKnownServerTimestamp: string | null = null;
let conflictCallback: ((conflict: ConflictInfo) => void) | null = null;

export interface ConflictInfo {
    type: 'EXTERNAL_CHANGE' | 'DATA_MERGED' | 'SAVE_BLOCKED';
    localTimestamp: string;
    serverTimestamp: string;
    sessionId: string;
    serverSessionId?: string;
    mergedData?: boolean;
}

export function setConflictCallback(cb: (conflict: ConflictInfo) => void) {
    conflictCallback = cb;
}

export function getSessionId(): string {
    return SESSION_ID;
}

// ============================================
// Deep Merge Utility
// ============================================

/**
 * 두 개의 store state를 병합합니다.
 * 규칙:
 * - 서버에 있는 기존 entity(id 기준)는 보존
 * - 로컬에만 있는 새 entity는 추가
 * - 동일 ID가 충돌하면 updatedAt 기준으로 최신 것 선택
 */
function mergeStoreData(serverData: any, localData: any): any {
    if (!serverData) return localData;
    if (!localData) return serverData;

    try {
        const serverParsed = typeof serverData === 'string' ? JSON.parse(serverData) : serverData;
        const localParsed = typeof localData === 'string' ? JSON.parse(localData) : localData;

        const merged = { ...serverParsed };

        // 병합할 Record 타입 필드들
        const recordFields = ['ideas', 'analyses', 'projects', 'months', 'weeks', 'tasks'];

        for (const field of recordFields) {
            if (localParsed[field] && typeof localParsed[field] === 'object') {
                merged[field] = { ...(serverParsed[field] || {}) };

                for (const id of Object.keys(localParsed[field])) {
                    const localEntity = localParsed[field][id];
                    const serverEntity = serverParsed[field]?.[id];

                    if (!serverEntity) {
                        // 서버에 없는 새 엔티티 → 추가
                        merged[field][id] = localEntity;
                    } else {
                        // 동일 ID 충돌 → updatedAt 비교
                        const localTime = new Date(localEntity.updatedAt || 0).getTime();
                        const serverTime = new Date(serverEntity.updatedAt || 0).getTime();

                        if (localTime > serverTime) {
                            merged[field][id] = localEntity;
                        }
                        // else: 서버 데이터 유지
                    }
                }
            }
        }

        // 비-Record 필드는 로컬 우선 (UI 상태 등)
        const nonRecordFields = ['activeProjectId', 'currentView', 'selectedMonthIndex', 'version', 'isMigrated'];
        for (const field of nonRecordFields) {
            if (localParsed[field] !== undefined) {
                merged[field] = localParsed[field];
            }
        }

        return JSON.stringify(merged);
    } catch (e) {
        console.error('[Merge] Failed to merge data:', e);
        return localData; // 병합 실패 시 로컬 데이터 사용
    }
}

// ============================================
// Storage Adapter Interface
// ============================================

export interface StorageAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
    keys(): Promise<string[]>;
    clear(): Promise<void>;
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
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                throw new Error('저장 공간이 부족합니다.');
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
        keys.forEach((key) => localStorage.removeItem(this.getKey(key)));
    }

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
// IndexedDB Adapter
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

export const storage = createStorage('localStorage');

// ============================================
// Server Storage with Deep Merge Protection
// ============================================

interface ServerDBMeta {
    _meta?: {
        lastUpdatedAt: string;
        lastUpdatedBy: string;
    };
    [key: string]: any;
}

export const serverStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            const res = await fetch('/api/storage');
            if (!res.ok) throw new Error('Server unreachable');

            const db: ServerDBMeta = await res.json();

            // 메타데이터 저장
            if (db._meta?.lastUpdatedAt) {
                lastKnownServerTimestamp = db._meta.lastUpdatedAt;
            }

            if (db[name]) {
                localStorage.setItem(name, db[name]);
                return db[name];
            }

            // 로컬 데이터가 있으면 마이그레이션 (서버가 비어있는 경우만)
            const localData = localStorage.getItem(name);
            if (localData && Object.keys(db).filter(k => k !== '_meta').length === 0) {
                console.log(`[Storage] Initial migration to server...`);
                const newDb: ServerDBMeta = {
                    [name]: localData,
                    _meta: {
                        lastUpdatedAt: new Date().toISOString(),
                        lastUpdatedBy: SESSION_ID
                    }
                };
                await fetch('/api/storage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newDb)
                });
                lastKnownServerTimestamp = newDb._meta!.lastUpdatedAt;
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
            // 1. 서버 DB 조회
            const res = await fetch('/api/storage');
            const db: ServerDBMeta = res.ok ? await res.json() : {};

            const serverValue = db[name];
            const serverMeta = db._meta;

            // 2. 충돌 감지 및 병합
            let finalValue = value;

            if (serverValue && serverValue !== value) {
                // 서버에 기존 데이터가 있고, 현재 저장하려는 것과 다름
                console.log('[ServerStorage] 🔀 Merging with existing server data...');

                finalValue = mergeStoreData(serverValue, value);

                // 병합 완료 알림
                if (conflictCallback && serverMeta) {
                    conflictCallback({
                        type: 'DATA_MERGED',
                        localTimestamp: lastKnownServerTimestamp || new Date().toISOString(),
                        serverTimestamp: serverMeta.lastUpdatedAt,
                        sessionId: SESSION_ID,
                        serverSessionId: serverMeta.lastUpdatedBy,
                        mergedData: true
                    });
                }
            }

            // 3. 로컬 캐시 업데이트 (병합된 데이터로)
            localStorage.setItem(name, finalValue);

            // 4. 동일한 값이면 스킵
            if (db[name] === finalValue) return;

            // 5. 서버에 저장
            const newTimestamp = new Date().toISOString();
            db[name] = finalValue;
            db._meta = {
                lastUpdatedAt: newTimestamp,
                lastUpdatedBy: SESSION_ID
            };

            await fetch('/api/storage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(db)
            });

            lastKnownServerTimestamp = newTimestamp;
            console.log(`[ServerStorage] ✅ Saved successfully (session: ${SESSION_ID.slice(0, 8)}...)`);

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
