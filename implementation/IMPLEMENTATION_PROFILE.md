# Implementation Plan: User Profile & Identity Management

This plan outlines the steps to integrate a unified **Profile Management** system for all roles (Admin, Client, User) within the Expert28 Gym prototype. It builds upon the foundation established in [IMPLEMENTATION_BACKEND_DASHBOARDS.md](./IMPLEMENTATION_BACKEND_DASHBOARDS.md).

## 🎯 Objectives
- Create a role-agnostic **Profile Page** (`/profile`) that allows all users to view and update their basic information.
- Replace the static "Dashboard" button in the `Header` with a modern **Profile Dropdown** menu.
- Ensure seamless navigation between the landing page, dashboards, and profile management.

---

## 🛠️ Phase 1: Database Support (Verified)
- [x] Ensure the `profiles` table in Supabase contains necessary fields: `full_name`, `avatar_url`, `role`, `email`.
- [x] Verify RLS policies allow users to view/edit their own profiles.

---

## 🎨 Phase 2: UI Components

### 1. `ProfileDropdown` Component
- [ ] Implement a custom dropdown using the "Performance Lab" aesthetic (glassmorphism/emerald accents).
- [ ] **Visuals**: Display the user's avatar (or a stylized initial placeholder) next to their name.
- [ ] **Menu Options**:
  - **Profile**: Link to `/profile`.
  - **Dashboard**: Dynamic link (redirects to `/admin/dashboard` or `/client/dashboard` based on role).
  - **Log Out**: Clear session and redirect to `/`.

### 2. `ProfilePage` Component
- [ ] Create `src/pages/ProfilePage.tsx`.
- [ ] **Features**:
  - Display user information (Name, Email, Role, Joined Date).
  - Editable "Full Name" field.
  - Avatar upload placeholder (Future integration: Supabase Storage).
  - Consistent "Expert28" branding with premium dark gradients.

---

## 🔗 Phase 3: Global Integration

### 1. Header Update
- [ ] Modify `App.tsx` (Header component) to replace the "My Dashboard" button with the new `ProfileDropdown`.
- [ ] Ensure the dropdown is responsive and accessible.

### 2. Routing
- [ ] Register the `/profile` route in `App.tsx`.
- [ ] Implement a basic role-aware navigation helper to automatically route users from the "Dashboard" menu item to their respective dashboard.

---

## ✅ Progress Checklist

- [x] **Infrastructure**:
  - [x] Add `ProfilePage` route to `App.tsx`.
- [x] **Components**:
  - [x] Create `src/components/ProfileDropdown.tsx`.
  - [x] Create `src/pages/ProfilePage.tsx`.
- [x] **Refinement**:
  - [x] Connect `Header` to use the new dropdown logic.
  - [x] Test navigation for both `Admin` and `Client` roles.

---

## 📅 Maintenance
- This plan is to be updated upon completion of each sub-task.
- Reference **Issue #10** (TBD) on GitHub for tracking.
