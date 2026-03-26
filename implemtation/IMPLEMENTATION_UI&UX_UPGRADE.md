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

## Phase 12 — Deep Polish & Dynamism ✅
- [x] **Scroll Progress Bar**: Fixed 2px lime gradient bar at page top fills as user scrolls — w/ emerald glow shadow
- [x] **Orb Visibility**: Increased orb opacity from 0.15 → 0.32, reduced filter blur from 80px → 60px for clear depth
- [x] **Dot-Matrix Backdrop**: Added CSS `radial-gradient` dot pattern at 3.5% opacity via `body::after` for structural depth
- [x] **Section Separators**: Full-width gradient lines (transparent → emerald → transparent) between every section
- [x] **"28" Watermark**: Large faded `28` text (~600px font) at 3.2% opacity in hero background for brand drama
- [x] **Hero Radial Glow**: Emerald radial bloom centered behind the hero headline text
- [x] **Staggered Headline**: Three-line hero headline with CSS keyframe entrance (100ms offsets per line)
- [x] **Hero Card Taller**: Changed hero image aspect ratio from 4/5 → 3/4 for more height
- [x] **Hero Gradient Overlay**: Gradient overlay inside photo card (rgba→dark fade from bottom) for atmospheric depth
- [x] **Hero Border Pulse**: Hero card CSS keyframe animates border-color between transparent and emerald
- [x] **Scroll Chevron**: Bouncing chevron + "Scroll" label at bottom of hero section (hidden on mobile)
- [x] **Ticker Readable**: Ticker item color upgraded from `#4b5563` → `#9ca3af`, dots are full `#10b981` green
- [x] **Ticker Fade Masks**: `::before`/`::after` gradient masks on ticker edges (disappear into black)
- [x] **Ticker Speed**: Increased animation speed from 30s → 22s for more energy
- [x] **WhatsIncluded Numbered Index**: Large `01–06` background text in top-right of each card at 4% opacity
- [x] **Facilities Hover Lift**: Cards now `translateY(-4px)` + shadow increase on hover (glass-card upgrade)
- [x] **Pricing Popular Scale**: `.pricing-popular` applies `transform: scale(1.04)`, `box-shadow: 0 0 40px rgba(16,185,129,0.15)`, and animated pulsing top border
- [x] **Testimonial Quote Anchor**: Massive `"` character in top-left at 8% opacity as visual anchor
- [x] **Testimonial Star Ratings**: 5 filled amber stars above each quote
- [x] **Testimonial Verified Badge**: Green "VERIFIED MEMBER" badge with checkmark icon on each card
- [x] **Testimonial Hover Sweep**: `::after` pseudo-element diagonal gradient sweep on hover
- [x] **Stagger Children**: Cards use `.stagger-child` with per-index `transitionDelay` (left-to-right reveal)
- [x] **Count-Up Stats**: Hero stats (500, 4.9, 7) animate up with `useCountUp()` hook on scroll reveal
- [x] **Button Shine Sweep**: `.btn-blue::after` pseudo-element sweeps a white gradient left-to-right on hover
- [x] **Ripple Effect**: Click ripple on all primary CTA buttons via `addRipple()` helper
- [x] **Floating CTA Pulse Glow**: Persistent `cta-pulse-glow` keyframe — animates box-shadow ring
- [x] **FinalCTA Radial Glow**: Full emerald radial gradient behind the CTA section headline
- [x] **FinalCTA JOIN Watermark**: Large faded `JOIN` text (~280px) behind the CTA buttons
- [x] **FinalCTA Headline Larger**: Font size pushed to `5rem` desktop with `clamp(2.5rem, 6vw, 5rem)`
- [x] **FinalCTA Animated Border Box**: `.cta-group-box` wraps the two CTA buttons with a pulsing emerald border
- [x] **Mobile Sticky Bar**: Full-width `position: fixed; bottom: 0` bar with "Join Expert28 — From $8" and CTA button; floating pill hidden on mobile
- [x] **Mobile Menu Slide-In**: Replaced instant overlay with `transform: translateX(100%)` → slide from right + backdrop overlay
- [x] **48px Tap Targets**: All interactive elements have `minHeight: 48px` for WCAG mobile compliance
- [x] **Mobile Stat Dividers**: Stats flexbox switches to `flex-direction: column` on mobile; dividers become horizontal lines
- [x] **Facilities Swipe**: `.facilities-grid` becomes `display: flex; overflow-x: auto; scroll-snap-type: x mandatory` on mobile
- [x] **Footer Badge Polish**: Replaced emoji with `Shield` icon + clean `[P] PROTOTYPE STATUS` text
- [x] **Header Amber Pulse Dot**: 6px amber dot next to logo pulses with `pulse-amber` keyframe
- [x] **Banner Mobile Font**: `prototype-banner span` reduced via responsive class for clean wrap on mobile

## Phase 13 — Membership Refinement & Final UX ✅
- [x] **Start Your Transformation Scroll**: Re-routed "Start Your Transformation" button to scroll to membership section instead of instant modal.
- [x] **Membership UI/UX Upgrade**: Implemented a higher-precision Pricing section with improved "Elite" plan prominence and interactive hover states.
- [x] **Checklist Fluidity**: Added subtle animations to the feature checkmarks within pricing cards.

---
*Ongoing: Implementing Phase 13 Membership Refinements.*
