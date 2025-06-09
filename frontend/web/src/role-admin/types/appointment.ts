export interface AppointmentRequest {
  slotStart: string; // ISO time string, e.g. "08:00:00"
  slotEnd: string;   // ISO time string
  scheduleId: number;
  symptoms: string;
  doctorId: number;
  patientId: number;
}

export interface AppointmentResponse {
  appointmentId: number;
  doctorId: number;
  schedule: ScheduleDto;
  symptoms: string;
  number: number;
  slotStart: string; // ISO time string
  slotEnd: string;   // ISO time string
  appointmentStatus: AppointmentStatus;
  createdAt: string; // ISO timestamp
  patientInfo: PatientDto;
  appointmentNotes: AppointmentNoteDto[];
}

export interface AppointmentUpdateRequest {
  appointmentId: number;
  doctorId: number;
  patientId: number;
  scheduleId: number;
  symptoms: string;
  number: number;
  appointmentStatus: AppointmentStatus;
  slotStart: string; // ISO date string (yyyy-mm-dd)
  slotEnd: string;   // ISO date string
}

export interface AvailableTimeSlotResponse {
  slotStart: string; // ISO time string
  slotEnd: string;   // ISO time string
  isAvailable: boolean;
  currentAppointments: number;
  maxAppointments: number;
}

// Bạn cần định nghĩa thêm các interface/phụ thuộc sau:
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; // hoặc enum thực tế backend

export interface ScheduleDto {
  // Định nghĩa các trường cần thiết theo backend
  // Ví dụ:
  scheduleId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  // ...
}

export interface PatientDto {
  // Định nghĩa các trường cần thiết theo backend
  patientId: number;
  fullName: string;
  // ...
}

export interface AppointmentNoteDto {
  // Định nghĩa các trường cần thiết theo backend
  noteId: number;
  content: string;
  createdAt: string;
  // ...
}