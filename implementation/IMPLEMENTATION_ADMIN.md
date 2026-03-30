# IMPLEMENTATION PLAN: PREMIUM ADMIN PORTAL

This document outlines the architecture and execution strategy for the **Expert28 Admin Portal**. It focuses on technical excellence, branding consistency, and advanced administrative capabilities.

## 🏗️ 1. Core Architecture: `DashboardLayout`

We will implement a unified layout that provides a consistent shell for all administrative tasks.

### Features:
- **Collapsible Sidebar**: A high-density menu using Lucide icons.
  - **Menu Items**: Dashboard, Clients, Payments, Reporting, Notifications.
  - **States**: Fully expanded (labels visible) or Collapsed (icons only).
  - **Active Indicator**: Emerald left-border glow for the current route.
- **Header System**:
  - **Breadcrumbs**: Small, subtle text (e.g., `Admin / Clients / Update`) for orientation.
  - **Profile Integration**: The `ProfileDropdown` component (Amber/Gold theme) embedded in the top-right.
  - **Quick Search (Cmd+K)**: A global search trigger for searching the database instantly.
  - **Notification Hub**: A bell icon linked to real-time Supabase events.

---

## 📊 2. Telemetry & Analytics (Overview Page)

The dashboard home will provide high-level "Performance Lab" stats.

### Components:
- **Telemetry Cards**:
  - **Stats**: Total Members, Monthly Revenue, Today's Attendance.
  - **Trend Indicators**: Percentage change labels (e.g., `+12% vs last month`) with mini sparkline charts.
  - **Filters**: A dropdown button in the header to toggle date ranges (7 Days, 30 Days, 3 Months).
- **Recent Activity Feed**: A scrollable list of audit logs and new registrations.
- **Quick Links**: Large action cards for "Add New Member," "Export Report," or "Send System Alert."

---

## 👥 3. Administrative Workspaces

### /admin/clients (CRUD)
- **Table View**: High-density table with glassmorphism styling.
- **Controls**:
  - Filter by Membership Tier.
  - Search by Name/Email.
  - **Contextual Actions**: Ban User, Change Role, View Workout History.

### /admin/payments
- **Transaction Logs**: Linked to `payment_history` table.
- **Actions**: Manual payment override, Refund trigger (Stripe integration), and CSV Export.

---

## 🔔 4. Real-time Notification Center

### Technical Requirements:
1.  **Table**: `notifications` (id, user_id, type, title, message, is_read, created_at).
2.  **Supabase Realtime**: Enable replication for the `notifications` table.
3.  **Frontend**: Use `supabase.channel()` to listen for `INSERT` events and trigger a toast + increment the bell badge.

---

## 🎨 5. Branding & UI Standards

- **Density**: "Data-First" approach (compact padding, 12px/14px fonts for labels).
- **Colors**:
  - Background: `#030712` (Vantablack).
  - Surface: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(16px)`.
  - Borders: `rgba(255, 255, 255, 0.08)`.
- **Icons**: Lucide React (Stroke width: 1.5).

---

## ✅ Progress Checklist

- [ ] **Infrastructure**:
  - [ ] Create `src/components/layout/DashboardLayout.tsx`.
  - [ ] Integrate `ProfileDropdown` into the header.
  - [ ] Implement Breadcrumbs helper.
- [ ] **Components**:
  - [ ] Build `TelemetryCard.tsx` with sparklines.
  - [ ] Build `SidebarItem.tsx` with focus/active states.
- [ ] **Pages**:
  - [ ] Refactor `AdminDashboard.tsx` to use `DashboardLayout`.
  - [ ] Create `AdminClients.tsx` (Table + Filter).
  - [ ] Create `AdminPayments.tsx` (Logs + CSV).
- [ ] **System Features**:
  - [ ] Implement `Cmd+K` Quick Search modal.
  - [ ] Setup Supabase Notification Realtime channel.
  - [ ] Create `AdminNotifications.tsx` (Inbox + Alert Settings).
