// Batch Processing Logic

import { estimateTokens, generateId, sleep } from './utils.js';
import { generateWithFailover } from './gemini-api.js';
import storage from './storage.js';

/**
 * Split text into batches with overlap
 */
export function splitIntoBatches(text, batchSize = 10000, overlapSize = 200) {
    const tokens = estimateTokens(text);
    const batches = [];

    if (tokens <= batchSize) {
        // Text fits in one batch
        return [{
            id: generateId(),
            text: text,
            startPos: 0,
            endPos: text.length,
            tokens: tokens
        }];
    }

    // Calculate character size per batch (rough estimate)
    const charsPerBatch = Math.floor((batchSize / tokens) * text.length);
    const overlapChars = Math.floor((overlapSize / tokens) * text.length);

    let position = 0;
    let batchNum = 0;

    while (position < text.length) {
        const start = Math.max(0, position - overlapChars);
        const end = Math.min(text.length, position + charsPerBatch);

        // Try to break at sentence boundary
        let actualEnd = end;
        if (end < text.length) {
            const nextPeriod = text.indexOf('. ', end);
            const nextNewline = text.indexOf('\n', end);

            if (nextPeriod !== -1 && nextPeriod < end + 200) {
                actualEnd = nextPeriod + 1;
            } else if (nextNewline !== -1 && nextNewline < end + 200) {
                actualEnd = nextNewline + 1;
            }
        }

        const batchText = text.substring(start, actualEnd);

        batches.push({
            id: generateId(),
            batchNumber: batchNum++,
            text: batchText,
            startPos: start,
            endPos: actualEnd,
            tokens: estimateTokens(batchText),
            status: 'pending',
            transformedText: null,
            error: null,
            attempts: 0,
            model: null
        });

        position = actualEnd;
    }

    return batches;
}

/**
 * Process batches with progress tracking
 */
export class BatchProcessor {
    constructor(options = {}) {
        this.options = {
            apiKey: options.apiKey,
            backupApiKey: options.backupApiKey,
            models: options.models || ['gemini-2.0-flash-exp'],
            systemPrompt: options.systemPrompt || '',
            transformPrompt: options.transformPrompt || '',
            maxRetries: options.maxRetries || 3,
            retryDelay: options.retryDelay || 2000,
            rateLimitDelay: options.rateLimitDelay || 1000,
            parallelChunks: options.parallelChunks || 1,
            temperature: options.temperature || 1,
            topP: options.topP || 0.95,
            topK: options.topK || 40,
            maxOutputTokens: options.maxOutputTokens || 4000,
            timeout: options.timeout || 60000,
            onProgress: options.onProgress || (() => { }),
            onBatchComplete: options.onBatchComplete || (() => { }),
            onBatchError: options.onBatchError || (() => { })
        };

        this.batches = [];
        this.fileId = null;
        this.paused = false;
        this.cancelled = false;
        this.startTime = null;
        this.completedCount = 0;
    }

    /**
     * Process all batches
     */
    async process(batches, fileId) {
        this.batches = batches;
        this.fileId = fileId;
        this.startTime = Date.now();
        this.completedCount = 0;
        this.paused = false;
        this.cancelled = false;

        // Save initial batch states
        for (const batch of batches) {
            await storage.saveBatch({
                ...batch,
                fileId: this.fileId
            });
        }

        // Process in parallel if enabled
        if (this.options.parallelChunks > 1) {
            await this.processParallel();
        } else {
            await this.processSequential();
        }

        return this.batches;
    }

    /**
     * Process batches sequentially
     */
    async processSequential() {
        for (let i = 0; i < this.batches.length; i++) {
            if (this.cancelled) break;

            while (this.paused) {
                await sleep(100);
            }

            const batch = this.batches[i];
            await this.processBatch(batch, i);

            // Rate limiting delay
            if (i < this.batches.length - 1) {
                await sleep(this.options.rateLimitDelay);
            }
        }
    }

