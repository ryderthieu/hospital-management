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
  "BS CKI": "BS CKI",
  "BS CKII": "BS CKII",
  "ThS.BS": "ThS.BS",
  "TS.BS": "TS.BS",
  "PGS.TS.BS": "PGS.TS.BS",
  "GS.TS.BS": "GS.TS.BS"
};
