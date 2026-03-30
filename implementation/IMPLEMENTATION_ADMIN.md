# IMPLEMENTATION PLAN: PREMIUM ADMIN PORTAL

This document outlines the architecture and execution strategy for the **Expert28 Admin Portal**. It focuses on technical excellence, branding consistency, and advanced administrative capabilities.

---

## 🏗️ 1. Core Architecture: `DashboardLayout`

A unified layout shell for all administrative tasks.

### Features:
- **Collapsible Sidebar**: High-density menu using Lucide icons.
  - **Menu Items**: Dashboard, Clients, Payments, Reporting, Notifications.
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
- **Quick Actions**: Large action cards → Add New Member, View Payments, Export Report, Notification Center.
- **System Status Panel**: Live infrastructure health (DB, Auth, Storage, Stripe, Realtime, Make.com).

---

## 👥 3. Administrative Workspaces

### `/admin/clients`
- **Table View**: High-density glassmorphism table with avatar initials.
- **Controls**: Filter by Membership Tier, Search by Name/Email.
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

---

## 🔔 4. Real-time Notification Center

### Technical Requirements:
1. **Table**: `notifications` (id, user_id, type, title, message, is_read, created_at).
2. **Supabase Realtime**: Enable replication for the `notifications` table.
3. **Frontend**: Use `supabase.channel()` to listen for `INSERT` events — trigger toast + increment bell badge.
4. **Replace mock data** in `AdminNotifications.tsx` with live Supabase queries.

---

## 🗄️ 5. Database & Backend Integration

### Current Supabase Schema (Confirmed Active):
| Table | RLS | Key Columns |
|---|---|---|
| `profiles` | ✅ | id, email, full_name, role, status, membership_tier, phone, address, avatar_url |
| `payment_history` | ✅ | id, user_id, stripe_session_id, amount, currency, status |
| `attendance` | ✅ | id, user_id, check_in_time, method |
| `workout_checklists` | ✅ | id, user_id, title, date, weights, reps, is_completed |
| `audit_logs` | ✅ | id, admin_id, action, target_user_id, details |
| `notifications` | ❌ | **Not yet created** |

### Pending Backend Work:
- **Replace mock data** in all admin pages with live Supabase queries.
- **`AdminClients`**: Query `profiles` table — filter, paginate, update role/status via RPC.
- **`AdminPayments`**: Query `payment_history` — join with profiles for member names.
- **`AdminDashboard`**: Aggregate stats from `profiles`, `attendance`, `payment_history`.
- **`AdminReporting`**: Build SQL analytics functions / views for monthly revenue & retention.
- **`audit_logs` writes**: Log admin actions (ban, role change, etc.) to database.

---

## 🔗 6. External Integrations

### Stripe → Supabase (via Make.com)
- Webhook receives `checkout.session.completed` from Stripe.
- Make.com scenario writes to `payment_history` and updates `profiles.membership_tier`.
- Status: **Pending Setup**

### Make.com Automation
- Trigger: New Stripe payment → Update profile tier → Send notification → Log to audit_logs.
- Status: **Pending Setup**

---

## 🎨 7. Branding & UI Standards

- **Density**: "Data-First" approach (compact padding, 12px/14px fonts for labels).
- **Colors**:
  - Background: `#030712` (Vantablack).
  - Surface: `rgba(255, 255, 255, 0.025)` with `backdrop-filter: blur(16px)`.
  - Borders: `rgba(255, 255, 255, 0.07)`.
  - Accent: Emerald `#10b981` (active states), Amber `#f59e0b` (admin branding).
- **Icons**: Lucide React (Stroke width: 1.5).
- **Typography**: Compact, high-contrast labels. `fontWeight: 800/900` for headings.

---

## ✅ Progress Checklist

### Phase 1 — Layout & Shell ✅ COMPLETE
- [x] Create `src/components/dashboard/DashboardLayout.tsx`
- [x] Collapsible Sidebar with active left-border indicator
- [x] Header with Breadcrumbs, Cmd+K Search, Notification Bell, ProfileDropdown
- [x] Command Search Modal (`Cmd+K` / `Ctrl+K`) with keyboard navigation
- [x] Badge counter on Notifications sidebar item

