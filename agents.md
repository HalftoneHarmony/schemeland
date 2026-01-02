# SchemeLand Agent Protocol (agents.md)

> **TARGET AGENT:** Gemini 3 Pro (and future iterations)
> **STATUS:** ACTIVE
> **SECURITY LEVEL:** HIGH
> **LAST UPDATED:** 2026-01-02

---

## 🚀 1. Project Identity & Philosophy

**Project Name**: SchemeLand (Cyberpunk Edition)
**Core Vibe**: Tactical, Cyberpunk, High-Stakes, Gamified.

### The "Vibe Coding" Philosophy
This project isn't just about functionality; it's about **EMOTION** and **IMMERSION**.
*   **Principle 1: Persona Defines Function.** We don't just "add a chat feature"; we "build an AI Coach that feels like Elon Musk grilling you on First Principles."
*   **Principle 2: Detail is Persuasion.** Micro-interactions, loading states (`CALCULATING...`), and error messages (`SYSTEM FAILURE - REBOOTING`) must maintain the illusion.
*   **Principle 3: Aesthetics > Pure Utility.** A feature that looks boring is a broken feature. If it doesn't feel "Premium" and "Tactical", it needs a redesign.

### Tactical Vocabulary
*   **Dashboard** -> `CONTROL::DECK`
*   **Project List** -> `MISSION::HUB`
*   **Kanban** -> `TASK::MATRIX`
*   **Settings** -> `SYSTEM::CONFIG`
*   **Save/Submit** -> `DEPLOY` / `INITIATE`

---

## 🛠 2. Technology Stack & Architecture

### Core Stack
*   **Framework**: React 18 + TypeScript + Vite
*   **State Management**: Zustand (Slice Pattern)
*   **Styling**: Tailwind CSS + Custom CSS Variables + Framer Motion
*   **Icons**: Lucide React
*   **Charts**: Recharts

### Architectural Patterns

#### 1. State Management (Zustand Slices)
Do not create monolithic store files. Use the **Slice Pattern** in `src/store/slices`.
*   **Example**: `projectSlice.ts`, `taskSlice.ts`, `uiSlice.ts`.
*   **Combined**: All slices are merged in `src/store/index.ts`.
*   **Persistence**: Handled via `src/store/storage.ts`.

#### 2. Logic Separation (Hooks)
*   **Rule**: UI Components should be "dumb" renderers whenever possible.
*   **Pattern**: Extract complex logic into Custom Hooks in `src/hooks` or `src/features`.
*   **Example**: `useTaskHandlers` controls the logic; `activeProject` controls the state; Components just call these.

#### 3. Directory Structure
*   `src/components/views`: Full-page views (Dashboard, Landing).
*   `src/components/ui`: Atomic, reusable UI atoms (Buttons, Cards).
*   `src/features`: Business logic grouped by feature domain.
*   `docs/learning`: **Crucial.** This folder contains the "Memory" of the project. Always check here before refactoring major systems.

---

## 🎨 3. Design System: "Cyberpunk Tactical"

### Color Palette (The "Neon Trinity")
*   **Primary (Neon Pink)**: `#ff00ff` (`var(--cyber-pink)`) - Actions, High Alert.
*   **Secondary (Neon Cyan)**: `#00ffff` (`var(--cyber-cyan)`) - Information, Data, Tech.
*   **Accent (Cyber Yellow)**: `#fcee0a` (`var(--cyber-yellow)`) - Warnings, Highlights.
*   **Background**: `#050505` (Deep Void Black) - *Never use pure white backgrounds.*

### Typography
*   **Headings**: `Orbitron` (Geometric, Mechanical).
*   **Body**: `Rajdhani` (Squared, Technical).
*   **Korean**: `Pretendard` (Legibility).

### Visual Signatures
1.  **Glassmorphism**: `bg-zinc-950/40 backdrop-blur-xl border border-white/5`.
2.  **Neon Glows**: `box-shadow: 0 0 10px rgba(var(--cyber-pink), 0.3)`. Use `.shadow-neon-pink`.
3.  **Skewed Geometry**: Use `skew-x-[-10deg]` for buttons and headers to create dynamic tension.
4.  **Scanlines & Grids**: Use CSS backgrounds to add texture.

---

## 🛡 4. Guardrails & Best Practices

### ✅ DOs
*   **DO** check `docs/learning` files. They contain the "Soul" of the code (e.g., `21_vibe_coding_fundamentals.md`).
*   **DO** use Tailwind for structure (`flex`, `grid`, `p-4`) but Custom CSS/Framer Motion for "Vibe" (glows, animations).
*   **DO** animate entrance and exits (Framer Motion `AnimatePresence`). Static UIs are forbidden.
*   **DO** handle local-first data carefully. We use `migration.ts` to version data schema changes.

### ❌ DON'Ts
*   **DON'T** use default browser alerts or confirms. Use custom "Tactical" modals.
*   **DON'T** creating generic "Admin Panel" grey/white UIs. Every pixel must serve the theme.
*   **DON'T** mutate state directly. Always use the Zustand actions defined in slices.
*   **DON'T** overlook the "Empty States". An empty project list should look like a "Awaiting New Mission Parameters" screen, not "No items found".

### 🤖 Agent Protocol (For Gemini 3 Pro)
1.  **Analyze Context**: Before writing code, understand the *emotional goal* of the feature.
2.  **Adopt the Persona**: You are a pair programmer helping to build a "System". Speak in "Tactical" terms when appropriate.
3.  **Refactor with Purpose**: If you see messy code, clean it up using the `hooks` + `components` separation pattern.
4.  **Update Documentation**: If you create a new major workflow, add it to `docs/learning`.

---

**"Function can be copied. Vibe cannot."**
**Stay Hard. Think First Principles.**
