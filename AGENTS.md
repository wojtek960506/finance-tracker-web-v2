# Project Guidelines & Architecture

This repository is **finance-tracker-web-v2**, a modern personal finance and investment management web application built with React, TypeScript, Tailwind CSS, and Vite.

---

## 1. Project Architecture & Stack

- **Core**: React 19, TypeScript (strict mode), Vite.
- **UI Components**: Custom components built on top of Radix UI and `@base-ui/react`, styled with Tailwind CSS and `clsx`.
- **Forms & Validation**: `react-hook-form` + `@hookform/resolvers/zod` + `zod` schemas.
- **Data Fetching & State**:
  - Server state: `@tanstack/react-query` (custom queries and mutation hooks).
  - Client global state: `zustand` (e.g. `toast-store`).
- **Localization**: `react-i18next` with translation files located in `src/shared/i18n/locales/{en,pl,de,ru}/`.
- **Routing**: `react-router-dom` v7.

---

## 2. Directory & Modular Structure

We follow a feature-driven architecture:

```
src/
├── features/               # Domain feature modules (transactions, investments, currencies, etc.)
│   └── <feature-name>/
│       ├── api/            # API endpoints, query hooks, and DTO types
│       ├── components/     # Feature-specific UI components
│       ├── types.ts        # Feature domain and form types
│       ├── consts.ts       # Constants and styling helpers
│       ├── schemas.ts      # Zod validation schemas
│       ├── utils.ts        # Feature utilities and helper functions
│       └── index.ts        # Public feature interface
├── components/ui/          # Low-level reusable UI primitives (buttons, inputs, selects, comboboxes)
├── shared/                 # Cross-feature shared utilities, i18n, consts, and UI wrappers
├── store/                  # Global Zustand stores
├── lib/                    # Core helpers (e.g., `cn` utility)
└── test-utils/             # Testing helpers and mock factories
```

---

## 3. General Implementation Rules (React & TypeScript)

1. **File Modularity & Size**:
   - Keep component files focused and concise (< 150–200 lines).
   - When a component or view grows large, split it into dedicated modules:
     - `types.ts`: Form values, props, and enum-like types.
     - `consts.ts`: Static arrays, default values, and class name constants.
     - `schemas.ts`: Zod validation schemas and refinement logic.
     - `utils.ts`: Pure transformations, formatters, and helper functions.
     - Subcomponents: Isolated sub-elements for specific row types, tabs, or sections.

2. **Line Length & Tailwind Formatting**:
   - **Line limit**: Keep code lines under 100 characters.
   - For long Tailwind CSS classes, use `clsx(...)` across multiple readable lines.

3. **Step-by-Step Refactoring & Communication**:
   - When refactoring large components, proceed in small, logical steps.
   - Outline what will be done in the upcoming step and confirm with the user before proceeding.
   - Immediately integrate extracted modules into the parent component to keep the workspace continuously working.

4. **Testing & Regression Safety**:
   - **Preserve existing tests**: Do not alter test expectations or remove test assertions during refactorings unless specifically requested.
   - Always verify changes with:
     ```bash
     npx vitest run <relevant-tests>
     pnpm tsc --noEmit
     npm run fix
     ```

5. **Type Safety & Clean Code**:
   - Avoid `any` — use explicit TypeScript types and narrow types with Zod schemas.
   - Maintain consistent import ordering (external libraries, shared aliases `@features/*`, `@shared/*`, `@transactions/*`, relative imports `./...`).

6. **JSX & Conditional Rendering**:
   - Prefer `{condition && <Component />}` over `{condition ? <Component /> : null}` for single-branch conditional rendering.
   - For multi-branch rendering based on a kind/discriminated union, use a helper function or subcomponent with a clean `switch` statement rather than chained ternary operators or multiple isolated condition checks.
