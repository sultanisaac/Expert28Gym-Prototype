# STRIPE PAYMENT INTEGRATION — Expert28 Gym Prototype

**Status**: Implementation Plan (pre-code)
**Last Updated**: 2026-03-26

---

## Overview

We use **Stripe Checkout (hosted redirect)** for payments, triggered from a dedicated `/apply` page.
The existing "Join Expert28" modal is repurposed as a **marketing teaser** — it shows benefits and pricing, with a single CTA that navigates the user to `/apply`.

No Supabase. No custom webhook handler on the site. Stripe fires webhooks directly to Make.com.

---

## User Flow

```
[Pricing Card] → "Join Expert28" button
      ↓
[JoinModal] — shows plan benefits, price, social proof
      ↓ clicks "Apply Now" / "Continue to Application"
[/apply page] — form: Name, Email, Phone, Goal + selected plan
      ↓ submits form
[Vercel API /api/create-checkout-session] — creates Stripe session
      ↓ redirects
[Stripe Checkout] — hosted payment page (Stripe handles all card UI)
      ↓ payment succeeds
[/success page] — confirmation, next steps
      ↓
[Stripe → Make.com Webhook] — automation triggers (email, WhatsApp, CRM, etc.)
```

If user cancels on Stripe → redirected to `/apply?cancelled=true` (shows a soft message, keeps form data).

---

## Pages to Create

| Page | Route | Description |
|---|---|---|
| Apply | `/apply` | Full application form (Name, Email, Phone, Goal) + plan summary + Pay CTA |
| Success | `/success` | Post-payment confirmation. Shows next steps. |
| *(cancel stays on)* | `/apply?cancelled=true` | Soft message, keeps form, user can retry |

Since this is a **Vite SPA** (no React Router installed), pages are handled via:
- **Hash-based routing** using `window.location.hash` — e.g. `/#/apply`, `/#/success`
- Or by detecting `window.location.pathname` if the Vercel `vercel.json` rewrites all routes to `index.html`

**Recommended: use `vercel.json` rewrites + pathname-based routing** — cleaner URLs, better SEO.

---

## Files to Create / Modify

```
Expert28Gym-Prototype/
├── api/
│   └── create-checkout-session.ts   ← NEW: Vercel serverless function
├── src/
│   ├── pages/
│   │   ├── ApplyPage.tsx            ← NEW: Form + pay
│   │   └── SuccessPage.tsx          ← NEW: Post-payment confirmation
│   ├── components/
│   │   └── JoinModal.tsx            ← MODIFY: teaser only, no form
│   └── App.tsx                      ← MODIFY: add routing, wire modal/pages
├── vercel.json                      ← NEW: SPA route rewrites
├── .env.local                       ← NEW: local env vars (never commit)
└── STRIPE.md                        ← This file
```

---

## Environment Variables

Set these in two places:
1. **`.env.local`** — for local development (`npm run dev`)
2. **Vercel Dashboard → Project → Settings → Environment Variables** — for production

| Variable | Value | Side | Where to get it |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Server only | See §A below |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` | Client-safe | See §A below |
| `STRIPE_PRICE_ID` | `price_...` | Server only | See §B below |
| `VITE_APP_URL` | `https://your-site.vercel.app` | Client + Server | Your Vercel project URL |

> ⚠️ **NEVER prefix `STRIPE_SECRET_KEY` with `VITE_`** — Vite embeds `VITE_` vars into the browser bundle. The secret key must stay server-side only.

---

## §A — Where to Get API Keys from Stripe

