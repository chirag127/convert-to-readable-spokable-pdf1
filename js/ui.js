// UI Controller

import { formatBytes, formatNumber, formatDuration, calculateETA } from './utils.js';

/**
 * Show/hide elements
 */
export function show(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    element?.classList.remove('hidden');
}

export function hide(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    element?.classList.add('hidden');
}

export function toggle(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    element?.classList.toggle('hidden');
}

/**
 * Show toast notification
 */
export function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            toast.remove();
        }, duration);
    }
}

/**
 * Update file info display
 */
export function updateFileInfo(info) {
    document.getElementById('fileName').textContent = info.filename || '-';
    document.getElementById('filePages').textContent = info.pages || '-';
    document.getElementById('fileSize').textContent = info.size ? formatBytes(info.size) : '-';
    document.getElementById('textLength').textContent = info.textLength ?
        `${formatNumber(info.textLength)} chars / ${formatNumber(Math.floor(info.textLength / 5))} words` : '-';
    document.getElementById('detectedLang').textContent = info.language || '-';
    document.getElementById('estimatedBatches').textContent = info.batches || '-';
}

/**
 * Update progress bar
 */
export function updateProgress(current, total, stage = '') {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    const progressBar = document.querySelector('.progress-fill');
    const progressPercent = document.getElementById('progressPercent');
    const currentStage = document.getElementById('currentStage');
    const batchProgress = document.getElementById('batchProgress');

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }

    if (progressPercent) {
        progressPercent.textContent = `${percentage}%`;
    }

    if (currentStage && stage) {
        currentStage.textContent = stage;
    }

    if (batchProgress) {
        batchProgress.textContent = `${current} / ${total}`;
    }
}

/**
 * Update ETA and speed
 */
export function updateETA(startTime, current, total) {
    const etaElement = document.getElementById('eta');
    const speedElement = document.getElementById('speed');

    if (current === 0) {
        if (etaElement) etaElement.textContent = 'Calculating...';
        if (speedElement) speedElement.textContent = '-';
        return;
    }

    const elapsed = Date.now() - startTime;
    const rate = current / elapsed; // batches per ms
    const remaining = al - current;
    const eta = remaining / rate;

    if (etaElement) {
        etaElement.textContent = formatDuration(eta);
    }

    if (speedElement) {
        const batchesPerMin = (rate * 60000).toFixed(1);
        speedElement.textContent = `${batchesPerMin} batches/min`;
    }
}

/**
 * Update batch table
 */
export function updateBatchTable(batches) {
    const table = document.getElementById('batchTable');
    if (!table) return;

    table.innerHTML = '';

    // Show only recent batches (last 10)
    const recentBatches = batches.slice(-10);

    for (const batch of recentBatches) {
        const row = document.createElement('div');
        row.className = 'batch-row';

        const statusBadge = `<span class="status-badge ${batch.status}">${batch.status}</span>`;
        const modelInfo = batch.model ? `<span class="batch-model">${batch.model}</span>` : '';

        row.innerHTML = `
            <div class="batch-id">Batch ${batch.batchNumber + 1}</div>
            <div class="batch-text">${batch.text.substring(0, 100)}...</div>
            <div class="batch-status">${statusBadge}</div>
            <div>${modelInfo}</div>
        `;

        table.appendChild(row);
    }
}

/**
 * Update results display
 */
export function updateResults(stats) {
    document.getElementById('originalLength').textContent =
        stats.originalLength ? formatNumber(stats.originalLength) + ' chars' : '-';
    document.getElementById('transformedLength').textContent =
        stats.transformedLength ? formatNumber(stats.transformedLength) + ' chars' : '-';
    document.getElementById('processingTime').textContent =
        stats.processingTime ? formatDuration(stats.processingTime) : '-';
}

/**
 * Update stored files list
 */
export function updateStoredFilesList(files) {
    const list = document.getElementById('storedFilesList');
    if (!list) return;

    if (files.length === 0) {
        list.innerHTML = '<p class="empty-state">No stored files yet. Upload and process a PDF to get started.</p>';
        return;
    }

    list.innerHTML = '';

    for (const file of files) {
        const card = document.createElement('div');
        card.className = 'stored-file-card';

        const date = new Date(file.timestamp).toLocaleDateString();
        const status = file.status || 'unknown';

        card.innerHTML = `
            <div class="stored-file-info">
                <div class="stored-file-name">${file.filename}</div>
                <div class="stored-file-meta">
                    <span>📄 ${file.pages} pages</span>
                    <span>📅 ${date}</span>
                    <span>Status: ${status}</span>
                </div>
            </div>
            <div class="stored-file-actions">
                <button class="btn btn-sm btn-primary" data-action="download" data-id="${file.id}">
                    📥 Download
                </button>
                <button class="btn btn-sm btn-secondary" data-action="view" data-id="${file.id}">
                    👁️ View
                </button>
                <button class="btn btn-sm btn-danger" data-action="delete" data-id="${file.id}">
                    🗑️ Delete
                </button>
            </div>
        `;

        list.appendChild(card);
    }
}

/**
 * Show modal
 */
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

/**
 * Hide modal
 */
export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Switch tab
 */
export function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}Tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activate button
    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

/**
 * Enable/disable button
 */
export function setButtonEnabled(buttonId, enabled) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = !enabled;
    }
}

/**
 * Show loading spinner
 */
export function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        spinner.id = `${elementId}-spinner`;
        element.appendChild(spinner);
    }
}

/**
 * Hide loading spinner
 */
export function hideLoading(elementId) {
    const spinner = document.getElementById(`${elementId}-spinner`);
    if (spinner) {
        spinner.remove();
    }
}

/**
 * Confirm dialog
 */
export function confirm(message) {
    return window.confirm(message);
}

/**
 * Set input value
 */
export function setValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        if (element.type === 'checkbox') {
            element.checked = value;
        } else {
            element.value = value;
        }
    }
}

/**
 * Get input value
 */
export function getValue(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return null;

    if (element.type === 'checkbox') {
        return element.checked;
    } else if (element.type === 'number') {
        return parseFloat(element.value);
    } else {
        return element.value;
    }
}