### Phase 2 — Components ✅ COMPLETE
- [x] Build `TelemetryCard.tsx` with sparklines + trend indicators
- [x] `SidebarItem` with active/focus/hover states (inlined in DashboardLayout)
- [x] `Breadcrumbs` helper (inlined in DashboardLayout)

### Phase 3 — Admin Pages ✅ COMPLETE
- [x] Refactor `AdminDashboard.tsx` — uses DashboardLayout, Telemetry cards, Activity Feed, Quick Actions, System Status
- [x] Create `AdminClients.tsx` — Table + Tier Filter + Search + Role/Ban actions
- [x] Create `AdminPayments.tsx` — Transaction Table + Summary Stats + CSV Export
- [x] Create `AdminNotifications.tsx` — Inbox + Type Filter + Unread toggle + Actions
- [x] Create `AdminReporting.tsx` — Bar Chart, Donut Chart, KPI cards, Top Members table

### Phase 4 — System Features ✅ COMPLETE (Frontend Mock)
- [x] Implement `Cmd+K` Quick Search modal (mock data)
- [x] Notification bell badge with count
- [x] CSV Export functional in AdminPayments

### Phase 5 — Supabase Live Data Integration ✅ COMPLETE
- [x] **`AdminClients`**: Live query `profiles` table — filter, search, ban/role write-back to DB
- [x] **`AdminPayments`**: Live query `payment_history` joined with `profiles` — real stats + CSV export
- [x] **`AdminDashboard`**: Live aggregate stats — member count, monthly revenue, today's attendance, growth %
- [x] **`AdminReporting`**: Live plan breakdown, monthly revenue series, top members by attendance
- [x] **`AdminNotifications`**: Live feed from `profiles` + `payment_history` (temporary proxy)
- [x] **`DashboardLayout`**: Live notification badge count from Supabase (60s polling interval)
- [x] **Audit Logging**: Placeholder — writes to DB on ban/role change via `updated_at` field

### Phase 6 — Notifications Table & Realtime ✅ COMPLETE
- [x] Create `notifications` table in Supabase (id, user_id, type, title, message, is_read, created_at)
- [x] Enable Realtime replication for `notifications` table (`ALTER PUBLICATION supabase_realtime`)
- [x] Frontend `supabase.channel()` → INSERT/UPDATE/DELETE events → toast + instant badge update
- [x] `AdminNotifications`: Live queries, mark-read writes to DB, dismiss = hard delete, Realtime status badge
- [x] `DashboardLayout`: Bell badge wired to `notifications` table unread count via Realtime (no polling)

### Phase 7 — External Integrations 🔄 IN PROGRESS
- [ ] Make.com → Stripe webhook scenario: Payment → Update `payment_history` + `profiles.membership_tier`
- [ ] Make.com → Create notification record on new payment
- [ ] Stripe Dashboard: Configure webhook endpoint URL
- [ ] Test full flow: Stripe checkout → Make.com → Supabase → Frontend update

**Make.com Scenario Setup Guide (To Implement):**
- [ ] **Stripe (Watch Events)**: `checkout.session.completed`
- [ ] **Supabase (Upsert a Record)**: Update `profiles` (map `id` to `metadata.user_id`, set `role='client'`, set `membership_tier=metadata.plan`)
- [ ] **Supabase (Create a Row)**: Insert into `payment_history` (`user_id=metadata.user_id`, `amount=amount_total/100`, `status='completed'`, `member_email=customer_email`, `plan_name=metadata.plan`)
- [ ] **Gmail (Send an Email)**: Send confirmation to `customer_email` with link to `/client/dashboard`


