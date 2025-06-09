export interface DoctorInfo {
  doctorId: number;
  userId: number;
  identityNumber: string;
  fullName: string;
  birthday: string; 
  gender: 'MALE' | 'FEMALE' 
  address: string;
  academicDegree: string; 
  specialization: string; 
  type: 'EXAMINATION' | 'TEST'
  departmentId: number;
  createdAt: string; 
}
