export enum ServiceType {
  TEST = "TEST",
  IMAGING = "IMAGING",
  CONSULTATION = "CONSULTATION",
  OTHER = "OTHER",
}

export interface Service {
  serviceId: number
  serviceName: string
  serviceType: ServiceType
  price: number
  createdAt?: string
}

export enum OrderStatus {
  ORDERED = "ORDERED",
  COMPLETED = "COMPLETED",
}

export interface ServiceOrder {
  orderId: number
  appointmentId: number
  roomId: number
  service: Service
  orderStatus: OrderStatus
  result?: string
  number: number
  orderTime: string
  resultTime?: string
  createdAt?: string
}

export interface TestResult {
  orderId: number
  serviceName: string
  expectedTime: string
  actualTime?: string
  result?: string
  status: OrderStatus
  roomId: number
}

export interface CreateServiceOrderRequest {
  appointmentId: number
  roomId: number
  serviceId: number
  orderTime: string
}

export interface UpdateServiceOrderRequest {
  roomId?: number
  orderStatus?: OrderStatus
  result?: string
  resultTime?: string
}
