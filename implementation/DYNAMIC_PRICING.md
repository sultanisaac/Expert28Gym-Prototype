# Implementation Plan: Dynamic Pricing Management

**Status**: Planning / In Progress
**Goal**: Allow Admin role users to update membership prices directly from the dashboard, which automatically updates Stripe and the website checkout flow.

---

## 1. Database Schema (Supabase)
We have added a `membership_plans` table to track the source of truth for all packages.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary Key |
| `name` | Text | Unique identifier (e.g. 'Base Expert') |
| `price` | Numeric | Display price in the UI |
| `stripe_product_id` | Text | Reference to the Stripe Product |
| `stripe_price_id` | Text | **Current** Active Price ID in Stripe |
| `is_active` | Boolean | Visibility toggle |

---

## 2. API Architecture (Vercel Serverless)

### `POST /api/manage-plan-price`
This new endpoint will handle the synchronization between Supabase and Stripe.
1. **Verify Authorization**: Ensure the requester is an Admin in Supabase.
2. **Create Stripe Price**: Uses `stripe.prices.create()` to generate a new Price object for the existing Product ID.
3. **Update Supabase**: Updates the `membership_plans` record with the new `price` and `stripe_price_id`.

### Refactor `POST /api/create-checkout-session`
1. Instead of reading `process.env.STRIPE_PRICE_...`, it will query the `membership_plans` table in Supabase.
2. Example: `const { data: plan } = await supabase.from('membership_plans').select('stripe_price_id').eq('name', planName).single()`

---

## 3. UI Updates

### Admin Dashboard (`AdminPayments.tsx`)
- Add a **"Manage Plans"** tab.
- Display a list of all plans from the database.
- Provide an **"Edit Price"** modal/form.
- Trigger the `/api/manage-plan-price` endpoint on save.

---

## 4. Implementation Steps

### Phase 1: Database & API Refactor (Current)
- [x] Create `membership_plans` table.
- [x] Seed initial plan data from `.env`.
- [ ] Create `api/manage-plan-price.ts`.
- [ ] Update `api/create-checkout-session.ts` to use DB.

### Phase 2: User Interface
- [ ] Add "Manage Plans" section to `AdminPayments.tsx`.
- [ ] Implement price update feedback (loading states, success/error).

---

## 5. Security Note
- Admin verification will be performed via the Supabase Service Role key combined with the user's JWT `role` check.
- Stripe Secret Key remains server-side only.
