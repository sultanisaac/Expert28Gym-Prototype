# Implementation Plan: Dynamic Membership & Pricing Management

**Status**: ✅ Completed
**Goal**: Allow Admin role users to fully manage membership plans (CRUD) directly from the dashboard, with automatic synchronization to Stripe products/prices and live updates to the website.

---

## 1. Database Schema (Supabase)
The `membership_plans` table is the Single Source of Truth for all active offerings.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary Key |
| `name` | Text | Unique plan name (e.g. 'Elite Expert') |
| `description` | Text | Marketing description |
| `price` | Numeric | Amount in IDR (Rp) |
| `currency` | Text | Default: 'idr' |
| `features` | Text[] | Array of benefit bullet points |
| `interval` | Text | 'month', 'week', or 'one-time' |
| `badge` | Text | Ribbon text (e.g. 'Popular') |
| `stripe_product_id`| Text | Reference to the Stripe Product |
| `stripe_price_id` | Text | **Current** Active Price ID |
| `is_active` | Boolean | Visibility toggle (Live / Hidden) |

---

## 2. API Architecture (Vercel Serverless)

### `POST /api/manage-plan`
This comprehensive endpoint handles full CRUD operations:
1. **Create**: Generates a new Product and Price in Stripe, then saves the metadata to Supabase.
2. **Update**: 
   - Syncs Product metadata (Name/Description) to Stripe.
   - **Immutability Check**: If Price or Interval changes, it creates a *new* Price object in Stripe and updates the DB pointer.
3. **Delete**: Removes the plan record from Supabase.

### `POST /api/create-checkout-session`
1. Dynamically queries the `membership_plans` table by name.
2. Fetches the latest `stripe_price_id`.
3. Detects `interval`:
   - If `one-time`: use `mode: 'payment'`.
   - If `month/week`: use `mode: 'subscription'`.

---

## 3. UI Features

### Admin Dashboard (`AdminPayments.tsx`)
- **Real-time CRUD**: Add/Edit/Delete plans without code changes.
- **Live Toggle**: Instantly hide/show plans on the landing page.
- **Save-on-Blur**: edits are saved automatically as the admin types.

### Dynamic Landing Page (`App.tsx`)
- **Automated Pricing**: Fetches only `is_active: true` plans.
- **Smart Sticky Bar**: Automatically calculates "From Rp XXX" based on the cheapest active plan.
- **Dynamic Modals**: The Join Modal now populates features and pricing directly from the DB.

---

## 4. Implementation Log

### Phase 1: Infrastructure
- [x] Create `membership_plans` table with RLS.
- [x] Implement Stripe Node.js SDK integration.
- [x] Create core `api/manage-plan.ts` logic.

### Phase 2: Refactoring
- [x] Replace hardcoded environment variables with DB dynamic lookups.
- [x] Align currency to IDR (Rp) with proper number formatting.
- [x] Support both One-time and Subscription checkout sessions.

---

## 5. Security & Maintenance
- **Service Role**: Backend operations use the `SUPABASE_SERVICE_ROLE_KEY` for secure Stripe sync.
- **Sync Integrity**: If a price update fails in Stripe, the DB is not updated (Atomic consistency).
