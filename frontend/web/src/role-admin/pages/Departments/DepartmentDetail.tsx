import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import ReturnButton from "../../components/ui/button/ReturnButton";
import { departmentService } from "../../../services/departmentService";

interface Doctor {
  doctorId: number;
  fullName: string;
  academicDegree: string;
  specialty?: string;
  avatar?: string;
  isAvailable?: boolean;
  departmentId?: number;
}

interface Equipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  purchaseYear: number;
  status: 'operational' | 'maintenance' | 'out-of-order';
}

interface DepartmentRoom {
  roomId: number;
  roomName: string;
  departmentId: number;
  capacity: number;
  isAvailable: boolean;
  equipment?: string;
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  insurance_covered: boolean;
}

interface DepartmentStats {
  totalPatients: number;
  todayPatients: number;
  occupancyRate: number;
  averageStay: number;
}

interface Department {
  departmentId: number;
  departmentName: string;
  description?: string;
  location?: string;
  headDoctorName?: string;
  headDoctorImage?: string;
  staffCount: number;
  foundedYear?: number;
  phoneNumber?: string;
  email?: string;
  staffImages?: string[];
  examinationRoomDtos?: DepartmentRoom[];
}

const DepartmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [department, setDepartment] = useState<Department | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rooms, setRooms] = useState<DepartmentRoom[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<DepartmentStats>({
    totalPatients: 0,
    todayPatients: 0,
    occupancyRate: 0,
    averageStay: 0
  });

  // Helper function to extract numeric ID from formatted ID
  const extractDepartmentId = (formattedId: string): number => {
    // Extract numeric part from "KH2025-003" format
    const match = formattedId.match(/\d+$/);
    return match ? parseInt(match[0]) : parseInt(formattedId);
  };

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError("ID khoa không hợp lệ");
          return;
        }

        const numericId = extractDepartmentId(id);
        
        // Fetch department details
        const departmentData = await departmentService.getDepartmentById(numericId);
        setDepartment(departmentData);

        // Fetch doctors for this department
        try {
          const doctorsData = await departmentService.getDoctorsByDepartmentId(numericId);
          setDoctors(doctorsData as Doctor[]);
        } catch (docError) {
          console.error("Error fetching doctors:", docError);
          setDoctors([]);
        }

        // For now, set demo data for equipment, rooms, and services
        // These can be replaced with actual API calls when available
        setEquipment([
          {
            id: "TB-001",
            name: "Máy xét nghiệm sinh hóa tự động",
            model: "Cobas c501",
            manufacturer: "Roche Diagnostics",
            purchaseYear: 2023,
            status: 'operational'
          },
          {
            id: "TB-002",
            name: "Máy xét nghiệm huyết học",
            model: "Sysmex XN-1000",
            manufacturer: "Sysmex Corporation",
            purchaseYear: 2022,
            status: 'operational'
          },
        ]);

        setRooms(departmentData.examinationRoomDtos || []);

        setServices([
          {
            id: "DV-001",
            name: "Khám tổng quát",
            duration: "30 phút",
            price: "200.000 đ",
            insurance_covered: true
          },
          {
            id: "DV-002",
            name: "Tư vấn chuyên môn",
            duration: "45 phút",
            price: "300.000 đ",
            insurance_covered: true
          },
        ]);

        setStats({
          totalPatients: 1250,
          todayPatients: 24,
          occupancyRate: 75,
          averageStay: 2.5
        });

      } catch (err) {
        console.error("Error fetching department data:", err);
        setError("Không thể tải thông tin khoa. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Hoạt động tốt</span>;
      case "maintenance":
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Đang bảo trì</span>;
      case "out-of-order":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Ngưng hoạt động</span>;
      case "available":
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Còn chỗ</span>;
      case "full":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Đã đầy</span>;
      default:
        return null;
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-base-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="text-lg font-medium text-red-700 mb-2">
          Có lỗi xảy ra
        </h3>
        <p className="text-red-500 mb-6">
          {error}
        </p>
        <button
          onClick={() => navigate("/admin/departments")}
          className="inline-flex items-center px-4 py-2 bg-base-600 text-white font-medium rounded-lg hover:bg-base-700"
        >
          Quay lại danh sách khoa
        </button>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M5.8 21H18.2a2 2 0 002-2V5a2 2 0 00-2-2H5.8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Không tìm thấy thông tin khoa
        </h3>
        <p className="text-gray-500 mb-6">
          Khoa bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
        </p>
        <button
          onClick={() => navigate("/admin/departments")}
          className="inline-flex items-center px-4 py-2 bg-base-600 text-white font-medium rounded-lg hover:bg-base-700"
        >
          Quay lại danh sách khoa
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Thông tin cơ bản */}
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin chung</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Trưởng khoa:</span>
                    <span>{department.headDoctorName || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Số nhân viên:</span>
                    <span>{department.staffCount} người</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Vị trí:</span>
                    <span>{department.location || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Thành lập:</span>
                    <span>Năm {department.foundedYear || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Số điện thoại:</span>
                    <span>{department.phoneNumber || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Email:</span>
                    <span>{department.email || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>

              {/* Thống kê */}
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thống kê hoạt động</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tổng số bệnh nhân</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.totalPatients}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Bệnh nhân hôm nay</p>
                    <p className="text-2xl font-bold text-green-700">{stats.todayPatients}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tỷ lệ lấp đầy</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.occupancyRate}%</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Số lượng dịch vụ</p>
                    <p className="text-2xl font-bold text-amber-700">{services.length}</p>
                  </div>
                </div>
              </div>
            </div>            {/* Mô tả khoa */}
            <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Mô tả</h3>
              <p className="text-gray-600">{department.description || "Chưa có mô tả cho khoa này."}</p>
            </div>

            {/* Nhân sự nổi bật */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Nhân sự nổi bật</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {doctors.slice(0, 4).map(doctor => (
                  <div key={doctor.doctorId} className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">                    <img 
                      src={doctor.avatar || "/images/user/owner.jpg"} 
                      alt={doctor.fullName} 
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/user/owner.jpg";
                      }}
                    />
                    <h4 className="font-medium text-gray-800 mt-2">{doctor.fullName}</h4>
                    <p className="text-sm text-gray-500">{doctor.academicDegree}</p>
                    <p className="text-xs text-gray-500 mt-1">{doctor.specialty || "Chưa cập nhật"}</p>
                    <span className={`mt-2 px-2 py-0.5 text-xs rounded-full ${doctor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {doctor.isAvailable ? 'Có mặt' : 'Vắng mặt'}
                    </span>
                  </div>
                ))}
                {doctors.length === 0 && (
                  <div className="col-span-4 text-center text-gray-500 py-8">
                    Chưa có thông tin nhân sự
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'doctors':
        return (
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách nhân sự ({doctors.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên môn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.doctorId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={doctor.avatar || "/images/user/owner.jpg"} 
                              alt={doctor.fullName}
                              onError={(e) => {
                                e.currentTarget.src = "/images/user/owner.jpg";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                            <div className="text-sm text-gray-500">{doctor.academicDegree}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.specialty || "Chưa cập nhật"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.academicDegree}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {doctor.isAvailable ? 'Có mặt' : 'Vắng mặt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Xem lịch</button>
                          <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>                        </div>
                      </td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Chưa có thông tin bác sĩ trong khoa này
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'equipment':
        return (
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Trang thiết bị ({equipment.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên thiết bị</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà sản xuất</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm mua</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipment.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.manufacturer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.purchaseYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'rooms':
        return (
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách phòng ({rooms.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên phòng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại phòng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công suất</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.roomId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{room.roomName}</div>
                        <div className="text-xs text-gray-500">ID: {room.roomId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Phòng khám
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Khoa {department.departmentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {room.capacity} người
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {room.isAvailable ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Còn chỗ</span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Đã đầy</span>
                        )}
                      </td>                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Chưa có thông tin phòng trong khoa này
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Dịch vụ y tế ({services.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã dịch vụ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BHYT</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.insurance_covered ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Được bảo hiểm</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Không bảo hiểm</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>      <PageMeta
        title={`${department.departmentName} | Bệnh viện Đa khoa Trung tâm`}
        description={`Thông tin chi tiết về ${department.departmentName}`}
      />

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <ReturnButton />
          <h2 className="text-xl font-semibold">Chi tiết khoa: {department.departmentName}</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <ul className="flex flex-wrap -mb-px border-b border-gray-200">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`inline-block py-3 px-4 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-base-600 text-base-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tổng quan
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`inline-block py-3 px-4 text-sm font-medium ${
                  activeTab === 'doctors'
                    ? 'border-b-2 border-base-600 text-base-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bác sĩ & Nhân viên
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('equipment')}
                className={`inline-block py-3 px-4 text-sm font-medium ${
                  activeTab === 'equipment'
                    ? 'border-b-2 border-base-600 text-base-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Trang thiết bị
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('rooms')}
                className={`inline-block py-3 px-4 text-sm font-medium ${
                  activeTab === 'rooms'
                    ? 'border-b-2 border-base-600 text-base-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Phòng
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('services')}
                className={`inline-block py-3 px-4 text-sm font-medium ${
                  activeTab === 'services'
                    ? 'border-b-2 border-base-600 text-base-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dịch vụ
              </button>
            </li>
          </ul>
        </div>

        {renderTabContent()}
      </div>
    </>
  );
};

export default DepartmentDetail;