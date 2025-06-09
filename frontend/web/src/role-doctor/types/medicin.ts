import { PrescriptionDetail } from './prescriptionDetail';

export interface Medicine {
  medicineId: number;
  medicineName: string;
  manufactor?: string;
  category: string;
  description?: string;
  usage: string;
  unit: string;
  insuranceDiscountPercent: number;
  insuranceDiscount?: number;
  sideEffects?: string;
  price: number;
  quantity?: number;
  createdAt: string; // ISO format datetime
  prescriptionDetails: PrescriptionDetail[];
}