1. Go to **[https://dashboard.stripe.com](https://dashboard.stripe.com)**
2. In the left sidebar click **"Developers"**
3. Click **"API keys"**
4. You will see two keys:
   - **Publishable key** — starts with `pk_test_` (testing) or `pk_live_` (live). Safe for browser.
   - **Secret key** — starts with `sk_test_` or `sk_live_`. **Never expose this.**
5. Use **test keys** (`sk_test_` / `pk_test_`) until you're ready to go live.

> 💡 Use **test mode** (toggle in top-left of Stripe dashboard) while building. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## §B — Where to Get the Price ID from Stripe

The Checkout Session requires a **Price ID** (`price_...`), NOT the Product ID (`prod_...`).

**Step-by-step:**

1. Go to **Stripe Dashboard → Products** (in the left sidebar)
2. Click **"Add product"** (or select an existing one)
3. Fill in:
   - **Name**: e.g. `Expert28 Transformation Plan`
   - **Description**: optional but good for the Stripe-hosted checkout page
   - **Image**: optional — appears on the Stripe checkout page
4. Under **Pricing**, set:
   - **Price**: e.g. `£49.00` (or your actual price)
   - **Billing period**: One-time (since it's a transformation plan, not a recurring membership)
   - Or set to **Recurring / Monthly** if it's a subscription
5. Click **Save product**
6. On the product detail page, under **Pricing**, you'll see the price listed with an ID like `price_1PxxxxxxxxxxxxxxxxxxxxX`
7. **Copy that `price_xxx` ID** — this goes into `STRIPE_PRICE_ID` env var

> 💡 If you have multiple plans (Base $29, Elite $49, Trial $8), you can create multiple products/prices and store multiple price IDs as separate env vars: `STRIPE_PRICE_BASE`, `STRIPE_PRICE_ELITE`, `STRIPE_PRICE_TRIAL`. The selected plan from the modal can then determine which price ID the API uses.

---

## §C — Setting Up Make.com Webhook from Stripe

This connects Stripe payments to your Make.com automations. **No code needed on the site for this step.**

1. In **Make.com**, create a new Scenario
2. Add a **Webhook** trigger → copy the webhook URL (looks like `https://hook.eu1.make.com/xxxxx`)
3. Go to **Stripe Dashboard → Developers → Webhooks**
4. Click **"Add endpoint"**
5. Paste the Make.com webhook URL
6. Under **"Events to send"**, select:
   - `checkout.session.completed` ← this is the key one — fires when payment succeeds
   - Optionally: `payment_intent.payment_failed` for failed payment handling
7. Click **"Add endpoint"**

Make.com will receive the full Stripe event payload including:
```json
{
  "customer_email": "user@email.com",
  "amount_total": 4900,
  "metadata": {
    "name": "John Doe",
    "phone": "+447700000000",
    "goal": "Lose 10kg in 28 days",
    "plan": "Elite Expert"
  },
  "payment_status": "paid"
}
```

---

## Vercel Serverless Function — How It Works

| | Detail |
|---|---|
| **File location** | `api/create-checkout-session.ts` |
| **Route** | Vercel auto-exposes it at `POST /api/create-checkout-session` |
| **Inputs** | `name`, `email`, `phone`, `goal`, `plan` (JSON body) |
| **What it does** | Creates a Stripe Checkout Session with form data as metadata |
| **Output** | `{ url: "https://checkout.stripe.com/..." }` |
| **Frontend** | React calls this endpoint, then `window.location.href = url` to redirect |

---

## JoinModal — Teaser Mode (Post-Change)

The modal **no longer contains a form**. It becomes a conversion teaser:

- Shows the selected plan name + price
- Lists 3–4 key benefits of the transformation
- Shows a social proof line ("Join 500+ members")
- Single CTA button: **"Apply Now →"** or **"Continue to Application"**
  - This button closes the modal and navigates to `/apply` (passing the selected plan via URL param: `/apply?plan=elite`)

---

## Apply Page — What It Contains

| Element | Detail |
|---|---|
| Header | "Apply for the Expert28 Transformation" |
| Plan summary | Shows the plan they selected (pre-filled from URL param) |
| Form | Full Name, Email, Phone Number, Training Goal (textarea) |
| Validation | `react-hook-form` + `zod` (already installed) |
| Submit button | "Pay & Apply — £49" with loading spinner |
| On submit | Calls `/api/create-checkout-session` → redirects to Stripe |
| On cancel return | Soft message: "Payment cancelled — your application is still saved below" |

---

## Success Page — What It Contains

- ✅ Large confirmation icon
- Headline: "You're in. Welcome to Expert28."
- Sub-copy: "Check your email for next steps. We'll be in touch within 24 hours."
- CTA back to homepage
- Social media links

---

## Implementation Checklist

### Before coding:
- [ ] Create product + price in Stripe dashboard (§B)
- [ ] Copy `price_xxx` ID
- [ ] Copy `sk_test_xxx` and `pk_test_xxx` API keys (§A)
- [ ] Set up Make.com webhook and connect to Stripe (§C) — can do after coding

### Dev implementation order:
1. Install `stripe` npm package ✅ (already done)
2. Create `.env.local` with real keys
3. Create `vercel.json` for SPA route rewrites
4. Create `api/create-checkout-session.ts`
5. Create `src/pages/ApplyPage.tsx`
6. Create `src/pages/SuccessPage.tsx`
7. Update `src/components/JoinModal.tsx` (teaser only)
8. Update `src/App.tsx` (routing + modal wiring)

### After coding:
- [ ] Test locally with Stripe test card `4242 4242 4242 4242`
- [ ] Deploy to Vercel
- [ ] Add all env vars in Vercel dashboard
- [ ] Test on production with test keys
- [ ] Switch Stripe to live mode + update keys
- [ ] Verify Make.com webhook receives test event

---

## Local Test Card (Stripe Test Mode)

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date (e.g. `12/29`) |
| CVC | Any 3 digits (e.g. `123`) |
| Name | Anything |
| Zip | Anything |
