import React, { createContext, useContext, useState } from 'react';
import API from '../services/api';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  image?: { uri: string } | null;
  price: string;
  consultationFee: number;
  rating?: number;
  experience?: string | null;
  isOnline?: boolean;
  joinDate?: string | null;
  status?: string;
  avatar?: string | null;
  // ... các trường khác nếu cần
}

export interface Schedule {
  doctorId: string;
  schedules: any[]; // tuỳ theo cấu trúc schedule thực tế
}

interface DoctorContextType {
  doctorsByDepartment: Record<string, Doctor[]>;
  schedulesByDoctor: Record<string, any[]>;
  loadingDepartments: string[];
  loadingDoctors: string[];
  preloadDoctorsForDepartments: (departmentIds: string[]) => Promise<void>;
  preloadSchedulesForDoctors: (doctorIds: string[]) => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const useDoctors = () => {
  const ctx = useContext(DoctorContext);
  if (!ctx) throw new Error('useDoctors must be used within DoctorProvider');
  return ctx;
};

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctorsByDepartment, setDoctorsByDepartment] = useState<Record<string, Doctor[]>>({});
  const [schedulesByDoctor, setSchedulesByDoctor] = useState<Record<string, any[]>>({});
  const [loadingDepartments, setLoadingDepartments] = useState<string[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<string[]>([]);

  const preloadDoctorsForDepartments = async (departmentIds: string[]) => {
    const toLoad = departmentIds.filter(id => !doctorsByDepartment[id] && !loadingDepartments.includes(id));
    if (toLoad.length === 0) return;
    setLoadingDepartments(prev => [...prev, ...toLoad]);
    await Promise.all(toLoad.map(async (id) => {
      try {
        const res = await API.get(`/doctors/departments/${id}/doctors`);
        setDoctorsByDepartment(prev => ({
          ...prev,
          [id]: res.data.map((dto: any) => {
            const academicPart = dto.academicDegree ? `${dto.academicDegree}.` : '';
            const namePart = dto.fullName || '';
            const fullName = [academicPart, namePart].filter(Boolean).join(' ').trim() || 'Bác sĩ chưa có tên';
            const formattedPrice = dto.consultationFee
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dto.consultationFee)
              : 'Liên hệ';
            return {
              id: dto.doctorId.toString(),
              name: fullName,
              specialty: dto.specialization || 'Đa khoa',
              departmentId: id,
              image: dto.avatar ? { uri: dto.avatar } : null,
              price: formattedPrice,
              consultationFee: Number(dto.consultationFee) || 0,
              rating: dto.rating || 0,
              experience: dto.experience || null,
              isOnline: dto.isOnline || false,
              joinDate: dto.joinDate || null,
              status: dto.status || 'active',
              avatar: dto.avatar || null,
            };
          })
        }));
      } catch (e) {
        setDoctorsByDepartment(prev => ({ ...prev, [id]: [] }));
      }
    }));
    setLoadingDepartments(prev => prev.filter(id => !toLoad.includes(id)));
  };

  const preloadSchedulesForDoctors = async (doctorIds: string[]) => {
    const toLoad = doctorIds.filter(id => !schedulesByDoctor[id] && !loadingDoctors.includes(id));
    if (toLoad.length === 0) return;
    setLoadingDoctors(prev => [...prev, ...toLoad]);
    await Promise.all(toLoad.map(async (id) => {
      try {
        const res = await API.get(`/doctors/${id}/schedules`);
        console.log(res.data);
        setSchedulesByDoctor(prev => ({ ...prev, [id]: res.data }));
      } catch (e) {
        setSchedulesByDoctor(prev => ({ ...prev, [id]: [] }));
      }
    }));
    setLoadingDoctors(prev => prev.filter(id => !toLoad.includes(id)));
  };

  return (
    <DoctorContext.Provider value={{ doctorsByDepartment, schedulesByDoctor, loadingDepartments, loadingDoctors, preloadDoctorsForDepartments, preloadSchedulesForDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
}; 