import React, { createContext, useContext, useState } from 'react';
import API from '../services/api';
import { format, isToday, isTomorrow, isWeekend, addDays } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { DateOption, TimeSlot } from '../screens/BookAppointment/types';

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
  datesByDoctor: Record<string, DateOption[]>;
  timeSlotsBySchedule: Record<number, TimeSlot[]>;
  loadingDepartments: string[];
  loadingDoctors: string[];
  preloadDoctorsForDepartments: (departmentIds: string[]) => Promise<void>;
  preloadSchedulesForDoctors: (doctorIds: string[]) => Promise<void>;
  preloadDatesForDoctors: (doctorIds: string[], days: number) => Promise<void>;
  preloadTimeSlotsForSchedules: (scheduleIds: number[]) => Promise<void>;
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
  const [datesByDoctor, setDatesByDoctor] = useState<Record<string, DateOption[]>>({});
  const [timeSlotsBySchedule, setTimeSlotsBySchedule] = useState<Record<number, TimeSlot[]>>({});
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
        const schedules = await Promise.all(
          res.data.map(async (schedule: any) => {
            // Gọi API lấy availableSlots cho từng schedule
            let availableSlots = [];
            try {
              const slotRes = await API.post('/appointments/schedule/available-slots', {
                scheduleId: schedule.scheduleId,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
              });
              availableSlots = slotRes.data;
            } catch (e) {
              availableSlots = [];
            }
            return { ...schedule, availableSlots };
          })
        );
        setSchedulesByDoctor(prev => ({ ...prev, [id]: schedules }));
      } catch (e) {
        setSchedulesByDoctor(prev => ({ ...prev, [id]: [] }));
      }
    }));
    setLoadingDoctors(prev => prev.filter(id => !toLoad.includes(id)));
  };

  const preloadDatesForDoctors = async (doctorIds: string[], days: number) => {
    await Promise.all(doctorIds.map(async (doctorId) => {
      const schedules = schedulesByDoctor[doctorId] || [];
      if (!schedules.length) {
        setDatesByDoctor(prev => ({ ...prev, [doctorId]: [] }));
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateMap = new Map<string, any[]>();
      schedules.forEach((schedule: any) => {
        const workDate = schedule.workDate;
        const workDateObj = new Date(workDate);
        if (workDateObj >= today && workDateObj <= addDays(today, days - 1)) {
          const arr = dateMap.get(workDate) || [];
          arr.push(schedule);
          dateMap.set(workDate, arr);
        }
      });
      const dates: DateOption[] = [];
      for (let i = 0; i < days; i++) {
        const date = addDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');
        const schedulesInDay = dateMap.get(dateString) || [];
        const availableSlots = schedulesInDay.reduce((total, schedule) => {
          return total + (schedule.availableSlots ? schedule.availableSlots.filter((slot: any) => slot.available).length : 0);
        }, 0);
        const isPast = date < today && !isToday(date);
        dates.push({
          id: dateString,
          day: isToday(date) ? 'Hôm Nay' : isTomorrow(date) ? 'Ngày Mai' : format(date, 'EEEE', { locale: vi }),
          date: format(date, 'dd/MM', { locale: vi }),
          disabled: isPast,
          availableSlots,
          isToday: isToday(date),
          isTomorrow: isTomorrow(date),
          isWeekend: isWeekend(date),
          scheduleIds: schedulesInDay.map((s: any) => s.scheduleId),
        });
      }
      setDatesByDoctor(prev => ({ ...prev, [doctorId]: dates }));
    }));
  };

  const preloadTimeSlotsForSchedules = async (scheduleIds: number[]) => {
    const toLoad = scheduleIds.filter(id => !timeSlotsBySchedule[id]);
    if (toLoad.length === 0) return;
    await Promise.all(toLoad.map(async (scheduleId) => {
      try {
        // Lấy schedule từ schedulesByDoctor
        let foundSchedule = null;
        for (const doctorId in schedulesByDoctor) {
          const schedule = (schedulesByDoctor[doctorId] || []).find((s: any) => s.scheduleId === scheduleId);
          if (schedule) {
            foundSchedule = schedule;
            break;
          }
        }
        if (!foundSchedule) {
          setTimeSlotsBySchedule(prev => ({ ...prev, [scheduleId]: [] }));
          return;
        }
        // Lấy availableSlots từ schedule
        const slots = (foundSchedule.availableSlots || []).map((slot: any, index: number) => ({
          id: `${scheduleId}-${index}`,
          time: `${slot.slotStart.slice(0, 5)} - ${slot.slotEnd.slice(0, 5)}`,
          available: slot.available,
          price: '150.000 VND',
          isSelected: false,
          isPast: new Date(`${foundSchedule.workDate}T${slot.slotStart}`).getTime() < Date.now(),
          isBooked: !slot.available,
        }));
        setTimeSlotsBySchedule(prev => ({ ...prev, [scheduleId]: slots }));
      } catch (e) {
        setTimeSlotsBySchedule(prev => ({ ...prev, [scheduleId]: [] }));
      }
    }));
  };

  return (
    <DoctorContext.Provider value={{ doctorsByDepartment, schedulesByDoctor, datesByDoctor, timeSlotsBySchedule, loadingDepartments, loadingDoctors, preloadDoctorsForDepartments, preloadSchedulesForDoctors, preloadDatesForDoctors, preloadTimeSlotsForSchedules }}>
      {children}
    </DoctorContext.Provider>
  );
}; 