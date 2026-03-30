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
- [x] Implement a custom dropdown using the "Performance Lab" aesthetic (glassmorphism/emerald accents).
- [x] **Visuals**: Display the user's avatar (or a stylized initial placeholder) next to their name.
- [x] **Menu Options**:
  - **Profile**: Link to `/profile`.
  - **Dashboard**: Dynamic link (redirects to `/admin/dashboard` or `/client/dashboard` based on role).
  - **Log Out**: Clear session and redirect to `/`.

### 2. `ProfilePage` Component
- [x] Create `src/pages/ProfilePage.tsx`.
- [x] **Features**:
  - Display user information (Name, Email, Role, Joined Date).
  - Editable "Full Name" field.
  - Avatar upload placeholder (Future integration: Supabase Storage).
  - Consistent "Expert28" branding with premium dark gradients.

---

## 🔗 Phase 3: Global Integration

### 1. Header Update
- [x] Modify `App.tsx` (Header component) to replace the "My Dashboard" button with the new `ProfileDropdown`.
- [x] Ensure the dropdown is responsive and accessible.

### 2. Routing
- [x] Register the `/profile` route in `App.tsx`.
- [x] Implement a basic role-aware navigation helper to automatically route users from the "Dashboard" menu item to their respective dashboard.

---

## 💾 Phase 4: Data Persistence
- [x] Connect the `Edit Profile` form in `src/pages/ProfilePage.tsx` to Supabase.
- [x] Implement an `updateProfile` function to save changes to `full_name`, `phone_number`, and `address` fields.
- [x] Add loading states and toast notifications (using `sonner`) for a better user experience.

---

## 📸 Phase 5: Avatar & Media Management
- [x] Set up a Supabase Storage bucket named `avatars`.
- [x] Implement profile picture upload logic in the `ProfilePage`.
- [x] Update the `avatar_url` in the `profiles` table upon successful upload.

---

## ✅ Progress Checklist

- [x] **Infrastructure**:
  - [x] Add `ProfilePage` route to `App.tsx`.
- [x] **Components**:
  - [x] Create `src/components/ProfileDropdown.tsx`.
  - [x] Create `src/pages/ProfilePage.tsx`.
- [x] **Refinement**:
  - [x] Connect `Header` to use the new dropdown logic everywhere.
  - [x] Fix "Back" button to route correctly to dashboard/home.
  - [x] Enforce 1MB file size limit for avatar uploads.
  - [x] Synchronize initial profile fetch in `useAuth` to prevent role flicker.
  - [x] Test navigation for both `Admin` and `Client` roles.
- [x] **Persistence**:
  - [x] Implement profile data saving in `ProfilePage.tsx`.
- [x] **Media**:
  - [x] Add profile picture upload functionality (strict 1MB limit).

---

## 📅 Maintenance
- This plan is to be updated upon completion of each sub-task.
- Reference **Issue #10** (TBD) on GitHub for tracking.
