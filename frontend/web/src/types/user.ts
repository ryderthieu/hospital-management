export interface User {
  userId: number
  email?: string
  phone: string
  role: "ADMIN" | "PATIENT" | "DOCTOR" | "RECEPTIONIST"
  createdAt: string
}

export interface UserRequest {
  email?: string
  phone: string
  password: string
  role: "ADMIN" | "PATIENT" | "DOCTOR" | "RECEPTIONIST"
}

export interface UserUpdateRequest {
  phone?: string
  email?: string
  password?: string
  role?: "ADMIN" | "PATIENT" | "DOCTOR" | "RECEPTIONIST"
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}
