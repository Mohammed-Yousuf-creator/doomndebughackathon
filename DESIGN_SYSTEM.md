# Aegis & Forge — Editorial Warm Stone UI/UX Design System
> **Master AI Design Specification & Prompt Directive**  
> *Use this document as a system prompt or style guide for any AI (Claude, ChatGPT, Cursor, v0, Bolt, Lovable, Antigravity) to generate frontend interfaces with this exact high-craft editorial aesthetic.*

---

## 1. Design Philosophy: "The Anti-AI Slop" Archetype

Most AI-generated frontends look identical: dark purple gradients, neon cyan glowing borders, generic glassmorphism, and oversized pill-shaped buttons. 

This design system takes the opposite path:
- **Aesthetic Archetype:** *High-Craft Archival Engineering* meets *Editorial Warm Stone*. A hybrid of **Linear**, **Kaggle**, and **Vercel Enterprise**, wrapped in a warm physical-paper editorial aesthetic.
- **Tone:** Authoritative, clean, highly dense yet breathable, tactile, and enterprise-grade.
- **Physicality:** Cream and stone paper surfaces (`#FAF7F2`), ultra-crisp 1px borders (`#E7DFD5`), deep espresso text (`#1F1916`), and organic accents (deep forest green `#2F5B3C` and warm rust terracotta `#943C1D`).
- **Typography Contrast:** Bold geometric sans-serif headlines (`tracking-tight`) paired with sharp technical monospace tags and numerical values (`font-mono text-[11px] uppercase tracking-wider`).

---

## 2. Color Palette & Design Tokens

Every AI building with this design system **MUST** use these exact color hex codes.

### Canvas & Surfaces
| Token Name | Hex Code | Tailwind / Usage |
|---|---|---|
| **App Canvas / Background** | `#FAF7F2` | Default page background `bg-[#FAF7F2]` |
| **Secondary Background** | `#F8F5F0` | Sidebar, secondary sections, table headers `bg-[#F8F5F0]` |
| **Input / Tag Fill** | `#FAF7F2` or `#F4EFEA` | Input field backgrounds, inner chips `bg-[#FAF7F2]` |
| **Surface Card** | `#FFFFFF` | Primary cards, modals, dropdowns `bg-white` |
| **Card Border (Default)** | `#E7DFD5` | Standard structural border `border-[#E7DFD5]` |
| **Card Border (Muted/Subtle)**| `#F0EAE1` | Dividers, inner separators `border-[#F0EAE1]` |
| **Card Border (Hover)** | `#943C1D`/60 or `#2F5B3C`/60 | Interactive hover state border |

### Text & Content
| Token Name | Hex Code | Tailwind / Usage |
|---|---|---|
| **Primary Text (Espresso)** | `#1F1916` | Main headings, primary copy, table values `text-[#1F1916]` |
| **Secondary Text (Taupe)** | `#73645A` | Subtitles, labels, timestamps, metadata `text-[#73645A]` |
| **Muted Text / Placeholder** | `#8A7A70` | Input placeholders, inactive tabs `text-[#8A7A70]` |
| **Text Selection** | `#EBDDCF` / `#943C1D` | `selection:bg-[#EBDDCF] selection:text-[#943C1D]` |

### Semantic Accents & Status
| Accent Role | Main Hex | Background Tint | Border Tint | Usage |
|---|---|---|---|---|
| **Forest Green (Primary)** | `#2F5B3C` | `#ECFDF5` (emerald-50) | `#A7F3D0` (emerald-200) | Primary CTAs, high scores, verified status, active states |
| **Dark Forest (Hover)** | `#23452D` | — | — | Button hover state `hover:bg-[#23452D]` |
| **Rust / Terracotta (Brand)** | `#943C1D` | `#FAF7F2` | `#E7DFD5` | Brand logo dot, category tags, link highlights |
| **Warm Amber (Gold Medal)** | `#D97706` | `#FEF3C7` (amber-100) | `#FDE68A` (amber-300) | 1st place medals, warnings, highlight tiers |
| **Cool Silver (Silver Medal)** | `#475569` | `#F1F5F9` (slate-100) | `#CBD5E1` (slate-300) | 2nd/3rd place medals, secondary chips |
| **Warm Bronze (Bronze Medal)** | `#C2410C` | `#FFEDD5` (orange-100) | `#FDBA74` (orange-300) | 4th/5th place medals, alert accents |
| **Obsidian Dark (Action)** | `#1F1916` | — | — | High-contrast secondary buttons `bg-[#1F1916] text-[#FAF7F2]` |

---

## 3. Strict Geometric Rules: "NO OVAL PILL BOXES"

