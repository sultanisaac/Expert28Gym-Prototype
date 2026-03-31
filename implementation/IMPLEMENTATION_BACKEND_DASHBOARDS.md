# BACKEND & DASHBOARDS: IMPLEMENTATION PLAN

**Target Project**: Expert28 Gym Prototype
**Focus**: Supabase Integration, Role-Based Dashboards (using `/admin/...` and `/client/...` routing), and Payment Automation.
**Version**: 1.2.0

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
    - `status` (text)

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

-   **Color Tokens**: Emerald `#10b981`, Amber `#f59e0b`.
-   **Typography**: Inter (900 for headers).
-   **Density**: High-density data tables with glassmorphism.

---

## 🚀 3. Step-by-Step Implementation Flow

1.  **Phase 1 (Supabase Setup) ✅ COMPLETE**: 
    - [x] Create all Postgres tables and Role enums (Added `guest` role).
    - [x] Define RLS policies for all tables.
    - [x] Add indices and helper views (`active_members`).

2.  **Phase 2 (Auth Implementation) ✅ COMPLETE**:
    - [x] Build `/signup` and `/login` with Supabase Auth.
    - [x] Role-based routing logic in `useAuth` and guards.

3.  **Phase 3 (Testing & Role Routing) ✅ COMPLETE**:
    - [x] High-fidelity dashboard shells created.
    - [x] Verified role-guarded access for Admin and Client routes.

4.  **Phase 4 (Feature Development - Client) ✅ COMPLETE**:
    - [x] Build full `/client/workouts` CRUD system.
    - [x] Implement workout history with edit/delete capability.
    - [x] "One-Click Self Check-in" functionality live.

5.  **Phase 5 (Feature Development - Admin) ✅ COMPLETE**:
    - [x] Build `/admin/clients` member management with expiry tracking.
    - [x] Build `/admin/payments` and `/admin/reporting` with live stats.
    - [x] Build `/admin/notifications` with Supabase Realtime.
    - [x] Build `/admin/audit-logs` system event trail.

6.  **Phase 6 (Make.com Automation) 🔄 IN PROGRESS**:
    - [x] **Frontend Ready**: Stripe checkout sends `user_id`, `email`, and `role_upgrade` in metadata (as per `IMPLEMENTATION_GUEST.md`).
    - [ ] **Scenario Config**: User needs to map Stripe `checkout.session.completed` to Supabase updates using the provided metadata.
    - [ ] **Role Protection**: Expired membership status triggers "Access Denied" or "Payment Required" blocks.

---

## 🔐 Security Status

- **Admin/Client Guards**: Active.
- **RLS Policies**: Applied to all tables (Profiles, Payments, Attendance, Notifications).
- **Audit Logs**: Automatically capturing high-value admin actions.
