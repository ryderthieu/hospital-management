import API from "../../services/api";
import type { Specialty, Doctor, DateOption, TimeSlot, SortOption } from "./types";
import { format, addDays, isToday, isTomorrow, isWeekend } from "date-fns";
import { vi } from "date-fns/locale";
import type { SvgProps } from "react-native-svg";

// Import SVG icons
import TimMach from "../../assets/images/ChuyenKhoa/TimMach.svg";
import SanNhi from "../../assets/images/ChuyenKhoa/SanNhi.svg";
import DongY from "../../assets/images/ChuyenKhoa/DongY.svg";
import DaKhoa from "../../assets/images/ChuyenKhoa/DaKhoa.svg";
import Than from "../../assets/images/ChuyenKhoa/Than.svg";
import TamThan from "../../assets/images/ChuyenKhoa/TamThan.svg";
import TieuHoa from "../../assets/images/ChuyenKhoa/TieuHoa.svg";
import UngThu from "../../assets/images/ChuyenKhoa/UngThu.svg";
import PhauThuat from "../../assets/images/ChuyenKhoa/PhauThuat.svg";
import NhaKhoa from "../../assets/images/ChuyenKhoa/NhaKhoa.svg";

// Specialty data
export const specialtiesData: Specialty[] = [
  {
    id: "1",
    name: "Tim mạch",
    count: "340 bác sĩ",
    iconType: "svg",
    icon: TimMach as React.ComponentType<SvgProps>,
  },
  {
    id: "2",
    name: "Sản nhi",
    count: "450 bác sĩ",
    iconType: "svg",
    icon: SanNhi as React.ComponentType<SvgProps>,
  },
  {
    id: "3",
    name: "Đông y",
    count: "450 bác sĩ",
    iconType: "svg",
    icon: DongY as React.ComponentType<SvgProps>,
  },
  {
    id: "4",
    name: "Đa khoa",
    count: "50 bác sĩ",
    iconType: "svg",
    icon: DaKhoa as React.ComponentType<SvgProps>,
  },
  {
    id: "5",
    name: "Thận",
    count: "20 bác sĩ",
    iconType: "svg",
    icon: Than as React.ComponentType<SvgProps>,
  },
  {
    id: "6",
    name: "Tâm thần",
    count: "50 bác sĩ",
    iconType: "svg",
    icon: TamThan as React.ComponentType<SvgProps>,
  },
  {
    id: "7",
    name: "Tiêu hóa",
    count: "14 bác sĩ",
    iconType: "svg",
    icon: TieuHoa as React.ComponentType<SvgProps>,
  },
  {
    id: "8",
    name: "Ung thư",
    count: "34 bác sĩ",
    iconType: "svg",
    icon: UngThu as React.ComponentType<SvgProps>,
  },
  {
    id: "9",
    name: "Phẫu thuật",
    count: "54 bác sĩ",
    iconType: "svg",
    icon: PhauThuat as React.ComponentType<SvgProps>,
  },
  {
    id: "10",
    name: "Nha khoa",
    count: "34 bác sĩ",
    iconType: "svg",
    icon: NhaKhoa as React.ComponentType<SvgProps>,
  },
  {
    id: "11",
    name: "Nội tổng quát",
    count: "100 bác sĩ",
    iconType: "svg",
    icon: DaKhoa as React.ComponentType<SvgProps>, // Tạm dùng icon Đa khoa
  },
];

