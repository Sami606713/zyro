# Design System Inspired by Zainab Chottani

> Auto-extracted from `https://pk.zainabchottani.com/` on 2026-09-28

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

The hero section leads with "Zainab Chottani".

**Key Characteristics:**
- Montserrat as the heading font (custom web font loaded via @font-face)
- Montserrat as the body font for all running text
- Heading weight 500
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#c70a0a` used for CTAs and brand highlights
- 3 shadow level(s) detected — tinted shadows
- Rounded corners (40px+) creating a friendly, approachable feel
- Tags: light, rounded, accented, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#c70a0a`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#ec0101`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#f2f2f2`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#878787`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#8b8b8b`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#f2f2f2`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | badge | large | text-dark |
| 2 | `#f2f2f2` | `--palette-2` | section | large | text-dark |
| 3 | `#000000` | `--palette-3` | badge | large | text-light |
| 4 | `#222222` | `--palette-4` | badge | medium | text-light |
| 5 | `#c70a0a` | `--palette-5` | badge | small | text-light |
| 6 | `#8b8b8b` | `--palette-6` | badge | small | text-dark |
| 7 | `#333333` | `--palette-7` | button | small | text-light |
| 8 | `#ec0101` | `--palette-8` | text-accent | small | text-light |
| 9 | `#6016eb` | `--palette-9` | text-accent | small | text-light |
| 10 | `#5f1010` | `--palette-10` | text-accent | small | text-light |

## 3. Typography Rules

- **Heading Font:** `Montserrat` (web font)
- **Body Font:** `Montserrat` (web font)

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Montserrat | 37px | 500 | 51.8px | normal |
| H2 | Montserrat | 28px | 600 | 34px | 2px |
| H3 | Montserrat | 14px | 400 | 20px | normal |
| H4 | Montserrat | 18px | 500 | 30px | normal |
| Body | Montserrat | 10px | 400 | 19px | 1px |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `71px` | headings |
| H1 | `37px` | headings |
| H2 | `28px` | headings |
| H3 | `23px` | headings |
| H4 | `19px` | headings |
| Body L | `18px` | body / supporting text |
| Body | `15px` | body / supporting text |
| Small | `14px` | body / supporting text |
| XS | `13px` | body / supporting text |
| Caption | `12px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: #222222;
  color: #ffffff;
  border-radius: 0px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #878787;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button 2

```css
.btn-ghost-2 {
  background: transparent;
  color: #222222;
  border-radius: 40px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #f3f3f3;
  color: #000000;
  border-radius: 50px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #8b8b8b;
  color: #ffffff;
  border-radius: 2px;
  padding: 0px 0px;
  font-size: 12px;
  font-weight: 400;
  border: 1px solid rgb(255, 255, 255);
  cursor: pointer;
}
```

## 5. Layout Principles

- **Base spacing unit:** `5px` — use multiples (10px, 15px, 20px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `5px` | element |
| spacing-2 | `10px` | element |
| spacing-3 | `11px` | element |
| spacing-4 | `2px` | element |
| spacing-5 | `15px` | element |
| spacing-6 | `8px` | element |
| spacing-7 | `6px` | element |
| spacing-8 | `20px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-card | `40px` | card |
| radius-subtle | `2px` | subtle |
| radius-card | `50px` | card |
| radius-subtle | `5px` | subtle |
| radius-card | `30px` | card |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Mid | `rgba(213, 207, 207, 0.2) 0px 2px 8px 0px` | Dropdowns, popovers |
| Low | `rgba(0, 0, 0, 0.3) 1px 1px 3px 0px` | Cards, subtle elevation |
| Mid | `rgba(54, 54, 54, 0.15) 0px 2px 10px 0px` | Dropdowns, popovers |

> **Note:** This site uses chromatic (color-tinted) shadows rather than pure black — this is a deliberate brand choice that adds warmth to elevation.

## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `Montserrat` for all headings and `Montserrat` for body text
- Use `#c70a0a` as the single dominant accent/CTA color
- Maintain `5px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`40px`+) consistently for all interactive elements
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 500 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Montserrat/Montserrat with generic alternatives
- Don't use irregular spacing — stick to 5px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use pure black (#000000) for text — use `#878787` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 5px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #878787
Accent:      #c70a0a
Secondary:   #ec0101
Border:      #f2f2f2
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `Montserrat` heading in `#878787`, and a `#c70a0a` CTA button with 0px radius."
2. "Create a pricing card using background `#f2f2f2`, border `#f2f2f2`, `Montserrat` for text, and 15px padding."
3. "Design a navigation bar — `#ffffff` background, `#878787` links, `#c70a0a` for active state."
4. "Build a feature grid with 3 columns, 15px gap, each card using the card component style."
5. "Create a footer with `#878787` background, `#ffffff` text, and 10px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 71 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--t4s-success-color` | `#428445` |
| `--t4s-warning-color` | `#e0b252` |
| `--t4s-error-color` | `#EB001B` |
| `--t4s-light-color` | `#ffffff` |
| `--t4s-dark-color` | `#222222` |
| `--t4s-highlight-color` | `#ec0101` |
| `--t4s-tooltip-background` | `#383838` |
| `--t4s-tooltip-color` | `#fff` |
| `--primary-sw-color` | `#333` |
| `--border-sw-color` | `#ddd` |
| `--secondary-sw-color` | `#878787` |
| `--primary-price-color` | `#ec0101` |
| `--secondary-price-color` | `#878787` |
| `--t4s-body-background` | `#fff` |
| `--text-color` | `#878787` |
| `--heading-color` | `#222222` |
| `--accent-color` | `#222222` |
| `--accent-color-darken` | `#000000` |
| `--secondary-color` | `#222` |
| `--link-color` | `#878787` |
| `--link-color-hover` | `#222222` |
| `--border-color` | `#ddd` |
| `--border-primary-color` | `#333` |
| `--button-background` | `#222` |
| `--button-color` | `#fff` |
| `--button-background-hover` | `#222222` |
| `--button-color-hover` | `#fff` |
| `--sale-badge-background` | `#c70a0a` |
| `--sale-badge-color` | `#fff` |
| `--new-badge-background` | `#109533` |
| ... | *(23 more)* |

### Spacing Variables

| Variable | Value |
|---|---|
| `--wrapper-mw` | `1310px` |
| `--btn-radius` | `60px` |
| `--t4s-other-radius` | `0px` |

### Typography Variables

| Variable | Value |
|---|---|
| `--font-family-1` | `Montserrat, sans-serif` |
| `--font-family-2` | `Montserrat, sans-serif` |
| `--font-family-3` | `Montserrat, sans-serif` |
| `--font-body-family` | `Montserrat, sans-serif` |
| `--font-heading-family` | `Montserrat, sans-serif` |
| `--text-color-rgb` | `135, 135, 135` |

### Other Variables

| Variable | Value |
|---|---|
| `--t4s-success-color-rgb` | `66, 132, 69` |
| `--t4s-warning-color-rgb` | `224, 178, 82` |
| `--t4s-error-color-rgb` | `235, 0, 27` |
| `--primary-sw-color-rgb` | `51, 51, 51` |
| `--accent-color-rgb` | `34, 34, 34` |
| `--accent-color-hover` | `var(--accent-color-darken)` |
| `--secondary-color-rgb` | `34, 34, 34` |
| `--border-color-rgb` | `221, 221, 221` |
| `--lz-img` | `url("//pk.zainabchottani.com/cdn/shop/t/161/assets/t4s_loader.svg?v=111115509287537986261790071028")` |
