# Login Page Overrides

> **PROJECT:** Atendimentos
> Rules here override `design-system/atendimentos/MASTER.md`.

## Page-Specific Rules

### Layout
- Phone-first, max content width 560px, 24px gutters.
- One primary CTA: Entrar (primary blue `#2563EB` / on-primary `#FFFFFF` for 4.5:1+).
- Do not use accent orange as button fill with white text (fails contrast).
- Base local notice is a card with icon + text (color is not the only cue).

### Forms
- Visible labels above fields; placeholders are not labels.
- Allow paste and password-manager autocomplete (`username` / `current-password`).
- Touch targets ≥48dp Android / ≥44pt iOS; 8dp gap between controls.
- Submit shows busy state on the button; no layout-shifting press transforms.

### Motion
- Pressed state: opacity only, ~150ms. No translateY. Skip decorative scroll reveals.
