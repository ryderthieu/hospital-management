export interface Medicine {
  medicineId: number
  medicineName: string
  manufactor: string
  category: string
  description: string
  usage: string
  unit: string
  insuranceDiscountPercent: number
  insuranceDiscount: number
  sideEffects: string
  price: number
  quantity: number
}

export interface MedicineRequest {
  medicineName: string
  manufactor: string
  category: string
  description: string
  usage: string
  unit: string
  insuranceDiscountPercent: number
  sideEffects: string
  price: number
  quantity: number
}

export interface MedicineUpdateRequest {
  medicineName?: string
  manufactor?: string
  category?: string
  description?: string
  usage?: string
  unit?: string
  insuranceDiscountPercent?: number
  sideEffects?: string
  price?: number
  quantity?: number
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}
