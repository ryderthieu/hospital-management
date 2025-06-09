import type React from "react"
import type { Specialty, Doctor, DateOption, TimeSlot, SortOption } from "./types"
import type { SvgProps } from "react-native-svg"
import API from "../../services/api"

// Import SVG icons
import TimMach from "../../assets/images/ChuyenKhoa/TimMach.svg"
import SanNhi from "../../assets/images/ChuyenKhoa/SanNhi.svg"
import DongY from "../../assets/images/ChuyenKhoa/DongY.svg"
import DaKhoa from "../../assets/images/ChuyenKhoa/DaKhoa.svg"
import Than from "../../assets/images/ChuyenKhoa/Than.svg"
import TamThan from "../../assets/images/ChuyenKhoa/TamThan.svg"
import TieuHoa from "../../assets/images/ChuyenKhoa/TieuHoa.svg"
import UngThu from "../../assets/images/ChuyenKhoa/UngThu.svg"
import PhauThuat from "../../assets/images/ChuyenKhoa/PhauThuat.svg"
import NhaKhoa from "../../assets/images/ChuyenKhoa/NhaKhoa.svg"

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
]

// Enhanced doctor data với đầy đủ thông tin
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
    id: "2",
    name: "ThS BS. Trần Nhật Trường",
    specialty: "Tim mạch",
    room: "Phòng 66 - Lầu 1 Khu B",
    price: "150.000 VND",
    image: require("../../assets/images/avatars/nhattruong.png"),
    rating: 4.9,
    reviewCount: 89,
    experience: "12 năm",
    education: "Đại học Y TP.HCM",
    languages: ["Tiếng Việt", "English", "日本語"],
    bio: "Thạc sĩ Bác sĩ chuyên về tim mạch can thiệp và điều trị bệnh lý mạch vành.",
    joinDate: "2012-08-20",
    isOnline: true,
    status: "active",
  },
  {
    id: "3",
    name: "BSCKI. Trịnh Thị Phương Quỳnh",
    specialty: "Tim mạch",
    room: "Phòng 66 - Lầu 1 Khu B",
    price: "150.000 VND",
    image: require("../../assets/images/avatars/pq.jpg"),
    rating: 4.7,
    reviewCount: 156,
    experience: "6 năm",
    education: "Đại học Y Huế",
    languages: ["Tiếng Việt"],
    bio: "Bác sĩ chuyên khoa I Tim mạch, chuyên điều trị tăng huyết áp và rối loạn nhịp tim.",
    joinDate: "2018-01-10",
    isOnline: false,
    status: "busy",
  },
  {
    id: "4",
    name: "BSCKII. Huỳnh Văn Thiệu",
    specialty: "Tim mạch",
    room: "Phòng 66 - Lầu 1 Khu B",
    price: "150.000 VND",
    image: require("../../assets/images/avatars/thieu.jpg"),
    rating: 4.6,
    reviewCount: 203,
    experience: "15 năm",
    education: "Đại học Y Dược TP.HCM",
    languages: ["Tiếng Việt", "English"],
    bio: "Bác sĩ chuyên khoa II với 15 năm kinh nghiệm trong lĩnh vực tim mạch.",
    joinDate: "2009-05-12",
    isOnline: true,
    status: "active",
  },
  {
    id: "5",
    name: "BS. Nguyễn Thị Mai",
    specialty: "Sản nhi",
    room: "Phòng 12 - Lầu 2 Khu A",
    price: "120.000 VND",
    image: require("../../assets/images/avatars/phuongnhi.jpg"),
    rating: 4.5,
    reviewCount: 78,
    experience: "5 năm",
    education: "Đại học Y Hà Nội",
    languages: ["Tiếng Việt"],
    bio: "Bác sĩ chuyên khoa Sản phụ khoa, chuyên theo dõi thai kỳ và sinh nở.",
    joinDate: "2019-09-01",
    isOnline: true,
    status: "active",
  },
  {
    id: "6",
    name: "BSCKII. Lê Văn Hùng",
    specialty: "Sản nhi",
    room: "Phòng 15 - Lầu 2 Khu A",
    price: "180.000 VND",
    image: require("../../assets/images/avatars/nhattruong.png"),
    rating: 4.9,
    reviewCount: 145,
    experience: "10 năm",
    education: "Đại học Y TP.HCM",
    languages: ["Tiếng Việt", "English"],
    bio: "Bác sĩ chuyên khoa II Sản phụ khoa, chuyên phẫu thuật sản khoa.",
    joinDate: "2014-02-15",
    isOnline: false,
    status: "offline",
  },
  {
    id: "7",
    name: "BS. Phạm Thị Lan",
    specialty: "Đa khoa",
    room: "Phòng 20 - Lầu 1 Khu C",
    price: "100.000 VND",
    image: require("../../assets/images/avatars/pq.jpg"),
    rating: 4.4,
    reviewCount: 92,
    experience: "4 năm",
    education: "Đại học Y Cần Thơ",
    languages: ["Tiếng Việt"],
    bio: "Bác sĩ đa khoa với kinh nghiệm điều trị các bệnh lý nội khoa thường gặp.",
    joinDate: "2020-06-01",
    isOnline: true,
    status: "active",
  },
  {
    id: "8",
    name: "BSCKI. Võ Minh Tuấn",
    specialty: "Tim mạch",
    room: "Phòng 68 - Lầu 1 Khu B",
    price: "200.000 VND",
    image: require("../../assets/images/avatars/thieu.jpg"),
    rating: 4.8,
    reviewCount: 167,
    experience: "9 năm",
    education: "Đại học Y Dược TP.HCM",
    languages: ["Tiếng Việt", "English", "Français"],
    bio: "Bác sĩ chuyên khoa I Tim mạch, chuyên điều trị suy tim và bệnh lý van tim.",
    joinDate: "2015-11-20",
    isOnline: true,
    status: "active",
  },
]

