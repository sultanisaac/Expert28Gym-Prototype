# BACKEND & DASHBOARDS: IMPLEMENTATION PLAN

**Target Project**: Expert28 Gym Prototype
**Focus**: Supabase Integration, Role-Based Dashboards (using `/admin/...` and `/client/...` routing), and Performance Analytics.
**Version**: 1.3.0

---

## 🏗️ 1. Database Architecture (Supabase)

We have implemented Row Level Security (RLS) to ensure users can only see their own data, while Admins have full visibility across all records.

### Tables & Schema
1.  **`profiles`**: (Extends Supabase Auth)
    - `id` (uuid, primary key)
    - `email` (text, unique)
    - `full_name` (text)
    - `avatar_url` (text)
    - `role` (enum: `'admin'`, `'client'`, `'user'`, `'guest'`)
    - `status` (enum: `'active'`, `'banned'`, `'pending'`)
    - `membership_tier` (text)
    - `membership_expires_at` (timestamptz) — *Tracking expiration for active clients*
    - **Contact/Address Info**: phone, address, city, etc. ✅ Live
    - `created_at` (timestamptz)

2.  **`workout_checklists`**: ✅ Complete (Client CRUD logic implemented)
    - `id` (uuid)
    - `user_id` (uuid)
    - `title` (text)
    - `date` (date)
    - `weights_lbs` (numeric)
    - `reps` (int)
    - `notes` (text)
    - `is_completed` (boolean)

3.  **`attendance`**: ✅ Live
    - `id` (uuid)
    - `user_id` (uuid)
    - `check_in_time` (timestamptz)
    - `method` (text: 'self_check_in')

4.  **`payment_history`**: ✅ Live
    - `id` (uuid)
    - `user_id` (uuid)
    - `stripe_session_id` (text)
    - `amount` (numeric)
    - `currency` (text)
    - `status` (text)
    - `member_email` (text)
    - `member_name` (text)
    - `plan_name` (text)

5.  **`audit_logs`**: ✅ Live
    - `id` (uuid)
    - `admin_id` (uuid)
    - `action` (text)
    - `entity_type` (text)
    - `details` (text)

6.  **`notifications`**: ✅ Live (Realtime enabled)

---

## 🎨 2. UI/UX & Branding Guide (Dashboards)

Dashboards feel like an extension of the "Dark Performance Lab" landing page.

-   **Color Tokens**: Emerald `#10b981`, Amber `#f59e0b`, Blue `#3b82f6`.
-   **Typography**: Inter (900 for headers).
-   **Density**: High-density data tables with glassmorphism.
-   **Analytics**: Interactive Recharts Progression (Emerald Gradients).

---

## 🚀 3. Step-by-Step Implementation Flow

1.  **Phase 1-5 (Core Development) ✅ COMPLETE**:
    - [x] All Postgres tables, RLS, and Role enums live.
    - [x] Auth system with role-based routing.
    - [x] Client `/client/workouts` CRUD functionality.
    - [x] Admin workspaces: Clients, Payments, Reporting, Notifications, Audit Logs.

2.  **Phase 6 (Performance Analytics) ✅ COMPLETE**:
    - [x] **Interactive Charts**: Recharts implementation for 14-day training volume tracking.
    - [x] **Streak Tracking**: Consistency scoring (Consistency %) logic.
    - [x] **Elite Badges**: Real-time status indicators for athletes with >80% consistency.
    - [x] **Performance Card Sharing**: Integrated social/clipboard sharing for lab stats.

3.  **Phase 7 (Make.com & Automation) ✅ COMPLETE**:
    - [x] **Frontend Ready**: Stripe checkout sends `user_id`, `email`, and `role_upgrade` in metadata (as per `IMPLEMENTATION_GUEST.md`).
    - [x] **Scenario Config**: User has mapped Stripe `checkout.session.completed` to Supabase updates (Role, Plan, Payment History, Expiry).
    - [x] **Real-time Alerting**: Notifications triggered via Make.com are live on the Admin Dashboard.
    - [x] **Role Protection**: Expired membership status infrastructure is ready for automated gating.

---

## 🔐 Security Status

- **Admin/Client Guards**: Active.
- **RLS Policies**: Applied to all tables (Profiles, Payments, Attendance, Notifications).
- **Audit Logs**: Automatically capturing high-value admin actions.
- **Governance**: Searchable, immutable record of administrative actions live.
