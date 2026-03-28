# EXPERT28 GYM — BRANDING STYLE GUIDE

This document defines the visual and technical branding for the **Expert28 Gym** project. Use this as a reference for creating new web pages, emails, and marketing assets to ensure consistent high-performance branding.

---

## 1. Core Aesthetic
**Theme**: Dark Performance Lab / Premium Athletic Brand
**Vibe**: Aggressive, Modern, Tech-Athletic, High-Energy, Professional.

---

## 2. Color Palette

### Primary Colors
| Color | Hex Code | Usage |
| :--- | :--- | :--- |
| **Emerald Green** | `#10b981` | Primary accents, success states, active links, scroll bar. |
| **Performance Black** | `#030712` | Main background color. |
| **Pure White** | `#ffffff` | Primary text, high-contrast CTA text. |
| **Zinc Grey** | `#9ca3af` | Secondary text, descriptions, muted elements. |

### Secondary / Action Colors
| Color | Hex Code | Usage |
| :--- | :--- | :--- |
| **Royal Blue** | `#2563eb` | Primary conversion points (Join Now), floating CTA. |
| **Amber Gold** | `#f59e0b` | Prototype warnings, star ratings, urgency dots. |
| **Slate Surface** | `rgba(255, 255, 255, 0.04)`| Glassmorphism card backgrounds. |

---

## 3. Typography

### Primary Font: **Inter**
- **Headings**: `700` or `800` weight. Bold, uppercase, often italic for aggressive athletic feel.
- **Body**: `400` or `500` weight. Clean and readable.
- **Variable Font**: Use **Outfit** for high-energy display headlines if available.

### Hierarchy
- **H1 (Hero)**: Large scale, uppercase, often with one Emerald accent word.
- **Section Headers**: Uppercase, bold, with an Emerald overline label.
- **Labels**: Small caps, 0.15em letter spacing, Emerald color.

---

## 4. UI Elements & Design Tokens

### Glassmorphism
- **Background**: `rgba(255, 255, 255, 0.04)`
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Radius**: `1rem` (16px)
- **Blur**: `Backdrop-filter: blur(12px)`

### Button Styles
- **Primary CTA**: White text on Royal Blue (`#2563eb`) with a gradient sweep animation.
- **Secondary CTA**: White text on Transparent background with White border (`rgba(255, 255, 255, 0.12)`).
- **High-Contrast CTA**: Black text on Emerald (`#10b981`) for immediate attention.

### Background Textures
- **Grain Overlay**: Cinematic noise at 5% opacity.
- **Dot-Matrix**: Radial gradient background pattern (28px size, 3.5% opacity).
- **Drifting Orbs**: Large blur radial gradients (Emerald, Blue, Amber) drifting slowly.
- **Watermark**: Massive "28" text at 3.2% opacity in the background.

---

## 5. Email System Specifics

### Structure
- **Logo**: Centered or Top-Left. Use the "PROTOTYPE" version if applicable.
- **Hero**: Clear high-contrast headline with a Royal Blue primary button.
- **Footer**: Performance Black background, Emerald Green links.

### CSS for Email (Inline-safe)
```css
/* Core Email Styling */
.email-container { background-color: #030712; color: #f9fafb; font-family: 'Inter', sans-serif; }
.cta-button { background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; }
.accent-link { color: #10b981; }
```

---

## 6. Voice & Tone
- **Direct**: No fluff. Focus on results and transformation.
- **Urgent**: Focus on "Starting Now" and "No Excuses".
- **Professional**: Technical precision but athletic grit.

---
*Created on 2026-03-28 for the Expert28 Gym Prototype Project.*
