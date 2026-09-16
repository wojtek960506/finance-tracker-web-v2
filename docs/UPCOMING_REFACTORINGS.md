# Upcoming Component Refactoring Tasks

This document tracks planned architectural refactorings and component decompositions for the Transactions & Investments UI modules.

---

## 📋 Enhancement 1: Modularize `InvestmentTransactionForm`

**Target Directory**: `src/features/transactions/components/transaction-forms/investment-transaction-form/`

### Goal

Decompose the monolithic `InvestmentTransactionForm` (~340 lines) into focused subcomponents and a custom hook, matching the architecture of other transaction forms and `InstrumentsList`.

### Proposed Structure

```
src/features/transactions/components/transaction-forms/investment-transaction-form/
├── components/
│   ├── investment-operation-kind-selector.tsx  // Segmented buttons (buy/sell/interest/fee) + semantic styling
│   ├── investment-instrument-field.tsx        // Instrument picker & inline CreateInstrumentModal trigger
│   ├── investment-advanced-fields.tsx          // Collapsible section (Payment Method & Account fields)
│   └── index.ts
├── hooks/
│   ├── use-investment-transaction-form.ts      // React-hook-form instance, useWatch, modal state & submit handler
│   └── index.ts
├── utils/                                      // (Existing) Validation schema, normalizers, and defaults
├── investment-transaction-form.tsx             // Slim orchestrator component (~50-60 lines)
├── investment-transaction-form.test.tsx        // Comprehensive form unit tests
└── index.ts
```

### Steps

1. Create `components/investment-operation-kind-selector.tsx` with operation kind styles and button mapping.
2. Create `components/investment-instrument-field.tsx` encapsulating the `InstrumentSelectField` and `CreateInstrumentModal` integration.
3. Create `components/investment-advanced-fields.tsx` encapsulating the collapsible payment method and account fields.
4. Extract form lifecycle, watch state, and submit logic into `hooks/use-investment-transaction-form.ts`.
5. Refactor `investment-transaction-form.tsx` to compose these units cleanly.
6. Verify with unit tests (`investment-transaction-form.test.tsx`).

---

## 🔍 Enhancement 2: Extract Special Cases in `TransactionDetailsCard`

**Target Directory**: `src/features/transactions/components/transaction-details/transaction-details-card/`

### Goal

Extract specialized conditional branches (Investment metadata and Trashed metadata) from `TransactionDetailsCard` into modular helper components.

### Proposed Structure

```
src/features/transactions/components/transaction-details/transaction-details-card/
├── components/
│   ├── investment-details.tsx     // Operation kind, Instrument name + InstrumentKindBadge, note
│   ├── trash-details.tsx          // Trash indicator badge, deletedAt, and purgeAt timestamps
│   └── index.ts
├── transaction-details-card.tsx   // Declarative card composing core fields + helper components
├── transaction-details-card.test.tsx
└── index.ts
```

### Steps

1. Create `components/investment-details.tsx` for investment-specific details (`operationKind`, `instrument`, `note`).
2. Create `components/trash-details.tsx` for trash-mode elements (top-right trash badge, `deletedAt`, `purgeAt`).
3. Refactor `transaction-details-card.tsx` to conditionally render `<InvestmentDetails transaction={transaction} />` and `<TrashDetails transaction={transaction} />`.
4. Update/verify unit tests (`transaction-details-card.test.tsx`).

---

## 📑 Enhancement 3: Extract Metadata & Badges in `TransactionPreview`

**Target Directory**: `src/features/transactions/components/transactions-list/transaction-preview/`

### Goal

Extract the inline investment badge/metadata logic and auxiliary sections from `TransactionPreview` into reusable subcomponents.

### Proposed Structure

```
src/features/transactions/components/transactions-list/transaction-preview/
├── components/
│   ├── investment-preview-metadata.tsx  // Operation kind pill (colored by kind) + instrument name tag
│   ├── transaction-preview-header.tsx   // Date, icon, amount & currency formatting
│   ├── transaction-preview-footer.tsx   // Resource pills (category, payment method, account)
│   └── index.ts
├── transaction-preview.tsx              // Main link preview card
├── transaction-preview.test.tsx
└── index.ts
```

### Steps

1. Create `components/investment-preview-metadata.tsx` to encapsulate the investment operation pill and instrument label styling.
2. (Optional) Extract header/footer sections to keep `TransactionPreview` concise and focused on interaction/linking.
3. Verify list rendering across all transaction types (standard, transfer, exchange, investment, trashed).
4. Update/verify unit tests (`transaction-preview.test.tsx`).
