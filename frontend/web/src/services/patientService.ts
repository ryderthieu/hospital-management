import { api } from "./api";
import { Patient, PatientDto } from "../types/patient";

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    const response = await api.get<Patient[]>("/patients");
    return response.data;
  },

  async getPatientById(patientId: string): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${patientId}`);
    return response.data;
  },

  async createPatient(patientData: PatientDto): Promise<Patient> {
    const response = await api.post<Patient>("/patients", patientData);
    return response.data;
  },

  async updatePatient(
    patientId: string,
    patientData: Partial<PatientDto>
  ): Promise<Patient> {
    const response = await api.put<Patient>(
      `/patients/${patientId}`,
      patientData
    );
    return response.data;
  },

  async deletePatient(patientId: string): Promise<string> {
    const response = await api.delete<string>(`/patients/${patientId}`);
    return response.data;
  },

  async searchPatient(params: {
    identityNumber?: string;
    insuranceNumber?: string;
    fullName?: string;
  }): Promise<Patient | null> {
    const query = new URLSearchParams(params).toString();
    const response = await api.get<Patient | null>(`/patients/search?${query}`);
    return response.data;
  },
};
