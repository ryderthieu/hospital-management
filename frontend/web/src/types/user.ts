export interface User {
  userId: number
  email: string | null 
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
  email?: string | null
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

// Response type for getCurrentUser endpoint - same as User
export interface UserResponse extends User {}
