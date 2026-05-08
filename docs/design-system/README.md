# Lente Clínica — Design System

## Overview

**Lente Clínica** ("Clinical Lens") is a clinical support platform for psychologists and therapists. It helps practitioners recognize warning signs in medicated patients during or between therapy sessions, organize clinical observations, and communicate them clearly to the prescribing psychiatrist.

The product is positioned as a **fast, low-friction clinical tool** — not a course, not an EMR — designed to be used in the 5 minutes between patient sessions.

### Brand essence
> "Autoridade sem arrogância." (Authority without arrogance.)

The interface guides *observation*, not diagnosis. It supports the therapist without overstepping their professional role.

---

## Sources

- **Codebase**: `github.com/tjgontijo/lente-clinica` (Next.js 16, TailwindCSS v4, shadcn/ui, TypeScript)
- **Product docs**: `docs/contexto/ESTEIRA_DE_OFERTAS.md` — full product/funnel strategy
- **PRD**: `docs/PRD/PRD-001-foundation/` — technical foundation PRD (data model, auth)
- **No Figma link provided.**
- **No brand logo assets found in repo** (early-stage scaffold; placeholder wordmark used).

---

## Product Surfaces

| Surface | Description |
|---|---|
| **Web App (`/app`)** | The core clinical tool — medication search, checklist, alerts, message generator |
| **Marketing site** | Sales page for the Plataforma Lente Clínica (~R$147 front offer) |
| **Programa / Comunidade** | Future: course area and community space (separate product tier) |

This design system focuses on the **Web App** (MVP).

---

## Core App Features (MVP)

1. **Buscador de Medicações** — Quick-reference cards for psychiatric medications (effects, side effects, classes)
2. **Checklist Interativo** — Step-by-step flow to mark physical/psychiatric signs observed in a patient
3. **Painel de Alertas** — Cross-references medication + symptoms; outputs severity alerts (🟡 Atenção / 🔴 Urgência)
4. **Gerador de Conduta** — Produces a formatted clinical message ready to copy-paste to the psychiatrist via WhatsApp or email

---

## CONTENT FUNDAMENTALS

### Language
- All product copy is in **Brazilian Portuguese (PT-BR)**.
- Tone is **professional but human** — academic rigor with warmth. Not cold or sterile.
- Avoid overly technical medical jargon; the user is a psychologist, not a physician.

### Voice
- **2nd person singular ("você")** — direct, personal, not distant.
- **Never imperative commands** — prefer invitations: "Veja o que observamos" not "Veja!"
- **Active voice** throughout. Short sentences. No filler.

### Copy style
- Headings: **Sentence case** (not Title Case). E.g., "Sinais de atenção" not "Sinais De Atenção".
- Labels: **Uppercase only for severity badges** (ATENÇÃO, URGÊNCIA).
- No emoji in the UI itself — severity is communicated via color + icon, not emoji.
- Numbers and clinical data are always formatted cleanly: "2x ao dia" not "2X/DIA".

### Examples of good copy
- "O que você observou na sessão de hoje?"
- "Sertralina · 50 mg · Antidepressivo (ISRS)"
- "Há sinais que merecem atenção antes da próxima sessão."
- "Mensagem clínica gerada com base nos sinais que você registrou."
- "Copiar mensagem para o psiquiatra"

### What to avoid
- ❌ "ALERTA CRÍTICO!!!" — too alarming, causes anxiety
- ❌ "Digite o nome do remédio aqui..." — weak placeholder copy
- ❌ "Erro ao processar" — always describe what happened and what to do next
- ❌ English mixed into PT-BR UI

---

## VISUAL FOUNDATIONS

### Color philosophy
The palette is **calm and clinical** — inspired by the precision of medical instruments, but warm enough to feel supportive rather than institutional. The primary teal grounds the interface in trustworthiness; the alert colors are the emotional heart of the product.

#### Primary — Teal (`--lc-teal-*`)
A muted clinical teal. Not a bright medical green, not corporate blue — a middle ground that reads as "clear thinking" and "professional care."

