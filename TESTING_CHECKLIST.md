# Testing Checklist

Use this checklist to verify the application works correctly before deployment.

## Pre-Testing Setup

-   [ ] Have a Google AI Studio API key ready
-   [ ] Have test PDF files (small, medium, large)
-   [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
-   [ ] Clear browser storage before testing

## Basic Functionality

### File Upload

-   [ ] Drag and drop PDF works
-   [ ] Click to select PDF works
-   [ ] File info displays correctly (name, pages, size)
-   [ ] Cancel file selection works
-   [ ] Only PDF files are accepted
-   [ ] Error shown for non-PDF files

### Settings

-   [ ] Settings modal opens
-   [ ] All tabs switch correctly (API, Processing, Prompts, Output, Advanced)
-   [ ] API key can be entered and saved
-   [ ] Settings persist after page reload
-   [ ] Dark mode toggle works and persists
-   [ ] Reset to defaults works
-   [ ] Clear API keys works
-   [ ] Erase all data works

### Processing

-   [ ] Process button starts processing
-   [ ] Progress bar updates
-   [ ] Batch status table updates
-   [ ] ETA calculation works
-   [ ] Pause button works
-   [ ] Resume button works
-   [ ] Cancel button works
-   [ ] Download partial works during processing

### Results

-   [ ] Results section shows after completion
-   [ ] Statistics display correctly
-   [ ] Download PDF works
-   [ ] Download text works
-   [ ] Preview opens in new window
-   [ ] Process another file resets UI

### Stored Files

-   [ ] Processed files appear in stored files list
-   [ ] Download button works for stored files
-   [ ] View button works for stored files
-   [ ] Delete button works for stored files
-   [ ] Confirmation dialog appears before delete

## API Integration

### Gemini API

-   [ ] Valid API key works
-   [ ] Invalid API key shows error
-   [ ] Backup API key failover works
-   [ ] Rate limit handling works
-   [ ] Retry logic works
-   [ ] Model failover works
-   [ ] Timeout handling works
-   [ ] Error messages are user-friendly

### Model Selection

-   [ ] Default models are pre-populated
-   [ ] Custom model list can be entered
-   [ ] Models are tried in priority order
-   [ ] Diagnostics page can fetch model list

## Batch Processing

### Chunking

-   [ ] Text splits into appropriate batches
-   [ ] Overlap is applied correctly
-   [ ] Batch size setting is respected
-   [ ] Very small documents (1 batch) work
-   [ ] Very large documents work

### Parallel Processing

-   [ ] Turbo mode can be enabled
-   [ ] Parallel chunks setting works
-   [ ] Multiple batches process simultaneously
-   [ ] Rate limiting still works in turbo mode

### Error Handling

-   [ ] Failed batches are retried
-   [ ] Max retries is respected
-   [ ] Failed batches are marked clearly
-   [ ] Partial results can be downloaded
-   [ ] Processing continues after recoverable errors

## PDF Generation

### Output Quality

-   [ ] Generated PDF opens correctly
-   [ ] Text is readable and formatted
-   [ ] Font settings are applied
-   [ ] Page size is correct
-   [ ] Margins are correct
-   [ ] Line height is correct

### Optional Features

-   [ ] Page numbers appear when enabled
-   [ ] Page numbers don't appear when disabled
-   [ ] Table of contents generates when enabled
-   [ ] TOC links work (if supported)

## Storage & Persistence

### IndexedDB

-   [ ] Files are saved to IndexedDB
-   [ ] Batches are saved to IndexedDB
-   [ ] Logs are saved to IndexedDB
-   [ ] Settings are saved to IndexedDB
-   [ ] Data persists after page reload
-   [ ] Data can be cleared

### LocalStorage

-   [ ] API key persists in LocalStorage
-   [ ] Dark mode preference persists
-   [ ] Welcome banner state persists

## UI/UX

### Responsiveness

-   [ ] Works on desktop (1920x1080)
-   [ ] Works on laptop (1366x768)
-   [ ] Works on tablet (768x1024)
-   [ ] Works on mobile (375x667)
-   [ ] All buttons are clickable on mobile
-   [ ] Text is readable on all screen sizes

### Dark Mode

-   [ ] Dark mode toggle works
-   [ ] All text is readable in dark mode
-   [ ] All colors have sufficient contrast
-   [ ] Dark mode persists after reload

### Accessibility

-   [ ] Keyboard navigation works
-   [ ] Tab order is logical
-   [ ] Focus indicators are visible
-   [ ] ARIA labels are present
-   [ ] Screen reader can navigate (test with NVDA/JAWS)
-   [ ] Color contrast meets WCAG AA

### Notifications

-   [ ] Toast notifications appear
-   [ ] Toast notifications auto-dismiss
-   [ ] Toast close button works
-   [ ] Success toasts are green
-   [ ] Error toasts are red
-   [ ] Warning toasts are yellow

## Pages

### About Page

-   [ ] Loads correctly
-   [ ] Navigation works
-   [ ] Links work
-   [ ] Content is readable

### FAQ Page

-   [ ] Loads correctly
-   [ ] All questions are answered
-   [ ] Links work
-   [ ] Content is helpful

### Privacy Page

-   [ ] Loads correctly
-   [ ] Policy is clear
-   [ ] Links work

### Terms Page

-   [ ] Loads correctly
-   [ ] Terms are clear
-   [ ] Links work

### Diagnostics Page

-   [ ] Loads correctly
-   [ ] Fetch models button works
-   [ ] Storage info displays
-   [ ] Logs display
-   [ ] Export logs works
-   [ ] Clear logs works
-   [ ] Export support bundle works
-   [ ] System info displays

## Error Scenarios

### Network Errors

-   [ ] Offline mode shows appropriate error
-   [ ] API timeout shows appropriate error
-   [ ] Network interruption is handled gracefully

### API Errors

-   [ ] 401 (unauthorized) shows helpful message
-   [ ] 403 (forbidden) shows helpful message
-   [ ] 429 (rate limit) shows helpful message
-   [ ] 500 (server error) shows helpful message
-   [ ] Invalid model shows helpful message

### User Errors

-   [ ] Missing API key shows helpful message
-   [ ] Invalid settings show validation errors
-   [ ] Corrupted PDF shows helpful message

## Performance

### Speed

-   [ ] Initial page load is fast (< 2 seconds)
-   [ ] Settings open quickly
-   [ ] File upload is responsive
-   [ ] Progress updates are smooth
-   [ ] No UI freezing during processing

### Memory

-   [ ] No memory leaks during processing
-   [ ] Large PDFs don't crash browser
-   [ ] Multiple processing sessions work

### Storage

-   [ ] Storage usage is reasonable
-   [ ] Old files can be deleted to free space
-   [ ] Storage quota warnings appear if needed

## Browser Compatibility

### Chrome

-   [ ] All features work
-   [ ] No console errors
-   [ ] Performance is good

### Firefox

-   [ ] All features work
-   [ ] No console errors
-   [ ] Performance is good

### Safari

-   [ ] All features work
-   [ ] No console errors
-   [ ] Performance is good

### Edge

-   [ ] All features work
-   [ ] No console errors
-   [ ] Performance is good

## Security

### Data Privacy

-   [ ] API key is not visible in logs
-   [ ] API key is not sent to any server except Google
-   [ ] Files are not uploaded to any server
-   [ ] No tracking scripts are present

### Input Validation

-   [ ] File type is validated
-   [ ] Settings are validated
-   [ ] API responses are validated
-   [ ] User input is sanitized

## Documentation

### README

-   [ ] Instructions are clear
-   [ ] Links work
-   [ ] Examples are helpful

### USAGE Guide

-   [ ] Comprehensive coverage
-   [ ] Easy to follow
-   [ ] Troubleshooting section is helpful

### DEPLOYMENT Guide

-   [ ] Multiple deployment options covered
-   [ ] Instructions are accurate
-   [ ] Examples work

## Deployment

### Local Testing

-   [ ] Works with file:// protocol (with limitations)
-   [ ] Works with local HTTP server
-   [ ] Works with Python SimpleHTTPServer
-   [ ] Works with Node http-server

### Production Deployment

-   [ ] Works on GitHub Pages
-   [ ] Works on Netlify
-   [ ] Works on Vercel
-   [ ] HTTPS works
-   [ ] Custom domain works (if applicable)

## Edge Cases

### Unusual PDFs

-   [ ] Very small PDF (1 page) works
-   [ ] Very large PDF (500+ pages) works
-   [ ] PDF with no text shows appropriate message
-   [ ] PDF with images works
-   [ ] PDF with tables works
-   [ ] PDF with code blocks works
-   [ ] PDF with math notation works

### Unusual Settings

-   [ ] Batch size = 1000 (minimum) works
-   [ ] Batch size = 50000 (maximum) works
-   [ ] Overlap = 0 works
-   [ ] Max retries = 0 works
-   [ ] Parallel chunks = 1 works
-   [ ] Parallel chunks = 10 works

### Unusual Behavior

-   [ ] Closing browser during processing
-   [ ] Refreshing page during processing
-   [ ] Multiple tabs open simultaneously
-   [ ] Switching tabs during processing
-   [ ] Computer sleep during processing

## Final Checks

### Code Quality

-   [ ] No console errors in production
-   [ ] No console warnings in production
-   [ ] Code is minified (if applicable)
-   [ ] Comments are helpful
-   [ ] Functions are documented

### User Experience

-   [ ] First-time user can complete workflow
-   [ ] Error messages are helpful
-   [ ] Success feedback is clear
-   [ ] Loading states are indicated
-   [ ] No dead ends in UI

### Documentation

-   [ ] All links work
-   [ ] All examples are accurate
-   [ ] All screenshots are current (if any)
-   [ ] Contact information is present

## Sign-Off

-   [ ] All critical tests pass
-   [ ] All major browsers tested
-   [ ] Documentation is complete
-   [ ] Ready for production deployment

---

**Testing Date**: ******\_\_\_******
**Tested By**: ******\_\_\_******
**Browser Versions**: ******\_\_\_******
**Issues Found**: ******\_\_\_******
**Status**: ⬜ Pass / ⬜ Fail / ⬜ Needs Work
