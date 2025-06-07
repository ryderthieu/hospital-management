import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/users/auth/login`, data);
  return response.data;
};
