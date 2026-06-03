# Security Audit — Expert28 Gym Prototype

This report summarizes the findings of a security scan performed on the **Expert28 Gym Prototype** repository in preparation for public release.

---

## 🛡️ Executive Summary
A scan of all configuration files, source code, CI/CD setup, and environment configurations was executed. The repository adheres to secure coding practices by loading all sensitive variables dynamically. However, since the local environment files (`.env` and `.env.local`) contain real active credentials, their exclusion from version control has been verified, and recommendations for credential management are provided below.

---

## 📋 Scan Findings

### 1. Sensitive Files Checked

| File Path | Tracked in Git? | Contains Secrets? | Risk Level | Details |
| :--- | :---: | :---: | :---: | :--- |
| **`.env`** | ❌ No (Ignored) | Yes | **HIGH** (If committed) | Contains active Stripe secret keys and Supabase service role key. |
| **`.env.local`** | ❌ No (Ignored) | Yes | **HIGH** (If committed) | Contains Vercel OIDC Token and Stripe keys. |
| **`.env.example`** | ✅ Yes | No | **NONE** | Contains only descriptive placeholders (e.g. `your_anon_key`). |
| **`vercel.json`** | ✅ Yes | No | **NONE** | Standard routing rewrite rules. |

---

### 2. Environment Variables & Secret Masking

The following sensitive variables were detected in local untracked `.env`/`.env.local` files. These values must remain outside the git history:

* **`STRIPE_SECRET_KEY`**: `sk_test_51TFD7WR9Pkde3J5r****************************************************************************************`
  * *Severity:* **HIGH**
  * *Location:* `.env` (Line 3), `.env.local` (Line 3)
  * *Remediation:* Verified ignored. Ensure the live production key is NEVER placed in this file.

* **`STRIPE_PUBLISHABLE_KEY`**: `pk_test_51TFD7WR9Pkde3J5r****************************************************************************************`
  * *Severity:* **MEDIUM**
  * *Location:* `.env` (Line 4), `.env.local` (Line 2)
  * *Remediation:* Verified ignored.

* **`VITE_SUPABASE_URL`**: `https://xuajmsxpnedvjxhclzfd.supabase.co`
  * *Severity:* **LOW** (Public API Endpoint)
  * *Location:* `.env` (Line 7)

* **`VITE_SUPABASE_ANON_KEY`**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YWptc3hwbmVkdmp4aGNsemZk****************`
  * *Severity:* **LOW** (Safe for public client distribution under Row Level Security)
  * *Location:* `.env` (Line 8)

* **`SUPABASE_SERVICE_ROLE_KEY`**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YWptc3hwbmVkdmp4aGNsemZk****************`
  * *Severity:* **CRITICAL** (Bypasses Row Level Security)
  * *Location:* `.env` (Line 9)
  * *Remediation:* Verified ignored. This key must never be shared, exposed in public client bundles, or committed to GitHub.

* **`VERCEL_OIDC_TOKEN`**: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9wZXRlcmFsYmFuMjYtNzk1NXMtcHJvamVjdHMiLCJzdWIiOiJvd25lcjpwZXRlcmFsYmFuMjYtNzk1NXMtcHJvamVjdHM****************`
  * *Severity:* **HIGH** (Temporary ID Token, now expired)
  * *Location:* `.env.local` (Line 4)
  * *Remediation:* Verified ignored.

---

### 3. Source Code Scans

The source code was searched for hardcoded credentials, connection strings, or private configurations.
* **Serverless Endpoints (`api/create-checkout-session.ts`, `api/manage-plan.ts`, `api/create-portal-session.ts`):** All Stripe instances are initialized safely using `process.env.STRIPE_SECRET_KEY`. No hardcoded strings.
* **Supabase Client Core (`src/lib/supabase.ts`):** Safely initialized using Vite's `import.meta.env` system.
* **Radix / Shadcn components (`src/components/ui/`):** Entirely clean.
* **Routing guards & QuickLogin (`src/components/QuickLogin.tsx`):** Roles and logins are defined as labels. Actual passwords are not hardcoded. The quicklogin credentials require matching user accounts in the database.

---

## ⚡ Recommended Security Actions & Hardening

1. **Stripe Test Mode Keys:** The Stripe keys currently in use are test keys (`sk_test_*` and `pk_test_*`). Prior to public release, ensure that any live production keys (`sk_live_*`) are configured *only* in the Vercel project settings dashboard, and never on local machines or inside files.
2. **Supabase Row Level Security (RLS):** Since the anonymous key (`VITE_SUPABASE_ANON_KEY`) will be public, confirm that RLS is active on all tables (`profiles`, `workout_checklists`, `attendance`, `payment_history`, `audit_logs`).
3. **Database Secrets Rotation:** If the repository is cloned for public use, users should be instructed to generate their own Supabase project and Stripe keys. Recommend rotating the current `SUPABASE_SERVICE_ROLE_KEY` if there is any suspicion of it being exposed outside this development environment.
