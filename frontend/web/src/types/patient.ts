export interface Patient {
  patientId: Number;
  identityNumber: string;
  insuranceNumber: string;
  fullName: string;
  birthday: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  allergies: string;
  height: number; // đơn vị: cm
  weight: number; // đơn vị: kg
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  createdAt: string;
}

export interface PatientDto {
  identityNumber: string;
  insuranceNumber: string;
  fullName: string;
  birthday: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  allergies: string;
  height: number;
  weight: number;
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
}
