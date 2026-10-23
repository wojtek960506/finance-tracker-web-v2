# 📝 Backend Specification: Unified Home Dashboard Summary Endpoint

**Author:** Frontend Team  
**Target:** Backend Team (`finance-tracker-api`)  
**Status:** Proposal / Ready for Implementation  
**Related Frontend Modules:**

- `src/features/home/` (Dashboard components, summary cards, recent transactions)
- `src/app/routes/app-routes/app-routes.tsx` (Route `/`)
- `src/shared/types/api.generated.ts`

---

## 1. 🎯 Purpose & Overview

We are building a **Home Dashboard** page at `/` that serves as the central landing hub when the user is logged in.

The page provides users with:

1. **Domain Summary Cards**: High-level key metrics (total amounts and counts) for:
   - **Transactions** (spending/income, transaction count) $\rightarrow$ links to `/transactions`
   - **Investments** (portfolio valuation, profit/loss, instrument count) $\rightarrow$ links to `/investments/portfolio`
   - **Vehicles** (total fleet expenses, vehicle count) $\rightarrow$ links to `/vehicles`
   - **Sports** (total sports expenditure, activities count) $\rightarrow$ links to `/sports`
2. **Recent Transactions Feed**: A list of the last **10** transactions with quick metadata (date, category, account, amount, type) and a "Show more" link redirecting to `/transactions`.

### Why a Single Dedicated Endpoint?

Without a unified endpoint, loading the home dashboard requires 5 separate HTTP roundtrips:

- `GET /api/transactions/totals`
- `GET /api/transactions/?limit=10&sort=desc`
- `GET /api/investments/summary/`
- `GET /api/vehicles/summary`
- `GET /api/sports/stats/`

A single endpoint:

- Eliminates connection overhead and latency waterfalls.
- Provides consistent, point-in-time snapshot data across domains.
- Reduces database roundtrips via backend parallel execution or consolidated aggregation queries.

---

## 2. 🔌 Endpoint Definition

### **`GET /api/dashboard/summary`**

- **Authentication:** Required (`Bearer <JWT>`)
- **Query Parameters:**

| Parameter      | Type            | Required | Default | Description                                                         |
| :------------- | :-------------- | :------- | :------ | :------------------------------------------------------------------ |
| `baseCurrency` | `string` (enum) | No       | `"PLN"` | Target base currency for investment & normalized valuation metrics. |
| `recentLimit`  | `integer`       | No       | `10`    | Number of recent transactions to return (clamped between 1 and 20). |

---

## 3. 📦 Response Schema & DTO Structure

### HTTP `200 OK` Response Body:

```typescript
export interface DashboardSummaryResponse {
  baseCurrency: string; // e.g. "PLN"

  // 1. Transactions domain summary
  transactions: {
    totalItems: number;
    totalExpenseAmount: number;
    totalIncomeAmount: number;
    byCurrency?: Record<
      string,
      {
        totalItems: number;
        totalExpenseAmount: number;
        totalIncomeAmount: number;
      }
    >;
  };

  // 2. Investments domain summary
  investments: {
    totalCurrentValue: number;
    totalNetInvested: number;
    totalPnL: number;
    roiPercentage: number;
    instrumentsCount: number;
  };

  // 3. Vehicles domain summary
  vehicles: {
    totalVehicles: number;
    totalSpentPln: number;
    totalFuelSpentPln: number;
    totalMaintenanceSpentPln: number;
    totalEquipmentSpentPln: number;
  };

  // 4. Sports domain summary
  sports: {
    totalCostPln: number;
    totalEntries: number;
    categoriesCount: number;
  };

  // 5. Recent transactions list (max recentLimit, default 10)
  recentTransactions: TransactionResponse[];
}
```

> **Note on `recentTransactions`:**
> Each element must match the standard `TransactionResponse` schema already returned by `GET /api/transactions/` so that the frontend can reuse existing transaction row formatters, badges, and category/account pills without additional transformations.

---

## 4. 🗄️ Backend Aggregation Logic (Implementation Guide)

Each section maps directly to existing service layers in `finance-tracker-api`:

### 1. `transactions`

- Calculate counts and sums from the user's active (non-trashed) transactions:
  - `totalItems`: `COUNT(id)`
  - `totalExpenseAmount`: `SUM(amount)` where `transaction_type = 'expense'`
  - `totalIncomeAmount`: `SUM(amount)` where `transaction_type = 'income'`
- Reuses logic from `TransactionService.get_totals()`.

### 2. `investments`

- Reuses portfolio aggregation logic from `InvestmentService.get_portfolio_summary(user_id, base_currency)`.
- If user has no instruments:
  ```json
  {
    "totalCurrentValue": 0,
    "totalNetInvested": 0,
    "totalPnL": 0,
    "roiPercentage": 0,
    "instrumentsCount": 0
  }
  ```

### 3. `vehicles`

- Reuses fleet summary aggregation from `VehicleService.get_fleet_summary(user_id)`:
  - `totalVehicles`: `COUNT(vehicles)`
  - `totalSpentPln`: `SUM(fuel_cost + maintenance_own_cost + equipment_cost)`
  - `totalFuelSpentPln`: `SUM(fuel_cost)`
  - `totalMaintenanceSpentPln`: `SUM(maintenance_own_cost)`
  - `totalEquipmentSpentPln`: `SUM(equipment_cost)`

### 4. `sports`

- Reuses statistics aggregation from `SportService.get_stats(user_id)`:
  - `totalCostPln`: `SUM(cost_pln)`
  - `totalEntries`: `COUNT(sport_entries)`
  - `categoriesCount`: `COUNT(DISTINCT category_id)`

