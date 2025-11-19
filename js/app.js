// Main Application Controller

import storage from './storage.js';
import settings from './settings.js';
import { extractTextFromPDF, getPDFInfo } from './pdf-extractor.js';
import { splitIntoBatches, BatchProcessor } from './batch-processor.js';
import { generateAndDownloadPDF, generatePDFBlob } from './pdf-generator.js';
import * as ui from './ui.js';
import {
    formatBytes,
    formatNumber,
    detectLanguage,
    estimateTokens,
    generateId,
    sanitizeFilename,
    downloadFile
} from './utils.js';

class App {
    constructor() {
        this.currentFile = null;
        this.currentFileData = null;
        this.extractedText = null;
        this.batches = null;
        this.processor = null;
        this.transformedText = null;
        this.processingStartTime = null;
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            // Initialize storage
            await storage.init();

            // Initialize settings
            await settings.init();

            // Apply dark mode
            if (settings.get('darkMode')) {
                document.body.classList.add('dark-mode');
            }

            // Show welcome banner if first visit
            if (settings.get('showWelcome')) {
                ui.show('welcomeBanner');
            }

            // Load stored files
            await this.loadStoredFiles();

            // Setup event listeners
            this.setupEventListeners();

            // Setup settings UI
            this.setupSettingsUI();

            console.log('App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            ui.showToast('Failed to initialize application', 'error');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // File upload
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const selectFileBtn = document.getElementById('selectFileBtn');

        console.log('Setting up file upload listeners...', { dropZone, fileInput, selectFileBtn });

        selectFileBtn.addEventListener('click', () => {
            console.log('Select file button clicked');
            fileInput.click();
        });
        fileInput.addEventListener('change', (e) => {
            console.log('File input changed', e.target.files);
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                this.handleFileSelect(file);
            } else {
                ui.showToast('Please drop a PDF file', 'error');
            }
        });

        // Process button
        document.getElementById('processBtn').addEventListener('click', () => this.startProcessing());
        document.getElementById('cancelFileBtn').addEventListener('click', () => this.cancelFile());

        // Progress controls
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseProcessing());
        document.getElementById('cancelBtn').addEventListener('click', () => this.cancelProcessing());
        document.getElementById('downloadPartialBtn').addEventListener('click', () => this.downloadPartial());