    /**
     * Process batches in parallel
     */
    async processParallel() {
        const chunks = [];
        for (let i = 0; i < this.batches.length; i += this.options.parallelChunks) {
            chunks.push(this.batches.slice(i, i + this.options.parallelChunks));
        }

        for (const chunk of chunks) {
            if (this.cancelled) break;

            while (this.paused) {
                await sleep(100);
            }

            // Process chunk in parallel
            await Promise.all(
                chunk.map((batch, idx) => this.processBatch(batch, batch.batchNumber))
            );

            // Rate limiting delay between chunks
            await sleep(this.options.rateLimitDelay);
        }
    }

    /**
     * Process single batch
     */
    async processBatch(batch, index) {
        batch.status = 'processing';
        batch.attempts++;

        this.options.onProgress({
            current: this.completedCount,
            total: this.batches.length,
            batch: batch,
            stage: 'processing'
        });

        // Save batch state
        await storage.saveBatch({
            ...batch,
            fileId: this.fileId
        });

        try {
            // Build prompt
            const prompt = `${this.options.transformPrompt}\n\n${batch.text}`;

            // Call API with failover
            const result = await generateWithFailover(
                this.options.apiKey,
                this.options.backupApiKey,
                this.options.models,
                prompt,
                {
                    systemInstruction: this.options.systemPrompt,
                    temperature: this.options.temperature,
                    topP: this.options.topP,
                    topK: this.options.topK,
                    maxOutputTokens: this.options.maxOutputTokens,
                    timeout: this.options.timeout,
                    maxRetries: this.options.maxRetries,
                    retryDelay: this.options.retryDelay,
                    rateLimitDelay: this.options.rateLimitDelay
                }
            );

            // Success
            batch.status = 'success';
            batch.transformedText = result.text;
            batch.model = result.model;
            batch.usage = result.usage;
            this.completedCount++;

            this.options.onBatchComplete(batch, index);

        } catch (error) {
            // Error
            batch.status = 'error';
            batch.error = error.message || String(error);

            this.options.onBatchError(batch, index, error);

            // Log error
            await storage.addLog({
                level: 'error',
                type: 'batch_error',
                batchId: batch.id,
                batchNumber: batch.batchNumber,
                error: batch.error,
                attempts: batch.attempts
            });
        }

        // Save final batch state
        await storage.saveBatch({
            ...batch,
            fileId: this.fileId
        });

        this.options.onProgress({
            current: this.completedCount,
            total: this.batches.length,
            batch: batch,
            stage: batch.status === 'success' ? 'complete' : 'error'
        });
    }

    /**
     * Pause processing
     */
    pause() {
        this.paused = true;
    }

    /**
     * Resume processing
     */
    resume() {
        this.paused = false;
    }

    /**
     * Cancel processing
     */
    cancel() {
        this.cancelled = true;
    }

    /**
     * Retry failed batches
     */
    async retryFailed() {
        const failedBatches = this.batches.filter(b => b.status === 'error');

        for (const batch of failedBatches) {
            if (this.cancelled) break;

            while (this.paused) {
                await sleep(100);
            }

            batch.status = 'pending';
            batch.error = null;
            await this.processBatch(batch, batch.batchNumber);

            await sleep(this.options.rateLimitDelay);
        }
    }

    /**
     * Get processing statistics
     */
    getStats() {
        const total = this.batches.length;
        const completed = this.batches.filter(b => b.status === 'success').length;
        const failed = this.batches.filter(b => b.status === 'error').length;
        const pending = this.batches.filter(b => b.status === 'pending').length;
        const processing = this.batches.filter(b => b.status === 'processing').length;

        const elapsed = this.startTime ? Date.now() - this.startTime : 0;
        const rate = completed > 0 ? elapsed / completed : 0;
        const eta = pending > 0 ? rate * pending : 0;

        return {
            total,
            completed,
            failed,
            pending,
            processing,
            percentage: total > 0 ? (completed / total * 100).toFixed(1) : 0,
            elapsed,
            eta,
            rate
        };
    }

    /**
     * Assemble transformed text from batches
     */
    assembleText() {
        const successfulBatches = this.batches
            .filter(b => b.status === 'success')
            .sort((a, b) => a.batchNumber - b.batchNumber);

        if (successfulBatches.length === 0) {
            return '';
        }

        // Simple concatenation (could be improved with overlap handling)
        return successfulBatches
            .map(b => b.transformedText)
            .join('\n\n');
    }
}

export default BatchProcessor;
