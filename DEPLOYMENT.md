# Deployment Guide

## Overview

This is a static website that can be deployed to any static hosting service. No server-side code or build process is required.

## Deployment Options

### Option 1: GitHub Pages (Free)

1. **Create a GitHub repository**

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/yourusername/readable-spokable-pdf.git
    git push -u origin main
    ```

2. **Enable GitHub Pages**

    - Go to repository Settings → Pages
    - Source: Deploy from branch
    - Branch: main, folder: / (root)
    - Save

3. **Access your site**
    - URL: `https://yourusername.github.io/readable-spokable-pdf/`

### Option 2: Netlify (Free)

1. **Via Netlify Drop**

    - Go to [Netlify Drop](https://app.netlify.com/drop)
    - Drag and drop your project folder
    - Get instant URL

2. **Via Git**

    - Push code to GitHub/GitLab/Bitbucket
    - Connect repository in Netlify
    - Deploy automatically on push

3. **Configuration** (optional)
   Create `netlify.toml`:

    ```toml
    [build]
      publish = "."

    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```

### Option 3: Vercel (Free)

1. **Install Vercel CLI**

    ```bash
    npm install -g vercel
    ```

2. **Deploy**

    ```bash
    vercel
    ```

3. **Or via Git**
    - Push to GitHub
    - Import project in Vercel dashboard
    - Deploy automatically

### Option 4: Cloudflare Pages (Free)

1. **Push to Git**

    - Push your code to GitHub/GitLab

2. **Create Pages Project**
    - Go to Cloudflare Pages
    - Connect your repository
    - Build settings: None (static site)
    - Deploy

### Option 5: AWS S3 + CloudFront

1. **Create S3 Bucket**

    ```bash
    aws s3 mb s3://readable-spokable-pdf
    aws s3 sync . s3://readable-spokable-pdf --exclude ".git/*"
    ```

2. **Enable Static Website Hosting**

    - Bucket → Properties → Static website hosting
    - Index document: index.html

3. **Set Bucket Policy**

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::readable-spokable-pdf/*"
            }
        ]
    }
    ```

4. **Optional: Add CloudFront**
    - Create CloudFront distribution
    - Origin: S3 bucket
    - Enable HTTPS

### Option 6: Self-Hosted

1. **Simple HTTP Server**

    ```bash
    # Python
    python -m http.server 8000

    # Node.js
    npx http-server -p 8000

    # PHP
    php -S localhost:8000
    ```

2. **Nginx**

    ```nginx
    server {
        listen 80;
        server_name yourdomain.com;
        root /path/to/readable-spokable-pdf;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    ```

3. **Apache**

    ```apache
    <VirtualHost *:80>
        ServerName yourdomain.com
        DocumentRoot /path/to/readable-spokable-pdf

        <Directory /path/to/readable-spokable-pdf>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>
    </VirtualHost>
    ```

## Single-File Bundle

For maximum portability, create a single-file bundle:

```bash
npm run bundle
```

This creates `dist/index-bundle.html` with all CSS and JS inlined. You can:

-   Email it
-   Share via USB drive
-   Open directly from filesystem
-   Deploy as a single file

**Note:** The bundle still requires internet for:

-   PDF.js library (CDN)
-   jsPDF library (CDN)
-   Google AI Studio API calls

## Custom Domain

### GitHub Pages

1. Add `CNAME` file with your domain:

    ```
    yourdomain.com
    ```

2. Configure DNS:
    ```
    Type: A
    Name: @
    Value: 185.199.108.153
           185.199.109.153
           185.199.110.153
           185.199.111.153
    ```

### Netlify/Vercel/Cloudflare

1. Add domain in dashboard
2. UpdDNS nameservers or add CNAME record
3. SSL is automatic

## Environment Variables

This app doesn't use environment variables (everything is client-side). However, you can customize:

1. **Default Settings**: Edit `js/settings.js` → `DEFAULT_SETTINGS`
2. **Model List**: Edit default model priority in settings
3. **Branding**: Edit HTML/CSS for custom branding

## HTTPS

**Important:** Always use HTTPS in production for security.

-   GitHub Pages: Automatic HTTPS
-   Netlify/Vercel/Cloudflare: Automatic HTTPS
-   Self-hosted: Use Let's Encrypt (certbot)

## Performance Optimization

### 1. Enable Compression

**Nginx:**

```nginx
gzip on;
gzip_types text/css application/javascript application/json;
```

**Apache:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### 2. Cache Headers

**Nginx:**

```nginx
location ~* \.(css|js|jpg|png|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN

Use a CDN for faster global delivery:

-   Cloudflare (free)
-   AWS CloudFront
-   Fastly

### 4. Minification

Minify CSS and JS (optional):

```bash
# Install tools
npm install -g csso-cli terser

# Minify CSS
csso css/main.css -o css/main.min.css

# Minify JS
terser js/app.js -o js/app.min.js
```

## Security Headers

Add security headers for production:

**Nginx:**

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https://cdnjs.cloudflare.com https://generativelanguage.googleapis.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline';" always;
```

## Monitoring

### Analytics (Optional)

Add Google Analytics or similar:

```html
<!-- Add before </head> in index.html -->
<script
    async
    src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### Error Tracking (Optional)

Add Sentry or similar:

```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
    Sentry.init({ dsn: "YOUR_DSN" });
</script>
```

## Updating

### Manual Update

1. Make changes locally
2. Test thoroughly
3. Deploy updated files

### Automated Deployment

**GitHub Actions** (for GitHub Pages):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v2
            - name: Deploy to GitHub Pages
              uses: peaceiris/actions-gh-pages@v3
              with:
                  github_token: ${{ secrets.GITHUB_TOKEN }}
                  publish_dir: .
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Ensure you're serving via HTTP/HTTPS (not file://)
2. Check browser console for specific errors
3. Verify API endpoints allow your domain

### Mixed Content Warnings

If deploying on HTTPS:

-   Ensure all CDN resources use HTTPS
-   Check for any http:// links in code

### Large File Uploads

Some hosts have upload size limits:

-   GitHub Pages: 100MB per file, 1GB per repo
-   Netlify: 125MB per file
-   Vercel: 100MB per file

## Backup & Recovery

### Backup Strategy

1. **Code**: Keep in Git repository
2. **User Data**: Users manage their own (browser storage)
3. **Settings**: Export/import feature in app

### Disaster Recovery

Since this is a static site:

1. Redeploy from Git repository
2. No database to restore
3. Users' data is in their browsers

## Compliance

### GDPR

-   No cookies used
-   No server-side tracking
-   All data stored locally in user's browser
-   Privacy policy included

### Accessibility

-   Keyboard navigable
-   ARIA labels included
-   Color contrast compliant
-   Screen reader friendly

## Cost Estimates

### Free Tier Hosting

-   GitHub Pages: Free (100GB bandwidth/month)
-   Netlify: Free (100GB bandwidth/month)
-   Vercel: Free (100GB bandwidth/month)
-   Cloudflare Pages: Free (unlimited bandwidth)

### Paid Hosting (if needed)

-   Netlify Pro: $19/month (400GB bandwidth)
-   Vercel Pro: $20/month (1TB bandwidth)
-   AWS S3 + CloudFront: ~$1-5/month (varies by traffic)

### API Costs

Users pay for their own Google AI Studio usage.

## Support

For deployment issues:

1. Check hosting provider documentation
2. Review browser console for errors
3. Test locally first
4. Check DNS propagation (if using custom domain)
