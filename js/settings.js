// Settings Management

import storage from './storage.js';
import { debounce } from './utils.js';

// Default settings
export const DEFAULT_SETTINGS = {
    // API Settings
    apiKey: '',
    backupApiKey: '',
    apiTimeout: 60,

    // Processing Settings
    batchSize: 10000,
    overlapSize: 200,
    maxRetries: 3,
    retryDelay: 2000,
    rateLimitDelay: 1000,
    turboMode: false,
    parallelChunks: 3,

    // Prompts
    systemPrompt: 'You are an expert at converting technical documentation into natural, spoken language optimized for text-to-speech systems.',
    transformPrompt: 'Convert the following text into a natural, spoken format that is easy to listen to. Maintain accuracy while making it conversational. Expand acronyms on first use. Convert formulas and special symbols into spoken words. Convert tables into narrative sentences. Describe figures and images clearly. Replace code blocks with descriptive explanations of what the code does (do not read code line-by-line). Preserve the logical order and headings. Add natural transitions between sections. Remove inline citations and footnotes. Make the output TTS-friendly with good rhythm (commas and pauses).',
    tablePrompt: 'Convert this table into natural narrative sentences, describing each row and column clearly.',
    codePrompt: 'Describe what this code does in plain English, explaining its purpose and key logic without reading it line by line.',
    mathPrompt: 'Convert mathematical notation into spoken form (e.g., x² becomes "x squared").',
    figurePrompt: 'Describe this figure or image in detail for someone who cannot see it.',
    listPrompt: 'Convert this list into flowing sentences with natural transitions.',

    // Output Settings
    fontSize: 12,
    lineHeight: 1.5,
    pageMargin: 20,
    fontFamily: 'Times New Roman',
    pageSize: 'Letter',
    addPageNumbers: true,
    generateToc: true,

    // Advanced Settings
    modelPriority: [
        'gemini-2.0-flash-exp',
        'gemini-2.0-flash-thinking-exp-1219',
        'gemini-exp-1206',
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash'
    ],
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 4000,
    presencePenalty: 0,
    frequencyPenalty: 0,

    // UI Settings
    darkMode: false,
    showWelcome: true,

    // Language Settings
    inputLanguage: 'English',
    outputLanguage: 'English',
    dateFormat: 'YYYY-MM-DD'
};

class Settings {
    constructor() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.listeners = [];
    }

    /**
     * Initialize settings from storage
     */
    async init() {
        // Load from IndexedDB
        const stored = await storage.getSetting('appSettings');
        if (stored) {
            this.settings = { ...DEFAULT_SETTINGS, ...stored };
        }

        // Load API key from localStorage (for security)
        const apiKey = localStorage.getItem('apiKey');
        const backupApiKey = localStorage.getItem('backupApiKey');
        if (apiKey) this.settings.apiKey = apiKey;
        if (backupApiKey) this.settings.backupApiKey = backupApiKey;

        // Load dark mode preference
        const darkMode = localStorage.getItem('darkMode') === 'true';
        this.settings.darkMode = darkMode;

        // Load welcome banner state
        const showWelcome = localStorage.getItem('showWelcome') !== 'false';
        this.settings.showWelcome = showWelcome;

        return this.settings;
    }

    /**
     * Get setting value
     */
    get(key) {
        return this.settings[key];
    }

    /**
     * Get all settings
     */
    getAll() {
        return { ...this.settings };
    }

    /**
     * Set setting value
     */
    async set(key, value) {
        this.settings[key] = value;
        await this.save();
        this.notifyListeners(key, value);
    }

    /**
     * Set multiple settings
     */
    async setMultiple(updates) {
        Object.assign(this.settings, updates);
        await this.save();
        Object.entries(updates).forEach(([key, value]) => {
            this.notifyListeners(key, value);
        });
    }

    /**
     * Save settings to storage
     */
    async save() {
        // Save most settings to IndexedDB
        const toSave = { ...this.settings };
        delete toSave.apiKey;
        delete toSave.backupApiKey;
        await storage.saveSetting('appSettings', toSave);

        // Save API keys to localStorage
        if (this.settings.apiKey) {
            localStorage.setItem('apiKey', this.settings.apiKey);
        }
        if (this.settings.backupApiKey) {
            localStorage.setItem('backupApiKey', this.settings.backupApiKey);
        }

        // Save UI preferences to localStorage
        localStorage.setItem('darkMode', this.settings.darkMode);
        localStorage.setItem('showWelcome', this.settings.showWelcome);
    }

    /**
     * Reset to defaults
     */
    async reset() {
        this.settings = { ...DEFAULT_SETTINGS };
        await this.save();
        this.notifyListeners('*', this.settings);
    }

    /**
     * Clear API keys
     */
    async clearApiKeys() {
        this.settings.apiKey = '';
        this.settings.backupApiKey = '';
        localStorage.removeItem('apiKey');
        localStorage.removeItem('backupApiKey');
        await this.save();
    }

    /**
     * Reset prompts to defaults
     */
    async resetPrompts() {
        const promptKeys = [
            'systemPrompt',
            'transformPrompt',
            'tablePrompt',
            'codePrompt',
            'mathPrompt',
            'figurePrompt',
            'listPrompt'
        ];

        promptKeys.forEach(key => {
            this.settings[key] = DEFAULT_SETTINGS[key];
        });

        await this.save();
        this.notifyListeners('prompts', 'reset');
    }

    /**
     * Add change listener
     */
    onChange(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify listeners of changes
     */
    notifyListeners(key, value) {
        this.listeners.forEach(callback => {
            try {
                callback(key, value);
            } catch (error) {
                console.error('Settings listener error:', error);
            }
        });
    }

    /**
     * Export settings as JSON
     */
    export() {
        const exported = { ...this.settings };
        // Redact API keys
        if (exported.apiKey) exported.apiKey = '***REDACTED***';
        if (exported.backupApiKey) exported.backupApiKey = '***REDACTED***';
        return JSON.stringify(exported, null, 2);
    }

    /**
     * Import settings from JSON
     */
    async import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            // Don't import API keys
            delete imported.apiKey;
            delete imported.backupApiKey;

            // Merge with current settings
            this.settings = { ...this.settings, ...imported };
            await this.save();
            this.notifyListeners('*', this.settings);
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }

    /**
     * Validate settings
     */
    validate() {
        const errors = [];

        if (!this.settings.apiKey) {
            errors.push('API key is required');
        }

        if (this.settings.batchSize < 1000 || this.settings.batchSize > 50000) {
            errors.push('Batch size must be between 1000 and 50000');
        }

        if (this.settings.maxRetries < 0 || this.settings.maxRetries > 10) {
            errors.push('Max retries must be between 0 and 10');
        }

        if (this.settings.parallelChunks < 1 || this.settings.parallelChunks > 10) {
            errors.push('Parallel chunks must be between 1 and 10');
        }

        if (this.settings.temperature < 0 || this.settings.temperature > 2) {
            errors.push('Temperature must be between 0 and 2');
        }

        return errors;
    }
}

// Create singleton instance
const settings = new Settings();

export default settings;
