![Expert28 Gym Banner](./public/docs-assets/banner.png)

<div align="center">
  <img src="./public/docs-assets/logo.png" width="120" alt="Expert28 Logo" />
  <h1>Expert28 Gym — Prototype v1.3.0</h1>
  <p><i>The elite operating system for high-performance athlete management and gym orchestration.</i></p>

  <p>
    <img src="https://img.shields.io/badge/Version-1.3.0-amber?style=for-the-badge" alt="Version" />
    <img src="https://img.shields.io/badge/Stack-React_|_TS_|_Supabase-blue?style=for-the-badge" alt="Stack" />
    <img src="https://img.shields.io/badge/UI-Shadcn_|_Framer-black?style=for-the-badge" alt="UI" />
    <img src="https://img.shields.io/badge/Payments-Stripe-blueviolet?style=for-the-badge" alt="Payments" />
  </p>
</div>

---

## ⚡ The Vision
Expert28 Gym is not just a tracker; it's a **Performance Ecosystem**. Built for elite coaches and dedicated athletes, it bridges the gap between raw training data and actionable intelligence. This prototype demonstrates a high-fidelity, role-based architecture designed for scale and precision.

## 🚀 Core Pillar Features

### 🏛️ Admin Command Center
A comprehensive suite for gym owners to manage their entire operation with real-time telemetry.
- **Reporting & Analytics:** Deep dives into revenue, client retention, and operational trends.
- **Client Management:** Granular control over athlete profiles, memberships, and progress.
- **Dynamic Payments:** Seamless Stripe integration for membership cycles and automated billing.
- **Audit Logs:** Full transparency into system-wide administrative actions for security and compliance.

### 🏋️ The Athlete's Lab
A mobile-first, performance-obsessed interface for athletes to log, track, and evolve.
- **The Lab Tracker:** High-precision workout logging (Sets, Reps, RPE, and Volume).
- **Athlete Intelligence:** Rechants-powered data visualization showing performance radar and training consistency.
- **Real-time Notifications:** Instant feedback from coaches and system alerts via a centralized hub.

### 🎭 Experience Portal (Role Switcher)
A unique transition layer that allows stakeholders to evaluate the platform from different perspectives:
- **Guest View:** High-conversion onboarding and application flows.
- **Client View:** Personalized training dashboards and community engagement.
- **Admin View:** Full-spectrum managerial access.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** [Vite](https://vitejs.dev/) + [React 18](https://reactjs.org/) (TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a custom glassmorphism design system.
- **Components:** [Radix UI](https://www.radix-ui.com/) (via Shadcn) for accessible, premium-feel interactive elements.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid, professional transitions.
- **Charts:** [Recharts](https://recharts.org/) for athlete performance visualization.

### Backend & Infrastructure
- **BaaS:** [Supabase](https://supabase.com/) (PostgreSQL, Real-time, Edge Functions).
- **Authentication:** Role-based access control (RBAC) via Supabase Auth.
- **Billing:** [Stripe](https://stripe.com/) for secure transaction processing.
- **Deployment:** Optimized for [Vercel](https://vercel.com).

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional for local DB tinkering)

### 2. Environment Configuration
Create a `.env` file in the root directory (referencing `.env.example` or your active `.env`):
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_key
```

### 3. Installation & Launch
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 📈 Roadmap
- [ ] **AI Coaching Engine:** Integration of LLMs for personalized training program generation.
- [ ] **Wearable Sync:** Direct API bridges to Apple Health and Garmin.
- [ ] **Pro Mobile App:** Native iOS/Android builds via Capacitor.

---

<div align="center">
  <p>Built with precision by <b>Expert28 Engineering</b></p>
  <p>&copy; 2026 Expert28 Gym. All rights reserved.</p>
</div>
