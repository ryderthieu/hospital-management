import type React from "react"
import type { Specialty, Doctor, DateOption, TimeSlot, SortOption } from "./types"
import type { SvgProps } from "react-native-svg"

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

// Enhanced: Generate real-time dates với better logic
export const generateRealTimeDates = (daysCount = 7): DateOption[] => {
  const dates: DateOption[] = []
  const today = new Date()

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    const isToday = i === 0
    const isTomorrow = i === 1
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    let day: string
    if (isToday) {
      day = "Hôm nay"
    } else if (isTomorrow) {
      day = "Ngày mai"
    } else {
      day = dayNames[date.getDay()]
    }

    const dateStr = `${date.getDate()}/${date.getMonth() + 1}`

    // Auto-disable logic
    const isPast = date < today && !isToday
    const currentHour = new Date().getHours()
    const isTooLateToday = isToday && currentHour >= 16 // After 4 PM

    dates.push({
      id: date.toISOString().split("T")[0], // YYYY-MM-DD format
      day,
      date: dateStr,
      disabled: isPast || isTooLateToday,
      isToday,
      isTomorrow,
      isWeekend,
      availableSlots: Math.floor(Math.random() * 8) + 1, // Mock available slots
    })
  }

  return dates
}

// Enhanced time slots generation
export const generateTimeSlots = (date: string): TimeSlot[] => {
  const morningSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]

  const afternoonSlots = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]

  const allSlots = [...morningSlots, ...afternoonSlots]

  const selectedDate = new Date(date)
  const today = new Date()
  const isToday = selectedDate.toDateString() === today.toDateString()
  const currentHour = today.getHours()
  const currentMinute = today.getMinutes()

  return allSlots.map((time, index) => {
    const [hour, minute] = time.split(":").map(Number)
    const slotTime = new Date(selectedDate)
    slotTime.setHours(hour, minute, 0, 0)

    // Check if slot is in the past
    const isPast = isToday && slotTime <= today

    // Random availability (80% chance)
    const isRandomlyAvailable = Math.random() > 0.2

    return {
      id: `${date}-${time}`,
      time: time,
      available: !isPast && isRandomlyAvailable,
      price: "150.000 VND",
      isSelected: false,
      isPast,
    }
  })
}

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
