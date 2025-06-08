import { api } from "../../services/api";
import {
  Patient,
  PatientDto,
  EmergencyContact,
  EmergencyContactDto,
} from "../types/patient";

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    const response = await api.get<Patient[]>("/patients");
    return response.data;
  },

  async getPatientById(patientId: number): Promise<Patient> {
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

  async deletePatient(patientId: number): Promise<string> {
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

  // Emergency Contacts
  async getEmergencyContacts(patientId: number): Promise<EmergencyContact[]> {
    const response = await api.get<EmergencyContact[]>(
      `/patients/${patientId}/contacts`
    );
    return response.data;
  },
};
