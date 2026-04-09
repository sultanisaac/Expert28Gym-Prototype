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
| `price` | Numeric | Sale/Current Amount in currency |
| `original_price`| Numeric | For discounts (strike-through pricing) |
| `currency` | Text | Dynamic currency (e.g., 'idr', 'gbp', 'usd') |
| `features` | Text[] | Array of benefit bullet points |
| `interval` | Text | 'month', 'week', or 'one-time' |
| `badge` | Text | Dynamic Tags (e.g., 'Most Popular', 'Best Value') |
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
- **Dynamic Badges**: Pre-set category buttons (Hot, Popular, New) or custom tags.
- **Smart Discounts**: Setting an `original_price` > `price` automatically generates strike-through pricing and "% Save" indicators.
- **Explicit Synchronization ("Confirm & Sync")**: Admins make multiple changes locally first. A dirty-state check triggers a prompt to "Confirm & Sync Changes", preventing accidental mid-typing Stripe updates.
- **Live Toggle**: Instantly hide/show plans on the landing page (Live / Draft).

### Universal Representation (Guest, Client, Landing)
- **Automated Pricing**: Fetches only `is_active: true` plans natively.
- **Dynamic Currency & Formats**: Currency symbols and periods are injected based on DB configuration.
- **Persistent Logic**: 
  - **Landing Page**: Shows strike-through deals and glowing badges.
  - **Join Modal**: Reflects the exact same data to prevent discrepancies at checkout.
  - **Client & Profile Dashboards**: Members without active access are directed to this same source-of-truth.

---

## 4. Implementation Log

### Phase 1: Infrastructure
- [x] Create `membership_plans` table with RLS.
- [x] Implement Stripe Node.js SDK integration.
- [x] Create core `api/manage-plan.ts` logic.

### Phase 2: Refactoring & Localization
- [x] Replace hardcoded environment variables with DB dynamic lookups.
- [x] Support multiple currencies (Rp, £, $) based on dynamic column.
- [x] Support both One-time and Subscription checkout sessions dynamically.

### Phase 3: UX & Growth Optimizations
- [x] Explicit Admin "Confirm & Sync" Workflow to protect API limits.
- [x] Smart Badge Categories ("Best Value", "Hot").
- [x] Dynamic Strike-through Discounts (`original_price` implementation).
- [x] Centralize all views (Landing, Modals, Profiles) to the same real-time pricing data.

---

## 5. Security & Maintenance
- **Service Role**: Backend operations use the `SUPABASE_SERVICE_ROLE_KEY` for secure Stripe sync.
- **Sync Integrity**: If a price update fails in Stripe, the DB is not updated (Atomic consistency) and loading states lock the UI to prevent double-clicks.