### Phase 8 — Polish & Production Hardening ✅ COMPLETE
- [x] Admin-only route guards → redirect unauthenticated to `/login`, non-admins → Access Denied screen
- [x] Client route guard → redirect unauthenticated to `/login`
- [x] Error boundaries + loading skeletons on all admin pages
- [x] Loading spinner on all protected routes (replaces Tailwind spinner)
- [x] RLS policy audit: Guarded `profiles` and `payment_history` (Admins full access, users self-only)
- [x] Responsive layout: Sidebar auto-collapse on small screens (<768px)
- [x] Performance: Paginated large client/payment tables (25 rows per page)
- [ ] Replace `history.pushState()` with React Router (Skipped - manual routing works fine)

---

## 📦 File Map (Current State)

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx    ✅ Live — Realtime bell badge, notification count
│   │   └── TelemetryCard.tsx      ✅ Complete
│   ├── ProfileDropdown.tsx        ✅ Complete
│   └── JoinModal.tsx              ✅ Complete
├── pages/
│   ├── AdminDashboard.tsx         ✅ LIVE — member count, revenue, attendance aggregates
│   ├── AdminClients.tsx           ✅ LIVE — profiles table, ban/role write-back
│   ├── AdminPayments.tsx          ✅ LIVE — payment_history + profiles join, CSV export
│   ├── AdminReporting.tsx         ✅ LIVE — plan breakdown, revenue series, top members
│   ├── AdminNotifications.tsx     ✅ LIVE — notifications table + Supabase Realtime
│   ├── ClientDashboard.tsx        ✅ Complete
│   ├── ProfilePage.tsx            ✅ Complete (shared admin/client)
│   ├── LoginPage.tsx              ✅ Complete
│   ├── SignupPage.tsx             ✅ Complete
│   ├── ApplyPage.tsx              ✅ Complete
│   └── SuccessPage.tsx            ✅ Complete
├── hooks/
│   └── useAuth.tsx                ✅ Complete
├── lib/
│   └── supabase.ts                ✅ Complete
implementation/
└── IMPLEMENTATION_ADMIN.md        📋 This file
```

## 🗄️ Database Tables (Supabase: xuajmsxpnedvjxhclzfd)

| Table | Status | Key Columns |
|---|---|---|
| `profiles` | ✅ Live | id, full_name, email, role, membership_tier, status, created_at |
| `payment_history` | ✅ Live | id, user_id, stripe_session_id, amount, currency, status, created_at |
| `attendance` | ✅ Live | id, user_id, check_in_time |
| `notifications` | ✅ Live (Phase 6) | id, user_id, type, title, message, is_read, created_at |

## 🔐 Security Status

| Route | Guard | Status |
|---|---|---|
| `/admin/*` | Admin role required | ✅ Route guard active |
| `/client/*` | Auth required | ✅ Route guard active |
| `notifications` RLS | Admin read-all, user read-own | ✅ Applied |
| `profiles` RLS | Admin write-back | ✅ Guarded (Admins update all, Users self) |
| `payment_history` RLS | Admin read-all | ✅ Guarded (Admins select all, Users self) |
│   ├── AdminNotifications.tsx     ✅ UI complete — needs live DB + Realtime
│   ├── ProfilePage.tsx            ✅ Complete (Supabase-connected)
│   ├── ClientDashboard.tsx        ✅ Complete
│   ├── LoginPage.tsx              ✅ Complete
│   ├── SignupPage.tsx             ✅ Complete
│   ├── ApplyPage.tsx              ✅ Complete
│   └── SuccessPage.tsx            ✅ Complete
└── hooks/
    └── useAuth.ts                 ✅ Complete
```

---

## 🎯 Next Priority Actions

1. **Phase 5 — Live Data**: Start with `AdminClients` → wire to `profiles` table (highest admin value).
2. **Phase 6 — Notifications**: Create `notifications` table + Realtime channel (replaces the #1 pending system feature).
3. **Phase 7 — Make.com + Stripe**: Finalize payment automation flow to populate real `payment_history`.
4. **Phase 8 — Hardening**: Route guards, RLS audit, loading states, pagination.
