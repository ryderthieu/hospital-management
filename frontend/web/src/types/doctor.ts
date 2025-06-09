export interface Department {
  departmentId: number;
  departmentName: string;
}

export interface Doctor {
  doctorId: number
  userId: number
  identityNumber: string
  fullName: string
  birthday: string
  gender: "MALE" | "FEMALE" 
  address: string
  academicDegree: "BS" | "BS_CKI" | "BS_CKII" | "THS_BS" | "TS_BS" | "PGS_TS_BS" | "GS_TS_BS"
  specialization: string
  type: "EXAMINATION" | "SERVICE"
  department: Department;
  profileImage?: string;
  avatar?: string;
  createdAt: string;
}

export interface DoctorDto {
  doctorId?: number;
  userId?: number;
  identityNumber: string;
  fullName: string;
  birthday: string;
  gender: "MALE" | "FEMALE";
  address: string;
  academicDegree:
    | "BS"
    | "BS_CKI"
    | "BS_CKII"
    | "THS_BS"
    | "TS_BS"
    | "PGS_TS_BS"
    | "GS_TS_BS";
  specialization: string;
  type: "EXAMINATION" | "SERVICE";
  departmentId: number;
}

export interface CreateDoctorRequest {
  email?: string;
  phone: string;
  password: string;
  identityNumber: string;
  fullName: string;
  birthday: string; // Will be converted to LocalDate in backend
  gender: "MALE" | "FEMALE";
  address?: string;
  academicDegree: "BS" | "BS_CKI" | "BS_CKII" | "THS_BS" | "TS_BS" | "PGS_TS_BS" | "GS_TS_BS";
  specialization: string;
  avatar?: string;
  type: "EXAMINATION" | "SERVICE";
  departmentId: number;
  consultationFee?: number;
}

// Academic degree labels for display
export const ACADEMIC_DEGREE_LABELS: Record<string, string> = {
  BS: "BS",
  BS_CKI: "BS CKI",
  BS_CKII: "BS CKII",
  THS_BS: "ThS.BS",
  TS_BS: "TS.BS",
  PGS_TS_BS: "PGS.TS.BS",
  GS_TS_BS: "GS.TS.BS",
};
