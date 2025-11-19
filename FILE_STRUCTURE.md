# File Structure Guide

## 📁 Complete Directory Tree

```
readable-spokable-pdf/
│
├── 📄 index.html                    # Main application entry point
│
├── 📚 Documentation Files
│   ├── README.md                    # Project overview and quick start
│   ├── QUICKSTART.md                # 5-minute setup guide
│   ├── USAGE.md                     # Comprehensive user guide
│   ├── DEPLOYMENT.md                # Hosting and deployment guide
│   ├── PROJECT_SUMMARY.md           # Technical summary
│   ├── TESTING_CHECKLIST.md         # QA testing checklist
│   ├── COMPLETION_REPORT.md         # Project completion status
│   └── FILE_STRUCTURE.md            # This file
│
├── ⚙️ Configuration Files
│   ├── package.json                 # NPM scripts and metadata
│   ├── .gitignore                   # Git ignore rules
│   └── LICENSE                      # MIT License
│
├── 🎨 CSS Styles (css/)
│   ├── main.css                     # Core styles and layout
│   ├── components.css               # UI component styles
│   └── dark-mode.css                # Dark theme overrides
│
├── 💻 JavaScript Modules (js/)
│   ├── app.js                       # Main application controller
│   ├── utils.js                     # Utility functions
│   ├── storage.js                   # IndexedDB wrapper
│   ├── settings.js                  # Settings management
│   ├── pdf-extractor.js             # PDF text extraction
│   ├── gemini-api.js                # Gemini REST API client
│   ├── batch-processor.js           # Batch processing logic
│   ├── pdf-generator.js             # PDF output generation
│   └── ui.js                        # UI controllers
│
├── 📄 Additional Pages (pages/)
│   ├── about.html                   # About page
│   ├── faq.html                     # FAQ page
│   ├── privacy.html                 # Privacy policy
│   ├── terms.html                   # Terms of service
│   └── diagnostics.html             # Diagnostics and logs
│
├── 🛠️ Tools (tools/)
│   └── bundle.js                    # Single-file bundler script
│
└── 📦 Build Output (dist/)
    └── index-bundle.html            # Single-file bundle (generated)
```

## 📋 File Descriptions

### Core Application Files

#### `index.html` (Main Entry Point)

-   **Purpose**: Main application page
-   **Size**: ~300 lines
-   **Contains**:
    -   Navigation bar
    -   File upload section
    -   Progress tracking UI
    -   Results display
    -   Settings modal
    -   Toast notifications
-   **Dependencies**: Links to CSS and JS modules

### CSS Files (css/)

#### `main.css` (Core Styles)

-   **Purpose**: Base styles, layout, typography
-   **Size**: ~400 lines
-   **Contains**:
    -   CSS variables for theming
    -   Layout styles (flexbox, grid)
    -   Navigation styles
    -   Button styles
    -   Form styles
    -   Responsive breakpoints

#### `components.css` (UI Components)

-   **Purpose**: Reusable component styles
-   **Size**: ~350 lines
-   **Contains**:
    -   Modal styles
    -   Toast notification styles
    -   Tab styles
    -   Card styles
    -   Batch table styles
    -   Progress bar styles

#### `dark-mode.css` (Dark Theme)

-   **Purpose**: Dark mode overrides
-   **Size**: ~50 lines
-   **Contains**:
    -   Dark color scheme
    -   Contrast adjustments
    -   Smooth transitions

### JavaScript Modules (js/)

#### `app.js` (Main Controller)

-   **Purpose**: Application orchestration
-   **Size**: ~500 lines
-   **Responsibilities**:
    -   Initialize app
    -   Handle file uploads
    -   Coordinate processing
    -   Manage UI state
    -   Event handling
-   **Dependencies**: All other JS modules

#### `utils.js` (Utilities)

-   **Purpose**: Helper functions
-   **Size**: ~200 lines
-   **Functions**:
    -   formatBytes()
    -   formatNumber()
    -   estimateTokens()
    -   formatDuration()
    -   calculateETA()
    -   generateId()
    -   detectLanguage()
    -   downloadFile()

#### `storage.js` (IndexedDB Wrapper)

-   **Purpose**: Data persistence
-   **Size**: ~300 lines
-   **Functions**:
    -   init()
    -   saveFile()
    -   getFile()
    -   getAllFiles()
    -   deleteFile()
    -   saveBatch()
    -   getBatchesForFile()
    -   addLog()
    -   getLogs()
    -   clearAll()

#### `settings.js` (Settings Manager)

-   **Purpose**: Settings management
-   **Size**: ~250 lines
-   **Functions**:
    -   init()
    -   get()
    -   set()
    -   save()
    -   reset()
    -   clearApiKeys()
    -   export()
    -   import()
    -   validate()

#### `pdf-extractor.js` (PDF Extraction)

-   **Purpose**: Extract text from PDFs
-   **Size**: ~200 lines
-   **Functions**:
    -   extractTextFromPDF()
    -   extractImagesFromPDF()
    -   getPDFInfo()
    -   hasSelectableText()
-   **Dependencies**: PDF.js (CDN)

#### `gemini-api.js` (API Client)

-   **Purpose**: Gemini API communication
-   **Size**: ~350 lines
-   **Functions**:
    -   generateContent()
    -   generateContentMultimodal()
    -   listModels()
    -   switchToBackup()
    -   parseError()
-   **Features**:
    -   Retry logic
    -   Timeout handling
    -   Error parsing
    -   Logging

#### `batch-processor.js` (Batch Processing)

-   **Purpose**: Batch processing logic
-   **Size**: ~350 lines
-   **Functions**:
    -   splitIntoBatches()
    -   process()
    -   processSequential()
    -   processParallel()
    -   processBatch()
    -   retryFailed()
    -   assembleText()