> [!CAUTION]
> **RULE #1:** NEVER use `rounded-full` for cards, buttons, input fields, modal boxes, or navigation segment containers. Oval pill boxes ruin the architectural editorial aesthetic.
> - The ONLY allowed uses of `rounded-full` are:
>   1. Small status indicator light dots (`h-2 w-2 rounded-full bg-emerald-500 animate-pulse`)
>   2. Circular user profile avatars (`h-8 w-8 rounded-full`) or circular icon badges.

### Allowed Border Radii Hierarchy
- **Cards, Panels & Modals:** `rounded-2xl` (16px) with `border border-[#E7DFD5]` and `shadow-sm`
- **Buttons, Inputs & Segmented Tabs:** `rounded-xl` (12px)
- **Badges, Metric Chips & Table Tags:** `rounded-lg` (8px)

---

## 4. Typography Standards

1. **Font Family:** `font-sans` (Plus Jakarta Sans, Inter, or system geometric sans).
2. **Headings:**
   - H1: `text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F1916]`
   - H2: `text-2xl font-bold tracking-tight text-[#1F1916]`
   - H3: `text-lg sm:text-xl font-bold text-[#1F1916]`
   - H4: `text-sm sm:text-base font-semibold text-[#1F1916]`
3. **Body Copy:**
   - Standard: `text-sm text-[#73645A] leading-relaxed`
   - Compact: `text-xs text-[#73645A] leading-relaxed`
4. **Data & Technical Metadata (Monospace):**
   - Ranks, Metrics, Scores, Timestamps: `font-mono text-xs font-bold text-[#2F5B3C]`
   - Tags & Badges: `font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold`

---

## 5. Master Component Code Recipes (Tailwind CSS)

### 5.1 App Navigation Header
```jsx
<header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7DFD5]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
    {/* Brand Logo & Wordmark */}
    <div className="flex items-center gap-6 shrink-0">
      <div className="flex items-center gap-2 group cursor-pointer">
        <span className="font-bold text-2xl tracking-tight text-[#1F1916]">
          brand
        </span>
        <span className="h-2 w-2 rounded-full bg-[#943C1D]"></span>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#73645A] px-2 py-0.5 bg-[#FAF7F2] rounded-lg border border-[#E7DFD5]">
          Console
        </span>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#73645A]">
        <button className="px-3 py-1.5 rounded-xl text-[#1F1916] bg-[#F4EFEA] font-semibold transition-colors">
          Dashboard
        </button>
        <button className="px-3 py-1.5 rounded-xl hover:text-[#1F1916] transition-colors">
          Competitions
        </button>
      </nav>
    </div>

    {/* Search Input */}
    <div className="hidden sm:flex flex-1 max-w-md items-center relative">
      <span className="material-symbols-outlined text-[#73645A] absolute left-3 text-lg pointer-events-none">
        search
      </span>
      <input
        type="text"
        placeholder="Search models, metrics, or datasets..."
        className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl pl-10 pr-4 py-1.5 text-xs text-[#1F1916] placeholder-[#8A7A70] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
      />
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3 shrink-0">
      <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors shadow-sm flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm">add</span>
        <span>Create New</span>
      </button>

      <div className="h-8 w-8 rounded-xl bg-[#943C1D] text-white flex items-center justify-center font-bold text-xs shadow-sm">
        JD
      </div>
    </div>
  </div>
</header>
```

---

### 5.2 Action Buttons
```jsx
{/* Primary Action Button (Forest Green) */}
<button className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50">
  <span className="material-symbols-outlined text-sm">publish</span>
  <span>Submit Model</span>
</button>

{/* High-Contrast Action Button (Obsidian) */}
<button className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1F1916] text-[#FAF7F2] hover:bg-[#332A25] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
  <span className="material-symbols-outlined text-sm">rocket_launch</span>
  <span>Deploy Benchmark</span>
</button>

{/* Secondary / Outline Button */}
<button className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E7DFD5] text-[#1F1916] hover:bg-[#FAF7F2] transition-colors shadow-sm cursor-pointer">
  Cancel
</button>

{/* Subtle Filter Chip Button */}
<button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E7DFD5] text-[#73645A] hover:text-[#1F1916] transition-all cursor-pointer">
  Featured
</button>
```

---

### 5.3 Metric & Status Badges
```jsx
{/* Gold Medal Badge */}
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
  <span>🥇</span> Gold
</span>

{/* Silver Medal Badge */}
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
  <span>🥈</span> Silver
</span>

{/* Bronze Medal Badge */}
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-orange-100 text-orange-900 border border-orange-300">
  <span>🥉</span> Bronze
</span>

{/* Metric Tag (F1-Score / Accuracy / RMSE) */}
<span className="text-[11px] font-mono font-semibold text-[#2F5B3C] px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
  F1-Score
</span>

{/* Category Tag */}
<span className="text-[11px] font-mono uppercase font-semibold text-[#943C1D] px-2.5 py-0.5 bg-[#FAF7F2] rounded-lg border border-[#E7DFD5]">
  Featured
</span>

{/* Live System Indicator */}
<div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
  <span>Live & Evaluated</span>
</div>
```

