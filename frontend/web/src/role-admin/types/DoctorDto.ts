export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AcademicDegree = "BACHELOR" | "MASTER" | "DOCTOR" | "OTHER";
export type DoctorType = "FULL_TIME" | "PART_TIME" | "OTHER";

export interface DoctorDto {
  doctorId?: number;
  userId: number;
  identityNumber: string;
  fullName: string;
  birthday: string;
  gender: Gender;
  address?: string;
  academicDegree: AcademicDegree;
  specialization: string;
  type: DoctorType;
  departmentId?: number;
  createdAt?: string;
}