-   **Features**:
    -   Parallel processing
    -   Progress tracking
    -   Pause/resume
    -   Error handling

#### `pdf-generator.js` (PDF Output)

-   **Purpose**: Generate output PDFs
-   **Size**: ~200 lines
-   **Functions**:
    -   generatePDF()
    -   generateAndDownloadPDF()
    -   generatePDFBlob()
    -   estimatePageCount()
-   **Dependencies**: jsPDF (CDN)

#### `ui.js` (UI Controllers)

-   **Purpose**: UI manipulation
-   **Size**: ~300 lines
-   **Functions**:
    -   show()
    -   hide()
    -   showToast()
    -   updateFileInfo()
    -   updateProgress()
    -   updateBatchTable()
    -   showModal()
    -   switchTab()

### Additional Pages (pages/)

#### `about.html`

-   **Purpose**: About the project
-   **Size**: ~100 lines
-   **Content**: Project description, features, technology stack

#### `faq.html`

-   **Purpose**: Frequently asked questions
-   **Size**: ~200 lines
-   **Content**: 13+ Q&A pairs covering common issues

#### `privacy.html`

-   **Purpose**: Privacy policy
-   **Size**: ~150 lines
-   **Content**: Data handling, storage, third-party services

#### `terms.html`

-   **Purpose**: Terms of service
-   **Size**: ~150 lines
-   **Content**: Usage terms, liability, responsibilities

#### `diagnostics.html`

-   **Purpose**: Diagnostics and troubleshooting
-   **Size**: ~200 lines
-   **Features**:
    -   Model listing
    -   Storage info
    -   Log viewer
    -   Export tools

### Documentation Files

#### `README.md`

-   **Purpose**: Project overview
-   **Size**: ~150 lines
-   **Audience**: All users
-   **Content**: Quick start, features, installation

#### `QUICKSTART.md`

-   **Purpose**: 5-minute setup guide
-   **Size**: ~200 lines
-   **Audience**: New users
-   **Content**: Step-by-step first-time setup

#### `USAGE.md`

-   **Purpose**: Comprehensive user guide
-   **Size**: ~500 lines
-   **Audience**: All users
-   **Content**: Detailed instructions, troubleshooting, tips

#### `DEPLOYMENT.md`

-   **Purpose**: Hosting and deployment
-   **Size**: ~400 lines
-   **Audience**: Developers, admins
-   **Content**: Multiple deployment options, configuration

#### `PROJECT_SUMMARY.md`

-   **Purpose**: Technical overview
-   **Size**: ~300 lines
-   **Audience**: Developers
-   **Content**: Architecture, features, achievements

#### `TESTING_CHECKLIST.md`

-   **Purpose**: QA testing guide
-   **Size**: ~400 lines
-   **Audience**: Testers, developers
-   **Content**: Comprehensive test cases

#### `COMPLETION_REPORT.md`

-   **Purpose**: Project status report
-   **Size**: ~300 lines
-   **Audience**: Stakeholders, developers
-   **Content**: Deliverables, achievements, status

### Configuration Files

#### `package.json`

-   **Purpose**: NPM configuration
-   **Size**: ~20 lines
-   **Scripts**:
    -   `npm run bundle` - Create single-file bundle
    -   `npm run serve` - Start local server

#### `.gitignore`

-   **Purpose**: Git ignore rules
-   **Size**: ~20 lines
-   **Ignores**: node_modules, dist, IDE files, logs

#### `LICENSE`

-   **Purpose**: MIT License
-   **Size**: ~20 lines

### Tools

#### `tools/bundle.js`

-   **Purpose**: Create single-file bundle
-   **Size**: ~100 lines
-   **Usage**: `node tools/bundle.js`
-   **Output**: `dist/index-bundle.html`

## 📊 Statistics

### Total Files: 30+

-   HTML: 6 files
-   CSS: 3 files
-   JavaScript: 9 files
-   Documentation: 8 files
-   Configuration: 4 files

### Total Lines: ~6,000+

-   HTML: ~1,800 lines
-   CSS: ~900 lines
-   JavaScript: ~2,800 lines
-   Documentation: ~1,500 lines

### File Sizes (Approximate)

-   index.html: ~15 KB
-   CSS total: ~25 KB
-   JavaScript total: ~80 KB
-   Documentation: ~100 KB
-   **Total project size**: ~220 KB (excluding node_modules)

## 🔗 Dependencies

### External Libraries (CDN)

-   **PDF.js**: v3.11.174 (PDF text extraction)
-   **jsPDF**: v2.5.1 (PDF generation)

### Browser APIs

-   IndexedDB (storage)
-   LocalStorage (settings)
-   FileReader (file upload)
-   Fetch (API calls)

### No Build Dependencies

-   No npm packages required
-   No build process needed
-   No bundler required (optional)

## 🚀 Quick Navigation

### For Users

1. Start here: `QUICKSTART.md`
2. Then read: `USAGE.md`
3. If issues: `pages/faq.html`

### For Developers

1. Start here: `README.md`
2. Then read: `PROJECT_SUMMARY.md`
3. For deployment: `DEPLOYMENT.md`
4. Before deploying: `TESTING_CHECKLIST.md`

### For Deployment

1. Read: `DEPLOYMENT.md`
2. Choose platform
3. Deploy files
4. Test with `TESTING_CHECKLIST.md`

## 📝 Notes

-   All paths are relative to project root
-   No build process required (files work as-is)
-   Optional bundler creates single-file version
-   All external dependencies loaded from CDN
-   No server-side code anywhere

---

**Last Updated**: November 19, 2025
**Project Version**: 1.0.0
