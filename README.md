# Convert to Readable Spokable PDF

A browser-based static website that transforms technical PDFs into natural, spoken-friendly documents optimized for text-to-speech consumption.

## Features

-   **100% Browser-Based**: No server required - runs entirely in your browser
-   **Gemini AI Integration**: Uses Google AI Studio REST API for intelligent text transformation
-   **Smart Processing**: Converts code blocks, tables, math notation, and figures into natural language
-   **Multimodal Support**: Processes images and figures with AI-powered descriptions
-   **Batch Processing**: Handles large documents with configurable chunking and parallel processing
-   **Robust Retry Logic**: Automatic failover between models and backup API keys
-   **Offline Storage**: Uses IndexedDB for persistence and recovery
-   **Beautiful UI**: Modern, responsive design with dark mode support

## Quick Start

1. **Get a Google AI Studio API Key**

    - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
    - Click "Create API Key"
    - Copy your key

2. **Open the Website**

    - Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari)
    - Or use the single-file bundle: `dist/index-bundle.html`

3. **Configure Settings**

    - Click the Settings icon
    - Paste your API key
    - Adjust batch size, model preferences, and transformation rules as needed

4. **Process a PDF**
    - Drag and drop a PDF or click to select
    - Review file metadata
    - Click "PROCESS" to start transformation
    - Monitor progress and download the result

## Project Structure

```
├── index.html              # Main entry point
├── css/
│   ├── main.css           # Core styles
│   ├── components.css     # UI component styles
│   └── dark-mode.css      # Dark mode theme
├── js/
│   ├── app.js             # Main application controller
│   ├── pdf-extractor.js   # PDF text extraction
│   ├── gemini-api.js      # Gemini REST API client
│   ├── batch-processor.js # Chunking and batch logic
│   ├── pdf-generator.js   # Output PDF creation
│   ├── storage.js         # IndexedDB wrapper
│   ├── settings.js        # Settings management
│   ├── ui.js              # UI controllers
│   └── utils.js           # Utility functions
├── pages/
│   ├── about.html
│   ├── faq.html
│   ├── privacy.html
│   ├── terms.html
│   └── diagnostics.html
├── assets/
│   └── icons/
├── dist/
│   └── index-bundle.html  # Single-file bundle
└── tools/
    └── bundle.js          # Bundling script
```

## How to Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" button
4. Choose "Create API key in new project" or select an existing project
5. Copy the generated API key
6. Paste it in the Settings panel of this app

**Important**: Your API key is stored only in your browser's LocalStorage and is never sent anywhere except to Google AI Studio endpoints.

## Local Development

No build process required! Just open `index.html` in a browser.

For local testing:

```bash
# Simple HTTP server (Python 3)
python -m http.server 8000

# Or use Node.js
npx http-server
```

Then visit `http://localhost:8000`

## Creating Single-File Bundle

```bash
node tools/bundle.js
```

This creates `dist/index-bundle.html` with all CSS, JS, and assets inlined.

## Browser Requirements

-   Modern browser with ES6+ support
-   IndexedDB support
-   FileReader API
-   Fetch API

Tested on:

-   Chrome 90+
-   Edge 90+
-   Firefox 88+
-   Safari 14+

## Privacy & Security

-   All processing happens in your browser
-   API keys stored only in LocalStorage
-   Files stored only in IndexedDB (local to your browser)
-   No data sent to third parties except Google AI Studio
-   Use "Erase All Data" to clear everything

## Cost Considerations

This app uses Google AI Studio API which has:

-   Free tier with rate limits
-   Pay-as-you-go pricing for higher usage
-   Check [Google AI Pricing](https://ai.google.dev/pricing) for current rates

Tips to minimize costs:

-   Use smaller batch sizes for testing
-   Start with flash models (cheaper than pro)
-   Enable rate limiting delays
-   Use backup API key only when needed

## Troubleshooting

**"API key invalid"**

-   Verify your key in Google AI Studio
-   Make sure you copied the entire key
-   Check if the key has been revoked

**"Rate limit exceeded"**

-   Increase "Rate Limit Delay" in settings
-   Reduce "Parallel Chunks"
-   Wait a few minutes and retry
-   Use a backup API key

**"Model not found"**

-   Run diagnostics to list available models
-   Update model priority list
-   Some models may not be available in your region

## License

MIT License - See LICENSE file for details

## Documentation

📚 **Complete Documentation Index**: See [INDEX.md](INDEX.md) for all documentation

### Quick Links

-   🚀 **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
-   📖 **[USAGE.md](USAGE.md)** - Comprehensive user guide
-   🚢 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production
-   🏗️ **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical overview
-   ✅ **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - QA checklist
-   📁 **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** - Project structure
-   🎉 **[COMPLETION_REPORT.md](COMPLETION_REPORT.md)** - Project status

### In-App Pages

-   **About**: Learn about the project
-   **FAQ**: 13+ common questions answered
-   **Privacy**: How your data is handled
-   **Terms**: Usage terms and conditions
-   **Diagnostics**: Troubleshooting and logs

## Support

For issues and questions:

1. Check the [FAQ](pages/faq.html)
2. Read [USAGE.md](USAGE.md) - Troubleshooting section
3. Use the Diagnostics page in the app
4. Export a support bundle for detailed troubleshooting