---

### 5.4 Item Card Container
```jsx
<div className="bg-white border border-[#E7DFD5] hover:border-[#943C1D]/60 hover:shadow-md transition-all rounded-2xl p-6 flex flex-col justify-between cursor-pointer group space-y-4">
  <div className="space-y-3">
    {/* Header Tags */}
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-mono uppercase font-semibold text-[#943C1D] px-2.5 py-0.5 bg-[#FAF7F2] rounded-lg border border-[#E7DFD5]">
        Research
      </span>
      <span className="text-[11px] font-mono text-[#2F5B3C] font-semibold px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
        RMSE
      </span>
    </div>

    {/* Title & Description */}
    <div>
      <h3 className="font-bold text-base text-[#1F1916] group-hover:text-[#943C1D] transition-colors line-clamp-1">
        Autonomous SLAM Odometry Drift Benchmark
      </h3>
      <p className="text-xs text-[#73645A] mt-1.5 line-clamp-2 leading-relaxed">
        Develop robust loop-closure algorithms to minimize trajectory drift in GPS-denied environments across 10,000 km test sequences.
      </p>
    </div>
  </div>

  {/* Footer KPI & Metadata */}
  <div className="pt-4 border-t border-[#F0EAE1] space-y-3">
    <div className="flex items-center justify-between text-xs">
      <span className="font-semibold text-[#1F1916] font-mono">$50,000 USD</span>
      <span className="text-[#73645A] font-mono text-[11px]">Deadline: Dec 31, 2026</span>
    </div>

    <div className="flex items-center justify-between text-[11px] text-[#73645A]">
      <div className="flex items-center gap-3">
        <span>42 teams</span>
        <span>&bull;</span>
        <span>189 entries</span>
      </div>
      <span className="font-semibold text-[#943C1D] group-hover:underline">
        View Challenge &rarr;
      </span>
    </div>
  </div>
</div>
```

---