// Doctor data
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "BSCKII. Trần Đỗ Phương Nhi",
    specialty: "Tim mạch",
    room: "Phòng 66 - Lầu 1 Khu B",
    price: "150.000 VND",
    image: require("../../assets/images/avatars/phuongnhi.jpg"),
    rating: 4.8,
    reviewCount: 124,
    experience: "8 năm",
    education: "Đại học Y Hà Nội",
    languages: ["Tiếng Việt", "English"],
    bio: "Bác sĩ chuyên khoa II Tim mạch với 8 năm kinh nghiệm điều trị các bệnh lý tim mạch.",
    joinDate: "2016-03-15",
    isOnline: true,
    status: "active",
  },
  {
    id: "9",
    name: "BS. Nguyễn Văn An",
    specialty: "Nội tổng quát",
    room: "Phòng 10 - Lầu 1 Khu C",
    price: "150.000 VND",
    image: require("../../assets/images/avatars/anhtho.png"),
    rating: 4.7,
    reviewCount: 100,
    experience: "10 năm",
    education: "Đại học Y Hà Nội",
    languages: ["Tiếng Việt"],
    bio: "Bác sĩ chuyên khoa Nội tổng quát với 10 năm kinh nghiệm.",
    joinDate: "2015-01-01",
    isOnline: true,
    status: "active",
  },
  {
    id: "10",
    name: "BS. Trần Thị Bình",
    specialty: "Nội tổng quát",
    room: "Phòng 11 - Lầu 1 Khu C",
    price: "150.000 VND",
    image: require("../../assets/images/avatars/nhattruong.png"),
    rating: 4.8,
    reviewCount: 120,
    experience: "12 năm",
    education: "Đại học Y TP.HCM",
    languages: ["Tiếng Việt", "English"],
    bio: "Bác sĩ chuyên khoa Nội tổng quát, chuyên điều trị bệnh lý mãn tính.",
    joinDate: "2013-01-01",
    isOnline: true,
    status: "active",
  },
];

interface ScheduleDto {
  scheduleId: number;
  doctorId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  shift: "MORNING" | "AFTERNOON";
  roomId: number;
  roomNote: string;
  floor: number;
  building: string;
  createdAt: string;
  availableTimeSlots: {
    slotStart: string;
    slotEnd: string;
    available: boolean;
  }[];
}

