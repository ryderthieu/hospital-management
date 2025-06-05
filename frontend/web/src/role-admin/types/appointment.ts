import { EventInput } from "@fullcalendar/core";

// Kiểu trạng thái lịch khám
export type EventStatus = "danger" | "success" | "waiting" | "cancel";

// Ánh xạ tên trạng thái và giá trị
export const EVENT_STATUS_MAP = {
  "Khẩn cấp": "danger" as EventStatus,
  "Đã khám": "success" as EventStatus,
  "Chờ khám": "waiting" as EventStatus,
  "Hủy": "cancel" as EventStatus,
};

// Interface cho sự kiện lịch
export interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: EventStatus;
    patientName: string;
    patientId?: string;
    insuranceId?: string;
    phoneNumber?: string;
    patientAge?: number;
    symptoms?: string;
    eventTime?: string;
    doctorName?: string;
    department?: string;
    departmentId?: string;
    doctorId?: string;
  };
}

// Interface cho form dữ liệu
export interface EventFormData {
  patientName: string;
  patientId: string;
  insuranceId: string;
  phoneNumber: string;
  patientAge: number;
  symptoms: string;
  date: string;
  time: string;
  doctorName: string;
  doctorId: string;
  department: string;
  departmentId: string;
  status: string;
}