import { api } from "../../services/api"
import type { ExaminationRoom } from "../types/examinationRoom"

export const examinationRoomService = {
  // Get all examination rooms
  async getAllExaminationRooms(): Promise<ExaminationRoom[]> {
    const response = await api.get<ExaminationRoom[]>("/doctors/examination-rooms")
    return response.data
  },

  // Get examination room by ID
  async getExaminationRoomById(roomId: number): Promise<ExaminationRoom> {
    const response = await api.get<ExaminationRoom>(`/doctors/examination-rooms/${roomId}`)
    return response.data
  },

  // Filter rooms by type, building, floor
  async filterRooms(type?: string, building?: string, floor?: number): Promise<ExaminationRoom[]> {
    const params = new URLSearchParams()
    if (type) params.append("type", type)
    if (building) params.append("building", building)
    if (floor) params.append("floor", floor.toString())

    const response = await api.get<ExaminationRoom[]>(`/doctors/examination-rooms/search?${params.toString()}`)
    return response.data
  },

  // Get only TEST type rooms
  async getTestRooms(): Promise<ExaminationRoom[]> {
    return this.filterRooms("TEST")
  },

  // Get only EXAMINATION type rooms
  async getExaminationRooms(): Promise<ExaminationRoom[]> {
    return this.filterRooms("EXAMINATION")
  },
}
