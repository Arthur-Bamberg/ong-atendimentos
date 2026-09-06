# Login Page Overrides

> **PROJECT:** Atendimentos
> Rules here override `design-system/atendimentos/MASTER.md`.

## Page-Specific Rules

### Layout
- Phone-first, max content width 560px, 24px gutters. No stack header — the lockup is the brand hero, with top+bottom safe area.
- Official lockup (`logo-caminho-do-bem.png`) above the title; `accessibilityLabel` = Caminho do bem OSC. Do not recolor.
- One primary CTA: Entrar (plum `#5F2357` / on-primary `#FFFFFF`, depth edge `#3A1A36` — not sun yellow).
- Do not use sun yellow as button fill or small text (fails contrast on white).
- Base local notice is a card with icon + text (color is not the only cue).

### Forms
- Visible labels above fields; placeholders are not labels.
- Allow paste and password-manager autocomplete (`username` / `current-password`).
- Touch targets ≥48dp Android / ≥44pt iOS; 8dp gap between controls.
- Submit shows busy state on the button; no layout-shifting press transforms.

### Motion
- Pressed state: opacity only, ~150ms. No translateY. Skip decorative scroll reveals.
