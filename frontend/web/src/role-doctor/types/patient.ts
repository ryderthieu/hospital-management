import { Appointment } from "./appointment"
import { Schedule } from "./schedule"
import { AppointmentNote } from "./appointmentNote"
import { DoctorInfo } from "./doctor"

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
  avatar: string,
  patientId: number;
  userId: number;
  identityNumber: string;
  insuranceNumber: string;
  fullName: string;
  birthday: string; 
  gender: 'MALE' | 'FEMALE'
  address: string;
  allergies?: string | "Không xác định";
  height?: number | "Không xác định" ;
  weight?: number | "Không xác định";
  bloodType?: string | "Không xác định";
  createdAt: string; 
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
  doctorInfo: DoctorInfo
  appointmentNote: AppointmentNote
  slotEnd: string
  slotStart: string
}

export interface PatientDetail2 {
  appointmentId: string
  patientId: string
  patientInfo: PatientInfo
  symptoms: string,
  number: number,
  slotEnd: string
  slotStart: string
  doctorId: number
  schedule: Schedule
  appointmentStatus: string,
  
  
  createdAt: string,
  
  doctorInfo: DoctorInfo
  appointmentNote: AppointmentNote
  
}