// Interface cho ScheduleDto từ backend
interface ScheduleDto {
  scheduleId: number
  doctorId: number
  workDate: string // e.g., "2025-06-09"
  startTime: string // e.g., "08:00:00"
  endTime: string // e.g., "17:00:00"
  shift: string
  roomId: number
  roomNote?: string
  floor?: number
  building?: string
  createdAt: string
}

// Interface cho TimeSlotDto từ backend
interface TimeSlotDto {
  slotStart: string // e.g., "08:00:00"
  slotEnd: string // e.g., "08:30:00"
}

// Basic utility functions
export const getSpecialtyById = (id: string): Specialty | undefined => {
  return specialtiesData.find((specialty) => specialty.id === id)
}

export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find((doctor) => doctor.id === id)
}

export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  return doctors.filter((doctor) => doctor.specialty === specialty)
}

export const getSpecialtyNames = (): string[] => {
  return specialtiesData.map((specialty) => specialty.name)
}

// Enhanced: Get similar doctors với sorting options
export const getSimilarDoctors = (currentDoctorId: string, specialty: string, limit = 4): Doctor[] => {
  return doctors
    .filter((doctor) => doctor.id !== currentDoctorId && doctor.specialty === specialty)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating
    .slice(0, limit)
}

// Hàm lấy danh sách ngày khả dụng từ API
export const fetchRealTimeDates = async (doctorId: string, daysCount = 7): Promise<DateOption[]> => {
  try {
    console.log(`[fetchRealTimeDates] Fetching schedules for doctorId: ${doctorId}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + daysCount);

    // Gọi API cho từng ngày trong khoảng daysCount
    const schedules: ScheduleDto[] = [];
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const workDate = date.toISOString().split("T")[0]; // e.g., "2025-06-09"
      for (const shift of ["MORNING", "AFTERNOON"]) {
        try {
          const response = await API.get<ScheduleDto[]>(`/doctors/${doctorId}/schedules?shift=${shift}&workDate=${workDate}`);
          if (response.data && response.data.length > 0) {
            schedules.push(...response.data.filter((schedule) => schedule.workDate === workDate && schedule.shift === shift));
          }
        } catch (error: any) {
          console.warn(`[fetchRealTimeDates] No schedules for doctorId: ${doctorId}, shift: ${shift}, workDate: ${workDate}`, error.message);
        }
      }
    }
    console.log(`[fetchRealTimeDates] Raw schedules response:`, JSON.stringify(schedules, null, 2));

    if (!schedules || schedules.length === 0) {
      console.warn(`[fetchRealTimeDates] No schedules found for doctorId: ${doctorId}`);
      return [];
    }

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    const dates: DateOption[] = schedules
      .filter((schedule) => {
        if (!schedule.workDate) {
          console.warn(`[fetchRealTimeDates] Missing workDate in schedule:`, schedule);
          return false;
        }
        const scheduleDate = new Date(schedule.workDate);
        if (isNaN(scheduleDate.getTime())) {
          console.warn(`[fetchRealTimeDates] Invalid workDate format: ${schedule.workDate}`);
          return false;
        }
        const isValid = scheduleDate >= today && scheduleDate <= maxDate;
        console.log(`[fetchRealTimeDates] Schedule ${schedule.scheduleId}: workDate=${schedule.workDate}, isValid=${isValid}`);
        return isValid;
      })
      .map((schedule) => {
        const date = new Date(schedule.workDate);
        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isPast = date < today;
        const isTooLateToday = isToday && new Date().getHours() >= 16;

        return {
          id: schedule.workDate,
          day: isToday ? "Hôm nay" : isTomorrow ? "Ngày mai" : dayNames[date.getDay()],
          date: `${date.getDate()}/${date.getMonth() + 1}`,
          disabled: isPast || isTooLateToday,
          isToday,
          isTomorrow,
          isWeekend,
          availableSlots: 0,
          scheduleId: schedule.scheduleId,
          shift: schedule.shift,
        };
      });

    // Loại bỏ các ngày trùng lặp
    const uniqueDates = Array.from(new Map(dates.map((date) => [date.id, date])).values());

    // Lấy số lượng khung giờ khả dụng
    for (const date of uniqueDates) {
      if (!date.disabled && date.scheduleId) {
        try {
          const slots = await fetchTimeSlots(date.scheduleId);
          date.availableSlots = slots.filter((slot) => slot.available && !slot.isBooked).length;
          console.log(`[fetchRealTimeDates] Available slots for ${date.id}: ${date.availableSlots}`);
        } catch (error) {
          console.error(`[fetchRealTimeDates] Error fetching slots for scheduleId ${date.scheduleId}:`, error);
          date.availableSlots = 0;
        }
      }
    }

    console.log(`[fetchRealTimeDates] Generated dates:`, JSON.stringify(uniqueDates, null, 2));
    return uniqueDates;
  } catch (error: any) {
    console.error("[fetchRealTimeDates] Error fetching schedules:", error.message, error.response?.data);
    return [];
  }
};

// Hàm lấy danh sách khung giờ khả dụng từ API
export const fetchTimeSlots = async (scheduleId: number): Promise<TimeSlot[]> => {
  try {
    console.log(`[fetchTimeSlots] Fetching time slots for scheduleId: ${scheduleId}`);
    const response = await API.get<TimeSlotDto[]>(`/doctors/schedules/${scheduleId}/time-slots`);
    const slots = response.data;
    console.log(`[fetchTimeSlots] Raw slots response:`, JSON.stringify(slots, null, 2));

    if (!slots || slots.length === 0) {
      console.warn(`[fetchTimeSlots] No slots found for scheduleId: ${scheduleId}`);
      return [];
    }

    const today = new Date();
    return slots.map((slot) => {
      const slotTime = new Date(`${today.toISOString().split("T")[0]}T${slot.slotStart}`);
      const isPast = slotTime <= today;
      return {
        id: `${scheduleId}-${slot.slotStart}`,
        time: `${slot.slotStart.slice(0, 5)} - ${slot.slotEnd.slice(0, 5)}`,
        available: !isPast,
        price: "150.000 VND", // Giá mặc định
        isSelected: false,
        isPast,
        isBooked: false, // Giả định không có thông tin từ TimeSlotDto
      };
    });
  } catch (error: any) {
    console.error("[fetchTimeSlots] Error fetching time slots:", error.message, error.response?.data);
    return [];
  }
};

// Enhanced: Sort doctors function
export const sortDoctors = (doctorList: Doctor[], sortOption: SortOption): Doctor[] => {
  const sorted = [...doctorList]

  switch (sortOption) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.joinDate || "").getTime() - new Date(a.joinDate || "").getTime())
    case "oldest":
      return sorted.sort((a, b) => new Date(a.joinDate || "").getTime() - new Date(b.joinDate || "").getTime())
    case "popular":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case "price_low_high":
      return sorted.sort((a, b) => {
        const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
        const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
        return priceA - priceB
      })
    case "price_high_low":
      return sorted.sort((a, b) => {
        const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
        const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
        return priceB - priceA
      })
    default:
      return sorted
  }
}

// Get available slots count for a specific date
export const getAvailableSlots = (dateId: string): number => {
  const slots = generateTimeSlots(dateId)
  return slots.filter((slot) => slot.available).length
}

// Check if a date is available for booking
export const isDateAvailable = (dateId: string): boolean => {
  const date = new Date(dateId)
  const today = new Date()

  // Not available if it's in the past
  if (date < today && date.toDateString() !== today.toDateString()) {
    return false
  }

  // Not available if it's too far in the future (e.g., more than 30 days)
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 30)

  if (date > maxDate) {
    return false
  }

  // Check if there are any available slots
  return getAvailableSlots(dateId) > 0
}

// Get recommended doctors (mix of specialties)
export const getRecommendedDoctors = (currentDoctorId: string, limit = 6): Doctor[] => {
  return doctors
    .filter((doctor) => doctor.id !== currentDoctorId)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating
    .slice(0, limit)
}

// Get top rated doctors
export const getTopRatedDoctors = (currentDoctorId: string, specialty?: string, limit = 4): Doctor[] => {
  let filtered = doctors.filter((doctor) => doctor.id !== currentDoctorId)

  if (specialty) {
    filtered = filtered.filter((doctor) => doctor.specialty === specialty)
  }

  return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit)
}

// Enhanced: Search doctors by name or specialty
export const searchDoctors = (query: string): Doctor[] => {
  if (!query.trim()) return doctors

  const lowercaseQuery = query.toLowerCase().trim()
  return doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(lowercaseQuery) ||
      doctor.specialty.toLowerCase().includes(lowercaseQuery) ||
      (doctor.room && doctor.room.toLowerCase().includes(lowercaseQuery)),
  )
}

// Get doctors by online status
export const getOnlineDoctors = (specialty?: string): Doctor[] => {
  let filtered = doctors.filter((doctor) => doctor.isOnline)

  if (specialty) {
    filtered = filtered.filter((doctor) => doctor.specialty === specialty)
  }

  return filtered
}

// Get doctor statistics
export const getDoctorStats = () => {
  const totalDoctors = doctors.length
  const onlineDoctors = doctors.filter((doctor) => doctor.isOnline).length
  const averageRating = doctors.reduce((sum, doctor) => sum + (doctor.rating || 0), 0) / totalDoctors
  const specialtyCount = new Set(doctors.map((doctor) => doctor.specialty)).size

  return {
    totalDoctors,
    onlineDoctors,
    averageRating: Math.round(averageRating * 10) / 10,
    specialtyCount,
  }
}

// Legacy function for backward compatibility
export const generateDateOptions = () => {
  return generateRealTimeDates(7)
}

// Export doctors as doctorsData for backward compatibility
export const doctorsData = doctors