### 5.5 High-Craft Data Table (Leaderboard / Data Stream)
```jsx
<div className="bg-white border border-[#E7DFD5] rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
  <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-4">
    <div>
      <h3 className="font-bold text-lg text-[#1F1916]">Public Leaderboard</h3>
      <p className="text-xs text-[#73645A]">Evaluated on test set using F1-Score</p>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="border-b border-[#E7DFD5] text-[#73645A] uppercase tracking-wider font-mono text-[10px]">
          <th className="py-3 px-4">Rank</th>
          <th className="py-3 px-4">Medal</th>
          <th className="py-3 px-4">Team / Competitor</th>
          <th className="py-3 px-4">Best Score</th>
          <th className="py-3 px-4">Total Entries</th>
          <th className="py-3 px-4">Last Submission</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#F0EAE1]">
        {/* Highlighted Current User Row */}
        <tr className="bg-amber-50/70 font-medium transition-colors">
          <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#1F1916]">#1</td>
          <td className="py-3.5 px-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              🥇 Gold
            </span>
          </td>
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1F1916]">MIT CSAIL Swarm Lab</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1F1916] text-[#FAF7F2]">YOU</span>
            </div>
            <span className="text-[11px] text-[#73645A]">Marcus Chen</span>
          </td>
          <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#2F5B3C]">0.9412</td>
          <td className="py-3.5 px-4 font-mono text-[#73645A]">6</td>
          <td className="py-3.5 px-4 text-[#73645A] text-[11px]">2 mins ago</td>
        </tr>

        {/* Regular Row */}
        <tr className="hover:bg-[#FAF7F2] transition-colors">
          <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#1F1916]">#2</td>
          <td className="py-3.5 px-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
              🥈 Silver
            </span>
          </td>
          <td className="py-3.5 px-4">
            <span className="font-semibold text-[#1F1916]">CMU Vision Lab</span>
            <span className="text-[11px] text-[#73645A] block">Elena Rostova</span>
          </td>
          <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#2F5B3C]">0.9287</td>
          <td className="py-3.5 px-4 font-mono text-[#73645A]">4</td>
          <td className="py-3.5 px-4 text-[#73645A] text-[11px]">1 hour ago</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

### 5.6 Form Inputs & Textareas
```jsx
<div className="space-y-4">
  <div>
    <label className="block text-xs font-semibold text-[#1F1916] mb-1">
      Submission Title / Model Identifier *
    </label>
    <input
      type="text"
      placeholder="e.g., DeBERTa-v3 Multi-Task Baseline v1"
      className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] placeholder-[#8A7A70] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C] focus:border-[#2F5B3C]"
    />
  </div>

  <div>
    <label className="block text-xs font-semibold text-[#1F1916] mb-1">
      Category
    </label>
    <select className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3 py-2 text-xs text-[#1F1916] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C] cursor-pointer">
      <option value="Featured">Featured</option>
      <option value="Research">Research</option>
      <option value="Community">Community</option>
    </select>
  </div>

  <div>
    <label className="block text-xs font-semibold text-[#1F1916] mb-1">
      Hypothesis & Architecture Notes
    </label>
    <textarea
      rows={3}
      placeholder="Specify learning rate, batch size, and seed configurations..."
      className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2 text-xs text-[#1F1916] placeholder-[#8A7A70] focus:outline-none focus:ring-1 focus:ring-[#2F5B3C]"
    />
  </div>
</div>
```

---

### 5.7 Modal Dialog Recipe
```jsx
<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="bg-white border border-[#E7DFD5] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
    {/* Modal Header */}
    <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
      <div>
        <h3 className="font-bold text-lg text-[#1F1916]">Publish Benchmark Challenge</h3>
        <p className="text-xs text-[#73645A]">Configure challenge parameters, metric, and rules.</p>
      </div>
      <button className="text-[#73645A] hover:text-[#1F1916] cursor-pointer">
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>

    {/* Modal Body */}
    <div className="space-y-4">
      {/* Form Fields Here */}
    </div>

    {/* Modal Footer */}
    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EAE1]">
      <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E7DFD5] text-[#73645A] hover:bg-[#EFE9DF] cursor-pointer">
        Cancel
      </button>
      <button className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] cursor-pointer shadow-sm">
        Publish
      </button>
    </div>
  </div>
</div>
```

---

### 5.8 Zero Dummy Data Empty State
```jsx
<div className="bg-white border border-[#E7DFD5] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center text-[#73645A]">
    <span className="material-symbols-outlined text-3xl">inbox</span>
  </div>
  <div className="space-y-1">
    <h3 className="text-lg font-bold text-[#1F1916]">No Competitions Active Yet</h3>
    <p className="text-xs text-[#73645A] max-w-md mx-auto">
      The platform currently has zero dummy data. You can host your own real competition or seed a realistic benchmark challenge with one click.
    </p>
  </div>
  <div className="flex flex-wrap justify-center gap-3 pt-2">
    <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2F5B3C] text-white hover:bg-[#23452D] transition-colors cursor-pointer">
      Host a Challenge
    </button>
    <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E7DFD5] text-[#1F1916] hover:bg-[#FAF7F2] transition-colors cursor-pointer">
      Load Sample Benchmark
    </button>
  </div>
</div>
```

---

## 6. AI System Prompt Directive (Copy-Paste Ready)

Whenever you prompt an AI to design any screen, copy and paste this exact prompt:

```text
You are a Principal Frontend Architect and High-Craft UI/UX Designer.
Design and implement this interface strictly following the "Editorial Warm Stone" design system:

1. Color Palette:
   - Canvas background: #FAF7F2 (warm stone cream)
   - Secondary background: #F8F5F0 or #F4EFEA
   - Cards & Surfaces: #FFFFFF with 1px border #E7DFD5 and shadow-sm
   - Primary text: #1F1916 (deep obsidian espresso)
   - Secondary/Muted text: #73645A (warm taupe)
   - Primary Accent: #2F5B3C (deep forest pine) for primary buttons, success states, and metric scores
   - Brand / Tag Accent: #943C1D (warm rust terracotta) for brand dots, category chips, and link highlights
   - Highlight / Medals: #D97706 (amber/gold), #475569 (silver), #C2410C (bronze)

2. Geometric Box Rules:
   - STRICTLY NO OVAL PILL BUTTONS (no `rounded-full` for buttons, cards, or inputs).
   - Card/Modal containers: rounded-2xl (16px).
   - Buttons, inputs, and tabs: rounded-xl (12px).
   - Metric tags and chips: rounded-lg (8px).

3. Typography & Information Architecture:
   - Geometric Sans for headings: text-[#1F1916], font-extrabold, tracking-tight.
   - Monospace for all metrics, ranks, counts, and tags: font-mono text-[11px] uppercase tracking-wider.
   - High information density with clean, generous whitespace.
   - Zero generic lorem ipsum or cartoonish mock data; use realistic, authentic domain fields.
   - Use Google Material Symbols Outlined or Lucide icons.

Build the requested interface using clean, responsive Tailwind CSS and modern React components.
```
