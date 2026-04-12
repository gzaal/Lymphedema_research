# Design System Document: Clinical Intelligence & Research

## 1. Overview & Creative North Star: "The Clinical Curator"
This design system is built to transform complex lymphedema research data into an experience of "The Clinical Curator." We are moving away from the cluttered, "noisy" look of traditional SaaS dashboards toward the authoritative, quiet confidence of a premium medical journal or high-end pharmaceutical annual report.

**Creative North Star: The Clinical Curator**
Our aesthetic is defined by **Intellectual Rigor and Spatial Silence**. We prioritize high-contrast editorial typography and a "layered paper" approach to depth. By eschewing standard 1px borders and heavy drop shadows, we create a layout that feels curated rather than manufactured. We use intentional asymmetry—such as oversized margins on one side of a data visualization—to guide the eye and provide "breathing room" for critical clinical decision-making.

---

## 2. Colors: Tonal Architecture
The palette is rooted in medical professionalism: deep navies and clinical blues, balanced against a warm, stone-like neutral base (`#FAF9F6`).

### The "No-Line" Rule
Traditional dividers are forbidden. Structure must be achieved through **Background Color Shifts**. For example, a data module should be defined by placing a `surface-container-lowest` card against a `surface-container-low` background. The transition in tone provides the boundary, maintaining a clean, "un-boxed" feel.

### Surface Hierarchy & Nesting
Treat the interface as a physical desk of stacked high-grade paper:
- **Base Layer:** `surface` (`#FAF9F6`) - The primary canvas.
- **Sectioning:** `surface-container-low` (`#f4f3f1`) - Used for the 220px fixed sidebar and secondary content areas.
- **Content Cards:** `surface-container-lowest` (`#ffffff`) - Reserved for high-priority data modules to make them "pop" against the tinted background.
- **Interactive Layers:** `surface-container-high` (`#e9e8e5`) - For hovered states or inactive UI elements.

### The "Glass & Gradient" Rule
To add soul to the "clinical" look, use subtle tonal gradients for primary actions. A button should not be a flat block; use a linear gradient from `primary` (`#142e52`) to `primary-container` (`#1b365d`). For floating modals, apply a `backdrop-blur` (12px–20px) to semi-transparent surface colors to create a "frosted glass" effect, ensuring the clinical context is never fully lost.

---

## 3. Typography: Editorial Authority
We utilize a high-contrast pairing: a sophisticated Sans-Serif for headers, body, and labels to evoke a sense of modern precision.

- **Display, Headlines, Body & Titles (Public Sans):** This is our "Voice of Authority" and "Data Engine." This font is neutral and highly readable. Use `display-lg` for key patient metrics and `headline-sm` for section titles. The consistent use of Public Sans across these roles adds a sense of precision and clarity.
- **Labels (Public Sans):** Reserved for technical metadata. Use `label-sm` in all-caps with 0.05em letter spacing for a "technical blueprint" aesthetic, maintaining consistency with other text.

---

## 4. Elevation & Depth: Tonal Layering
Depth in this system is a result of light and material, not artificial structure.

- **The Layering Principle:** Avoid `z-index` shadows. Instead, stack `surface-container-lowest` on `surface-container-low`. The 2-3% difference in luminance is sufficient for the human eye to perceive hierarchy without adding visual "weight."
- **Ambient Shadows:** If a floating element (like a filter popover) is required, use an "Ambient Shadow": `0px 20px 40px rgba(26, 28, 26, 0.06)`. The tint is derived from `on-surface` (`#1a1c1a`) rather than black, mimicking natural light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` (`#c4c6cf`) at **15% opacity**. It should be a suggestion of a line, not a hard boundary.

---

## 5. Components: Precision Primitives

### Buttons
- **Primary:** Gradient from `primary` to `primary-container`. `moderate` (2) corner roundedness.
- **Secondary:** Transparent background with a "Ghost Border" (15% `outline-variant`).
- **Tertiary:** `on-surface` text with no background; underline on hover.

### Input Fields
- **Styling:** No background. A single 1px "Ghost Border" at the bottom (editorial style). On focus, the bottom border transitions to `surface-tint` (`#465f88`) with a 2px weight.
- **Error State:** Use `error` (`#ba1a1a`) for the bottom border and `body-sm` for helper text.

### Cards & Data Lists
- **The Divider Rule:** Forbid the use of horizontal rules (`<hr>`). Separate list items using the spacing scale (e.g., `normal` (2) spacing or 1.5rem vertical padding) or a subtle shift to `surface-container-low` on zebra-striped rows.
- **Clinical Chips:** Use `secondary-container` for neutral status and `error-container` for high-risk lymphedema indicators. Keep corners at `full` (9999px) for a soft, organic feel.

### Dashboard-Specific Components
- **The "Research Lead" Sidebar:** Fixed at 220px. Background: `surface-container-low`. Typography: `label-md` in `on-secondary-container`.
- **Metric Micro-Charts:** Sparklines should use `surface-tint` and be embedded directly within `body-lg` text to maintain editorial flow.

---

## 6. Do's and Don'ts

### Do
- **Do** use `normal` (2) whitespace between major data modules.
- **Do** use `publicSans` for numbers that represent key clinical outcomes (e.g., TKV - Total Kidney Volume).
- **Do** use "Glassmorphism" for navigation overlays to keep the user grounded in the data.

### Don't
- **Don't** use 100% opaque borders to separate sections.
- **Don't** use standard "Material Blue." Use our clinical `primary` (`#142e52`) for a more premium, pharmaceutical feel.
- **Don't** use heavy gradients. If a gradient is used, it should be so subtle it is almost imperceptible.
- **Don't** use "Card Shadows" for everything. Let the background tones do the work.