| Token | Value | Usage |
|---|---|---|
| `--lc-teal-50` | `oklch(97% 0.025 192)` | Tinted backgrounds, active row highlights |
| `--lc-teal-100` | `oklch(93% 0.05 192)` | Chip fills, subtle accents |
| `--lc-teal-200` | `oklch(85% 0.08 192)` | Borders, dividers on tinted surfaces |
| `--lc-teal-400` | `oklch(68% 0.12 192)` | Secondary text on teal bg |
| `--lc-teal-600` | `oklch(52% 0.12 192)` | Primary brand color — buttons, links, active states |
| `--lc-teal-700` | `oklch(44% 0.11 192)` | Hover state for primary |
| `--lc-teal-800` | `oklch(36% 0.10 192)` | Pressed state |
| `--lc-teal-900` | `oklch(28% 0.09 192)` | Text on light teal backgrounds |

#### Alert — Amber/Yellow (`--lc-amber-*`)
Used for moderate attention — "Alinhar em breve." Warm amber; never neon yellow.

#### Alert — Red (`--lc-red-*`)
Used for clinical urgency — "Agir hoje." A decisive, unhesitating red. Not orange, not pink.

#### Neutral (`--lc-neutral-*`)
Zinc-based gray scale, slightly cool. Used for all text, surfaces, and borders.

#### Semantic (`--lc-bg-*`, `--lc-fg-*`, `--lc-border-*`)
See `colors_and_type.css` for full token list.

---

### Typography

