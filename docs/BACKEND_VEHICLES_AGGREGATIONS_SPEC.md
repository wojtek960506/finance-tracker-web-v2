# 📝 Backend Note: Vehicles Domain Aggregations & Summary Endpoints

**Author:** Frontend Team  
**Target:** Backend Team (`finance-tracker-api`)  
**Status:** Proposal / Request for Implementation  
**Related Frontend Modules:**

- `src/features/vehicles/utils.ts`
- `src/features/vehicles/hooks/use-all-vehicles-summary.ts`
- `src/features/vehicles/hooks/use-vehicle-overview.ts`
- `src/features/vehicles/components/fuel/fuel-summary-cards.tsx`
- `src/features/vehicles/components/maintenance/maintenance-summary-cards.tsx`
- `src/features/vehicles/components/equipment/equipment-summary-cards.tsx`

---

## 1. 🎯 Purpose & Executive Summary

Currently, the frontend calculates all vehicle-related metrics, totals, odometer stats, and activity
feeds entirely in the browser using raw historical logs fetched across multiple queries.

While this allowed rapid initial UI prototyping, it creates two major architectural bottlenecks:

1. **$1 + 3N$ Network Request Waterfall** on the All-Vehicles Hub (`/vehicles`):
   - For $N$ vehicles, the frontend first calls `GET /api/vehicles`.
   - It then triggers $3N$ separate requests (`/fuel`, `/maintenance`, `/equipment` per vehicle)
     to calculate card spendings and fleet summary totals.
   - For a user with 3 vehicles, this executes **10 HTTP requests** downloading all historical
     records just to display simple summary cards.
2. **Unbounded Data Downloads on Overview (`/vehicles/:vehicleSlug`)**:
   - The overview dashboard downloads full arrays of all fuel entries, maintenance records, and
     equipment items to merge, sort, and slice the top recent activities and calculate averages.
3. **Blocker for Server-Side Pagination**:
   - Once tables implement pagination (e.g., 20 records per page), client-side summary reducers
     will break because the client will no longer have access to the full dataset.

We request backend support for **pre-aggregated endpoints** and **summary metadata** to eliminate
these client calculations and reduce network traffic by ~90%.

---

## 2. 🔍 Current Frontend Calculations in `utils.ts`

Here is an inventory of what the frontend is currently calculating in JavaScript:

### A. Per-Vehicle Spending (`calculateVehicleSpending`)

- **`fuelTotalPln`**: `sum(fuelEntries.map(e => e.costPln))`
- **`maintenanceTotalPln`**: `sum(maintenanceEntries.filter(m => m.section === 'own_maintenance').map(m => m.costPln))`
  - _Note:_ `previous_owner_services` are explicitly excluded from the vehicle's active spending total.
- **`equipmentTotalPln`**: `sum(equipmentEntries.map(e => e.costPln))`
- **`totalSpentPln`**: `fuelTotalPln + maintenanceTotalPln + equipmentTotalPln`
- **`lastOdometerKm`**: `Math.max(...fuelOdometers, ...ownMaintenanceOdometers)` (or `null`)
- **Counts**: `fuelEntriesCount`, `maintenanceCount`, `equipmentCount`

### B. Fleet Global Summary (`calculateGlobalSummary`)

- **`totalVehicles`**: Count of vehicles
- **`totalSpentPln`**: `sum(vehicle.spending.totalSpentPln)`
- **`totalFuelSpentPln`**: `sum(vehicle.spending.fuelTotalPln)`
- **`totalMaintenanceSpentPln`**: `sum(vehicle.spending.maintenanceTotalPln)`
- **`totalEquipmentSpentPln`**: `sum(vehicle.spending.equipmentTotalPln)`

### C. Single Vehicle Overview (`calculateVehicleOverviewData`)

- **`totalSpentPln`**: Combined active spending across all categories.
- **Fuel Metrics**:
  - `totalSpentPln`: `sum(fuel.costPln)`
  - `totalLiters`: `sum(fuel.fuelLiters)`
  - `avgConsumptionLPer100Km`: Average of entries where `consumptionLPer100Km > 0`
  - `costPerKmPln`: Average of entries where `costPerKmPln > 0`
  - `entriesCount`: Count of fuel entries
- **Maintenance Metrics**:
  - `totalSpentPln`: Spending for `own_maintenance`
  - `entriesCount`: Total records count
  - `bySection`: Breakdown mapping:
    - `own_maintenance`: `{ costPln, count }`
    - `previous_owner_services`: `{ costPln, count }`
- **Equipment Metrics**:
  - `totalSpentPln`: `sum(equipment.costPln)`
  - `entriesCount`: Total equipment count
