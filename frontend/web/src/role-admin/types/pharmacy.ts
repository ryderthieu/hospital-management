export interface Medicine {
  medicineId: number;
  medicineName: string;
  manufactor: string;
  catogory: string;
  description: string;
  usage: string;
  unit: string; // đơn vị thuốc (viên, lọ, ml,...)
  isInsuranceCovered: boolean;
  sideEffects: string;
  price: number;
  quantity: number;
  createdAt: string;
}

export interface Prescription {
  prescriptionId: number;
  appointmentId: number;
  followUpDate: string;
  isFollowUp: boolean;
  diagnosis: string;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  heartRate: number;
  bloodSugar: number;
  note: string;
  createdAt: string;
}

export interface PrescriptionDetail {
  detailId: number;
  prescriptionId: number;
  medicine_id: number;
  dosage: string;
  frequency: string;
  duration: string;
  prescriptionNotes: string;
  createdAt: string;
}
