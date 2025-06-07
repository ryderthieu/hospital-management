import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import { ClinicCardProps } from "../../components/sections/clinics/ClinicCard";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  position: string;
  isAvailable: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

const ClinicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clinic, setClinic] = useState<ClinicCardProps | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Demo data for today's appointments
  const todayAppointments = 24;
  const completedAppointments = 15;
  const cancelledAppointments = 2;
  
  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        setLoading(true);
        
        // Demo data - trong thực tế bạn sẽ gọi API
        setTimeout(() => {
          setClinic({
            id: id || "clinic-1",
            name: "Phòng khám Nội tổng hợp",
            location: "Khu A - Bệnh viện Đa khoa Trung tâm",
            floor: "Tầng 1",
            phone: "028 1234 5678",
            specialties: ["Nội khoa", "Tim mạch", "Hô hấp", "Tiêu hóa"],
            workingHours: "7:30 - 16:30 (Thứ 2 - Thứ 6)",
            headDoctor: "BS.CKII. Nguyễn Văn A",
            capacity: 30,
            currentPatients: 18,
            status: "active",
            waitingTime: 15,
          });

          setDoctors([
            {
              id: "doc-1",
              name: "BS.CKII. Nguyễn Văn A",
              specialty: "Nội khoa",
              photo: "/images/user/user-22.jpg",
              position: "Trưởng phòng khám",
              isAvailable: true
            },
            {
              id: "doc-2",
              name: "BS.CKI. Lê Thị Hương",
              specialty: "Tim mạch",
              photo: "/images/user/user-23.jpg",
              position: "Bác sĩ",
              isAvailable: true
            },
            {
              id: "doc-3",
              name: "BS. Trần Minh Tuấn",
              specialty: "Hô hấp",
              photo: "/images/user/user-24.jpg",
              position: "Bác sĩ",
              isAvailable: false
            },
          ]);

          setAppointments([
            {
              id: "app-1",
              patientName: "Nguyễn Văn X",
              patientId: "BN10045",
              time: "09:00",
              status: "completed"
            },
            {
              id: "app-2",
              patientName: "Trần Thị Y",
              patientId: "BN10046",
              time: "09:30",
              status: "completed"
            },
            {
              id: "app-3",
              patientName: "Lê Văn Z",
              patientId: "BN10047",
              time: "10:00",
              status: "in-progress"
            },
            {
              id: "app-4",
              patientName: "Phạm Thị K",
              patientId: "BN10048",
              time: "10:30",
              status: "scheduled"
            },
            {
              id: "app-5",
              patientName: "Hoàng Văn M",
              patientId: "BN10049",
              time: "11:00",
              status: "scheduled"
            }
          ]);

          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng khám:", error);
        setLoading(false);
      }
    };

    fetchClinicData();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <span className="px-2 py-1 text-xs font-medium bg-base-100 text-base-800 rounded-full">Chờ khám</span>;
      case "in-progress":
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Đang khám</span>;
      case "completed":
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Hoàn thành</span>;
      case "cancelled":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Đã hủy</span>;
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

  if (!clinic) {
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
          Không tìm thấy thông tin phòng khám
        </h3>
        <p className="text-gray-500 mb-6">
          Phòng khám bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
        </p>
        <button
          onClick={() => navigate("/admin/examination/clinics")}
          className="inline-flex items-center px-4 py-2 bg-base-600 text-white font-medium rounded-lg hover:bg-base-700"
        >
          Quay lại danh sách phòng khám
        </button>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (clinic.status) {
      case 'active':
        return {
          label: 'Đang hoạt động',
          colorClass: 'bg-green-100 text-green-800',
          indicatorClass: 'bg-green-500',
        };
      case 'busy':
        return {
          label: 'Đông bệnh nhân',
          colorClass: 'bg-yellow-100 text-yellow-800',
          indicatorClass: 'bg-yellow-500',
        };
      case 'full':
        return {
          label: 'Đã đầy',
          colorClass: 'bg-red-100 text-red-800',
          indicatorClass: 'bg-red-500',
        };
      case 'inactive':
        return {
          label: 'Tạm nghỉ',
          colorClass: 'bg-gray-100 text-gray-800',
          indicatorClass: 'bg-gray-500',
        };
      default:
        return {
          label: 'Đang hoạt động',
          colorClass: 'bg-green-100 text-green-800',
          indicatorClass: 'bg-green-500',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const occupancyPercentage = clinic.capacity && clinic.currentPatients 
    ? Math.min(Math.round((clinic.currentPatients / clinic.capacity) * 100), 100) 
    : 0;

  return (
    <>
      <PageMeta
        title={`${clinic.name} | Bệnh viện Đa khoa Trung tâm`}
        description={`Thông tin chi tiết về ${clinic.name}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800">{clinic.name}</h1>
                <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.colorClass}`}>
                  <span className={`w-2 h-2 ${statusInfo.indicatorClass} rounded-full mr-1.5 flex-shrink-0`}></span>
                  {statusInfo.label}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/examination/clinics/${clinic.id}/edit`)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Sửa
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic info */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <span className="block text-sm text-gray-800 font-medium">Vị trí</span>
                    <span className="text-sm text-gray-600">
                      {clinic.location}, {clinic.floor}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <span className="block text-sm text-gray-800 font-medium">Số điện thoại</span>
                    <span className="text-sm text-gray-600">{clinic.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="block text-sm text-gray-800 font-medium">Giờ làm việc</span>
                    <span className="text-sm text-gray-600">{clinic.workingHours}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <span className="block text-sm text-gray-800 font-medium">Bác sĩ phụ trách</span>
                    <span className="text-sm text-gray-600">{clinic.headDoctor}</span>
                  </div>
                </div>
              </div>

              {/* Capacity and stats */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Sức chứa và tình trạng</h3>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Số bệnh nhân hiện tại</span>
                    <span className="text-sm text-gray-800 font-medium">
                      {clinic.currentPatients}/{clinic.capacity} ({occupancyPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        occupancyPercentage >= 90 ? 'bg-red-600' : 
                        occupancyPercentage >= 70 ? 'bg-yellow-400' : 'bg-green-500'
                      }`} 
                      style={{ width: `${occupancyPercentage}%` }}></div>
                  </div>
                </div>

                {clinic.waitingTime !== undefined && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="block text-sm text-gray-800 font-medium">Thời gian chờ ước tính</span>
                      <span className="text-sm text-gray-600">{clinic.waitingTime} phút</span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Chuyên khoa</h3>
                  <div className="flex flex-wrap gap-2">
                    {clinic.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-base-50 text-base-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê hôm nay</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tổng số lịch hẹn</span>
                <span className="text-2xl font-semibold text-gray-800">{todayAppointments}</span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Đã hoàn thành</span>
                <span className="text-2xl font-semibold text-green-700">{completedAppointments}</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">Đang chờ</span>
                <span className="text-2xl font-semibold text-yellow-700">
                  {todayAppointments - completedAppointments - cancelledAppointments}
                </span>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">Đã hủy</span>
                <span className="text-2xl font-semibold text-red-700">{cancelledAppointments}</span>
              </div>
            </div>
            
            <Link
              to={`/admin/examination/clinics/${clinic.id}/appointments`}
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-base-600 hover:bg-base-700"
            >
              Xem tất cả lịch hẹn
            </Link>
          </div>
        </div>
      </div>

      {/* Doctors Section */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Đội ngũ y bác sĩ</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => (
              <div key={doctor.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 flex items-center">
                  <img 
                    src={doctor.photo} 
                    alt={doctor.name} 
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{doctor.name}</h3>
                    <p className="text-xs text-gray-500">{doctor.position}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-base-100 text-base-800">
                        {doctor.specialty}
                      </span>
                    </div>
                    <div className="mt-1">
                      {doctor.isAvailable ? (
                        <span className="inline-flex items-center text-xs text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 flex-shrink-0"></span>
                          Đang làm việc
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5 flex-shrink-0"></span>
                          Không có mặt
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Lịch hẹn hôm nay</h2>
            <Link
              to={`/admin/examination/clinics/${clinic.id}/appointments`}
              className="text-base-600 hover:text-base-800 text-sm font-medium"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã BN
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên bệnh nhân
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {appointment.patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {appointment.patientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link 
                      to={`/admin/examination/appointments/${appointment.id}`}
                      className="text-base-600 hover:text-base-800"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ClinicDetail;