- **Stats**:
  - `currentOdometerKm`: `Math.max(odometers)`
  - `minOdometerKm`: `Math.min(odometers)`
  - `totalDistanceKm`: `currentOdometerKm - minOdometerKm` (if valid)
  - `refuelingCount`, `maintenanceCount`, `equipmentCount`
- **Recent Activity**:
  - Merges fuel, maintenance, and equipment items into a unified list.
  - Sorts descending by `date`.
  - Frontend currently retains the entire array in memory.

### D. Sub-Feature Summary Cards (Fuel, Maintenance, Equipment)

- **Fuel Summary Cards**:
  - `totalVolume`: `sum(fuelLiters)`
  - `totalCost`: `sum(costPln)`
  - `avgConsumption`: Average of valid `consumptionLPer100Km`
  - `avgUnitPrice`: `totalCost / totalVolume`
- **Maintenance Summary Cards**:
  - `ownCost`: `sum(costPln)` for `section === 'own_maintenance'`
  - `totalCount`: Count of records
- **Equipment Summary Cards**:
  - `totalCost`: `sum(costPln)`
  - `totalCount`: Count of items

---

## 3. 🛠️ Proposed Backend Endpoints & Contracts

We propose three targeted enhancements:

### Proposal 1: Fleet Summary & Vehicle List Aggregation

To eliminate the $1 + 3N$ requests on `/vehicles`, provide one of the following:

#### Option A (Recommended): Dedicated `GET /api/vehicles/summary`

A single endpoint returning fleet totals and vehicles with their spending summaries:

```http
GET /api/vehicles/summary
```

**Response (`200 OK`):**

```json
{
  "summary": {
    "totalVehicles": 2,
    "totalSpentPln": 8450.0,
    "totalFuelSpentPln": 4200.0,
    "totalMaintenanceSpentPln": 3100.0,
    "totalEquipmentSpentPln": 1150.0
  },
  "vehicles": [
    {
      "id": "670da1234567890abcdef101",
      "slug": "toyota-corolla-2018",
      "name": "Daily Corolla",
      "brand": "Toyota",
      "vehicleModel": "Corolla",
      "type": "car",
      "productionYear": 2018,
      "notes": null,
      "createdAt": "2026-01-10T12:00:00.000Z",
      "updatedAt": "2026-03-01T15:30:00.000Z",
      "spending": {
        "fuelTotalPln": 2200.0,
        "maintenanceTotalPln": 1500.0,
        "equipmentTotalPln": 450.0,
        "totalSpentPln": 4150.0,
        "lastOdometerKm": 142500,
        "fuelEntriesCount": 14,
        "maintenanceCount": 3,
        "equipmentCount": 2
      }
    }
  ]
}
```

#### Option B: Enrich existing `GET /api/vehicles`

Alternatively, include the `spending` object directly inside each vehicle in `GET /api/vehicles`
(optional query parameter `?includeSpending=true` if performance is a concern for dropdowns).

---

### Proposal 2: Dedicated Vehicle Overview Endpoint

To eliminate fetching all raw entries on `/vehicles/:vehicleSlug`, introduce:

```http
GET /api/vehicles/{vehicleId}/overview?activityLimit=10
```

**Query Parameters:**
| Parameter | Type | Default | Description |
| :-------------- | :------- | :------ | :----------------------------------------------------- |
| `activityLimit` | `number` | `10` | Number of recent activities across all spending types. |

**Response (`200 OK`):**

```json
{
  "vehicleId": "670da1234567890abcdef101",
  "totalSpentPln": 4150.0,
  "fuel": {
    "totalSpentPln": 2200.0,
    "totalLiters": 345.5,
    "avgConsumptionLPer100Km": 6.85,
    "costPerKmPln": 0.45,
    "entriesCount": 14
  },
  "maintenance": {
    "totalSpentPln": 1500.0,
    "entriesCount": 5,
    "bySection": {
      "own_maintenance": {
        "costPln": 1500.0,
        "count": 3
      },
      "previous_owner_services": {
        "costPln": 2400.0,
        "count": 2
      }
    }
  },
  "equipment": {
    "totalSpentPln": 450.0,
    "entriesCount": 2
  },
  "stats": {
    "currentOdometerKm": 142500,
    "minOdometerKm": 135000,
    "totalDistanceKm": 7500,
    "refuelingCount": 14,
    "maintenanceCount": 5,
    "equipmentCount": 2
  },
  "recentActivity": [
    {
      "id": "fuel_1",
      "type": "fuel",
      "date": "2026-10-10",
      "costPln": 280.5,
      "title": "Orlen",
      "description": "Full tank Pb95",
      "odometerKm": 142500,
      "transactionId": "tx_123",
      "fuelLiters": 42.5,
      "isFullTank": true,
      "consumptionLPer100Km": 6.7
    },
    {
      "id": "maint_1",
      "type": "maintenance",
      "date": "2026-09-20",
      "costPln": 450.0,
      "title": "Auto Serwis Kowalski",
      "description": "Oil & filters replacement",
      "odometerKm": 140000,
      "transactionId": null,
      "maintenanceSection": "own_maintenance",
      "serviceProvider": "Auto Serwis Kowalski"
    },
    {
      "id": "equip_1",
      "type": "equipment",
      "date": "2026-08-15",
      "costPln": 180.0,
      "title": "Phone Mount & Wireless Charger",
      "description": "Dashboard magnetic holder",
      "transactionId": "tx_456"
    }
  ]
}
```

