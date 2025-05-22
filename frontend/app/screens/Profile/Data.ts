import type { User, MenuItem, Insurance, HealthProfile, Setting, Notification } from "../types/type"

// Define the AllergyOption interface locally for this file
interface AllergyOption {
  id: string
  name: string
  selected: boolean
}

// Define the ChronicConditionOption interface locally
interface ChronicConditionOption {
  id: string
  name: string
  selected: boolean
}

// Mock user data
export const mockUser: User = {
  name: "Lê Thiện Nhi",
  email: "ltnh15624@gmail.com",
  avatar: require("../../assets/images/avatars/profile_pic.jpg"),
  phone: "0818923193211",
  dob: "28/04/2004",
  gender: "Nữ",
  patientId: "1092302",
  nationalId: "4328497927592",
  province: "Cà Mau",
  district: "Thới Bình",
  ward: "Hồ Thị Kỷ",
  fullAddress: "Ấp Xóm Sở, Xã Hồ Thị Kỷ, Huyện Thới Bình, Tỉnh Cà Mau",
  emergencyContact: {
    name: "Nguyễn Thị Mai Trinh",
    phone: "0818923193211",
    relationship: "Mẹ ruột",
  },
}

// Mock menu items
export const mockMenuItems: MenuItem[] = [
  {
    id: "account",
    title: "Thông tin tài khoản",
    subtitle: "Thay đổi thông tin tài khoản của bạn",
    icon: "person-outline",
    color: "#4285F4",
    route: "AccountInfo",
  },
  {
    id: "insurance",
    title: "Danh sách bảo hiểm",
    subtitle: "Thêm thông tin bảo hiểm của bạn",
    icon: "card-outline",
    color: "#34A853",
    route: "InsuranceList",
  },
  {
    id: "health",
    title: "Hồ sơ sức khỏe",
    subtitle: "Tình hình sức khỏe của bạn",
    icon: "fitness-outline",
    color: "#FBBC05",
    route: "HealthProfile",
  },
  {
    id: "settings",
    title: "Cài đặt",
    subtitle: "Quản lý và Cài đặt",
    icon: "settings-outline",
    color: "#4285F4",
    route: "Settings",
  },
]

// Mock insurance data
export const mockInsurances: Insurance[] = [
  {
    id: "1",
    name: "Bảo hiểm y tế",
    type: "BHYT",
    provider: "Bảo hiểm Y tế Việt Nam",
    policyNumber: "12039024329030",
    holderName: "Lê Thiện Nhi",
    startDate: "01/01/2024",
    expiryDate: "31/12/2024",
    coverageType: "Toàn diện",
    isActive: true,
    class: "1",
    benefits: [
      "Khám chữa bệnh tại các cơ sở y tế công lập",
      "Chi trả 80% chi phí khám chữa bệnh",
      "Miễn phí khám sức khỏe định kỳ 1 lần/năm",
    ],
  },
  {
    id: "2",
    name: "Bảo hiểm Nhân thọ",
    type: "OTHER",
    provider: "Prudential",
    policyNumber: "PRU987654321",
    holderName: "Lê Thiện Nhi",
    startDate: "15/06/2020",
    expiryDate: "15/06/2030",
    coverageType: "Bảo vệ sức khỏe",
    isActive: true,
    coverageAmount: "500.000.000 VND",
    paymentFrequency: "Hàng quý",
    paymentAmount: "3.000.000 VND",
    lastPaymentDate: "15/03/2024",
    nextPaymentDate: "15/06/2024",
    benefits: [
      "Bảo vệ trước rủi ro tử vong và thương tật toàn bộ vĩnh viễn",
      "Quyền lợi bảo hiểm bệnh hiểm nghèo",
      "Quyền lợi đáo hạn hợp đồng",
    ],
  },
  {
    id: "3",
    name: "Bảo hiểm Tai nạn",
    type: "BHTN",
    provider: "Bảo Việt",
    policyNumber: "BV456789123",
    holderName: "Lê Thiện Nhi",
    startDate: "10/10/2023",
    expiryDate: "10/10/2025",
    coverageType: "Tai nạn cá nhân",
    isActive: false,
    coverageAmount: "200.000.000 VND",
    benefits: [
      "Bồi thường chi phí y tế do tai nạn",
      "Trợ cấp thu nhập trong thời gian điều trị",
      "Bồi thường tử vong do tai nạn",
    ],
  },
]

