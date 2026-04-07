# Profile API Spec — `GET /api/auth/profile`

## Authentication

Requires a Bearer token in the request header:

```http
Authorization: Bearer <jwt_token>
```

---

## Success Response — `200 OK`

```typescript
{
  user: {
    id: number
    name: string
    email: string
    role: "admin" | "member"
    created_at: string          // ISO datetime string
  },

  ledger: Array<{
    id: number
    amount: string              // ⚠️ String from Postgres (e.g. "500.00") — parse with parseFloat()
    type: "deposit" | "withdrawal"
    note: string
    created_at: string          // ISO datetime string
    user_name: string           // Name of the user this transaction belongs to
    recorded_by_name: string    // Name of the admin who recorded it
  }>,

  summary: {
    total_deposits: number      // Sum of all deposits for this user
    total_withdrawals: number   // Sum of all withdrawals for this user
    net_contribution: number    // total_deposits - total_withdrawals
  }
}
```

---

## Example Response

```json
{
  "user": {
    "id": 1,
    "name": "yug",
    "email": "yug@fund.com",
    "role": "admin",
    "created_at": "2026-04-06T10:00:00.000Z"
  },
  "ledger": [
    {
      "id": 3,
      "amount": "500.00",
      "type": "deposit",
      "note": "Monthly contribution",
      "created_at": "2026-04-06T11:00:00.000Z",
      "user_name": "yug",
      "recorded_by_name": "yug"
    },
    {
      "id": 1,
      "amount": "200.00",
      "type": "withdrawal",
      "note": "Group dinner",
      "created_at": "2026-04-05T09:00:00.000Z",
      "user_name": "yug",
      "recorded_by_name": "yug"
    }
  ],
  "summary": {
    "total_deposits": 500,
    "total_withdrawals": 200,
    "net_contribution": 300
  }
}
```

---

## Error Responses

| Status | Reason |
|--------|--------|
| `401`  | No token / invalid token / session expired |
| `404`  | User not found |

---

## Key Notes for Frontend

- **`ledger` is ordered newest first** (descending by `created_at`).
- **`amount` is a string** — always use `parseFloat(amount)` before math or display.
- **`ledger` is scoped to the logged-in user only** — it does NOT include all group transactions. Use `GET /api/fund/ledger` for the full group ledger.
- **`summary.net_contribution`** = `total_deposits − total_withdrawals` for this user only, not the whole fund balance.
