export interface Patient {
  patientId: number;
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

export interface EmergencyContact {
  contactId: number;
  contactName: string;
  contactPhone: string;
  contactRelationship: "FAMILY" | "FRIEND" | "OTHER";
  createdAt: string;
  patientId: number;
}

export interface EmergencyContactDto {
  contactName: string;
  contactPhone: string;
  contactRelationship: "FAMILY" | "FRIEND" | "OTHER";
}
