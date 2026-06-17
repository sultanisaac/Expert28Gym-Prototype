# STRIPE PAYMENT INTEGRATION — Expert28 Gym Prototype

**Status**: ✅ Live & Dynamic
**Currency**: IDR (Rp)

---

## Overview

Expert28 uses a **Dynamic Pricing Model**. Instead of hardcoding Stripe Price IDs into code or environment variables, the system manages plans directly via the database.

1. **Admins** manage plans (Price, Features, Name) in the Admin Dashboard.
2. **Back-end** (`api/manage-plan`) syncs these changes to Stripe Products automatically.
3. **Checkout** (`api/create-checkout-session`) looks up active Price IDs from Supabase at runtime.

---

## Environment Variables

Only the core API keys are required. Individual Price IDs are now dynamic.

| Variable | Side | Required | Purpose |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Server | Yes | Authenticates backend requests to Stripe |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client | No | Used if manual client-side Stripe elements are added later |
| `VITE_SUPABASE_URL` | Both | Yes | Database connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes | Elevated permissions for API management tasks |

> ⚠️ **STRIPE_PRICE_BASE/ELITE** are deprecated and should be removed from `.env`.

---

## The Dynamic Sync Logic

When an Admin interacts with the **Manage Plans** tab:

### 1. Create Plan
- Creates a `Product` in Stripe.
- Creates a `Price` in Stripe (IDR currency).
- Saves both IDs to `public.membership_plans`.

### 2. Update Plan
- **Metadata**: Name/Description changes update the existing Stripe Product.
- **Price/Interval**: Since Stripe Price objects are immutable, changing the price or billing period in the dashboard triggers the creation of a **new Stripe Price ID**. This ensures existing subscribers are not affected while new ones get the updated rate.

### 3. Delete Plan
- Removes the record from the database.

---

## Checkout Workflow

### `POST /api/create-checkout-session`

The checkout session handles both **One-time** and **Recurring** memberships:

| Interval | Mode | Stripe Flow |
|---|---|---|
| `one-time` | `payment` | One-off transaction for kits or trials. |
| `month` / `week`| `subscription` | Recurring billing (SaaS style). |

**Metadata included in Stripe Session:**
- `full_name`, `email`, `phone`, `goal`
- `plan_name`
- `user_id` (for linking payment back to the athlete profile)

### 🛡️ Currency Guard & Auto-Correction
The checkout API (`create-checkout-session.ts`) includes a security layer to prevent currency mismatches:
- If a price exists in Stripe but its currency does not match the dashboard setting (e.g., Stripe is set to GBP but Dashboard requires IDR), the API **automatically generates a corrected Stripe Price** in the right currency.
- This new Price ID is then **permanently synced back to Supabase** during the first checkout attempt, ensuring the system remains self-healing.

---

## Webhook Automation (Supabase Edge Function) ✅ LIVE

> Make.com / n8n are no longer required. All post-payment automation is handled natively inside Supabase.

**Function URL:**
```
https://xuajmsxpnedvjxhclzfd.supabase.co/functions/v1/stripe-webhook
```

### Events Handled

| Stripe Event | Action |
|---|---|
| `checkout.session.completed` | Upgrades user `role` → `client`, sets `membership_tier` & `membership_expires_at`, logs to `payment_history`, sends in-app notification |
| `customer.subscription.deleted` | Downgrades user `role` → `user`, clears `membership_tier` & `membership_expires_at`, sends cancellation notification |

### How It Works
1. A user completes checkout. Stripe fires a `checkout.session.completed` event.
2. The event is securely sent to the Edge Function URL (verified via `STRIPE_WEBHOOK_SECRET`).
3. The function reads `metadata.user_id` (set during checkout) to identify the Supabase user.
4. It updates `public.profiles`: sets `role = 'client'`, `membership_tier`, and `membership_expires_at` (30 days from now).
5. It logs the transaction in `public.payment_history`.
6. It fires an in-app welcome notification via `public.notifications`.

### Required Secrets (set in Supabase Dashboard → Edge Functions → stripe-webhook → Secrets)

| Secret Name | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Signing Secret (`whsec_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API |

> ⚠️ `SUPABASE_URL` is auto-injected by Supabase and does not need to be set manually.

### Stripe Dashboard Setup
1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**.
2. Paste the Function URL above.
3. Select events: `checkout.session.completed` and `customer.subscription.deleted`.
4. Copy the **Signing Secret** (`whsec_...`) and save it as `STRIPE_WEBHOOK_SECRET` in Supabase.

---

## Testing (Stripe Test Mode)

Use the following card in **Test Mode** (ensure `STRIPE_SECRET_KEY` starts with `sk_test_`):

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | 123 |
| Minimum Charge | 10,000 IDR |
