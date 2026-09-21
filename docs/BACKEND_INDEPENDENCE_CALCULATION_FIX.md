# 📝 Backend Specification: Fix Calculation & Category Exclusions in `GET /api/net-worth/independence`

This document details the required changes in `finance-tracker-api` for the **Financial Independence and Liquid Safety Buffer** calculation.

---

## 1. 🎯 Objective

Ensure that historical living expense (`grossExpenses`) and passive non-work income (`nonWorkIncome`) aggregations accurately reflect true daily living costs rather than internal capital movements, asset purchases, or currency conversions.

---

## 2. ⚠️ Current Issues & Motivation

1. **Transaction Kinds not Filtered Out**:
   - Internal account transfers (`kind: 'transfer'`), currency exchanges (`kind: 'exchange'`), and asset investments/deposits (`kind: 'investment'`) are currently aggregated as regular expenses or incomes.
   - **Impact**: Moving 10,000 PLN to savings or investing 5,000 PLN in stocks is incorrectly counted as a living expense, severely inflating `grossExpenses` / `netBurnRate` and artificially shrinking the calculated runway (`independence.netWorthMonths`).

2. **`excludeCategoryIds` Only Applied to Incomes**:
   - The category exclusion list currently filters employment/salary from passive inflows, but is not applied to the expense side.
   - **Requirement**: Users must be able to exclude specific categories from **both** living expenses and passive incomes.

---

## 3. 🛠️ Required Aggregation Logic

### A. Exclude Non-Living Transaction Kinds (Both Expenses & Incomes)

When querying/aggregating historical transactions over the sampling period:

```typescript
const kindFilter = {
  kind: { $nin: ['transfer', 'exchange', 'investment'] }, // or kind === 'standard'
};
```

### B. Apply Category Exclusions (Both Expenses & Incomes)

When `excludeCategoryIds` or `excludeCategoryNames` are provided (or auto-detected work categories):

```typescript
const categoryExclusionFilter = {
  categoryId: { $nin: excludedCategoryObjectIds },
};
```

### C. Updated Metric Aggregations

1. **`monthlyAverages.grossExpenses`**:
   - `transactionType: 'expense'`
   - `kind: { $nin: ['transfer', 'exchange', 'investment'] }`
   - `categoryId: { $nin: excludedCategoryObjectIds }`
   - Date range: `[startDate, endDate]` normalized to `baseCurrency`.
   - Formula: `sum(expenses) / monthsCount`.

2. **`monthlyAverages.nonWorkIncome`**:
   - `transactionType: 'income'`
   - `kind: { $nin: ['transfer', 'exchange', 'investment'] }`
   - `categoryId: { $nin: excludedCategoryObjectIds }` (excludes salary & excluded categories).
   - Formula: `sum(nonWorkIncomes) / monthsCount`.

3. **`monthlyAverages.workIncome`**:
   - `transactionType: 'income'`
   - `categoryId: { $in: workCategoryObjectIds }` (employment/salary income).

4. **`monthlyAverages.netBurnRate`**:
   - `Math.max(0, grossExpenses - nonWorkIncome)`.

---

## 4. 📋 Query Parameters Specification

| Parameter              | Type                       | Required | Default              | Description                                                                               |
| :--------------------- | :------------------------- | :------- | :------------------- | :---------------------------------------------------------------------------------------- |
| `baseCurrency`         | `string`                   | No       | `undefined`          | Target currency for normalization (e.g. `PLN`, `USD`, `EUR`).                             |
| `periodMonths`         | `number`                   | No       | `12`                 | Number of past months to sample for monthly averages (1–120).                             |
| `startDate`            | `string` (ISO)             | No       | `now - periodMonths` | Custom start date for transaction analysis.                                               |
| `endDate`              | `string` (ISO)             | No       | `now`                | Custom end date for transaction analysis.                                                 |
| `excludeCategoryIds`   | `string` (comma-separated) | No       | Auto-detected work   | Specific category ObjectIds to exclude from **both** living expenses and passive incomes. |
| `excludeCategoryNames` | `string` (comma-separated) | No       | Auto-detected work   | Specific category names to exclude from **both** expenses and passive incomes.            |

---

## 5. ✅ Acceptance Criteria

- [ ] Internal transfers (`kind: 'transfer'`), currency exchanges (`kind: 'exchange'`), and investments (`kind: 'investment'`) are never aggregated into `grossExpenses` or `nonWorkIncome`.
- [ ] Passing `excludeCategoryIds=id1,id2` excludes those categories from **both** expense and income sums.
- [ ] `monthlyAverages.grossExpenses` strictly represents true consumption/living expenses over the sampled timeframe.
- [ ] Existing automated tests in `finance-tracker-api` pass and new test cases cover kind/category filtering.
