# 🚀 Home Dashboard (`/`) Implementation Plan & Progress

**Status:** Ready to Start  
**Feature Branch/Module:** `src/features/dashboard/`  
**Endpoint:** `GET /api/dashboard/summary`  
**Target Route:** `/` (Protected)

---

## 📋 Task Checklist & Progress Tracking

### Phase 1: API Layer & Path Configuration

- [x] **1.1. Path Aliases**: Add `@dashboard` and `@dashboard/*` to `tsconfig.json`.
- [x] **1.2. DTO Types (`src/features/dashboard/api/types.ts`)**:
  - [x] Define `DashboardSummaryResponseDTO` from generated API types.
  - [x] Define `DashboardTransactionsSummaryDTO`, `DashboardInvestmentsSummaryDTO`, `DashboardVehiclesSummaryDTO`, `DashboardSportsSummaryDTO`.
  - [x] Re-export or alias `TransactionResponse`.
- [x] **1.3. API Client & Hook (`src/features/dashboard/api/`)**:
  - [x] `get-dashboard-summary.ts`: Axios client call to `GET /api/dashboard/summary`.
  - [x] `use-dashboard-summary.ts`: `@tanstack/react-query` custom hook with query options.
  - [x] `index.ts`: Public API exports.

---

### Phase 2: Internationalization (`i18n`)

- [ ] **2.1. Navigation Labels**:
  - [ ] Add `"home"` key to `src/shared/i18n/locales/en/navigation.json` ("Home").
  - [ ] Add `"home"` key to `src/shared/i18n/locales/pl/navigation.json` ("Strona główna").
  - [ ] Add `"home"` key to `src/shared/i18n/locales/de/navigation.json` ("Startseite").
  - [ ] Add `"home"` key to `src/shared/i18n/locales/ru/navigation.json` ("Главная").
- [ ] **2.2. Dashboard Namespaces**:
  - [ ] `src/shared/i18n/locales/en/dashboard.json`
  - [ ] `src/shared/i18n/locales/pl/dashboard.json`
  - [ ] `src/shared/i18n/locales/de/dashboard.json`
  - [ ] `src/shared/i18n/locales/ru/dashboard.json`

---

### Phase 3: Domain Summary Cards

- [ ] **3.1. Config & Utils**:
  - [ ] `src/features/dashboard/consts.ts`: Card theme configurations (icons, colors, routes).
  - [ ] `src/features/dashboard/utils.ts`: Metric formatters (currency, counts, ROI%).
- [ ] **3.2. Summary Card Components (`src/features/dashboard/components/summary-cards/`)**:
  - [ ] `domain-summary-card.tsx`: Clickable card using `@ui` `Card` wrapped in `Link` with hover states.
  - [ ] `dashboard-summary-cards.tsx`: Responsive 4-card grid for Transactions, Investments, Vehicles, Sports.
  - [ ] `index.ts`: Exports for summary cards.

---

### Phase 4: Recent Transactions Feed

- [ ] **4.1. Row & Empty State Components (`src/features/dashboard/components/recent-transactions/`)**:
  - [ ] `recent-transaction-row.tsx`: Compact list item with date, badge, description, category/account pill, amount with profit/loss coloring, linking to `/transactions/:id`.
  - [ ] `recent-transactions-empty-state.tsx`: Friendly placeholder when no transactions exist.
- [ ] **4.2. Recent Transactions Section**:
  - [ ] `recent-transactions-section.tsx`: Section container with title, "Show more" button redirecting to `/transactions`, and list of up to 10 rows.
  - [ ] `index.ts`: Exports for recent transactions.

---

### Phase 5: Dashboard Page & Route Integration

- [ ] **5.1. Dashboard Page View**:
  - [ ] `src/features/dashboard/components/dashboard-page.tsx`: Assembles header, summary cards, recent transactions, loading state, error alert with retry.
  - [ ] `src/features/dashboard/index.ts`: Feature public barrel export.
- [ ] **5.2. Routing Updates**:
  - [ ] `src/app/routes/public-layout/public-layout.tsx`: Redirect authenticated users from `/` and `/login` to `/`.
  - [ ] `src/app/routes/app-routes/app-routes.tsx`: Register `/` as a protected route pointing to lazy `DashboardPage`.
- [ ] **5.3. Sidebar Navigation**:
  - [ ] `src/app/navigation/navigation.tsx`: Add "Home" item at the top of the navigation list.

---

### Phase 6: Testing & Quality Checks

- [ ] **6.1. Unit & Integration Tests**:
  - [ ] `src/features/dashboard/components/dashboard-page.test.tsx`: Test loading, error, cards, and recent transactions.
  - [ ] `src/app/navigation/navigation.test.tsx`: Update navigation test assertions to include the Home item.
- [ ] **6.2. Code Verification**:
  - [ ] `npx vitest run src/features/dashboard src/app`
  - [ ] `pnpm tsc --noEmit`
  - [ ] `npm run fix`
