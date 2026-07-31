# Metadata Implementation Plan

## Overview
The objective is to replace the default `bolt.new` placeholder meta tags with a complete, robust set of SEO and Social Media metadata. This will include generating a high-quality visual snapshot of the running application to use as the Open Graph (OG) and Twitter Card image, ensuring links shared on platforms like iMessage, Twitter, Discord, and LinkedIn look premium and professional.

## Execution Steps

### Phase 1: Capture Application Snapshot (`og-image.png`)
1. Ensure the local development server is running and the UI is fully rendered (including the Hero Section and Glassmorphism elements).
2. I will utilize an automated tool (or a quick Puppeteer script) to capture a high-resolution screenshot of the application. The viewport will be set to `1200x630` pixels, which is the exact optimal dimension for social media preview cards.
3. The resulting image will be saved directly to the public folder as `public/og-image.png`.

### Phase 2: Update HTML Metadata (`index.html`)
The `<head>` section of the `index.html` file will be entirely overhauled.

**1. Basic SEO Tags:**
Adding standard meta tags for search engine crawlers:
```html
<meta name="description" content="A high-performance athlete management and gym orchestration platform designed for elite coaches and dedicated athletes." />
<meta name="keywords" content="expert28 gym, athlete management, coaching platform, gym software, workout tracker" />
<meta name="author" content="Expert28" />
<meta name="theme-color" content="#000000" />
```

**2. Open Graph Tags (Facebook, LinkedIn, iMessage, Discord):**
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://expert28gym-prototype0.vercel.app/" />
<meta property="og:title" content="Expert28 Gym — Performance Lab Prototype" />
<meta property="og:description" content="A high-performance athlete management and gym orchestration platform designed for elite coaches and dedicated athletes." />
<meta property="og:image" content="https://expert28gym-prototype0.vercel.app/hero-image.jpg" />
```

**3. Twitter Card Tags (X / Twitter):**
Replacing the existing bolt URLs:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Expert28 Gym — Performance Lab Prototype" />
<meta name="twitter:description" content="A high-performance athlete management and gym orchestration platform designed for elite coaches and dedicated athletes." />
<meta name="twitter:image" content="https://expert28gym-prototype0.vercel.app/hero-image.jpg" />
```

### Phase 3: Validation and Verification
1. Confirm the `hero-image.jpg` is correctly stored in the `public/` directory.
2. Ensure the `<head>` of `index.html` properly renders all tags in the local DOM.
3. (Optional) In the future, once deployed, the metadata can be tested live using the Twitter Card Validator or LinkedIn Post Inspector.

---

### Task Checklist
- [x] Identify appropriate Open Graph & Twitter Card preview image (`hero-image.jpg`).
- [x] Confirm preview image exists in the `public/` directory.
- [x] Configure production URL for absolute paths (`https://expert28gym-prototype0.vercel.app/`).
- [x] Remove default `bolt.new` placeholder meta tags from `index.html`.
- [x] Inject Primary SEO Meta Tags (Description, Keywords, Author, Theme Color).
- [x] Inject Open Graph (OG) Tags for Facebook, LinkedIn, Discord.
- [x] Inject Twitter Card Tags for X/Twitter.

✅ **Status: 100% Completed.**