export const fetchRealTimeDates = async (doctorId: string, days: number): Promise<DateOption[]> => {
  try {
    console.log(`[data.ts] Đang lấy lịch cho doctorId: ${doctorId}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset giờ để so sánh ngày

    // Gọi API với tham số workDate từ ngày hiện tại
    const response = await API.get<ScheduleDto[]>(`/doctors/${doctorId}/schedules`, {
      params: {
        workDate: format(today, "yyyy-MM-dd"), // e.g., "2025-06-09"
      },
    });
    console.log(`[data.ts] Phản hồi lịch:`, JSON.stringify(response.data, null, 2));

    // Tạo danh sách ngày trong 'days' ngày tới
    const dateMap = new Map<string, ScheduleDto[]>();
    response.data.forEach((schedule) => {
      const workDate = schedule.workDate;
      const workDateObj = new Date(workDate);
      if (workDateObj >= today && workDateObj <= addDays(today, days)) {
        const schedules = dateMap.get(workDate) || [];
        schedules.push(schedule);
        dateMap.set(workDate, schedules);
      }
    });

    const dates: DateOption[] = [];
    for (let i = 0; i < days; i++) {
      const date = addDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      const schedules = dateMap.get(dateString) || [];
      const availableSlots = schedules.reduce((total, schedule) => {
        return total + schedule.availableTimeSlots.filter((slot) => slot.available).length;
      }, 0);

      dates.push({
        id: dateString,
        day: isToday(date) ? "Hôm Nay" : isTomorrow(date) ? "Ngày Mai" : format(date, "EEEE", { locale: vi }),
        date: format(date, "dd/MM", { locale: vi }),
        disabled: schedules.length === 0,
        availableSlots,
        isToday: isToday(date),
        isTomorrow: isTomorrow(date),
        isWeekend: isWeekend(date),
        scheduleIds: schedules.map(s => s.scheduleId), // Lưu tất cả scheduleIds
      });
    }

    return dates;
  } catch (error: any) {
    console.error(`[data.ts] Lỗi khi lấy lịch:`, error.message, error.response?.data);
    throw error;
  }
};

export const fetchTimeSlots = async (scheduleIds: number[]): Promise<TimeSlot[]> => {
  try {
    console.log(`[data.ts] Đang lấy khung giờ cho scheduleIds: ${scheduleIds.join(', ')}`);
    const response = await API.get<ScheduleDto[]>(`/doctors/1/schedules`);

    const schedules = response.data.filter((s) => scheduleIds.includes(s.scheduleId));
    if (schedules.length === 0) {
      throw new Error(`Không tìm thấy lịch với scheduleIds: ${scheduleIds.join(', ')}`);
    }

    const timeSlots: TimeSlot[] = schedules.flatMap(schedule =>
      schedule.availableTimeSlots.map((slot, index) => ({
        id: `${schedule.scheduleId}-${index}`,
        time: `${slot.slotStart.slice(0, 5)} - ${slot.slotEnd.slice(0, 5)}`,
        available: slot.available,
        price: "150.000 VND",
        isSelected: false,
        isPast: new Date(`${schedule.workDate}T${slot.slotStart}`).getTime() < Date.now(),
        isBooked: !slot.available,
      }))
    );

    console.log(`[data.ts] Phản hồi khung giờ:`, JSON.stringify(timeSlots, null, 2));
    return timeSlots;
  } catch (error: any) {
    console.error(`[data.ts] Lỗi khi lấy khung giờ:`, error.message, error.response?.data);
    throw error;
  }
};

// Utility functions
export const getSpecialtyById = (id: string): Specialty | undefined => {
  return specialtiesData.find((specialty) => specialty.id === id);
};

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find((doctor) => doctor.id === id);
};

export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  return doctors.filter((doctor) => doctor.specialty === specialty);
};

export const getSpecialtyNames = (): string[] => {
  return specialtiesData.map((specialty) => specialty.name);
};

export const getSimilarDoctors = (currentDoctorId: string, specialty: string, limit = 4): Doctor[] => {
  return doctors
    .filter((doctor) => doctor.id !== currentDoctorId && doctor.specialty === specialty)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
};

export const sortDoctors = (doctorList: Doctor[], sortOption: SortOption): Doctor[] => {
  const sorted = [...doctorList];
  switch (sortOption) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.joinDate || "").getTime() - new Date(a.joinDate || "").getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.joinDate || "").getTime() - new Date(a.joinDate || "").getTime());
    case "popular":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "price_low_high":
      return sorted.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
        return priceA - priceB;
      });
    case "price_high_low":
      return sorted.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
        return priceB - priceA;
      });
    default:
      return sorted;
  }
};

export const searchDoctors = (query: string): Doctor[] => {
  if (!query.trim()) return doctors;
  const lowercaseQuery = query.toLowerCase().trim();
  return doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(lowercaseQuery) ||
      doctor.specialty.toLowerCase().includes(lowercaseQuery) ||
      (doctor.room && doctor.room.toLowerCase().includes(lowercaseQuery)),
  );
};

export const getOnlineDoctors = (specialty?: string): Doctor[] => {
  let filtered = doctors.filter((doctor) => doctor.isOnline);
  if (specialty) {
    filtered = filtered.filter((doctor) => doctor.specialty === specialty);
  }
  return filtered;
};

export const getDoctorStats = () => {
  const totalDoctors = doctors.length;
  const onlineDoctors = doctors.filter((doctor) => doctor.isOnline).length;
  const averageRating = doctors.reduce((sum, doctor) => sum + (doctor.rating || 0), 0) / totalDoctors;
  const specialtyCount = new Set(doctors.map((doctor) => doctor.specialty)).size;

  return {
    totalDoctors,
    onlineDoctors,
    averageRating: Math.round(averageRating * 10) / 10,
    specialtyCount,
  };
};

export const doctorsData = doctors;