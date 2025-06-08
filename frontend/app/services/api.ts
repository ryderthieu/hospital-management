import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL: string = process.env.API_URL || 'http://192.168.120.172:8080';

const API: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default API;