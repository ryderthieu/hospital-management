
export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Appointments: undefined;
  AppointmentDetail: { appointment: Appointment };
  CompletedAppointmentDetail: { appointment: Appointment };
};
export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  specialty: string;
  imageUrl: string;
  status: "upcoming" | "completed";
  department?: string;
  room?: string;
  queueNumber?: number;
  patientName?: string;
  patientBirthday?: string;
  patientGender?: string;
  patientLocation?: string;
  appointmentFee?: string;
  examTime?: string;
  followUpDate?: string;
  diagnosis?: string[];
  doctorNotes?: string[];
  testResults?: { name: string; fileUrl: string }[];
  codes?: {
    appointmentCode?: string;
    transactionCode?: string;
    patientCode?: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  rating: number;
  experience: string;
  availability: string[];
}

export interface AppointmentResponseDto {
  appointmentId: number;
  doctorId: number;
  doctorInfo?: {
    doctorId: number;
    userId: number;
    identityNumber: string;
    fullName: string;
    birthday: string;
    gender: string;
    address: string;
    academicDegree: string;
    specialization: string;
    type: string;
    departmentId: number;
    createdAt: string;
  };
  schedule: {
    scheduleId: number;
    doctorId: number;
    workDate: string;
    startTime: string;
    endTime: string;
    shift: string;
    roomId: number;
    createdAt: string;
  } | null;
  symptoms: string;
  number: number;
  slotStart: string;
  slotEnd: string;
  appointmentStatus: string;
  createdAt: string;
  patientInfo: {
    patientId: number;
    fullName: string;
    birthday: string;
    gender: string;
    address: string;
  } | null;
  appointmentNotes: {
    id: number;
    appointmentId: number;
    noteType: string;
    content: string;
    createdAt: string;
  }[] | null;
}