export type BillStatus = "PAID" | "UNPAID";
export type BillDetailItemType = "CONSULTATION" | "MEDICINE" | "SERVICE";
export type PaymentMethod = "CASH" | "ONLINE BANKING" | "CARD";
export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface Bill {
  billId: number;
  appointmentId: number;
  totalCost: number;
  insuranceDiscount: number;
  amount: number;
  status: BillStatus;
  createdAt: string;
}

export interface BillDto {
  appointmentId: number;
  totalCost: number;
  insuranceDiscount: number;
  amount: number;
  status: BillStatus;
}

export interface BillDetail {
  detailId: number;
  billId: number;
  itemType: BillDetailItemType;
  quantity: number;
  insuranceDiscount: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface BillDetailDto {
  itemType: BillDetailItemType;
  quantity: number;
  insuranceDiscount: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Transaction {
  transactionId: number;
  billId: number;
  amout: number;
  paymentMethod: PaymentMethod;
  transactionDate: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface TransactionDto {
  billId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
}
