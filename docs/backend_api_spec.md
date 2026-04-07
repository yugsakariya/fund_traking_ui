# Backend API Specification for Frontend Development

This document outlines the API endpoints, authentication mechanisms, and payloads for the Fund Manager backend. Use this to construct the frontend API client (e.g., using `fetch` or `axios` with `swr` or React Query).

## Base URL Configuration

- Ensure the frontend utilizes an environment variable for the base URL.
- Example: `NEXT_PUBLIC_API_URL=http://localhost:3000`

## Authentication & Headers

- **Format**: JSON (`Content-Type: application/json` for all POST requests).
- **Authorization**: Protected endpoints require a Bearer token in the headers.
  ```http
  Authorization: Bearer <jwt_token>
  ```

---

## 🟢 Public Endpoints

### 1. User Login

- **Endpoint:** `POST /api/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```typescript
  interface LoginPayload {~
    email: string;
    password: string;
  }
  ```
- **Success Response (200 OK):**
  ```typescript
  interface LoginResponse {
    message: string;
    token: string; // Store this for Bearer auth
    user: {
      id: number;
      name: string;
      email: string;
      role: "admin" | "member";
    };
  }
  ```

### 2. User Registration

- **Endpoint:** `POST /api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```typescript
  interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "member"; // Defaults to 'member' if omitted
  }
  ```
- **Success Response (201 Created):**
  ```typescript
  interface RegisterResponse {
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
    };
  }
  ```

---

## 🟡 Protected Endpoints (Requires User Auth)

### 3. Get User Profile

- **Endpoint:** `GET /api/auth/profile`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```typescript
  interface ProfileResponse {
    user: {
      id: number;
      name: string;
      email: string;
      role: "admin" | "member";
      created_at: string;
    };
  }
  ```

### 4. Logout

- **Endpoint:** `POST /api/auth/logout`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```typescript
  interface LogoutResponse {
    message: string; // Usually "Logged out successfully"
  }
  ```

### 5. Get All Members

- **Endpoint:** `GET /api/members`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```typescript
  interface MembersResponse {
    users: Array<{
      id: number;
      name: string;
      email: string;
      role: "admin" | "member";
      created_at: string;
    }>;
  }
  ```

### 6. Get Fund Ledger (Transaction History)

- **Endpoint:** `GET /api/fund/ledger`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```typescript
  interface LedgerResponse {
    transactions: Array<{
      id: number;
      user_id: number;
      amount: string; // Note: comes as string from Postgres numeric
      type: "deposit" | "withdrawal";
      note: string;
      recorded_by: number;
      created_at: string;
      user_name: string; // The person the transaction belongs to
      recorder_name: string; // The admin who recorded it
    }>;
    summary: {
      total_deposits: number;
      total_withdrawals: number;
      balance: number;
    };
  }
  ```

### 7. Get Fund Balance

- **Endpoint:** `GET /api/fund/balance`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```typescript
  interface BalanceResponse {
    total_deposits: number;
    total_withdrawals: number;
    balance: number;
  }
  ```

---

## 🔴 Admin-Only Endpoints (Requires 'admin' Role)

### 8. Add Transaction

- **Endpoint:** `POST /api/fund/transaction`
- **Auth Required:** Yes (Must have `role: 'admin'`)
- **Request Body:**
  ```typescript
  interface TransactionPayload {
    amount: number; // Must be > 0
    type: "deposit" | "withdrawal";
    user_id?: number; // Optional. Defaults to the logged-in admin's ID if omitted.
    note?: string; // Optional context
  }
  ```
- **Error Conditions:** Will return HTTP 400 if `type` is 'withdrawal' and `amount` > total fund balance. Will return HTTP 403 if the user is not an admin.
- **Success Response (201 Created):**
  ```typescript
  interface TransactionResponse {
    message: string;
    transaction: {
      id: number;
      user_id: number;
      amount: string;
      type: "deposit" | "withdrawal";
      note: string;
      recorded_by: number;
      created_at: string;
    };
  }
  ```
