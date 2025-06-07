export interface AuthUser {
  userId: number
  email?: string
  phone: string
  role: "ADMIN" | "PATIENT" | "DOCTOR" | "RECEPTIONIST"
  createdAt: string
}

export interface DoctorInfo {
  doctorId: number
  userId: number
  identityNumber: string
  fullName: string
  birthday: string
  gender: "MALE" | "FEMALE" | "OTHER"
  address: string
  academicDegree: "BS" | "BS_CKI" | "BS_CKII" | "THS_BS" | "TS_BS" | "PGS_TS_BS" | "GS_TS_BS"
  specialization: string
  type: "EXAMINATION" | "SERVICE"
  department: {
    departmentId: number
    departmentName: string
  }
  createdAt: string
}

export interface AuthState {
  user: AuthUser | null
  doctorInfo: DoctorInfo | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  phone: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
  doctorInfo?: DoctorInfo
}