// Mock health profile data
export const mockHealthProfile: HealthProfile = {
  height: 170,
  weight: 72,
  bloodType: "O+",
  allergies: ["Dị ứng tôm, cua", "Dị ứng các thành phần của thuốc"],
  chronicConditions: ["Viêm mũi dị ứng"],
  medications: [
    {
      id: "1",
      name: "Loratadine",
      dosage: "10mg",
      frequency: "Ngày 1 lần",
      startDate: "15/03/2024",
      isActive: true,
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Ngày 1 lần",
      startDate: "01/01/2024",
      isActive: true,
    },
  ],
  medicalHistory: [
    {
      id: "1",
      title: "Khám sức khỏe tổng quát",
      date: "15/04/2024",
      hospital: "Bệnh viện Đa khoa Trung ương",
      doctor: "PGS.TS Nguyễn Văn Bình",
      description: "Khám sức khỏe định kỳ, các chỉ số trong ngưỡng bình thường",
    },
    {
      id: "2",
      title: "Khám dị ứng",
      date: "02/03/2024",
      hospital: "Bệnh viện Da liễu",
      doctor: "BS. Lê Thị Hương",
      description: "Xác định dị ứng với hải sản và một số loại thuốc",
    },
  ],
}

// Mock allergy options
export const mockAllergyOptions: AllergyOption[] = [
  { id: "1", name: "Account Manager", selected: false },
  { id: "2", name: "Dị ứng tôm, cua", selected: true },
  { id: "3", name: "Dị ứng các thành phần của thuốc", selected: true },
  { id: "4", name: "Financial Advisor", selected: false },
  { id: "5", name: "Account Executive", selected: false },
  { id: "6", name: "Data Analyst", selected: false },
  { id: "7", name: "Insurance Underwriter", selected: false },
  { id: "8", name: "Dị ứng phấn hoa", selected: false },
  { id: "9", name: "Dị ứng bụi nhà", selected: false },
  { id: "10", name: "Dị ứng lông động vật", selected: false },
]

// Mock chronic condition options
export const mockChronicConditionOptions: ChronicConditionOption[] = [
  { id: "1", name: "Viêm mũi dị ứng", selected: true },
  { id: "2", name: "Hen suyễn", selected: false },
  { id: "3", name: "Tiểu đường", selected: false },
  { id: "4", name: "Tăng huyết áp", selected: false },
  { id: "5", name: "Viêm khớp", selected: false },
  { id: "6", name: "Bệnh tim mạch", selected: false },
  { id: "7", name: "Bệnh thận mãn tính", selected: false },
  { id: "8", name: "Viêm gan", selected: false },
  { id: "9", name: "Rối loạn tuyến giáp", selected: false },
  { id: "10", name: "Bệnh phổi tắc nghẽn mãn tính", selected: false },
]

// Mock settings data
export const mockSettings: Setting[] = [
  {
    id: "notifications",
    title: "Thông báo",
    icon: "notifications-outline",
    type: "toggle",
    value: true,
  },
  {
    id: "darkMode",
    title: "Chế độ tối",
    icon: "moon-outline",
    type: "toggle",
    value: false,
  },
  {
    id: "language",
    title: "Ngôn ngữ",
    icon: "language-outline",
    type: "navigation",
  },
  {
    id: "privacy",
    title: "Quyền riêng tư",
    icon: "shield-outline",
    type: "navigation",
  },
  {
    id: "help",
    title: "Trợ giúp & Hỗ trợ",
    icon: "help-circle-outline",
    type: "navigation",
  },
  {
    id: "about",
    title: "Về ứng dụng",
    icon: "information-circle-outline",
    type: "navigation",
  },
  {
    id: "logout",
    title: "Đăng xuất",
    icon: "log-out-outline",
    type: "action",
  },
]

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nhắc lịch khám",
    message: "Bạn có lịch khám với ThS BS. Trần Ngọc Anh Thơ vào ngày mai lúc 8:00 AM.",
    type: "appointment",
    date: "27/04/2024",
    isRead: false,
  },
  {
    id: "2",
    title: "Kết quả xét nghiệm",
    message: "Kết quả xét nghiệm máu của bạn đã có. Vui lòng kiểm tra trong mục Kết quả.",
    type: "result",
    date: "20/04/2024",
    isRead: true,
  },
  {
    id: "3",
    title: "Nhắc uống thuốc",
    message: "Đã đến giờ uống thuốc Loratadine. Vui lòng uống 1 viên sau bữa ăn.",
    type: "medicine",
    date: "19/04/2024",
    isRead: true,
  },
  {
    id: "4",
    title: "Cập nhật hệ thống",
    message: "Ứng dụng đã được cập nhật lên phiên bản mới với nhiều tính năng hữu ích.",
    type: "system",
    date: "15/04/2024",
    isRead: true,
  },
]
