import { api } from "../../services/api";
import {
  Patient,
  PatientDto,
  EmergencyContact,
  CreatePatientRequest,
  RoomDetail,
  RoomDetailDto,
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

  async createPatient(patientData: any): Promise<CreatePatientRequest> {
    const response = await api.post<CreatePatientRequest>(
      "/patients/add-patient",
      patientData
    );
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

  // Get all room details
  async getAllRoomDetails(): Promise<RoomDetail[]> {
    const response = await api.get<RoomDetail[]>(`/patients/room-details`);
    return response.data;
  },

  // Get room details by detailId
  async getRoomDetailById(detailId: number): Promise<RoomDetail> {
    const response = await api.get<RoomDetail>(
      `/patients/room-details/${detailId}`
    );
    return response.data;
  },

  // Create a new room detail
  async createRoomDetail(
    roomDetailData: Partial<RoomDetailDto>
  ): Promise<RoomDetailDto> {
    const response = await api.post<RoomDetailDto>(
      `/patients/room-details`,
      roomDetailData
    );
    return response.data;
  },
};