        // Results actions
        document.getElementById('downloadPdfBtn').addEventListener('click', () => this.downloadPDF());
        document.getElementById('downloadTextBtn').addEventListener('click', () => this.downloadText());
        document.getElementById('previewBtn').addEventListener('click', () => this.previewText());
        document.getElementById('newFileBtn').addEventListener('click', () => this.resetForNewFile());

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => ui.showModal('settingsModal'));
        document.querySelector('.modal-close').addEventListener('click', () => ui.hideModal('settingsModal'));

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());

        // Welcome banner
        document.getElementById('closeWelcome').addEventListener('click', () => {
            ui.hide('welcomeBanner');
            settings.set('showWelcome', false);
        });

        // Stored files actions
        document.getElementById('storedFilesList').addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            const fileId = e.target.closest('[data-action]')?.dataset.id;

            if (action && fileId) {
                this.handleStoredFileAction(action, fileId);
            }
        });

        // Modal click outside to close
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                ui.hideModal('settingsModal');
            }
        });
    }

    /**
     * Setup settings UI
     */
    setupSettingsUI() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                ui.switchTab(btn.dataset.tab);
            });
        });

        // Load settings into UI
        this.loadSettingsToUI();

        // Auto-save on change
        const settingsInputs = [
            'apiKey', 'backupApiKey', 'apiTimeout',
            'batchSize', 'overlapSize', 'maxRetries', 'retryDelay', 'rateLimitDelay',
            'turboMode', 'parallelChunks',
            'systemPrompt', 'transformPrompt',
            'fontSize', 'lineHeight', 'pageMargin', 'fontFamily', 'pageSize',
            'addPageNumbers', 'generateToc',
            'modelPriority', 'temperature', 'topP', 'topK', 'maxOutputTokens'
        ];

        settingsInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.saveSettingsFromUI());
            }
        });

        // Settings buttons
        document.getElementById('clearApiKey').addEventListener('click', async () => {
            if (ui.confirm('Clear all API keys?')) {
                await settings.clearApiKeys();
                ui.setValue('apiKey', '');
                ui.setValue('backupApiKey', '');
                ui.showToast('API keys cleared', 'success');
            }
        });

        document.getElementById('resetPrompts').addEventListener('click', async () => {
            if (ui.confirm('Reset all prompts to defaults?')) {
                await settings.resetPrompts();
                this.loadSettingsToUI();
                ui.showToast('Prompts reset to defaults', 'success');
            }
        });

        document.getElementById('resetSettings').addEventListener('click', async () => {
            if (ui.confirm('Reset all settings to defaults? This cannot be undone.')) {
                await settings.reset();
                this.loadSettingsToUI();
                ui.showToast('Settings reset to defaults', 'success');
            }
        });

        document.getElementById('eraseAllData').addEventListener('click', async () => {
            if (ui.confirm('Erase ALL data including files, logs, and settings? This cannot be undone.')) {
                await storage.clearAll();
                await settings.reset();
                localStorage.clear();
                ui.showToast('All data erased', 'success');
                setTimeout(() => window.location.reload(), 1000);
            }
        });
    }

    /**
     * Load settings to UI
     */
    loadSettingsToUI() {
        const allSettings = settings.getAll();

        Object.entries(allSettings).forEach(([key, value]) => {
            if (key === 'modelPriority' && Array.isArray(value)) {
                ui.setValue(key, value.join('\n'));
            } else {
                ui.setValue(key, value);
            }
        });
    }

    /**
     * Save settings from UI
     */
    async saveSettingsFromUI() {
        const updates = {};

        // Get all setting values
        const settingKeys = Object.keys(settings.getAll());

        settingKeys.forEach(key => {
            const value = ui.getValue(key);
            if (value !== null) {
                if (key === 'modelPriority') {
                    updates[key] = value.split('\n').map(m => m.trim()).filter(m => m);
                } else {
                    updates[key] = value;
                }
            }
        });

        await settings.setMultiple(updates);
    }

    /**
     * Handle file selection
     */
    async handleFileSelect(file) {
        if (!file) return;

        if (file.type !== 'application/pdf') {
            ui.showToast('Please select a PDF file', 'error');
            return;
        }

        this.currentFile = file;

        try {
            ui.showToast('Analyzing PDF...', 'info', 2000);

            // Get PDF info
            const info = await getPDFInfo(file);

            // Estimate batches
            const batchSize = settings.get('batchSize');
            const estimatedBatches = Math.ceil(info.estimatedTextLength / (batchSize * 4));

            // Update UI
            ui.updateFileInfo({
                filename: file.name,
                pages: info.numPages,
                size: file.size,
                textLength: info.estimatedTextLength,
                language: 'English', // Could improve detection
                batches: estimatedBatches
            });

            ui.hide('dropZone');
            ui.show('fileInfo');

        } catch (error) {
            console.error('Failed to analyze PDF:', error);
            ui.showToast('Failed to analyze PDF: ' + error.message, 'error');
        }
    }

    /**
     * Cancel file selection
     */
    cancelFile() {
        this.currentFile = null;
        ui.hide('fileInfo');
        ui.show('dropZone');
    }

    /**
     * Start processing
     */
    async startProcessing() {
        if (!this.currentFile) return;

        // Validate settings
        const errors = settings.validate();
        if (errors.length > 0) {
            ui.showToast(errors[0], 'error');
            ui.showModal('settingsModal');
            return;
        }

        try {
            ui.hide('fileInfo');
            ui.show('progressSection');

            this.processingStartTime = Date.now();

            // Extract text
            ui.updateProgress(0, 100, 'Extracting text from PDF...');

            const extracted = await extractTextFromPDF(this.currentFile, (page, total) => {
                ui.updateProgress(page, total, `Extracting text (page ${page}/${total})...`);
            });

            this.extractedText = extracted.text;
            this.currentFileData = {
                id: generateId(),
                filename: this.currentFile.name,
                pages: extracted.numPages,
                size: this.currentFile.size,
                originalText: this.extractedText,
                metadata: extracted.metadata,
                timestamp: Date.now(),
                status: 'processing'
            };

            // Save to storage
            await storage.saveFile(this.currentFileData);

            // Split into batches
            ui.updateProgress(0, 100, 'Splitting into batches...');

            this.batches = splitIntoBatches(
                this.extractedText,
                settings.get('batchSize'),
                settings.get('overlapSize')
            );

            ui.showToast(`Split into ${this.batches.length} batches`, 'info', 3000);

            // Process batches
            await this.processBatches();

        } catch (error) {
            console.error('Processing failed:', error);
            ui.showToast('Processing failed: ' + error.message, 'error');
            this.resetForNewFile();
        }
    }

    /**
     * Process batches
     */
    async processBatches() {
        this.processor = new BatchProcessor({
            apiKey: settings.get('apiKey'),
            backupApiKey: settings.get('backupApiKey'),
            models: settings.get('modelPriority'),
            systemPrompt: settings.get('systemPrompt'),
            transformPrompt: settings.get('transformPrompt'),
            maxRetries: settings.get('maxRetries'),
            retryDelay: settings.get('retryDelay'),
            rateLimitDelay: settings.get('rateLimitDelay'),
            parallelChunks: settings.get('turboMode') ? settings.get('parallelChunks') : 1,
            temperature: settings.get('temperature'),
            topP: settings.get('topP'),
            topK: settings.get('topK'),
            maxOutputTokens: settings.get('maxOutputTokens'),
            timeout: settings.get('apiTimeout') * 1000,
            onProgress: (progress) => {
                ui.updateProgress(progress.current, progress.total, progress.stage);
                ui.updateETA(this.processingStartTime, progress.current, progress.total);
                ui.updateBatchTable(this.batches);
            },
            onBatchComplete: (batch) => {
                ui.showToast(`Batch ${batch.batchNumber + 1} completed`, 'success', 2000);
            },
            onBatchError: (batch, index, error) => {
                ui.showToast(`Batch ${batch.batchNumber + 1} failed: ${error.message}`, 'error', 5000);
            }
        });

        try {
            await this.processor.process(this.batches, this.currentFileData.id);

            // Assemble transformed text
            this.transformedText = this.processor.assembleText();

            // Update file data
            this.currentFileData.transformedText = this.transformedText;
            this.currentFileData.status = 'complete';
            this.currentFileData.processingTime = Date.now() - this.processingStartTime;
            await storage.saveFile(this.currentFileData);

            // Show results
            ui.hide('progressSection');
            ui.show('resultsSection');

            ui.updateResults({
                originalLength: this.extractedText.length,
                transformedLength: this.transformedText.length,
                processingTime: this.currentFileData.processingTime
            });

            ui.showToast('Processing complete!', 'success');

            // Reload stored files
            await this.loadStoredFiles();

        } catch (error) {
            console.error('Batch processing failed:', error);
            ui.showToast('Processing failed: ' + error.message, 'error');
        }
    }

    /**
     * Pause processing
     */
    pauseProcessing() {
        if (this.processor) {
            this.processor.pause();
            ui.showToast('Processing paused', 'info');
            document.getElementById('pauseBtn').textContent = '▶️ Resume';
            document.getElementById('pauseBtn').onclick = () => this.resumeProcessing();
        }
    }

    /**
     * Resume processing
     */
    resumeProcessing() {
        if (this.processor) {
            this.processor.resume();
            ui.showToast('Processing resumed', 'info');
            document.getElementById('pauseBtn').textContent = '⏸️ Pause';
            document.getElementById('pauseBtn').onclick = () => this.pauseProcessing();
        }
    }

    /**
     * Cancel processing
     */
    cancelProcessing() {
        if (ui.confirm('Cancel processing? Progress will be lost.')) {
            if (this.processor) {
                this.processor.cancel();
            }
            ui.showToast('Processing cancelled', 'warning');
            this.resetForNewFile();
        }
    }

    /**
     * Download partial results
     */
    async downloadPartial() {
        if (!this.processor) return;

        const partialText = this.processor.assembleText();
        if (!partialText) {
            ui.showToast('No completed batches yet', 'warning');
            return;
        }

        const filename = `partial_${sanitizeFilename(this.currentFile.name.replace('.pdf', ''))}.txt`;
        const blob = new Blob([partialText], { type: 'text/plain' });
        downloadFile(blob, filename);

        ui.showToast('Partial results downloaded', 'success');
    }

    /**
     * Download final PDF
     */
    async downloadPDF() {
        if (!this.transformedText) return;

        try {
            ui.showToast('Generating PDF...', 'info', 2000);

            const filename = sanitizeFilename(
                this.currentFile.name.replace('.pdf', '_readable.pdf')
            );

            await generateAndDownloadPDF(this.transformedText, filename, {
                fontSize: settings.get('fontSize'),
                lineHeight: settings.get('lineHeight'),
                pageMargin: settings.get('pageMargin'),
                fontFamily: settings.get('fontFamily'),
                pageSize: settings.get('pageSize'),
                addPageNumbers: settings.get('addPageNumbers'),
                generateToc: settings.get('generateToc'),
                title: this.currentFile.name.replace('.pdf', ''),
                author: this.currentFileData.metadata?.author || ''
            });

            ui.showToast('PDF downloaded successfully', 'success');

        } catch (error) {
            console.error('Failed to generate PDF:', error);
            ui.showToast('Failed to generate PDF: ' + error.message, 'error');
        }
    }

    /**
     * Download as text
     */
    downloadText() {
        if (!this.transformedText) return;

        const filename = sanitizeFilename(
            this.currentFile.name.replace('.pdf', '_readable.txt')
        );
        const blob = new Blob([this.transformedText], { type: 'text/plain' });
        downloadFile(blob, filename);

        ui.showToast('Text file downloaded', 'success');
    }

    /**
     * Preview text
     */
    previewText() {
        if (!this.transformedText) return;

        const preview = window.open('', '_blank');
        preview.document.write(`
            <html>
            <head>
                <title>Preview - ${this.currentFile.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                    pre { white-space: pre-wrap; word-wrap: break-word; }
                </style>
            </head>
            <body>
                <h1>Preview: ${this.currentFile.name}</h1>
                <pre>${this.transformedText}</pre>
            </body>
            </html>
        `);
    }

    /**
     * Reset for new file
     */
    resetForNewFile() {
        this.currentFile = null;
        this.currentFileData = null;
        this.extractedText = null;
        this.batches = null;
        this.processor = null;
        this.transformedText = null;

        ui.hide('fileInfo');
        ui.hide('progressSection');
        ui.hide('resultsSection');
        ui.show('dropZone');

        // Reset file input
        document.getElementById('fileInput').value = '';
    }

    /**
     * Toggle dark mode
     */
    async toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark-mode');
        await settings.set('darkMode', isDark);

        // Update icon
        document.getElementById('darkModeToggle').textContent = isDark ? '☀️' : '🌙';
    }

    /**
     * Load stored files
     */
    async loadStoredFiles() {
        try {
            const files = await storage.getAllFiles();
            ui.updateStoredFilesList(files);
        } catch (error) {
            console.error('Failed to load stored files:', error);
        }
    }

    /**
     * Handle stored file actions
     */
    async handleStoredFileAction(action, fileId) {
        try {
            const file = await storage.getFile(fileId);
            if (!file) {
                ui.showToast('File not found', 'error');
                return;
            }

            switch (action) {
                case 'download':
                    if (file.transformedText) {
                        const filename = sanitizeFilename(file.filename.replace('.pdf', '_readable.pdf'));
                        await generateAndDownloadPDF(file.transformedText, filename, {
                            fontSize: settings.get('fontSize'),
                            lineHeight: settings.get('lineHeight'),
                            pageMargin: settings.get('pageMargin'),
                            fontFamily: settings.get('fontFamily'),
                            pageSize: settings.get('pageSize'),
                            addPageNumbers: settings.get('addPageNumbers'),
                            generateToc: settings.get('generateToc'),
                            title: file.filename.replace('.pdf', ''),
                            author: file.metadata?.author || ''
                        });
                        ui.showToast('Downloaded', 'success');
                    } else {
                        ui.showToast('No transformed text available', 'warning');
                    }
                    break;

                case 'view':
                    if (file.transformedText) {
                        const preview = window.open('', '_blank');
                        preview.document.write(`
                            <html>
                            <head>
                                <title>${file.filename}</title>
                                <style>
                                    body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                                    pre { white-space: pre-wrap; word-wrap: break-word; }
                                </style>
                            </head>
                            <body>
                                <h1>${file.filename}</h1>
                                <pre>${file.transformedText}</pre>
                            </body>
                            </html>
                        `);
                    } else {
                        ui.showToast('No transformed text available', 'warning');
                    }
                    break;

                case 'delete':
                    if (ui.confirm(`Delete ${file.filename}?`)) {
                        await storage.deleteFile(fileId);
                        await this.loadStoredFiles();
                        ui.showToast('File deleted', 'success');
                    }
                    break;
            }
        } catch (error) {
            console.error('Action failed:', error);
            ui.showToast('Action failed: ' + error.message, 'error');
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
    });
} else {
    const app = new App();
    app.init();
}
