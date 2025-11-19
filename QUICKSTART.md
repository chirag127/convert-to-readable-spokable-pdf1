# Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Get Your API Key (2 minutes)

1. Open [Google AI Studio](https://aistudio.google.com/app/apikey) in a new tab
2. Sign in with your Google account
3. Click the blue **"Create API Key"** button
4. Select **"Create API key in new project"**
5. Copy the key that appears (it looks like: `AIzaSyC...`)

💡 **Tip**: Keep this tab open - you'll need the key in Step 3

## Step 2: Open the App (30 seconds)

Choose one option:

**Option A - Local File:**

```bash
# Just open the file
open index.html
# or double-click index.html in your file browser
```

**Option B - Local Server:**

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# Then visit: http://localhost:8000
```

**Option C - Online:**
Deploy to GitHub Pages, Netlify, or Vercel (see DEPLOYMENT.md)

## Step 3: Configure API Key (1 minute)

1. Click the **⚙️ Settings** icon in the top right
2. In the **API** tab, paste your API key
3. (Optional) Add a backup API key
4. Close settings - it auto-saves!

✅ **You're ready to go!**

## Step 4: Process Your First PDF (2 minutes)

1. **Upload**: Drag a PDF onto the upload zone (or click to browse)
2. **Review**: Check the file info (pages, size, estimated batches)
3. **Process**: Click the big green **▶️ PROCESS** button
4. **Wait**: Watch the progress bar (first file takes a few minutes)
5. **Download**: Click **📥 Download PDF** when complete

🎉 **Done!** You now have a TTS-friendly PDF!

## What Just Happened?

Your PDF was:

1. ✅ Text extracted (using PDF.js)
2. ✅ Split into smart chunks (with overlap for context)
3. ✅ Transformed by AI (Google Gemini)
    - Code → descriptions
    - Tables → sentences
    - Math → spoken form
4. ✅ Reassembled into a new PDF
5. ✅ Saved to your browser storage

## Try It With Your TTS App

1. Open your favorite TTS app (Moon+ Reader, Voice Dream, etc.)
2. Load the transformed PDF
3. Hit play and listen!

The difference:

-   ❌ **Before**: "function open parenthesis x comma y close parenthesis..."
-   ✅ **After**: "This function takes two parameters, x and y, and returns..."

## Common First-Time Issues

### "API key invalid"

-   Make sure you copied the **entire** key
-   Check for extra spaces at the beginning or end
-   Try creating a new key

### "Rate limit exceeded"

-   You're on the free tier with limits
-   Go to Settings → Processing
-   Increase "Rate Limit Delay" to 2000ms
-   Try again

### Processing seems stuck

-   It's probably working! Large documents take time
-   Check the batch status table - batches should be completing
-   First batch is slowest (API cold start)

## Next Steps

### Customize Your Experience

**Better Results:**

-   Settings → Prompts → Edit transformation instructions
-   Try different models (Settings → Advanced → Model Priority)

**Faster Processing:**

-   Settings → Processing → Enable Turbo Mode
-   Increase Parallel Chunks to 5

**Better PDFs:**

-   Settings → Output → Adjust font, size, margins
-   Enable/disable page numbers and table of contents

### Learn More

-   **Full Guide**: See USAGE.md
-   **FAQ**: See pages/faq.html
-   **Troubleshooting**: See Diagnostics page in app

## Pro Tips

1. **Test First**: Try a small PDF (5-10 pages) before processing a book
2. **Monitor Costs**: Check your Google AI Studio usage regularly
3. **Save Partials**: Click "Download Partial" during long processing
4. **Use Flash Models**: Cheaper and faster for most documents
5. **Customize Prompts**: Tailor them to your document type

## Example Workflow

```
1. Upload: research-paper.pdf (50 pages)
2. Settings: Enable Turbo Mode, 5 parallel chunks
3. Process: Takes ~8 minutes
4. Download: research-paper_readable.pdf
5. Listen: In your TTS app
6. Enjoy: No more "x equals y squared" nonsense!
```

## Need Help?

-   **In-App**: Check the FAQ page
-   **Diagnostics**: View logs and system info
-   **Support Bundle**: Export for troubleshooting
-   **Browser Console**: Press F12 to see detailed errors

## Share Your Success!

Processed a great document? Share your experience!

---

**That's it!** You're now ready to convert all your technical PDFs into listenable content. Happy listening! 🎧
