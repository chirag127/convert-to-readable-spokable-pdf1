// Gemini API Client (REST API)

import { sleep, redactApiKey } from './utils.js';
import storage from './storage.js';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

class GeminiAPI {
    constructor(apiKey, backupApiKey = null) {
        this.apiKey = apiKey;
        this.backupApiKey = backupApiKey;
        this.currentKey = apiKey;
        this.usingBackup = false;
    }

    /**
     * Generate content using Gemini API
     */
    async generateContent(model, prompt, options = {}) {
        const {
            systemInstruction = '',
            temperature = 1,
            topP = 0.95,
            topK = 40,
            maxOutputTokens = 4000,
            timeout = 60000
        } = options;

        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature,
                topP,
                topK,
                maxOutputTokens
            }
        };

        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const url = `${API_BASE_URL}/models/${model}:generateContent`;

        // Log request
        await this.logRequest(model, prompt, requestBody);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': this.currentKey
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            // Log response
            await this.logResponse(model, response.status, data);

            if (!response.ok) {
                throw new Error(this.parseError(data, response.status));
            }

            // Extract text from response
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            return {
                text,
                model,
                usage: data.usageMetadata || {}
            };

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }

            throw error;
        }
    }

    /**
     * Generate content with multimodal input (text + images)
     */
    async generateContentMultimodal(model, textPrompt, images = [], options = {}) {
        const {
            systemInstruction = '',
            temperature = 1,
            topP = 0.95,
            topK = 40,
            maxOutputTokens = 4000,
            timeout = 60000
        } = options;

        const parts = [{ text: textPrompt }];

        // Add images
        for (const image of images) {
            parts.push({
                inlineData: {
                    mimeType: image.mimeType || 'image/png',
                    data: image.data // base64 encoded
                }
            });
        }

        const requestBody = {
            contents: [{ parts }],
            generationConfig: {
                temperature,
                topP,
                topK,
                maxOutputTokens
            }
        };

        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const url = `${API_BASE_els / ${ model }: generateContent`;

        await this.logRequest(model, textPrompt, requestBody);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': this.currentKey
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();
            await this.logResponse(model, response.status, data);

            if (!response.ok) {
                throw new Error(this.parseError(data, response.status));
            }

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            return {
                text,
                model,
                usage: data.usageMetadata || {}
            };

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${ timeout } ms`);
            }

            throw error;
        }
    }

    /**
     * List available models
     */
    async listModels() {
        const url = `${ API_BASE_URL }/models`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-goog-api-key': this.currentKey
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(this.parseError(data, response.status));
            }

            return data.models || [];
        } catch (error) {
            console.error('Failed to list models:', error);
            throw error;
        }
    }

    /**
     * Switch to backup API key
     */
    switchToBackup() {
        if (this.backupApiKey && !this.usingBackup) {
            this.currentKey = this.backupApiKey;
            this.usingBackup = true;
            return true;
        }
        return false;
    }

    /**
     * Reset to primary API key
     */
    resetToPrimary() {
        this.currentKey = this.apiKey;
        this.usingBackup = false;
    }

    /**
     * Parse error from API response
     */
    parseError(data, status) {
        if (data.error) {
            const message = data.error.message || 'Unknown error';
            const code = data.error.code || status;

            // Provide helpful error messages
            if (status === 401 || status === 403) {
                return `API key invalid or unauthorized (${code}). Please check your API key in Settings.`;
            } else if (status === 429) {
                return `Rate limit exceeded (${code}). Try increasing Rate Limit Delay or reducing Parallel Chunks in Settings.`;
            } else if (status === 400) {
                return `Bad request (${code}): ${message}. Check your prompt or model settings.`;
            } else if (status === 404) {
                return `Model not found (${code}). The selected model may not be available. Try a different model.`;
            } else if (status >= 500) {
                return `Server error (${code}): ${message}. Please try again later.`;
            }

            return `API error (${code}): ${message}`;
        }

        return `HTTP ${status}: Request failed`;
    }

    /**
     * Log API request
     */
    async logRequest(model, prompt, requestBody) {
        try {
            await storage.addLog({
                level: 'info',
                type: 'api_request',
                model,
                promptLength: prompt.length,
                apiKey: redactApiKey(this.currentKey),
                usingBackup: this.usingBackup,
                // Don't log full request body to save space
                requestSize: JSON.stringify(requestBody).length
            });
        } catch (error) {
            console.error('Failed to log request:', error);
        }
    }

    /**
     * Log API response
     */
    async logResponse(model, status, data) {
        try {
            await storage.addLog({
                level: status >= 400 ? 'error' : 'info',
                type: 'api_response',
                model,
                status,
                success: status < 400,
                usage: data.usageMetadata || {},
                error: data.error ? data.error.message : null
            });
        } catch (error) {
            console.error('Failed to log response:', error);
        }
    }
}

/**
 * Retry with model failover
 */
export async function generateWithFailover(
    apiKey,
    backupApiKey,
    models,
    prompt,
    options = {}
) {
    const {
        maxRetries = 3,
        retryDelay = 2000,
        rateLimitDelay = 1000,
        ...apiOptions
    } = options;

    const api = new GeminiAPI(apiKey, backupApiKey);
    let lastError = null;

    // Try each model in priority order
    for (const model of models) {
        // Try with retries
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const result = await api.generateContent(model, prompt, apiOptions);

                // Success - reset to primary key for next call
                api.resetToPrimary();

                return result;

            } catch (error) {
                lastError = error;
                const errorMessage = error.message || String(error);

                // Check if it's a rate limit error
                if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
                    // Wait before retry
                    await sleep(rateLimitDelay * (attempt + 1));

                    // Try backup key if available
                    if (attempt === Math.floor(maxRetries / 2)) {
                        if (api.switchToBackup()) {
                            console.log('Switched to backup API key');
                        }
                    }

                    continue;
                }

                // Check if it's an auth error
                if (errorMessage.includes('401') || errorMessage.includes('403')) {
                    // Try backup key immediately
                    if (api.switchToBackup()) {
                        console.log('Auth error - switched to backup API key');
                        continue;
                    } else {
                        // No backup key, fail immediately
                        throw error;
                    }
                }

                // For other errors, wait and retry
                if (attempt < maxRetries - 1) {
                    await sleep(retryDelay * Math.pow(2, attempt));
                } else {
                    // Last attempt with this model failed, try next model
                    break;
                }
            }
        }
    }

    // All models failed
    throw new Error(
        `All models failed after ${maxRetries} retries. Last error: ${lastError?.message || 'Unknown error'}`
    );
}

export default GeminiAPI;
