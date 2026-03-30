# BACKEND & DASHBOARDS: IMPLEMENTATION PLAN

**Target Project**: Expert28 Gym Prototype
**Focus**: Supabase Integration, Role-Based Dashboards (using `/admin/...` and `/client/...` routing), and Payment Automation.
**Version**: 1.1.0

---

## 🏗️ 1. Database Architecture (Supabase)

We will implement Row Level Security (RLS) to ensure users can only see their own data, while Admins have full visibility across all records.

### Tables & Schema
1.  **`profiles`**: (Extends Supabase Auth)
    - `id` (uuid, primary key)
    - `email` (text, unique)
    - `full_name` (text)
    - `avatar_url` (text) — *Targeting Supabase Storage Bucket: `avatars`*
    - `role` (enum: `'admin'`, `'client'`, `'user'`) — *Default: 'user'*
    - `status` (enum: `'active'`, `'banned'`, `'pending'`) — *Default: 'active'*
    - `membership_tier` (text, null if role is 'user')
    - **Contact/Address Info**:
        - `phone_prefix` (text)
        - `phone_number` (text)
        - `address_line1` (text)
        - `address_line2` (text)
        - `post_code` (text)
        - `city` (text)
        - `county` (text)
        - `country` (text)
    - `created_at` (timestamptz)

2.  **`workout_checklists`**:
    - `id` (uuid)
    - `user_id` (uuid, references profiles.id)
    - `title` (text)
    - `date` (date)
    - `time` (time)
    - `weights_lbs` (numeric)
    - `reps` (int)
    - `notes` (text)
    - `is_completed` (boolean)

3.  **`attendance`**:
    - `id` (uuid)
    - `user_id` (uuid, references profiles.id)
    - `check_in_time` (timestamptz)
    - `method` (text: 'self_check_in')

4.  **`payment_history`**:
    - `id` (uuid)
    - `user_id` (uuid)
    - `stripe_session_id` (text)
    - `amount` (numeric)
    - `currency` (text)
    - `status` (text)
    - `created_at` (timestamptz)

5.  **`audit_logs`**:
    - `id` (uuid)
    - `admin_id` (uuid, references profiles.id)
    - `action` (text: 'ban_user', 'change_role', etc.)
    - `target_user_id` (uuid, references profiles.id)
    - `details` (jsonb)
    - `created_at` (timestamptz)

---

## 🎨 2. UI/UX & Branding Guide (Dashboards)

Dashboards must feel like an extension of the "Dark Performance Lab" landing page.

-   **Color Tokens**: 
    - Secondary/Actions: `var(--blue-cta)` (#2563eb).
    - Success/Primary: `var(--emerald)` (#10b981).
    - Surfaces: `rgba(255, 255, 255, 0.04)` with backdrop-blur.
-   **Typography**: Inter (900 for headers, 400 for data).
-   **Shadcn/UI**: Override default "Primary" to `#10b981`. Set "Radius" to `1rem`. Use "Inner Glow" on cards.
-   **Toasts**: Position: `Top-Left`. Style: Transparent glass with Emerald left-border.

---

## 📂 3. Page Structure

### General User Pages
- `/`: Home page (Landing).
- `/login`: Email/Password only. Clean, centered high-energy image background.
- `/signup`: Basic info gathering.
- `/profile`: Detailed identity management including contact and address fields.
- `/logout`: Clear session and redirect home.

### Admin Dashboard (`/admin/...`)
1.  **`/admin/dashboard`**: Overall metrics (Revenue, Member Growth, Today's Attendance).
2.  **`/admin/clients`**: Full member list, role editing, and banning controls.
3.  **`/admin/payments`**: Transaction logs synced from Stripe.
4.  **`/admin/reporting`**: Analytics charts and CSV exports.

### Client Dashboard (`/client/...`)
1.  **`/client/dashboard`**: Main hub with "One-Click Self Check-in" and recent stats.
2.  **`/client/workouts`**: Full workout history and CRUD for new checklists (Title/Weights/Reps/Notes).
3.  **`/client/membership`**: Current status badge + Stripe Billing Portal integration.

---

## ⚙️ 4. Automation Plan (Make.com)

This connects your Stripe payments to your Supabase logic.

### Scenario: Stripe -> Make.com -> Supabase/Email

**Step 1: Stripe Webhook**
- **Trigger**: `checkout.session.completed`
- **Output**: Returns `customer_email`, `amount_total`, `metadata`.

**Step 2: Update Supabase (Role Promotion)**
- **Action**: Supabase "Update Row" in `profiles` table.
- **Search Criteria**: Find row where `email` matches `customer_email`.
- **Update**: Set `role` = `'client'`, set `membership_tier` = `metadata.plan_name`.

**Step 3: Log Payment**
- **Action**: Supabase "Create Row" in `payment_history`.
- **Data**: Log the amount and Stripe Session ID for the Admin's view.

**Step 4: Email Trigger**
- **Action**: Send Email (via Gmail/Outlook/SendGrid module).
- **Subject**: "Welcome to the Lab, [Name]! Your Expert28 access is live."

---

## 🚀 5. Step-by-Step Implementation Flow

1.  **Phase 1 (Supabase Setup)**: 
    - [x] Create all Postgres tables (`profiles`, `workout_checklists`, `attendance`, `payment_history`, `audit_logs`).
    - [x] Define Role enums and RLS (Row Level Security) policies.
    - [ ] *Action: User to manually set Admin role in Supabase once tables are ready.*

2.  **Phase 2 (Auth Implementation)**:
    - [ ] Build/Enhance the `/signup` and `/login` pages using Supabase Auth.
    - [ ] Ensure new users default to the `'user'` role via Postgres triggers or frontend logic.

3.  **Phase 3 (Testing & Role Routing)**:
    - [ ] Create mockup shells for `/admin/dashboard` and `/client/dashboard`.
    - [ ] Implement role-guarded routes to verify that login correctly redirects based on the profile's role.

4.  **Phase 4 (Feature Development - Client)**:
    - [ ] Build full `/client/workouts` CRUD (Title/Weights/Reps/Notes).
    - [ ] Implement the "One-Click Self Check-in" in the client dashboard.

5.  **Phase 5 (Feature Development - Admin)**:
    - [ ] Build the `/admin/clients` interface for member management.
    - [ ] Implement Payment and reporting views.

6.  **Phase 6 (Make.com Automation)**:
    - [ ] Configure the Stripe-to-Supabase role promotion workflow.
