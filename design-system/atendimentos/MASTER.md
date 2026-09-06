# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Atendimentos — Caminho do bem OSC
**Updated:** 2026-09-05
**Category:** Nonprofit field tool (mobile-first)
**Design Dials:** Variance 3/10 (Centered / Minimal) | Motion 2/10 (Subtle) | Density 4/10 (Spacious)
**Brand source:** official lockup (sun + heart + wordmark). Do not recolor, stretch, or replace the mark.

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#5F2357` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Accent (sun) | `#EAB92E` | `--color-accent` |
| On Accent | `#3A1A36` | `--color-on-accent` |
| Background | `#FFFFFF` | `--color-background` |
| Foreground | `#3A1A36` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#3A1A36` | `--color-card-foreground` |
| Muted | `#F6E8F1` | `--color-muted` |
| Muted Foreground | `#6B4A66` | `--color-muted-foreground` |
| Border | `#B07086` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#5F2357` | `--color-ring` |

**Color Notes:** Primary is the logo plum (heart / “do bem”). Canvas is white; cards stay white and separate with the plum-rose hairline. Sun yellow is decorative only: it fails 4.5:1 and 3:1 on white, so it sits only in the official mark (sun, heart, “Caminho”). Primary button depth uses plum `#3A1A36`, not yellow. Dark primary is `#C48BB8` with on-primary `#1A0F18`.

### Typography

- **Heading Font:** Outfit
- **Body Font:** Work Sans
- **Mood:** geometric, modern, clean, balanced, contemporary, versatile
- **Google Fonts:** [Outfit + Work Sans](https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

*Density: 4/10 — Spacious (phone-first, 24px gutters)*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #5F2357;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 12px;
  border-bottom: 3px solid #3A1A36;
  font-weight: 600;
  min-height: 48px;
  transition: opacity 150ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #5F2357;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  min-height: 48px;
  transition: opacity 150ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FFFFFF;
  border: 1px solid #B07086;
  border-radius: 12px;
  padding: 16px;
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #B07086;
  border-radius: 8px;
  font-size: 16px;
  min-height: 48px;
  transition: border-color 150ms ease;
}

.input:focus {
  border-color: #5F2357;
  outline: none;
  box-shadow: 0 0 0 3px #5F235733;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Phone-first utility (tabs + forms)

- One primary CTA per screen. Bottom tabs ≤4. Content width max 560px, 24px gutters.
- Lockup on login and splash mark; in-app chrome uses plum tokens, not a repeated wordmark in every header.
- CTA Placement: in-flow primary button (not a marketing sticky hero).

---

## Motion

**Scroll Reveal** (Subtle) — Trigger: scroll (viewport enter) | Duration: 300-400ms | Easing: `power1.out`

```js
gsap.from(el, { opacity: 0, y: 12, duration: 0.35, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
```

**Framework notes:** Requires the ScrollTrigger plugin registered once via gsap.registerPlugin(ScrollTrigger); Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately

- ✅ Keep the y offset small (8-16px) so it reads as a fade, not a slide
- ❌ Don't reveal below-the-fold content needed for SEO/crawlers as invisible-by-default without a no-JS fallback
- ⚡ toggleActions 'play none none reverse' avoids re-triggering on every scroll direction change

---

## Anti-Patterns (Do NOT Use)


### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Sun yellow as body or button text** — Use plum; yellow stays in the official mark only
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y
- ❌ **Recoloring or stretching the lockup** — Use `assets/images/logo-caminho-do-bem.png` with contain fit

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
