# Component Simplification & Modularization Plan

This document details the components identified during the architecture audit that exceed repository guidelines (< 150–200 lines as specified in `AGENTS.md`) and outlines proposed refactoring plans for each.

---

## 1. `NamedResourcePreview` (~299 lines)

**File**: [`src/features/named-resources/components/named-resources-page/named-resource-preview/named-resource-preview.tsx`](file:///home/wojtek960506/Programming/own_projects/finance-tracker/finance-tracker-web-v2/src/features/named-resources/components/named-resources-page/named-resource-preview/named-resource-preview.tsx)  
_(Note: explicitly marked with `// TODO for sure split this component` at line 34)_

### Current Responsibilities

- 4 separate TanStack React Query mutations (`deleteMutation`, `updateMutation`, `favoriteMutation`, `unfavoriteMutation`) and optimistic cache updating logic.
- Local state for editing name, delete modal visibility, and error messages.
- Embedded delete confirmation / API error modal with action buttons.
- Inline view vs. edit mode rendering.

### Proposed Refactoring Plan

1. **`use-named-resource-preview.ts`**:
   - Encapsulate `deleteMutation`, `updateMutation`, `favoriteMutation`, and `unfavoriteMutation`.
   - Manage optimistic cache updates and toast notifications.
   - Return handlers: `onDelete`, `onUpdate`, `onToggleFavorite`, mutation loading states, and error states.
2. **`named-resource-delete-modal.tsx`**:
   - Extract the confirmation / error `<Modal>` into an isolated component.
   - Props: `isOpen`, `onClose`, `onConfirm`, `title`, `hint`, `errorMessage`, `isPending`.
3. **`named-resource-preview.tsx`**:
   - Focused purely on presentation (< 70 lines).

---

## 2. `OperationForm` (~282 lines)

**File**: [`src/features/investments/components/operations/operation-form/operation-form.tsx`](file:///home/wojtek960506/Programming/own_projects/finance-tracker/finance-tracker-web-v2/src/features/investments/components/operations/operation-form/operation-form.tsx)

### Current Responsibilities

- Orchestrates multi-kind investment operations (buy, sell, dividend, fee, tax, deposit, withdrawal).
- Renders multiple conditionally displayed input sections (units, price per unit, total amount, fees, taxes, settlement dates, and accounts).

### Proposed Refactoring Plan

1. **`operation-form-trade-fields.tsx`**:
   - Extract quantity / price per unit fields shown for trading operations (`buy`, `sell`).
2. **`operation-form-income-fields.tsx`**:
   - Extract dividend / interest / tax field groups.
3. **`operation-form-cash-fields.tsx`**:
   - Extract deposit / withdrawal account field groups.
4. **`operation-form.tsx`**:
   - Main orchestrator handling `useForm`, kind-switching, submission, and validation layout.

---

## 3. `TrashedTransactionDetails` (~255 lines)

**File**: [`src/features/transactions/components/transaction-details/trashed-transaction-details/trashed-transaction-details.tsx`](file:///home/wojtek960506/Programming/own_projects/finance-tracker/finance-tracker-web-v2/src/features/transactions/components/transaction-details/trashed-transaction-details/trashed-transaction-details.tsx)

### Current Responsibilities

- Fetches trashed transaction data.
- Manages state & modals for both "Restore Transaction" and "Permanently Delete Transaction" actions.
- Renders details card header, navigation back button, and modal confirmations.

### Proposed Refactoring Plan

1. **`trashed-transaction-actions-modals.tsx`**:
   - Extract restore and permanent delete `<Modal>` dialogs.
2. **`use-trashed-transaction-actions.ts`**:
   - Extract restore/purge mutations and confirmation modal state handlers.
3. **`trashed-transaction-details.tsx`**:
   - Keep only query fetching, layout, and preview composition.

---

## 4. `NamedResourceField` (Transactions Filters) (~253 lines)

**File**: [`src/features/transactions/components/transactions-filters/transactions-filters-form/named-resource-field/named-resource-field.tsx`](file:///home/wojtek960506/Programming/own_projects/finance-tracker/finance-tracker-web-v2/src/features/transactions/components/transactions-filters/transactions-filters-form/named-resource-field/named-resource-field.tsx)

### Current Responsibilities

- Dynamic multi-resource picker supporting inclusion vs. exclusion filtering modes.
- Manages search input, selection badges/chips, dropdown popover, and empty states.

### Proposed Refactoring Plan

1. **`named-resource-filter-pills.tsx`**:
   - Extract chip display and removal tags.
2. **`named-resource-filter-popover.tsx`**:
   - Extract the searchable dropdown selection list.
3. **`named-resource-field.tsx`**:
   - Compose label, mode toggle (include/exclude), and popover container.

---

## 5. `TrashedTransactionsList` (~212 lines)

**File**: [`src/features/transactions/components/transactions-list/trashed-transactions-list/trashed-transactions-list.tsx`](file:///home/wojtek960506/Programming/own_projects/finance-tracker/finance-tracker-web-v2/src/features/transactions/components/transactions-list/trashed-transactions-list/trashed-transactions-list.tsx)

### Current Responsibilities

- Selection state for bulk operations across items.
- Action bar for "Restore selected" and "Purge selected".
- List rendering with pagination.

### Proposed Refactoring Plan

1. **`trashed-transactions-bulk-actions.tsx`**:
   - Extract the bulk action bar and confirmation modals.
2. **`use-trashed-transactions-selection.ts`**:
   - Extract multi-select item state and bulk handler logic.
3. **`trashed-transactions-list.tsx`**:
   - Render list items, empty state, and pagination.
