clo# UI/UX UPGRADE: IMPLEMENTATION PLAN

**Target Project**: Expert28 Gym Prototype
**Primary Goal**: Transform from a "flat" layout to a "Premium Athletic Brand" experience.
**Related Issue**: #2

---

## Phase 1 — Hero & Foundation ✅
- [x] CSS Background (noise, diagonal lines, mesh grid)
- [x] Lime Gradient Band
- [x] Staggered Headline Animation
- [x] "28" Watermark (scaled responsive)
- [x] Stats Glass Row + Scanline
- [x] Scan Line Animation

## Phase 2 — Section Depth & Typography ✅
- [x] Diagonal stripe textures on alternating sections
- [x] Angular graphics + lime glow on Facilities
- [x] Pricing glow behind featured card
- [x] Global noise texture overlay
- [x] Decorative lime accent lines
- [x] Responsive `text-7xl` headings with italic uppercase
- [x] Lime overline labels above each section heading
- [x] One lime-highlighted word per headline

## Phase 3 — Cards & Interactivity ✅
- [x] Feature Cards: icon hover + corner accent
- [x] Facilities: numbered tags, faded watermarks
- [x] Pricing: `scale-105` featured card with lime glow
- [x] Testimonials: quote watermarks in background
- [x] Pricing Toggle: Monthly/Yearly billing + live price
- [x] Lucide `Check` icons on all feature lists

## Phase 4 — Scroll & Animation ✅
- [x] Intersection Observer for stats count-up (viewport-triggered)
- [x] 100–700ms staggered hero entrance delays
- [x] Animated metrics: Members, Rating, Days, Equipment
- [x] Hero parallax watermark

## Phase 5 — Navigation & Conversion ✅
- [x] Animated lime underline on nav hover
- [x] Glazsmorphism header on scroll
- [x] Pulsing urgency dot on header CTA
- [x] "No lock-in contract" on all pricing cards
- [x] Growth Bar: capacity indicator

## Phase 6 — Bug Fixes & UX Audit ✅
- [x] FIX #1: Secondary CTAs visible (border-white/50 + bg-white/8)
- [x] FIX #2: Header CTA visible pre-scroll
- [x] FIX #3: Pricing non-popular CTAs visible + hover action
- [x] FIX #4: Mobile CTA bar fully opaque (bg-black)
- [x] FIX #5: Stats count label corrected (no "24h Equipment Zone")
- [x] FIX #6: WhatsIncluded `id="included"` + nav link
- [x] FIX #7: Border-sweep z-index bug → replaced with `.glow-on-hover`
- [x] FIX #8: "28" watermark mobile overflow fixed
- [x] FIX #9: Mobile section padding reduced (py-24 → py-16)
- [x] FIX #10: Mid-section CTAs in WhyChooseUs + WhatsIncluded
- [x] FIX #11: FAQ restored from 4 → 9 questions
- [x] FIX #12: Mobile carousel dot indicators

## Phase 7 — Visual Power Upgrade ✅
- [x] **Animated Orbs**: 3-tier lime radial gradient orbs (xl/md/sm) drift slowly across Hero, WhyChooseUs, WhatsIncluded, Pricing, SocialProof, FinalCTA
- [x] **Hero Light Rays**: Two staggered CSS light-sweep animations (8s/6.5s offset) cross the hero periodically
- [x] **Gradient Text**: `.gradient-text` (lime→cream→white) applied to all key headline words — "Hard.", "Progress.", "Better.", "Included.", "Plan.", "Members.", "Real Training"
- [x] **Scroll-Reveal Cards**: `useRevealGrid()` hook — all card grids (WhyChooseUs, Facilities, WhatsIncluded, Pricing) reveal with staggered `fadeInUp` as they enter the viewport
- [x] **Diagonal Section Accents**: Skewed CSS band at top of Facilities section for angular depth

## Phase 8 — Premium High-Energy Hub ✅
- [x] **Cinematic Video Hero (Option A)**: Integrated looping high-intensity gym video with radial dark overlays for immediate brand authority.
- [x] **High-Fidelity Photography (Option D)**: Replaced icons with real-world gym photography grid in the `Facilities` section with grayscale-to-color hover transitions.
- [x] **CTA Visibility Fix (Final)**: Resolved all hidden button issues by standardizing on `Black on Lime` high-contrast styling for all primary actions.
- [x] **PostCSS Path Correction**: Fixed `@import` ordering and Tailwind configuration to resolve build errors and 404 resource issues.
- [x] **Navigation Optimization**: Removed gray backgrounds from header links for a clean, professional floating nav experience.
- [x] **Typography Finalization**: Applied **Outfit** variable font across all headings with bold/italic styling to match the aggressive brand voice.

## Phase 9 — Personal Trainer 28 Style Integration ✅
- [x] **Dark Performance Lab Aesthetic**: Transitioned to Deep Slate (`#030712`) background with Emerald (`#10b981`) accents and Royal Blue conversion points.
- [x] **Typography Refresh**: Shifted to **Inter** font family for a cleaner, modern "Tech-Athletic" feel.
- [x] **Glassmorphic Glass Cards**: Implemented rounded `1rem` glass cards with semi-transparent backgrounds and subtle borders across all grids.
- [x] **Dynamic Scrolling Ticker**: Integrated a high-speed text marquee between hero and feature sections for active brand energy.
- [x] **Category Badge Branding**: Added color-coded badges (Strength, Conditioning, Hypertrophy) to facility and session cards.
- [x] **Floating Conversion PILL**: Implemented a fixed "Join Expert28" pulsing action button in the bottom-right for constant accessibility.
- [x] **Branding Realignment (Expert28)**: Removed all "Iron Hub" or generic naming; standardized 100% on the **Expert28** brand name.
- [x] **Interactive Reveal Hooks**: Optimized `useReveal` hook for smooth staggered entrances of all major UI blocks.

## Phase 10 — Prototype Identity ✅
- [x] **Enhanced Global Banner**: Added a high-contrast amber banner to the top of every page.
- [x] **Header branding**: Added "PROTOTYPE" status label directly under the primary logo.
- [x] **Footer disclaimer**: Integrated a dedicated "PROTOTYPE STATUS" badge in the footer for consistent disclosure.

## Phase 11 — Premium "Performance Lab" Polish ✅
- [x] **Atmospheric Depth**: Added drifting radial orbs (emerald/blue/amber) and a cinematic grain/noise texture to the background.
- [x] **Interaction Maturity**: Implemented smooth hover-zoom on all facility photography and hero asset cards.
- [x] **Accordion Excellence**: Rebuilt FAQ with cumulative height transitions and visual state indicators (emerald active states).
- [x] **Technical Branding**: Upgraded the prototype banner to a monospaced "v1.0.4" technical disclosure with a security shield icon.
- [x] **Premium Mobile Navigation**: Enabled backdrop-blur filters and high-contrast styling for the mobile full-screen menu.

---
*All phase updates successfully implemented and verified via browser audit. The Expert28 Gym Prototype is now in a high-fidelity "Performance Lab" state, fully aligned with the Personal Trainer 28 design language.*
