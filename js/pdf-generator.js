// PDF Generation using jsPDF

let jsPDF = null;

/**
 * Load jsPDF library
 */
async function loadJsPDF() {
    if (jsPDF) return jsPDF;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            jsPDF = window.jspdf.jsPDF;
            resolve(jsPDF);
        };
        script.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.head.appendChild(script);
    });
}

/**
 * Generate PDF from transformed text
 */
export async function generatePDF(text, options = {}) {
    await loadJsPDF();

    const {
        fontSize = 12,
        lineHeight = 1.5,
        pageMargin = 20,
        fontFamily = 'times',
        pageSize = 'letter',
        addPageNumbers = true,
        generateToc = false,
        title = 'Readable Spokable PDF',
        author = '',
        metadata = {}
    } = options;

    // Create PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize.toLowerCase()
    });

    // Set font
    doc.setFont(fontFamily.toLowerCase().replace(/\s+/g, ''));
    doc.setFontSize(fontSize);

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (2 * pageMargin);
    const contentHeight = pageHeight - (2 * pageMargin);

    // Set metadata
    doc.setProperties({
        title: title,
        author: author,
        subject: 'Transformed PDF for TTS',
        keywords: 'readable, spokable, TTS, text-to-speech',
        creator: 'Readable Spokable PDF Converter'
    });

    let currentY = pageMargin;
    let pageNumber = 1;
    const tocEntries = [];

    // Add title page
    if (title) {
        doc.setFontSize(24);
        doc.text(title, pageWidth / 2, pageHeight / 3, { align: 'center' });

        if (author) {
            doc.setFontSize(14);
            doc.text(`by ${author}`, pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });
        }

        doc.setFontSize(12);
        doc.text(
            `Generated on ${new Date().toLocaleDateString()}`,
            pageWidth / 2,
            pageHeight / 3 + 30,
            { align: 'center' }
        );

        doc.addPage();
        pageNumber++;
        currentY = pageMargin;
    }

    // Split text into paragraphs
    const paragraphs = text.split(/\n\n+/);

    for (const paragraph of paragraphs) {
        if (!paragraph.trim()) continue;

        // Check if this is a heading (simple heuristic)
        const isHeading = paragraph.length < 100 &&
            !paragraph.endsWith('.') &&
            !paragraph.endsWith(',');

        if (isHeading) {
            // Add some space before heading
            currentY += 5;

            // Check if we need a new page
            if (currentY > contentHeight) {
                doc.addPage();
                pageNumber++;
                currentY = pageMargin;
            }

            doc.setFontSize(fontSize + 2);
            doc.setFont(fontFamily.toLowerCase().replace(/\s+/g, ''), 'bold');

            // Add to TOC
            if (generateToc) {
                tocEntries.push({
                    title: paragraph.trim(),
                    page: pageNumber
                });
            }
        } else {
            doc.setFontSize(fontSize);
            doc.setFont(fontFamily.toLowerCase().replace(/\s+/g, ''), 'normal');
        }

        // Split paragraph into lines that fit
        const lines = doc.splitTextToSize(paragraph, contentWidth);

        for (const line of lines) {
            // Check if we need a new page
            if (currentY + (fontSize * lineHeight * 0.35) > pageHeight - pageMargin) {
                // Add page number if enabled
                if (addPageNumbers) {
                    doc.setFontSize(10);
                    doc.text(
                        String(pageNumber),
                        pageWidth / 2,
                        pageHeight - 10,
                        { align: 'center' }
                    );
                    doc.setFontSize(fontSize);
                }

                doc.addPage();
                pageNumber++;
                currentY = pageMargin;
            }

            doc.text(line, pageMargin, currentY);
            currentY += fontSize * lineHeight * 0.35;
        }

        // Add space after paragraph
        currentY += 3;
    }

    // Add final page number
    if (addPageNumbers) {
        doc.setFontSize(10);
        doc.text(
            String(pageNumber),
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Add TOC at the beginning if requested
    if (generateToc && tocEntries.length > 0) {
        // Insert TOC page after title
        const totalPages = doc.internal.pages.length - 1;

        // Create new page for TOC
        doc.insertPage(2);
        doc.setPage(2);

        doc.setFontSize(18);
        doc.setFont(fontFamily.toLowerCase().replace(/\s+/g, ''), 'bold');
        doc.text('Table of Contents', pageMargin, pageMargin + 10);

        doc.setFontSize(12);
        doc.setFont(fontFamily.toLowerCase().replace(/\s+/g, ''), 'normal');

        let tocY = pageMargin + 20;
        for (const entry of tocEntries) {
            if (tocY > pageHeight - pageMargin) {
                doc.addPage();
                tocY = pageMargin;
            }

            const entryText = entry.title.substring(0, 80);
            doc.text(entryText, pageMargin, tocY);
            doc.text(String(entry.page + 1), pageWidth - pageMargin - 10, tocY, { align: 'right' });
            tocY += 7;
        }
    }

    return doc;
}

/**
 * Generate and download PDF
 */
export async function generateAndDownloadPDF(text, filename, options = {}) {
    const doc = await generatePDF(text, options);
    doc.save(filename);
}

/**
 * Generate PDF as blob
 */
export async function generatePDFBlob(text, options = {}) {
    const doc = await generatePDF(text, options);
    return doc.output('blob');
}

/**
 * Generate PDF as base64
 */
export async function generatePDFBase64(text, options = {}) {
    const doc = await generatePDF(text, options);
    return doc.output('datauristring');
}

/**
 * Estimate PDF page count
 */
export function estimatePageCount(text, options = {}) {
    const {
        fontSize = 12,
        lineHeight = 1.5,
        pageMargin = 20,
        pageSize = 'letter'
    } = options;

    // Rough estimation
    const charsPerLine = 80;
    const linesPerPage = 50;
    const charsPerPage = charsPerLine * linesPerPage;

    return Math.ceil(text.length / charsPerPage);
}
