#!/usr/bin/env node

/**
 * Simple bundler to create a single-file HTML version
 * Run with: node tools/bundle.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = 'dist/index-bundle.html';

console.log('Creating single-file bundle...');

// Read main HTML
let html = fs.readFileSync('index.html', 'utf8');

// Inline CSS files
const cssFiles = [
    'css/main.css',
    'css/components.css',
    'css/dark-mode.css'
];

let inlinedCSS = '<style>\n';
cssFiles.forEach(file => {
    console.log(`Inlining ${file}...`);
    const css = fs.readFileSync(file, 'utf8');
    inlinedCSS += `/* ${file} */\n${css}\n\n`;
});
inlinedCSS += '</style>';

// Replace CSS links with inlined styles
html = html.replace(
    /<link rel="stylesheet" href="css\/.*?">/g,
    ''
);
html = html.replace('</head>', `${inlinedCSS}\n</head>`);

// Inline JS files
const jsFiles = [
    'js/utils.js',
    'js/storage.js',
    'js/settings.js',
    'js/pdf-extractor.js',
    'js/gemini-api.js',
    'js/batch-processor.js',
    'js/pdf-generator.js',
    'js/ui.js',
    'js/app.js'
];

let inlinedJS = '<script type="module">\n';

// Read all JS files and combine them
jsFiles.forEach(file => {
    console.log(`Inlining ${file}...`);
    let js = fs.readFileSync(file, 'utf8');

    // Remove import/export statements for bundling
    js = js.replace(/^import .* from .*$/gm, '');
    js = js.replace(/^export (default )?/gm, '');
    js = js.replace(/^export \{.*\}.*$/gm, '');

    inlinedJS += `\n/* ${file} */\n${js}\n`;
});

inlinedJS += '\n</script>';

// Replace script tag with inlined scripts
html = html.replace(
    /<script type="module" src="js\/app.js"><\/script>/,
    inlinedJS
);

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Write bundled file
fs.writeFileSync(OUTPUT_FILE, html);

console.log(`✅ Bundle created: ${OUTPUT_FILE}`);
console.log(`File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
console.log('\nNote: This bundle still requires external CDN libraries (PDF.js, jsPDF)');
console.log('For a truly offline version, you would need to inline those as well.');
