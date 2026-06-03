# Public Release Safety Guide — Expert28 Gym Prototype

This document classifies all files in the **Expert28 Gym Prototype** workspace according to their suitability for public publishing on GitHub.

---

## 🟢 Category 1: Safe to Publish
These files contain core application logic, asset bundles, design systems, and standard build configurations. They present no security risk.

| File Path | Description | Action |
| :--- | :--- | :---: |
| **`src/`** (Entire folder) | Core application source code (React, TypeScript, Framer, Recharts). | **Publish** |
| **`api/`** (Entire folder) | Stripe checkout and billing portal serverless functions. | **Publish** |
| **`public/Logo.png`** | Application main branding graphic. | **Publish** |
| **`public/docs-assets/logo.png`** | Documentation logo graphic. | **Publish** |
| **`index.html`** | Application entry HTML point. | **Publish** |
| **`package.json`** | Dependencies list and project metadata. | **Publish** |
| **`package-lock.json`** | Dependency version lockfile. | **Publish** |
| **`tailwind.config.js`** | Tailwind CSS styling configuration. | **Publish** |
| **`postcss.config.js`** | PostCSS setup configuration. | **Publish** |
| **`vite.config.ts`** | Vite compiler configuration. | **Publish** |
| **`tsconfig.json`** | TypeScript settings. | **Publish** |
| **`tsconfig.app.json`** | TypeScript compiler settings for frontend. | **Publish** |
| **`tsconfig.node.json`** | TypeScript compiler settings for Node environment. | **Publish** |
| **`eslint.config.js`** | Code style and lint rules. | **Publish** |
| **`components.json`** | Shadcn UI component registration settings. | **Publish** |
| **`vercel.json`** | Deployment rewrite routes. | **Publish** |
| **`.gitignore`** | Version control tracking exclusions. | **Publish** |
| **`.env.example`** | Clean environment variable template. | **Publish** |

---

## 🟡 Category 2: Review Before Publishing
These files are technical design plans, internal developer guides, or tool configs. They are safe to publish but reveal prototype specs, database structures, or third-party workflow configurations (like Make.com setup).

| File Path | Description | Action |
| :--- | :--- | :---: |
| **`GITHUB_ISSUES_GUIDE.md`** | Protocol instructions for AI Dev Agents working on issues. | **Review** (Keep if you want public contributors to see AI agent protocols, otherwise delete). |
| **`implementation/`** (Entire folder) | Detailed architecture briefs, design system blueprints, Stripe database synchronization logic, and Make.com configurations. | **Review** (Highly recommended to retain for developer reference, but check if details match your exact production specs). |
| **`.bolt/`** (Entire folder) | Bolt.new configuration, prompt instructions, and file ignore list. | **Review** (Specific to Bolt sandbox; not needed for regular public repository usage). |

---

## 🔴 Category 3: Remove Before Publishing (Do Not Commit)
These files contain active local configuration values or temporary build compilation artifacts that should not be tracked in a public repository.

| File Path | Status in Workspace | Reason for Exclusion | Action Required |
| :--- | :---: | :--- | :--- |
| **`.env`** | ❌ Untracked | Contains active Stripe secret keys and Supabase credentials. | Already ignored by `.gitignore`. Ensure it remains untracked. |
| **`.env.local`** | ❌ Untracked | Contains active Stripe keys and Vercel OIDC Token. | Already ignored by `.gitignore`. Ensure it remains untracked. |
| **`tsconfig.app.tsbuildinfo`** | ⚠️ **Tracked** | Temporary TypeScript compiler build cache. | **Remove from tracking** (`git rm --cached`). Add to `.gitignore`. |
| **`tsconfig.node.tsbuildinfo`** | ⚠️ **Tracked** | Temporary TypeScript compiler build cache. | **Remove from tracking** (`git rm --cached`). Add to `.gitignore`. |
| **`node_modules/`** | ❌ Untracked | Heavy third-party dependency modules. | Already ignored by `.gitignore`. |
| **`dist/`** | ❌ Untracked | Frontend build distribution artifacts. | Already ignored by `.gitignore`. |
| **`.vercel/`** | ❌ Untracked | Local Vercel deploy cache and settings. | Already ignored by `.gitignore`. |
