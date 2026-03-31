# GUEST & CLIENT DASHBOARD: IMPLEMENTATION PLAN

**Target Project**: Expert28 Gym Prototype
**Focus**: Unified Client Portal for both `guest` (Unpaid) and `client` (Paid) roles.
**Version**: 1.0.0

---

## 🏗️ 1. Architecture & Routing Strategy

Both `guest` and `client` roles share the same base layout and routing (`/client/*`). The differentiation between the two states is handled entirely at the UI level based on the `membership_tier` and `role` properties in their Supabase profile.

### State Definitions
- **Guest State** (`role === 'guest'`): 
  - User has created an account but has not completed a Stripe checkout.
  - **Objective**: Conversion. The UI should prioritize membership selection and hide active gym features.
- **Client State** (`role === 'client'`): 
  - User has completed payment. Make.com webhook has upgraded their role.
  - **Objective**: utility & engagement. The UI should prioritize workout tracking, attendance, and progression.

---

## 🎨 2. Feature Toggle Matrix

| Feature | Guest View | Client View |
| :--- | :--- | :--- |
| **Welcome Header** | "Athlete Performance Hub" (Standard) | "Athlete Performance Hub" (Standard) |
| **Membership Card**| High-visibility Upgrade/Checkout Options | "Active" Status & "Manage Billing" button |
| **Self Check-In** | ❌ Locked / Hidden | ✅ Active Big Button |
| **Workout Metrics**| ❌ Hidden / Teaser Stats | ✅ Real stats (Visits, Consistency) |
| **Workout Logger** | ❌ Locked / Paywall overlay | ✅ Full CRUD (Add sets/reps/notes) |

---

## 📂 3. Page Structure

### 1. `/client/dashboard` (Main Hub)
- **Guest**: Sees the "Upgrade to Unlock Lab Access" cards we recently built.
- **Client**: Sees the "Self Check-In" button, recent workout summary, and their consistency score.

### 2. `/client/workouts` (The Lab Tracker)
- **Guest**: Sees a blurred-out preview of the workout logger with a padlock overlay.
- **Client**: Has full access.
  - Can create a new workout log (Date, Title).
  - Can add sets/reps/weight to the log.
  - Can mark as completed.
  - Data syncs to `workout_checklists` table.

---

## ⚙️ 4. Data Layer (Supabase) Requirements

To support this frontend, we need to ensure the following tables are fully accessible to the authenticated client:

1.  **`attendance`**:
    - RLS Policy: Clients can `INSERT` their own check-ins.
    - RLS Policy: Clients can `SELECT` their own check-ins.

2.  **`workout_checklists`**:
    - RLS Policy: Clients can `SELECT`, `INSERT`, `UPDATE`, `DELETE` where `user_id = auth.uid()`.

3.  **`profiles`**:
    - RLS Policy: Clients can `SELECT` and `UPDATE` their own profile (already implemented).

---

## 🚀 5. Implementation Phases

### Phase 1 — UI Unification & Locking ✅ COMPLETE
- [x] Refactor `ClientDashboard.tsx` to completely hide the Mock "Recent Workouts", "Workouts", and "Consistency" stats if the user is a `guest`.
- [x] Add empty states for `client` users who haven't logged any workouts yet.

### Phase 2 — Self Check-in System ✅ COMPLETE
- [x] Wire up the "Self Check-In" button to insert a row into the `attendance` table.
- [x] Add a visual success state (e.g., Turn button green and disable it for the day).
- [x] Add a DB check so they can't check in twice on the same day.

### Phase 3 — The Workout Tracker (`/client/workouts`) ✅ COMPLETE
- [x] Create the new page route and add it to `App.tsx`.
- [x] Build a mobile-first UI for logging reps and sets on the gym floor — Quick Log with +/- counters, quick-pick chips, session grouping by date.
- [x] Connect the UI to the `workout_checklists` table — full SELECT / INSERT / DELETE via Supabase RLS.
- [x] Add a "Paywall Overlay" component that wraps this feature if `role === 'guest'`.
- [x] Wire up real workout count + consistency % on `ClientDashboard.tsx` (replaced hardcoded mock values).

### Phase 4 — Billing Portal ✅ COMPLETE
- [x] Created `api/create-portal-session.ts` — looks up Stripe customer by email, creates a hosted portal session.
- [x] Wired "Manage Billing" button in `ClientDashboard.tsx` to call the endpoint with loading/error states.
- [x] Replaced hardcoded "Recent Workouts" mock data with live query from `workout_checklists` (last 3 entries).
- [x] Fixed `isGuest` logic — now checks `role` instead of `membership_tier` across all client pages.