**Primary font**: [Geist Sans](https://vercel.com/font) — clean, technical, highly legible at small sizes. Matches the codebase's existing `next/font` setup.

**Monospace font**: [Geist Mono](https://vercel.com/font) — for medication codes, dosage data, and clinical identifiers.

Both fonts are loaded via Google Fonts CDN in HTML files (`family=Geist`).

**Type scale**: See `colors_and_type.css` and `preview/type-*.html`.

Key rules:
- Minimum body text: **15px (0.9375rem)**
- Line height: always ≥ 1.5× for body, 1.2× for headings
- Negative tracking on headings (−0.02em to −0.015em)
- `text-wrap: pretty` on all paragraph content
- Never below 13px anywhere in the UI

---

### Spacing

8px base grid. Spacing tokens: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px`.

Mobile tap targets: **minimum 44px** (WCAG 2.5.5).

---

### Surfaces & Backgrounds

- **App background**: `--lc-neutral-50` (very light, slightly cool off-white)
- **Card background**: pure white (`#fff`)
- **Sidebar/nav**: `--lc-neutral-950` (deep dark)
- No full-bleed photographs, no texture. Clean, functional surfaces.
- Cards have `1px solid --lc-neutral-150` border + subtle shadow

---

### Shadow & Elevation

Three-level system:
- **Level 1** (cards, inputs): `0 1px 3px oklch(0% 0 0 / 0.07), 0 1px 2px oklch(0% 0 0 / 0.05)`
- **Level 2** (modals, popovers): `0 4px 12px oklch(0% 0 0 / 0.09), 0 2px 4px oklch(0% 0 0 / 0.05)`
- **Level 3** (sheets, toasts): `0 16px 32px oklch(0% 0 0 / 0.10)`

No colored shadows. No glow effects.

---

### Corner Radii

| Token | Value | Usage |
|---|---|---|
| `--lc-radius-xs` | `4px` | Tags, small badges |
| `--lc-radius-sm` | `6px` | Input fields, small cards |
| `--lc-radius-md` | `10px` | Cards, modals, main containers |
| `--lc-radius-lg` | `14px` | Bottom sheets, large modals |
| `--lc-radius-xl` | `20px` | Full-width bottom panels |
| `--lc-radius-full` | `9999px` | Pills, primary buttons, circular icons |

---

### Borders

- Default border: `1px solid var(--lc-neutral-150)` — barely visible, structural
- Active/focus border: `2px solid var(--lc-teal-600)` — clear visual feedback
- Alert border: uses `--lc-amber-300` or `--lc-red-300` appropriately
- No decorative left-border-only accent cards

---

### Animations & Motion

- **Philosophy**: Functional motion only. Nothing decorative. No bounces, no spring physics.
- **Micro-interactions**: 150ms ease-out for hover, 200ms ease-in-out for appearance
- **Page transitions**: Fade-through, 200ms
- **Alert appearance**: Slide-down + fade, 250ms ease-out
- No infinite loops or auto-playing animations

---

### Hover & Interaction States

- **Primary button hover**: darken teal → `--lc-teal-700`, 150ms
- **Ghost/outline button hover**: `--lc-teal-50` background fill
- **Card/row hover**: `--lc-neutral-50` background, no elevation change
- **Link hover**: underline appears (not color change alone)
- **Focus rings**: 2px teal outline with 2px offset, visible on keyboard nav

---

### Severity Alert Design

The alert system is the product's most critical visual element. Rules:

| Severity | Badge label | Background | Border | Icon | Text color |
|---|---|---|---|---|---|
| Atenção | ATENÇÃO | `--lc-amber-50` | `--lc-amber-300` | TriangleAlert | `--lc-amber-800` |
| Urgência | URGÊNCIA | `--lc-red-50` | `--lc-red-300` | AlertCircle | `--lc-red-800` |

- Never reverse the colors (no red bg with yellow text)
- Always pair color with an icon (never color-only)
- Text inside alerts: concise, actionable. "Sinal pode indicar efeito colateral da Sertralina."

---

### Imagery & Illustration

- **No decorative photography** in the app UI
- **No custom illustrations** — the interface IS the product
- **Iconography**: Lucide React icon set (stroke-based, 1.5px stroke, rounded joins)
- Placeholder image slots use a subtle `--lc-neutral-100` fill with a centered icon

---

## ICONOGRAPHY

**Icon system**: [Lucide](https://lucide.dev/) — open-source, stroke-based, consistent 24px grid with 1.5px stroke weight and round caps/joins. Loaded from CDN: `https://unpkg.com/lucide@latest`.

The codebase uses shadcn/ui which depends on Lucide React. Design artifacts use Lucide via CDN script tag.

**No custom icon font** exists in the codebase.
**No SVG icon sprite** found in repo.
**No PNG icons** found in repo.
**No emoji used** in the product UI.

### Key icons used in the product
| Context | Icon name | Lucide name |
|---|---|---|
| Medication search | Pill / Search | `pill`, `search` |
| Checklist | Check / ListChecks | `check`, `list-checks` |
| Alert (Atenção) | Triangle warning | `triangle-alert` |
| Alert (Urgência) | Circle alert | `alert-circle` |
| Copy message | Clipboard / Copy | `clipboard-copy`, `copy` |
| Patient case | User | `user` |
| Session | Calendar | `calendar` |
| Navigation home | House | `house` |
| Save | Save | `save` |
| Add medication | Plus / PillBottle | `plus`, `pill` |
| Back | Arrow left | `arrow-left` |

**Sizing convention**: 20px in compact lists, 24px in content areas, 32px in empty states.
**Color**: Inherits `currentColor`. Use `--lc-neutral-500` for decorative/structural icons; `currentColor` for semantic icons inside colored contexts.

**Assets location**: `assets/` — no production icon files to copy; use Lucide CDN.
**Logo**: See `assets/logo.svg` — placeholder wordmark (no official logo in repo yet).

---

## File Index

```
README.md                    — This file
colors_and_type.css          — Full CSS custom property system
SKILL.md                     — Claude Code agent skill definition

assets/
  logo.svg                   — Placeholder wordmark (no official brand logo found)

preview/
  colors-primary.html        — Teal primary scale
  colors-alerts.html         — Amber + Red severity colors
  colors-neutral.html        — Neutral gray scale
  colors-semantic.html       — Semantic color tokens
  type-scale.html            — Font size scale specimens
  type-specimens.html        — Font family specimens (Geist Sans + Mono)
  spacing-tokens.html        — Spacing scale tokens
  shadows-radii.html         — Shadow levels + corner radii
  comp-buttons.html          — Button variants and states
  comp-alerts.html           — Alert/severity banners
  comp-medication-card.html  — Medication info card
  comp-checklist.html        — Checklist item states
  comp-badges.html           — Severity + status badges
  comp-forms.html            — Input fields + search

ui_kits/
  app/
    README.md                — UI kit documentation
    index.html               — Interactive click-through prototype (5 screens)
```
