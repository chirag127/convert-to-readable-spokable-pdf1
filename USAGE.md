# Usage Guide

## Getting Started

### 1. Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Choose "Create API key in new project" or select an existing project
5. Copy the generated API key

### 2. Open the Application

**Option A: Open Locally**

-   Simply open `index.html` in a modern web browser
-   Or run a local server: `python -m http.server 8000` or `npm run serve`

**Option B: Use Single-File Bundle**

-   Open `dist/index-bundle.html` (after running `npm run bundle`)

### 3. Configure Settings

1. Click the Settings icon (⚙️) in the navigation bar
2. Go to the "API" tab
3. Paste your API key in the "Google AI Studio API Key" field
4. (Optional) Add a backup API key for failover
5. Settings are automatically saved

## Processing a PDF

### Step 1: Upload

1. Drag and drop a PDF file onto the upload zone, or
2. Click "Select PDF File" to browse for a file

**Requirements:**

-   PDF must contain selectable text (not scanned images)
-   File size: Reasonable (tested up to 100MB)
-   Pages: Any number (larger documents take longer)

### Step 2: Review File Info

After upload, you'll see:

-   Filename
-   Number of pages
-   File size
-   Estimated text length
-   Detected language
-   Estimated number of batches

### Step 3: Process

1. Click the "▶️ PROCESS" button
2. Watch the progress bar and batch status
3. Monitor ETA and processing speed

**During Processing:**

-   **Pause**: Temporarily stop processing (can resume later)
-   **Cancel**: Stop and discard progress
-   **Download Partial**: Save completed batches so far

### Step 4: Download Results

When complete, you can:

-   **Download PDF**: Get the transformed PDF with your formatting preferences
-   **Download as Text**: Get plain text version
-   **Preview**: View in browser
-   **Process Another File**: Start over with a new PDF

## Settings Guide

### API Settings

-   **API Key**: Your Google AI Studio key (required)
-   **Backup API Key**: Optional failover key
-   **API Timeout**: Maximum seconds to wait for API response (default: 60)

### Processing Settings

-   **Batch Size**: Tokens per batch (default: 10000)

    -   Larger = fewer API calls but longer per call
    -   Smaller = more API calls but faster per call

-   **Overlap Size**: Tokens to overlap between batches (default: 200)

    -   Helps maintain context across batch boundaries

-   **Max Retries**: How many times to retry failed batches (default: 3)

-   **Retry Delay**: Milliseconds to wait between retries (default: 2000)

-   **Rate Limit Delay**: Milliseconds to wait between batches (default: 1000)

    -   Increase if hitting rate limits

-   **Turbo Mode**: Enable parallel processing

    -   Processes multiple batches simultaneously
    -   Faster but may hit rate limits more easily

-   **Parallel Chunks**: Number of batches to process at once (default: 3)
    -   Only applies when Turbo Mode is enabled

### Prompts Settings

Customize how the AI transforms your text:

-   **System Prompt**: Sets the AI's role and behavior
-   **Text Transformation Prompt**: Main instructions for transformation
-   **Table Conversion Prompt**: How to handle tables
-   **Code Description Prompt**: How to describe code blocks
-   **Mathematical Notation Prompt**: How to speak math
-   **Figure/Image Description Prompt**: How to describe images
-   **List Formatting Prompt**: How to format lists

**Tips:**

-   Be specific about what you want
-   Include examples if helpful
-   Test with a small document first
-   Use "Reset to Defaults" if things go wrong

### Output Settings

Control the generated PDF:

-   **Font Size**: 8-24 pt (default: 12)
-   **Line Height**: 1.0-3.0 (default: 1.5)
-   **Page Margin**: 5-50 mm (default: 20)
-   **Font Family**: Times New Roman, Arial, Helvetica, Georgia
-   **Page Size**: Letter, A4, Legal
-   **Add Page Numbers**: Include page numbers at bottom
-   **Generate Table of Contents**: Create TOC from headings

### Advanced Settings

-   **Model Priority**: List of models to try in order

    -   One model per line
    -   First available model is used
    -   Automatically fails over to next on error

-   **Temperature**: 0-2 (default: 1)

    -   Higher = more creative/varied
    -   Lower = more consistent/focused

-   **Top P**: 0-1 (default: 0.95)

    -   Nucleus sampling parameter

-   **Top K**: 1-100 (default: 40)

    -   Top-k sampling parameter

-   **Max Output Tokens**: 100-8000 (default: 4000)
    -   Maximum length of AI response per batch

## Troubleshooting

### "API key invalid"

**Solution:**

1. Check that you copied the entire key
2. Verify the key hasn't been revoked in Google AI Studio
3. Try creating a new key

### "Rate limit exceeded"

**Solutions:**

