import { Appointment } from "./appointment"
import { Schedule } from "./schedule"
import { AppointmentNote } from "./appointmentNote"

export interface Patient {
  id: number
  name: string
  code: string
  appointment: string
  date: string
  gender: string
  age: number
  symptom: string
  status: string
  avatar?: string
  appointmentData?: Appointment
}

export interface PatientInfo {
  patientId: number;
  userId: number;
  identityNumber: string;
  insuranceNumber: string;
  fullName: string;
  birthday: string; // yyyy-mm-dd
  gender: 'MALE' | 'FEMALE' | 'OTHER'; // hoặc chỉ 'FEMALE' nếu không có enum đầy đủ
  address: string;
  allergies?: string | null;
  height?: number | null;
  weight?: number | null;
  bloodType?: string | null;
  createdAt: string; // ISO datetime
}

export interface PatientDetail {
  appointmentId: string
  doctorId: number
  schedule: Schedule
  symptoms: string,
  number: number,
  appointmentStatus: string,
  createdAt: string,
  patientInfo: PatientInfo

  appointmentNote: AppointmentNote


}