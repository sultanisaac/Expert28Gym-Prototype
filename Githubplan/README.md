# Expert28 Gym — Prototype Operating System

## Overview
Expert28 Gym is a high-performance athlete management and gym orchestration platform designed for elite coaches and dedicated athletes. It bridges the gap between raw training statistics and actionable athletic intelligence through a role-based, dynamic dashboard system. This repository contains the high-fidelity prototype demonstrating full admin orchestration, athlete logging workspaces, and seamless membership subscription synchronization.

---

## Features

### 🏛️ Admin Command Center
A comprehensive control panel for gym owners to manage operations with live telemetry:
- **Reporting & KPI Analytics:** Live charts and tables tracking revenue, client growth, daily attendance, and retention rates.
- **Client Workspace:** Complete member roster control with role promotion, account suspension/banning, and profile management.
- **Stripe Payment Synchronization:** Admin CRUD control for creating/modifying membership plans synced automatically to Stripe products.
- **Audit Logs:** Full system transparency capturing high-value administrative actions for security audits.

### 🏋️ Athlete's Training Lab
A mobile-first interface optimized for gym floor logging:
- **Lab Tracker:** High-precision workout logger tracking exercises, sets, reps, weight (lbs/kgs), volume, and Rate of Perceived Exertion (RPE).
- **Athlete Intelligence:** Visual representation of performance statistics and training consistency using Recharts.
- **Real-time Notifications:** CENTRALIZED system-wide hubs with live alerts triggered by coach feedback or payment events.

### 🎭 Experience Portal (Role Switcher)
An overlay system allowing stakeholders to transition across roles to evaluate the system:
- **Guest View:** High-conversion signup, application, and premium pricing/upgrade flows.
- **Client View:** Personalized performance dashboards and training logger access.
- **Admin View:** Full-spectrum administrative tools and reporting.

---

## Tech Stack
- **Frontend Core:** [Vite](https://vitejs.dev/) + [React 18](https://reactjs.org/) (TypeScript)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) with custom glassmorphism styling variables.
- **UI Components:** [Radix UI](https://www.radix-ui.com/) accessible primitives via [Shadcn UI](https://ui.shadcn.com/).
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for premium microinteractions.
- **Data Visualization:** [Recharts](https://recharts.org/) for interactive performance dashboards.
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL database, real-time channels, and database access controls).
- **Billing Processor:** [Stripe](https://stripe.com/) (dynamic product pricing and hosted checkout sessions).

---

## Project Structure
```text
Expert28Gym-Prototype/
├── .bolt/                # Developer sandbox configurations (Review before release)
├── api/                  # Serverless function endpoints (Stripe checkout/billing)
│   ├── create-checkout-session.ts
│   ├── create-portal-session.ts
│   └── manage-plan.ts
├── implementation/       # Extended architecture briefs and integration specs
├── public/               # Static image assets and icons
├── src/                  # Application source code
│   ├── components/       # Reusable components and UI widgets
│   ├── hooks/            # Custom React hooks (Authentication, state)
│   ├── lib/              # Client libraries (Supabase connection)
│   ├── pages/            # View pages (Admin workspaces, dashboards, auth screens)
│   ├── App.tsx           # Router and top-level layouts
│   └── main.tsx          # Application render entry point
├── vercel.json           # Vercel deployment and routing rewrites
└── vite.config.ts        # Vite configuration and build bundle split setup
```

---

## Installation
Set up your local development environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Expert28Gym-Prototype.git
   cd Expert28Gym-Prototype
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory (see **Environment Variables** section below).

---

## Environment Variables
The application relies on environment variables for database connectivity and Stripe authentication. Before running the application locally, duplicate the environment template:
```bash
cp .env.example .env
```
Open the newly created `.env` file and replace the placeholder values with your credentials. Refer to the `.env.example` file in the root of the repository for required fields. **Never commit your `.env` file with real credentials.**

---

## Running Locally
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

To validate build performance and code splitting optimization before deployment:
```bash
npm run build
npm run preview
```

---

## Deployment
This project is pre-configured for seamless deployment to **Vercel**:
1. Connect your repository to Vercel.
2. In the Vercel Dashboard, navigate to **Project Settings** > **Environment Variables**.
3. Add all required variables specified in `.env.example`.
4. Deploy the application. The routing rules are processed automatically via `vercel.json`.

---

## License
*Placeholder* - Refer to the LICENSE file in this repository (To be configured by the repository owner).

---

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'feat: description of changes'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request detailing the purpose and implementation details of your changes.

---

## Security Notes
- **Row Level Security (RLS):** This project requires Supabase RLS to be enabled on all Postgres tables (`profiles`, `workout_checklists`, `attendance`, `payment_history`, `audit_logs`). Client-side read/write operations must check `auth.uid() = user_id` to prevent data leakage.
- **Service Role Credentials:** The `SUPABASE_SERVICE_ROLE_KEY` has elevated bypass capabilities. It must **only** be declared in server-side functions (such as the `api/` endpoints) and never exposed in frontend scripts or committed to source control.
- **Secret Management:** Regularly audit your project configurations to guarantee credentials are not committed to Git.