1. Increase "Rate Limit Delay" (try 2000-5000ms)
2. Disable Turbo Mode or reduce Parallel Chunks
3. Add a backup API key
4. Wait a few minutes and retry
5. Check your Google AI Studio quota

### "Model not found"

**Solutions:**

1. Go to Diagnostics → Fetch Models to see available models
2. Update your Model Priority list with available models
3. Some models may not be available in your region

### Processing is slow

**Solutions:**

1. Enable Turbo Mode for parallel processing
2. Increase Parallel Chunks (but watch for rate limits)
3. Use faster models (flash instead of pro)
4. Reduce batch size for more granular progress

### Transformed text is poor quality

**Solutions:**

1. Adjust prompts to be more specific
2. Try a more capable model (pro instea
3. Increase Max Output Tokens
4. Adjust Temperature (try 0.7-1.3)
5. Process smaller sections and review

### Browser crashes or freezes

**Solutions:**

1. Process smaller documents
2. Increase batch size to reduce number of batches
3. Disable Turbo Mode
4. Close other browser tabs
5. Use a desktop browser (not mobile)

## Best Practices

### For Best Results

1. **Start Small**: Test with a few pages first
2. **Customize Prompts**: Tailor prompts to your document type
3. **Monitor Progress**: Watch the first few batches to ensure quality
4. **Use Appropriate Models**: Flash for simple docs, Pro for complex
5. **Save Partial Results**: Download partial PDFs during long processing

### For Cost Efficiency

1. **Use Flash Models**: Cheaper than Pro models
2. **Optimize Batch Size**: Larger batches = fewer API calls
3. **Avoid Retries**: Set good rate limits to avoid failed calls
4. **Test Prompts**: Perfect your prompts on small samples first
5. **Monitor Usage**: Check your Google Cloud billing regularly

### For Speed

1. **Enable Turbo Mode**: Process batches in parallel
2. **Use Fast Models**: Flash models are faster than Pro
3. **Reduce Overlap**: Less overlap = fewer tokens per batch
4. **Increase Batch Size**: Fewer batches = faster overall
5. **Minimize Retries**: Set appropriate delays to avoid failures

## Keyboard Shortcuts

-   **Ctrl/Cmd + ,**: Open Settings
-   **Esc**: Close modals
-   **Ctrl/Cmd + D**: Toggle dark mode (when implemented)

## Data Management

### Stored Files

-   Files are stored in your browser's IndexedDB
-   Access from the "Stored Files" section on the home page
-   Actions: Download, View, Delete

### Clearing Data

**Clear API Keys:**

-   Settings → API → Clear API Keys

**Clear Logs:**

-   Diagnostics → Clear Logs

**Clear Everything:**

-   Settings → Advanced → Erase All Data
-   This removes all files, logs, and settings

### Export Data

**Export Logs:**

-   Diagnostics → Export Logs

**Export Settings:**

-   Settings → Advanced → Export Settings (if implemented)

**Export Support Bundle:**

-   Diagnostics → Export Support Bundle
-   Includes logs, settings, and system info for troubleshooting

## Tips & Tricks

### Handling Large Documents

1. Split large PDFs into smaller sections
2. Process each section separately
3. Combine results manually if needed
4. Use larger batch sizes to reduce API calls

### Improving Accuracy

1. Be specific in transformation prompts
2. Include examples of desired output format
3. Use higher-capability models for complex content
4. Review and edit output as needed

### Batch Processing Multiple Files

1. Process first file completely
2. Download and save results
3. Click "Process Another File"
4. Repeat for each file

### Creating Custom Profiles

1. Adjust all settings for a specific use case
2. Export settings (if implemented)
3. Import when needed for similar documents

## API Usage & Costs

### Free Tier

Google AI Studio offers a free tier with:

-   Rate limits (requests per minute)
-   Daily quotas
-   May vary by region

### Paid Usage

-   Charged per 1000 tokens (input + output)
-   Flash models: ~$0.10-0.30 per 1M tokens
-   Pro models: ~$1-3 per 1M tokens
-   Check [Google AI Pricing](https://ai.google.dev/pricing) for current rates

### Estimating Costs

For a 100-page document (~50,000 words):

-   Estimated tokens: ~200,000
-   With Flash model: ~$0.02-0.06
-   With Pro model: ~$0.20-0.60

**Note:** Actual costs vary based on:

-   Document complexity
-   Batch size and overlap
-   Number of retries
-   Model used

## Support

### Getting Help

1. Check this guide and the FAQ
2. Visit the Diagnostics page for system info
3. Export a support bundle for detailed troubleshooting
4. Check browser console for errors (F12)

### Reporting Issues

Include:

-   Browser and version
-   Steps to reproduce
-   Error messages
-   Support bundle (if possible)

### Feature Requests

We welcome suggestions for improvements!
