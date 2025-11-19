// IndexedDB Storage Wrapper

const DB_NAME = 'ReadableSpokablePDF';
const DB_VERSION = 1;
const STORES = {
    FILES: 'files',
    BATCHES: 'batches',
    LOGS: 'logs',
    SETTINGS: 'settings'
};

class Storage {
    constructor() {
        this.db = null;
    }

    /**
     * Initialize database
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Files store
                if (!db.objectStoreNames.contains(STORES.FILES)) {
                    const fileStore = db.createObjectStore(STORES.FILES, { keyPath: 'id' });
                    fileStore.createIndex('timestamp', 'timestamp', { unique: false });
                    fileStore.createIndex('filename', 'filename', { unique: false });
                }

                // Batches store
                if (!db.objectStoreNames.contains(STORES.BATCHES)) {
                    const batchStore = db.createObjectStore(STORES.BATCHES, { keyPath: 'id' });
                    batchStore.createIndex('fileId', 'fileId', { unique: false });
                    batchStore.createIndex('status', 'status', { unique: false });
                }

                // Logs store
                if (!db.objectStoreNames.contains(STORES.LOGS)) {
                    const logStore = db.createObjectStore(STORES.LOGS, { keyPath: 'id', autoIncrement: true });
                    logStore.createIndex('timestamp', 'timestamp', { unique: false });
                    logStore.createIndex('level', 'level', { unique: false });
                }

                // Settings store
                if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                    db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Save file
     */
    async saveFile(fileData) {
        const transaction = this.db.transaction([STORES.FILES], 'readwrite');
        const store = transaction.objectStore(STORES.FILES);
        return new Promise((resolve, reject) => {
            const request = store.put(fileData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get file by ID
     */
    async getFile(id) {
        const transaction = this.db.transaction([STORES.FILES], 'readonly');
        const store = transaction.objectStore(STORES.FILES);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all files
     */
    async getAllFiles() {
        const transaction = this.db.transaction([STORES.FILES], 'readonly');
        const store = transaction.objectStore(STORES.FILES);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete file
     */
    async deleteFile(id) {
        const transaction = this.db.transaction([STORES.FILES, STORES.BATCHES], 'readwrite');
        const fileStore = transaction.objectStore(STORES.FILES);
        const batchStore = transaction.objectStore(STORES.BATCHES);

        // Delete file
        fileStore.delete(id);

        // Delete associated batches
        const index = batchStore.index('fileId');
        const request = index.openCursor(IDBKeyRange.only(id));

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Save batch
     */
    async saveBatch(batchData) {
        const transaction = this.db.transaction([STORES.BATCHES], 'readwrite');
        const store = transaction.objectStore(STORES.BATCHES);
        return new Promise((resolve, reject) => {
            const request = store.put(batchData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get batches for file
     */
    async getBatchesForFile(fileId) {
        const transaction = this.db.transaction([STORES.BATCHES], 'readonly');
        const store = transaction.objectStore(STORES.BATCHES);
        const index = store.index('fileId');

        return new Promise((resolve, reject) => {
            const request = index.getAll(IDBKeyRange.only(fileId));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Add log entry
     */
    async addLog(logData) {
        const transaction = this.db.transaction([STORES.LOGS], 'readwrite');
        const store = transaction.objectStore(STORES.LOGS);
        return new Promise((resolve, reject) => {
            const request = store.add({
                ...logData,
                timestamp: Date.now()
            });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get logs
     */
    async getLogs(limit = 100) {
        const transaction = this.db.transaction([STORES.LOGS], 'readonly');
        const store = transaction.objectStore(STORES.LOGS);
        const index = store.index('timestamp');

        return new Promise((resolve, reject) => {
            const logs = [];
            const request = index.openCursor(null, 'prev');

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && logs.length < limit) {
                    logs.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(logs);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear logs
     */
    async clearLogs() {
        const transaction = this.db.transaction([STORES.LOGS], 'readwrite');
        const store = transaction.objectStore(STORES.LOGS);
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Save setting
     */
    async saveSetting(key, value) {
        const transaction = this.db.transaction([STORES.SETTINGS], 'readwrite');
        const store = transaction.objectStore(STORES.SETTINGS);
        return new Promise((resolve, reject) => {
            const request = store.put({ key, value });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get setting
     */
    async getSetting(key) {
        const transaction = this.db.transaction([STORES.SETTINGS], 'readonly');
        const store = transaction.objectStore(STORES.SETTINGS);
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result?.value);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear all data
     */
    async clearAll() {
        const transaction = this.db.transaction(
            [STORES.FILES, STORES.BATCHES, STORES.LOGS, STORES.SETTINGS],
            'readwrite'
        );

        const promises = [
            STORES.FILES,
            STORES.BATCHES,
            STORES.LOGS,
            STORES.SETTINGS
        ].map(storeName => {
            return new Promise((resolve, reject) => {
                const request = transaction.objectStore(storeName).clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        });

        return Promise.all(promises);
    }

    /**
     * Get database size estimate
     */
    async getSize() {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentage: (estimate.usage / estimate.quota * 100).toFixed(2)
            };
        }
        return null;
    }
}

// Create singleton instance
const storage = new Storage();

export default storage;
