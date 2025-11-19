// Utility Functions

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Calculate ETA based on progress
 */
export function calculateETA(startTime, current, total) {
    if (current === 0) return 'Calculating...';
    const elapsed = Date.now() - startTime;
    const rate = current / elapsed;
    const remaining = total - current;
    const eta = remaining / rate;
    return formatDuration(eta);
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generate unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Detect language from text (simple heuristic)
 */
export function detectLanguage(text) {
    // Simple detection based on character patterns
    const sample = text.substring(0, 1000);

    // Check for common English words
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a'];
    const englishCount = englishWords.filter(word =>
        sample.toLowerCase().includes(` ${word} `)
    ).length;

    if (englishCount >= 3) return 'English';

    // Add more language detection logic as needed
    return 'Unknown';
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9.-]/gi, '_');
}

/**
 * Download file
 */
export function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Sleep/delay function
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const delay = baseDelay * Math.pow(2, i);
            await sleep(delay);
        }
    }
}

/**
 * Parse error message from API response
 */
export function parseErrorMessage(error) {
    if (error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'An unknown error occurred';
}

/**
 * Validate API key format
 */
export function isValidApiKey(key) {
    return key && key.length > 20 && /^[A-Za-z0-9_-]+$/.test(key);
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Redact API key for logging
 */
export function redactApiKey(key) {
    if (!key || key.length < 8) return '***';
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp() {
    return new Date().toISOString();
}

/**
 * Format date
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}
