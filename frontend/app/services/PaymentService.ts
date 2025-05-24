// Payment Service - Handle different payment methods

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  redirectUrl?: string
}

export interface PaymentRequest {
  amount: number
  currency: string
  description: string
  orderId: string
  returnUrl: string
}

class PaymentService {
  // MOCK IMPLEMENTATION (for development/demo)
  async mockPayment(method: string, request: PaymentRequest): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate random success/failure (95% success rate for demo)
    const isSuccess = Math.random() > 0.05

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
    } else {
      return {
        success: false,
        error: "Thanh toán thất bại. Vui lòng thử lại.",
      }
    }
  }

  // CREDIT CARD PAYMENT (Mock implementation)
  async processCreditCardPayment(request: PaymentRequest): Promise<PaymentResult> {
    return this.mockPayment("credit_card", request)
  }

  // MOMO PAYMENT (Mock implementation)
  async processMoMoPayment(request: PaymentRequest): Promise<PaymentResult> {
    return this.mockPayment("momo", request)
  }

  // ZALOPAY PAYMENT (Mock implementation)
  async processZaloPayPayment(request: PaymentRequest): Promise<PaymentResult> {
    return this.mockPayment("zalopay", request)
  }

  // VNPAY PAYMENT (Mock implementation)
  async processVNPayPayment(request: PaymentRequest): Promise<PaymentResult> {
    return this.mockPayment("vnpay", request)
  }
}

export const paymentService = new PaymentService()
