import { Medicine } from './medicin';
import { Prescription } from './prescription';

export interface PrescriptionDetail {
  detailId: number;
  prescription: Prescription;
  medicine: Medicine;
  dosage: string;
  frequency: string;
  duration: string;
  prescriptionNotes?: string;
  createdAt: string; // ISO format datetime
}
