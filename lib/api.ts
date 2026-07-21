const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers: customHeaders, ...fetchOptions } = options

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  }

  if (requiresAuth) {
    let token: string | null = null
    try {
      token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    } catch {
      // localStorage access denied
    }
    if (token) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  // Handle 401 Unauthorized - clear auth and redirect
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch {
        // localStorage access denied
      }
      window.location.href = "/"
    }
    throw new ApiError("Session expired. Please login again.", 401)
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(error.message || `HTTP error! status: ${response.status}`, response.status)
  }

  // Handle empty responses
  const text = await response.text()
  if (!text) {
    return {} as T
  }
  
  return JSON.parse(text)
}

// Types matching your backend API
export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "member"
  created_at?: string
}

export interface LoginResponse {
  message: string
  token: string
  user: User
}

export interface RegisterResponse {
  message: string
  user: User
}

export interface ProfileLedgerItem {
  id: number
  amount: string
  type: "deposit" | "withdrawal"
  note: string
  created_at: string
  user_name: string
  recorded_by_name: string
}

export interface ProfileSummary {
  total_deposits: number
  total_withdrawals: number
  net_contribution: number
}

export interface ProfileResponse {
  user: User
  ledger: ProfileLedgerItem[]
  summary: ProfileSummary
}

export interface LogoutResponse {
  message: string
}

export interface MembersResponse {
  users: User[]
}

export interface Transaction {
  id: number
  user_id: number
  amount: string // comes as string from Postgres numeric
  type: "deposit" | "withdrawal"
  note: string
  recorded_by: number
  created_at: string
  user_name: string
  recorder_name: string
}

export interface LedgerResponse {
  transactions: Transaction[]
  summary: {
    total_deposits: number
    total_withdrawals: number
    balance: number
  }
}

export interface BalanceResponse {
  total_deposits: number
  total_withdrawals: number
  balance: number
}

export interface CreateTransactionData {
  amount: number
  type: "deposit" | "withdrawal"
  user_id?: number
  note?: string
}

export interface TransactionResponse {
  message: string
  transaction: {
    id: number
    user_id: number
    amount: string
    type: "deposit" | "withdrawal"
    note: string
    recorded_by: number
    created_at: string
  }
}

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    }),

  register: (name: string, email: string, password: string, role?: "admin" | "member") =>
    apiRequest<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
      requiresAuth: false,
    }),

  getProfile: () =>
    apiRequest<ProfileResponse>("/api/auth/profile"),

  logout: () =>
    apiRequest<LogoutResponse>("/api/auth/logout", {
      method: "POST",
    }),
}

// Members endpoints
export const membersApi = {
  getAll: () =>
    apiRequest<MembersResponse>("/api/members"),
}

// Fund endpoints
export const fundApi = {
  getLedger: () =>
    apiRequest<LedgerResponse>("/api/fund/ledger"),

  getBalance: () =>
    apiRequest<BalanceResponse>("/api/fund/balance"),

  addTransaction: (data: CreateTransactionData) =>
    apiRequest<TransactionResponse>("/api/fund/transaction", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

export { ApiError }
