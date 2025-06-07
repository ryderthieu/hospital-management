import axios from "axios";
import { DoctorDto } from "../types/DoctorDto";

const API_BASE_URL = "http://localhost:8084/doctors";

const getAllDoctors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: {
        "X-User-Id": "123",
        "X-User-Role": "ADMIN",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API /doctors:", error);
    throw error;
  }
};

const getDoctorById = async (doctorId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${doctorId}`, {
      headers: {
        "X-User-Id": "123",
        "X-User-Role": "ADMIN",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi gọi API /doctors/${doctorId}:`, error);
    throw error;
  }
};

export const doctorApi = {
  getAllDoctors,
  getDoctorById,
};
