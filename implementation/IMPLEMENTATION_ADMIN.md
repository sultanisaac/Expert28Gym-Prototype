# IMPLEMENTATION PLAN: PREMIUM ADMIN PORTAL

This document outlines the architecture and execution strategy for the **Expert28 Admin Portal**. It focuses on technical excellence, branding consistency, and advanced administrative capabilities.

---

## 🏗️ 1. Core Architecture: `DashboardLayout`

A unified layout shell for all administrative tasks.

### Features:
- **Collapsible Sidebar**: High-density menu using Lucide icons.
  - **Menu Items**: Dashboard, Clients, Payments, Reporting, Notifications, Audit Logs. ✅ Live
  - **States**: Fully expanded (labels visible) or Collapsed (icons only).
  - **Active Indicator**: Emerald left-border glow for the current route.
- **Header System**:
  - **Breadcrumbs**: Small, subtle text (e.g., `Admin / Clients`) for orientation.
  - **Profile Integration**: The `ProfileDropdown` component (Amber/Gold theme) in the top-right.
  - **Quick Search (Cmd+K)**: Global search modal for navigating by client, payment, or page.
  - **Notification Hub**: Bell icon with live red badge linked to real-time Supabase events.

---

## 📊 2. Telemetry & Analytics (Overview Page)

The dashboard home provides high-level "Performance Lab" stats.

### Components:
- **Telemetry Cards**: Total Members, Monthly Revenue, Daily Attendance, Member Growth — with trend % labels and mini sparkline charts.
- **Date Range Filter**: Dropdown toggle (7 Days / 30 Days / 3 Months / 12 Months).
- **Recent Activity Feed**: Scrollable audit log of sign-ups, payments, and check-ins.
- **Quick Actions**: Large action cards → Add New Member, View Payments, Platform Audit, Notification Center.
- **System Status Panel**: Live infrastructure health (DB, Auth, Storage, Stripe, Realtime, Make.com).

---

## 👥 3. Administrative Workspaces

