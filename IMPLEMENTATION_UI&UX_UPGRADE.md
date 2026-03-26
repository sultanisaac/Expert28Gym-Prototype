# UI/UX UPGRADE: IMPLEMENTATION PLAN

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

---
*All phase updates posted to Issue #2 per the GITHUB_ISSUES_GUIDE protocol.*
