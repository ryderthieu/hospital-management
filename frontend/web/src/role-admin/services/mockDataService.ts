export interface Department {
  id: string;
  name: string;
}
export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
}

// Dữ liệu mẫu cho các khoa
export const departments: Department[] = [
  { id: "dept-1", name: "Khoa Nội" },
  { id: "dept-2", name: "Khoa Ngoại" },
  { id: "dept-3", name: "Khoa Tim mạch" },
  { id: "dept-4", name: "Khoa Sản" },
  { id: "dept-5", name: "Khoa Nhi" },
  { id: "dept-6", name: "Khoa Cơ Xương Khớp" },
  { id: "dept-7", name: "Khoa Tiêu hóa" },
  { id: "dept-8", name: "Khoa Thần kinh" },
];

// Dữ liệu mẫu cho các bác sĩ
export const doctors: Doctor[] = [
  { id: "doc-1", name: "Phạm Văn Minh", departmentId: "dept-1" },
  { id: "doc-2", name: "Nguyễn Minh Hải", departmentId: "dept-1" },
  { id: "doc-3", name: "Đỗ Thành Nam", departmentId: "dept-3" },
  { id: "doc-4", name: "Trương Thị Mỹ Hoa", departmentId: "dept-7" },
  { id: "doc-5", name: "Lưu Ly", departmentId: "dept-4" },
  { id: "doc-6", name: "Lâm Tâm Như", departmentId: "dept-6" },
  { id: "doc-7", name: "Hoắc Kiến Hoa", departmentId: "dept-5" },
  { id: "doc-8", name: "Châu Tấn", departmentId: "dept-2" },
  { id: "doc-9", name: "Phạm Băng Băng", departmentId: "dept-8" },
  { id: "doc-10", name: "Đàm Vĩnh Hưng", departmentId: "dept-3" },
];

// Service API giả lập
export const mockDataService = {
  // Lấy danh sách khoa
  getDepartments: async (): Promise<Department[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(departments), 300);
    });
  },

  // Lấy danh sách bác sĩ theo khoa
  getDoctorsByDepartment: async (departmentId: string): Promise<Doctor[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredDoctors = doctors.filter(
          (doctor) => doctor.departmentId === departmentId
        );
        resolve(filteredDoctors);
      }, 300);
    });
  },
};