### `/admin/clients`
- **Table View**: High-density glassmorphism table with avatar initials.
- **Controls**: Filter by Membership Tier, Search by Name/Email.
- **Expirations**: Visual tracking of `membership_expires_at` with expiration indicators. ✅ Live (Sync'd with Guest Portal conversion)
- **Contextual Actions**: Ban/Unban User, Change Role (client ↔ user), View Profile.
- **Status Badges**: Active (green), Pending (amber), Banned (red).

### `/admin/payments`
- **Transaction Table**: Shows ID, Member, Plan, Amount, Status, Date.
- **Summary Stats**: Total Revenue, Pending count, Refunded amount, Total Transactions.
- **Filters**: Search by member/email/ID, filter by payment status.
- **CSV Export**: Functional client-side export of filtered results.

### `/admin/reporting`
- **KPI Row**: Total Members, Monthly Revenue, Avg Check-ins/day, Retention Rate (with sparklines).
- **Monthly Revenue Bar Chart**: 6-month data with hover tooltips.
- **Membership Breakdown Donut Chart**: By plan (Elite, Base, Trial).
- **Most Active Members Table**: Ranked by check-in count with visual progress bars.

### `/admin/notifications`
- **Notification Inbox**: Full-page list with type filtering (All / Sign-ups / Payments / Alerts / System).
- **Unread Filter Toggle**: Quick toggle to show only unread items.
- **Notification Actions**: Mark as Read, Dismiss (per item), Mark All as Read.
- **Unread Dot + Left Border**: Visual unread indicators.

### `/admin/audit-logs`
- **Audit Explorer**: Searchable, immutable record of administrative actions. ✅ Live
- **Details**: Action type (CREATE/UPDATE/DELETE/LOGIN), detailed payload, Admin name, and IP address.
- **Security**: Ensures a complete trail for all critical system changes (e.g., manual role promotions or bans).

---

## 🔔 4. Real-time Notification Center

### Technical Requirements:
1. **Table**: `notifications` (id, user_id, type, title, message, is_read, created_at).
2. **Supabase Realtime**: Enabled replication for the `notifications` table.
3. **Frontend**: Uses `supabase.channel()` to listen for `INSERT`/`UPDATE` events — triggers toast + instant badge update.

---

## 🗄️ 5. Database & Backend Integration

### Current Supabase Schema (LIVE):
| Table | RLS | Key Columns |
|---|---|---|
| `profiles` | ✅ | id, email, full_name, role, status, membership_tier, membership_expires_at, phone, address, avatar_url |
| `payment_history` | ✅ | id, user_id, stripe_session_id, amount, currency, status, created_at |
| `attendance` | ✅ | id, user_id, check_in_time, method |
| `workout_checklists` | ✅ | id, user_id, title, date, weights, reps, is_completed |
| `audit_logs` | ✅ | id, admin_id, action, entity_type, entity_id, details, ip_address, created_at |
| `notifications` | ✅ | id, user_id, type, title, message, is_read, created_at |

---

## ✅ Progress Checklist

### Phase 1-6 — CORE INFRASTRUCTURE & LIVE DATA ✅ COMPLETE
- [x] **Dashboard Layout**: Collapsible Sidebar, Breadcrumbs, Cmd+K, Bell Badge.
- [x] **Components**: Telemetry Cards, Sparklines, Trend Indicators.
- [x] **Admin Workspaces**: Dashboard, Clients, Payments, Reporting, Notifications.
- [x] **Live Integration**: All pages pulling real data from Supabase tables.
- [x] **Realtime Notifications**: Web-sockets enabled for instant alerts (+ Toasts).

### Phase 7 — External Integrations 🔄 IN PROGRESS
- [x] **Stripe Checkout Integration**: Metadata configured to send `user_id` and `role_upgrade` (as per `IMPLEMENTATION_GUEST.md`).
- [x] **Conversion Logic**: Updated `SuccessPage.tsx` to handle instant redirection and success states.
- [ ] **Make.com → Stripe**: User must finalise scenario connection to ingest Stripe metadata.
- [ ] **Payment Mapping**: Scenario → Update `profiles.role='client'`, `profiles.membership_tier`, and `payment_history`.

### Phase 8 — Polish & Production Hardening ✅ COMPLETE
- [x] Role-guarded routing (`/admin/*`, `/client/*`, `/login`).
- [x] High-fidelity loading skeletons and error boundaries.
- [x] Responsive layout (auto-collapse sidebar on mobile).
- [x] Pagination for high-density tables (25 rows/page).

### Phase 9 — Audit Explorer & Governance ✅ COMPLETE
- [x] Create `audit_logs` table for administrative tracking.
- [x] Implement [AdminAuditLogs.tsx](file:///c:/Users/Sultan/Documents/TRW/GitHub/Expert28Gym-Prototype/src/pages/AdminAuditLogs.tsx) interface.
- [x] Register Audit Logs in global navigation and search.
- [x] Implement `membership_expiry` migration and table tracking.

### Phase 10 — Athlete Intelligence & Performance Radar ✅ COMPLETE
- [x] **Interactive Volume Charts**: Recharts integration for 14-day training volume tracking in the Client Dashboard.
- [x] **Heat & Streak Analytics**: Dynamic consistency scoring (Consistency %) based on facility check-ins.
- [x] **Elite Badging**: Real-time status badges for athletes maintaining >80% consistency.
- [x] **Performance Sharing**: Integrated social sharing for lab stats.
- [x] **Global Insights**: High-level training volume visibility for admins (integrated into `AdminReporting.tsx`).

---

**Current Status**: `v1.3.0 - Performance Intelligence Active` 🚀
**Next Objective**: Finalize the Make.com Stripe automation and bridge the gap for automated guest-to-client promotion.

## 📦 File Map (Current State)

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx    ✅ Live — Realtime bell badge, notification count
│   │   ├── TelemetryCard.tsx      ✅ Complete
│   │   └── AthleteAnalytics.tsx   ✅ NEW — Recharts volume progression & badges
│   └── ...
├── pages/
│   ├── AdminDashboard.tsx         ✅ LIVE — member count, revenue, attendance aggregates
│   ├── AdminClients.tsx           ✅ LIVE — profiles table, ban/role, EXPIRY tracking
│   ├── AdminPayments.tsx          ✅ LIVE — payment_history + profiles join, CSV export
│   ├── AdminReporting.tsx         ✅ LIVE — plan breakdown, revenue series, top members
│   ├── AdminNotifications.tsx     ✅ LIVE — notifications table + Supabase Realtime
│   ├── AdminAuditLogs.tsx         ✅ LIVE — platform events explorer explorer
│   ├── ClientDashboard.tsx        ✅ LIVE — performance sharing + analytics
│   ├── ClientWorkouts.tsx         ✅ Complete
│   └── ...
```
