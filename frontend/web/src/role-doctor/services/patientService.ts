import type { Patient } from "../types/patient"

export const fetchPatients = async (): Promise<Patient[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 1,
      name: "Trần Nhật Trường",
      code: "BN22521396",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 21,
      symptom: "Dị ứng",
      status: "Hoàn thành",
      avatar:
        "https://scontent.fsgn22-1.fna.fbcdn.net/v/t39.30808-6/480404053_1006984517940842_142074701260698715_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=r8rFep9IuVYQ7kNvwFjfPpD&_nc_oc=AdkP83gkVNhfVbpKu0-ljcL3QabSF50PJuixSDMIpPOm3ESya0fA9UYxmWi_SYmCoG8iGbQARjWtLuDjIB85epDh&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=2dC9L86bhn3ZNTzRC62APA&oh=00_AfElIn5o44i9rmvFVSmKCtw9BOAVH0AMFy9txWtVa1elOg&oe=6817C0E8",
    },
    {
      id: 2,
      name: "Huỳnh Văn Thiệu",
      code: "BN22521396",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 21,
      symptom: "Mắt mờ",
      status: "Hoàn thành",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Trần Ngọc Ánh Thơ",
      code: "BN22521396",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Trầm cảm",
      status: "Hoàn thành",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 4,
      name: "Lê Thiện Nhi",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Thêm yếu",
      status: "Xét nghiệm",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 5,
      name: "Trần Đỗ Phương Nhi",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Tăng huyết áp",
      status: "Đang chờ",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ]
}