---

### Proposal 3: Sub-Feature Responses with Embedded Summaries

When the user navigates to `/vehicles/:slug/fuel`, `/maintenance`, or `/equipment`, the frontend
renders top summary cards. To support date filtering and upcoming pagination without recalculating
on the client:

#### A. `GET /api/vehicles/{vehicleId}/fuel`

Add a `summary` object to the list response (respecting active `startDate` / `endDate` filters):

```json
{
  "items": [
    /* paginated or listed fuel entries */
  ],
  "summary": {
    "totalVolume": 450.25,
    "totalCostPln": 2980.5,
    "avgConsumptionLPer100Km": 7.15,
    "avgUnitPricePln": 6.62,
    "totalCount": 15
  }
}
```

#### B. `GET /api/vehicles/{vehicleId}/maintenance`

```json
{
  "items": [
    /* maintenance entries */
  ],
  "summary": {
    "ownMaintenanceCostPln": 1500.0,
    "previousOwnerCostPln": 2400.0,
    "totalRecords": 5
  }
}
```

#### C. `GET /api/vehicles/{vehicleId}/equipment`

```json
{
  "items": [
    /* equipment entries */
  ],
  "summary": {
    "totalCostPln": 450.0,
    "totalItems": 2
  }
}
```

---

## 4. 🧮 Backend Calculation Business Rules

To guarantee consistency between backend calculations and the business domain rules:

1. **Maintenance `section` distinction**:
   - `own_maintenance`: Work done during current ownership. **Must be included** in vehicle and
     fleet spending totals.
   - `previous_owner_services`: Historical service records from prior owners. **Must NOT** be
     added to active ownership spending (`totalSpentPln`), but should be reported separately in
     `bySection.previous_owner_services` and in the maintenance tab summary.
2. **Odometer Range & Delta**:
   - Max odometer (`currentOdometerKm`) and Min odometer (`minOdometerKm`) must be computed from
     `fuelEntries.odometerKm` and `maintenanceEntries.odometerKm` (where `section === 'own_maintenance'`).
   - `totalDistanceKm` = `Math.max(0, currentOdometerKm - minOdometerKm)`.
   - If only 1 entry exists or min == max, `totalDistanceKm` should be `null` or `0`.
3. **Average Consumption**:
   - Only entries where `isFullTank === true` (or where `consumptionLPer100Km` is non-null and `> 0`)
     should be averaged.
   - Average unit price: `totalCost / totalVolume` (PLN/L).

---

## 5. 🚀 Frontend Benefits & Transition Plan

| Area                  | Current Frontend State                           | With Backend Aggregations                               |
| :-------------------- | :----------------------------------------------- | :------------------------------------------------------ |
| **All Vehicles Page** | $1 + 3N$ HTTP requests (~16 reqs for 5 vehicles) | **1 HTTP request** (`GET /api/vehicles/summary`)        |
| **Overview Page**     | 3 HTTP requests fetching all entries across time | **1 HTTP request** (`GET /api/vehicles/:id/overview`)   |
| **Data Transfer**     | Downloads full historical logs & notes           | Transfers only ~1-2 KB aggregated summary JSON          |
| **Client Memory**     | Reducers over arrays, multi-array sorting in JS  | Zero complex JS calculations; direct UI binding         |
| **Pagination**        | Impossible (cards rely on downloading all data)  | Fully supported; summary reflects entire filtered range |

Once these backend endpoints are available, the frontend will:

1. Update API client methods and generate types from the updated OpenAPI schema.
2. Replace `useAllVehiclesSummary` and `useVehicleOverview` with single query hooks.
3. Remove redundant reducer functions from `src/features/vehicles/utils.ts`, keeping only formatting
   helpers (`formatPln`, `formatKm`, `formatLiters`, `formatConsumption`).
