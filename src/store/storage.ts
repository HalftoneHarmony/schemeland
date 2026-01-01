/**
 * @file store/storage.ts
 * 저장소 추상화 레이어
 * 
 * 다양한 저장소 백엔드를 지원하기 위한 추상화:
 * - localStorage (현재)
 * - IndexedDB (대용량 데이터용, 향후)
 * - 클라우드 동기화 (향후)
 */

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
