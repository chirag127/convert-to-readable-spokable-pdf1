// PDF Text Extraction using PDF.js

/**
 * Extract text and metadata from PDF file
 * Uses Mozilla's PDF.js library loaded from CDN
 */

let pdfjsLib = null;

/**
 * Load PDF.js library
 */
async function loadPdfJs() {
    if (pdfjsLib) return pdfjsLib;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(pdfjsLib);
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js'));
        document.head.appendChild(script);
    });
}

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file, onProgress = null) {
    await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const numPages = pdf.numPages;
    const pages = [];
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extract text items
        const pageText = textContent.items
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        pages.push({
            pageNumber: pageNum,
            text: pageText
        });

        fullText += pageText + '\n\n';

        if (onProgress) {
            onProgress(pageNum, numPages);
        }
    }

    return {
        text: fullText.trim(),
        pages,
        numPages,
        metadata: await extractMetadata(pdf)
    };
}

/**
 * Extract metadata from PDF
 */
async function extractMetadata(pdf) {
    try {
        const metadata = await pdf.getMetadata();
        return {
            title: metadata.info?.Title || '',
            author: metadata.info?.Author || '',
            subject: metadata.info?.Subject || '',
            keywords: metadata.info?.Keywords || '',
            creator: metadata.info?.Creator || '',
            producer: metadata.info?.Producer || '',
            creationDate: metadata.info?.CreationDate || '',
            modificationDate: metadata.info?.ModDate || ''
        };
    } catch (error) {
        console.error('Failed to extract metadata:', error);
        return {};
    }
}

/**
 * Extract images from PDF
 */
export async function extractImagesFromPDF(file, onProgress = null) {
    await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const numPages = pdf.numPages;
    const images = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const operatorList = await page.getOperatorList();

        // Look for image operations
        for (let i = 0; i < operatorList.fnArray.length; i++) {
            const fn = operatorList.fnArray[i];
            const args = operatorList.argsArray[i];

            // Check if this is an image operation
            if (fn === pdfjsLib.OPS.paintImageXObject ||
                fn === pdfjsLib.OPS.paintInlineImageXObject) {
                try {
                    // Extract image data
                    const imageName = args[0];
                    const image = await page.objs.get(imageName);

                    if (image) {
                        images.push({
                            pageNumber: pageNum,
                            name: imageName,
                            width: image.width,
                            height: image.height,
                            data: image.data
                        });
                    }
                } catch (error) {
                    console.warn(`Failed to extract image on page ${pageNum}:`, error);
                }
            }
        }

        if (onProgress) {
            onProgress(pageNum, numPages);
        }
    }

    return images;
}

/**
 * Get PDF file info without full extraction
 */
export async function getPDFInfo(file) {
    await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Extract first page to estimate text length
    const firstPage = await pdf.getPage(1);
    const textContent = await firstPage.getTextContent();
    const firstPageText = textContent.items.map(item => item.str).join(' ');

    // Estimate total text length
    const estimatedTextLength = firstPageText.length * pdf.numPages;

    return {
        numPages: pdf.numPages,
        estimatedTextLength,
        estimatedWords: Math.floor(estimatedTextLength / 5),
        metadata: await extractMetadata(pdf)
    };
}

/**
 * Detect if PDF has selectable text
 */
export async function hasSelectableText(file) {
    await loadPdfJs();

    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        // Check first few pages
        const pagesToCheck = Math.min(3, pdf.numPages);

        for (let i = 1; i <= pagesToCheck; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            if (textContent.items.length > 0) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error checking for selectable text:', error);
        return false;
    }
}

/**
 * Convert image data to base64
 */
export function imageDataToBase64(imageData, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(width, height);
    imgData.data.set(imageData);
    ctx.putImageData(imgData, 0, 0);

    return canvas.toDataURL('image/png');
}
