import { Department } from "./department";


export interface ExaminationRoom {
  roomId: number;
  department: Department;
  type: 'EXAMINATION' | 'TEST';
  building: string;
  floor: number;
  roomName: string;
  note?: string; 
  createdAt: Date;
}

