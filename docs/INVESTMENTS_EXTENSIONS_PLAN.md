# Investments Module Architecture & Extensions Plan

This document outlines the architectural decisions, URL structure, component design, and workflows for extending the **Investments** module in `finance-tracker-web-v2`.

---

## 1. Domain Separation & Navigation

### Top-Level Module

- **Separate from Transactions**: Investments is a dedicated domain (portfolio tracking, assets, valuations, snapshots, and performance analytics) rather than a sub-feature of transactions.
- **Drawer Navigation**: Investments is moved out of the collapsible `Transactions` item and placed as a standalone item at the top level in the navigation drawer (`/investments`).
- **Symmetry with Future Domains**: Follows the same modular approach as upcoming standalone features like `/vehicles` and `/sports`.

```
Sidebar Navigation:
├── Transactions (/transactions)
│   ├── Categories (/categories)
│   ├── Payment Methods (/paymentMethods)
│   ├── Bank Accounts (/accounts)
│   ├── Statistics (/transactions/statistics)
│   └── Trash (/transactions/trash)
├── Investments (/investments)  <-- [Top-level navigation item]
├── Vehicles (/vehicles)
├── Sports (/sports)
└── Settings (/settings)
```

---

## 2. URL Routing Architecture

URL sub-routes are used for tabs and detail views instead of internal state, ensuring full linkability, bookmarking, and native browser back/forward navigation.

| Route                          | View Description                                                                                                                                                                                                                                       |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/investments`                 | Redirects to `/investments/instruments` (or future portfolio summary dashboard)                                                                                                                                                                        |
| `/investments/instruments`     | Tab 1: Catalog and grid of investment instruments ([InstrumentsList](file:///home/wojtek960506/Programming/own_projects/finance-tracker/finance-tracker-web-v2/src/features/investments/components/instruments/instruments-list/instruments-list.tsx)) |
| `/investments/instruments/:id` | Dedicated Instrument Details Page (metrics, valuation chart, instrument operations)                                                                                                                                                                    |
| `/investments/operations`      | Tab 2: Global chronological feed of all investment operations and snapshots with filters                                                                                                                                                               |

---

## 3. Sub-Elements: Pages vs Modals

| Entity                                                     | UI Pattern                     | Rationale                                                                                                                                                                                 |
| :--------------------------------------------------------- | :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Instrument** (`/investments/instruments/:id`)            | **Dedicated Page**             | Instruments are high-level assets requiring space for valuation charts over time, summary metrics (capital invested, current balance, returns), and a dedicated operations history table. |
| **Snapshot Operation**                                     | **Modal / Dialog**             | Snapshots are lightweight valuation records (`instrumentId`, `balance`, `date`, `currency`, `note`). Creation, editing, and deletion are handled via modals.                              |
| **Cash-Flow Operation** (`buy`, `sell`, `interest`, `fee`) | **Link to Parent Transaction** | Cash flow operations originate from transactions. Clicking a cash-flow operation navigates directly to `/transactions/:transactionId`.                                                    |

---

## 4. Data Modeling & Operations Behavior

### 1 Transaction = 1 Operation

- **Strict 1:1 Mapping**: Each investment transaction is linked 1-to-1 to a single `InvestmentCashFlowOperation`.
- **Atomic Operations**: Keeping operations atomic avoids complex multi-split transaction schemas and keeps balance reconciliation simple and reliable.
- **Snapshots**: Created independently via `POST /api/investments/operations` (`kind: "snapshot"`) without creating a bank transaction.

### Legacy Data Migration

- **Script-Based Migration**: Legacy spreadsheet data without investment operation metadata should be converted via an external script (e.g. Python) calling the backend REST API (`PUT /api/transactions/:id` or `POST /api/transactions`).
- **No Temporary Frontend Code**: Avoid adding throwaway admin forms or temporary migration logic to the web application.

---

## 5. Component & File Structure

```
src/
├── app/
│   ├── navigation/navigation.tsx               # Updated to place Investments as top-level item
│   └── routes/app-routes/app-routes.tsx        # Updated /investments/* routes
└── features/
    └── investments/
        ├── api/                                # (Existing) getInstruments, getOperations, createSnapshotOperation, etc.
        ├── components/
        │   ├── investments-layout/             # Top-level layout with tab header (Instruments | Operations)
        │   ├── instruments/                    # Instruments catalog, cards, create/edit/delete modals
        │   ├── instrument-details/             # Dedicated instrument page (/investments/instruments/:id)
        │   │   ├── components/                 # Metric cards, valuation history chart, instrument operations table
        │   │   └── instrument-details-page.tsx
        │   ├── operations/                     # Operations ledger (/investments/operations)
        │   │   ├── operations-list/            # Operations list container with pagination/querying
        │   │   ├── operation-card/             # Operation row/card (snapshot badge vs cash-flow details)
        │   │   ├── operations-filters/         # Filters by instrument, operation kind, date range
        │   │   └── operations-page.tsx
        │   └── snapshots/                      # Snapshot modals and forms
        │       ├── create-snapshot-modal/      # Dialog for recording a balance snapshot
        │       ├── snapshot-form/              # Form with Zod schema (instrument, balance, date, currency, note)
        │       └── delete-snapshot-modal/      # Confirmation modal for snapshot removal
        ├── consts.ts
        ├── types.ts
        └── index.ts
```

---

## 6. Implementation Steps for Next Branch

1. **Branch Creation**: `feature/investment-operations-and-snapshots`
2. **Navigation & Route Restructuring**:
   - Move Investments to top level in `navigation.tsx`.
   - Update `app-routes.tsx` to handle `/investments`, `/investments/instruments`, `/investments/operations`, `/investments/instruments/:id`.
3. **Investments Layout & Tabs**:
   - Create `InvestmentsLayout` with tab navigation between Instruments and Operations.
4. **Operations Listing & Filters**:
   - Implement `OperationsList`, `OperationCard`, and `OperationsFilters` using `getOperations`.
5. **Create Snapshot Flow**:
   - Implement `CreateSnapshotModal` and `SnapshotForm` with `createSnapshotOperation` mutation.
6. **Instrument Details Page**:
   - Implement `/investments/instruments/:id` with summary cards, historical timeline, and instrument-specific operations.
7. **Localization**:
   - Add all strings across `en`, `pl`, `de`, `ru` in `investments.json` and `navigation.json`.
8. **Verification & Tests**:
   - Write unit tests for new components, forms, and pages.
   - Run `npx vitest run`, `pnpm tsc --noEmit`, and `npm run fix`.
