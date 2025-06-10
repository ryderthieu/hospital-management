import type { ExaminationRoom } from "./examinationRoom";

export interface Department {
  departmentId: number;
  departmentName: string;
  description?: string; 
  location: string;
  headDoctorId?: number; 
  foundedYear?: number; 
  phoneNumber: string;
  email: string;
  createdAt: Date;
  examinationRooms: ExaminationRoom[]; 
}