### 5. `recentTransactions`

- Fetches the latest transactions ordered descending by date:
  ```sql
  SELECT * FROM transactions
  WHERE owner_id = :user_id AND is_trashed = false
  ORDER BY transaction_date DESC, created_at DESC
  LIMIT :recentLimit;
  ```
- Hydrated with `category` and `account` relations matching `TransactionResponse`.

---

## 5. 📑 Complete Example JSON Response

```json
{
  "baseCurrency": "PLN",
  "transactions": {
    "totalItems": 142,
    "totalExpenseAmount": 15840.5,
    "totalIncomeAmount": 28400.0,
    "byCurrency": {
      "PLN": {
        "totalItems": 130,
        "totalExpenseAmount": 14200.5,
        "totalIncomeAmount": 28400.0
      },
      "EUR": {
        "totalItems": 12,
        "totalExpenseAmount": 380.0,
        "totalIncomeAmount": 0.0
      }
    }
  },
  "investments": {
    "totalCurrentValue": 54200.75,
    "totalNetInvested": 48000.0,
    "totalPnL": 6200.75,
    "roiPercentage": 12.92,
    "instrumentsCount": 8
  },
  "vehicles": {
    "totalVehicles": 2,
    "totalSpentPln": 8450.2,
    "totalFuelSpentPln": 4820.0,
    "totalMaintenanceSpentPln": 2980.2,
    "totalEquipmentSpentPln": 650.0
  },
  "sports": {
    "totalCostPln": 1820.0,
    "totalEntries": 46,
    "categoriesCount": 3
  },
  "recentTransactions": [
    {
      "id": "txn-001",
      "ownerId": "user-123",
      "transactionType": "expense",
      "amount": 145.5,
      "currency": "PLN",
      "transactionDate": "2026-10-23T12:30:00Z",
      "description": "Weekly grocery shopping",
      "category": {
        "id": "cat-food",
        "name": "Groceries"
      },
      "account": {
        "id": "acc-main",
        "name": "Main Checking Account"
      },
      "paymentMethod": {
        "id": "pm-card",
        "name": "Debit Card"
      },
      "isTrashed": false,
      "createdAt": "2026-10-23T12:35:00Z",
      "updatedAt": "2026-10-23T12:35:00Z"
    }
  ]
}
```

---

## 6. 🚀 OpenAPI 3.0 YAML Snippet

You can directly incorporate this into the backend OpenAPI spec (`openapi.json` / router):

```yaml
paths:
  /api/dashboard/summary:
    get:
      tags:
        - Dashboard
      summary: Get consolidated home dashboard summary
      description: Returns aggregated metrics for transactions, investments, vehicles, sports, and the latest transactions.
      operationId: get_dashboard_summary
      security:
        - BearerAuth: []
      parameters:
        - name: baseCurrency
          in: query
          required: false
          schema:
            type: string
            default: PLN
        - name: recentLimit
          in: query
          required: false
          schema:
            type: integer
            default: 10
            minimum: 1
            maximum: 20
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DashboardSummaryResponse'
        '401':
          description: Unauthorized
        '500':
          description: Internal Server Error

components:
  schemas:
    DashboardTransactionsSummary:
      type: object
      required:
        - totalItems
        - totalExpenseAmount
        - totalIncomeAmount
      properties:
        totalItems:
          type: integer
        totalExpenseAmount:
          type: number
        totalIncomeAmount:
          type: number
        byCurrency:
          type: object
          additionalProperties:
            type: object
            required:
              - totalItems
              - totalExpenseAmount
              - totalIncomeAmount
            properties:
              totalItems:
                type: integer
              totalExpenseAmount:
                type: number
              totalIncomeAmount:
                type: number

    DashboardInvestmentsSummary:
      type: object
      required:
        - totalCurrentValue
        - totalNetInvested
        - totalPnL
        - roiPercentage
        - instrumentsCount
      properties:
        totalCurrentValue:
          type: number
        totalNetInvested:
          type: number
        totalPnL:
          type: number
        roiPercentage:
          type: number
        instrumentsCount:
          type: integer

    DashboardVehiclesSummary:
      type: object
      required:
        - totalVehicles
        - totalSpentPln
        - totalFuelSpentPln
        - totalMaintenanceSpentPln
        - totalEquipmentSpentPln
      properties:
        totalVehicles:
          type: integer
        totalSpentPln:
          type: number
        totalFuelSpentPln:
          type: number
        totalMaintenanceSpentPln:
          type: number
        totalEquipmentSpentPln:
          type: number

    DashboardSportsSummary:
      type: object
      required:
        - totalCostPln
        - totalEntries
        - categoriesCount
      properties:
        totalCostPln:
          type: number
        totalEntries:
          type: integer
        categoriesCount:
          type: integer

    DashboardSummaryResponse:
      type: object
      required:
        - baseCurrency
        - transactions
        - investments
        - vehicles
        - sports
        - recentTransactions
      properties:
        baseCurrency:
          type: string
        transactions:
          $ref: '#/components/schemas/DashboardTransactionsSummary'
        investments:
          $ref: '#/components/schemas/DashboardInvestmentsSummary'
        vehicles:
          $ref: '#/components/schemas/DashboardVehiclesSummary'
        sports:
          $ref: '#/components/schemas/DashboardSportsSummary'
        recentTransactions:
          type: array
          items:
            $ref: '#/components/schemas/TransactionResponse'
```
