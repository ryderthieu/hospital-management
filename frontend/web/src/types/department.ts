export interface Department {
  id: string;
  name: string;
  head: string;
  team: {
    images: string[];
  };
  location: string;
  staffCount: number;
  description: string;
  foundedYear: number;
}

export interface DepartmentFromAPI {
  departmentId: number;
  departmentName: string;
  description: string;
  location: string;
  head: string;
  createdAt: string;
  examinationRoomDtos?: ExaminationRoom[];
}

export interface ExaminationRoom {
  roomId: number;
  roomName: string;
  departmentId: number;
  capacity: number;
  isAvailable: boolean;
  equipment?: string;
  createdAt: string;
}

// Helper function to transform API data to frontend format
export const transformDepartmentData = (apiDepartment: DepartmentFromAPI): Department => {
  return {
    id: `KH2025-${String(apiDepartment.departmentId).padStart(3, '0')}`,
    name: apiDepartment.departmentName,
    head: apiDepartment.head || "BS. Chưa cập nhật",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg", 
        "/images/user/user-24.jpg",
      ],
    },
    location: apiDepartment.location || "Chưa cập nhật vị trí",
    staffCount: Math.floor(Math.random() * 20) + 8, // Random staff count between 8-27
    description: apiDepartment.description || "Chưa có mô tả",
    foundedYear: new Date(apiDepartment.createdAt).getFullYear() || 2020,
  };
};