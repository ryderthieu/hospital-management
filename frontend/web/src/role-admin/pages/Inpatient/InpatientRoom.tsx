import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import SearchInput from "../../components/common/SearchInput";
import InpatientRoomCard, { InpatientRoomCardProps} from "../../components/sections/inpatients/InpatientRoomCard";
import { Link } from "react-router-dom";
import Metric from "../../components/sections/statistics/ClinicMetric";
import { ActiveIcon, ClinicIcon, FullIcon, WarningIcon } from "../../components/assets/icons";
import AddButton from "../../components/ui/button/AddButton";

type Room = InpatientRoomCardProps;

const InpatientRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "room-101",
      number: "101",
      department: "Nội tổng hợp",
      building: "Tòa nhà A",
      floor: "Tầng 1",
      type: "standard",
      capacity: 4,
      currentPatients: 3,
      hasNurseCall: true,
      status: "available",
      lastCleaned: "15/05/2025 08:30",
      equipmentStatus: "operational",
      patients: [
        {
          id: "BN100423",
          name: "Nguyễn Văn A",
          age: 45,
          gender: "male",
          diagnosis: "Viêm phổi",
          doctor: "BS. Trần Thành Công",
          admissionDate: "10/05/2025",
          expectedDischargeDate: "20/05/2025",
          severity: "normal"
        },
        {
          id: "BN100425",
          name: "Trần Thị B",
          age: 67,
          gender: "female",
          diagnosis: "Suy tim",
          doctor: "BS. Nguyễn Thu Hà",
          admissionDate: "12/05/2025",
          severity: "observation"
        },
        {
          id: "BN100431",
          name: "Lê Văn C",
          age: 52,
          gender: "male",
          diagnosis: "Đau thắt ngực",
          doctor: "BS. Trần Thành Công",
          admissionDate: "14/05/2025",
          severity: "normal"
        }
      ]
    },
    {
      id: "room-102",
      number: "102",
      department: "Nội tổng hợp",
      building: "Tòa nhà A",
      floor: "Tầng 1",
      type: "standard",
      capacity: 4,
      currentPatients: 4,
      hasNurseCall: true,
      status: "full",
      lastCleaned: "15/05/2025 09:15",
      equipmentStatus: "operational",
      patients: [
        {
          id: "BN100442",
          name: "Phạm Thị D",
          age: 72,
          gender: "female",
          diagnosis: "Phổi tắc nghẽn mãn tính",
          doctor: "BS. Lê Minh Đức",
          admissionDate: "08/05/2025",
          severity: "critical"
        },
        {
          id: "BN100445",
          name: "Hoàng Văn E",
          age: 56,
          gender: "male",
          diagnosis: "Tiểu đường type 2",
          doctor: "BS. Nguyễn Thu Hà",
          admissionDate: "09/05/2025",
          severity: "normal"
        },
        {
          id: "BN100448",
          name: "Ngô Thị F",
          age: 61,
          gender: "female",
          diagnosis: "Cao huyết áp",
          doctor: "BS. Trần Thành Công",
          admissionDate: "10/05/2025",
          severity: "normal"
        },
        {
          id: "BN100451",
          name: "Vũ Văn G",
          age: 49,
          gender: "male",
          diagnosis: "Viêm gan B",
          doctor: "BS. Lê Minh Đức",
          admissionDate: "11/05/2025",
          severity: "observation"
        }
      ]
    },
    {
      id: "room-201",
      number: "201",
      department: "Tim mạch",
      building: "Tòa nhà B",
      floor: "Tầng 2",
      type: "vip",
      capacity: 2,
      currentPatients: 1,
      hasNurseCall: true,
      status: "available",
      lastCleaned: "15/05/2025 10:00",
      equipmentStatus: "operational",
      patients: [
        {
          id: "BN100462",
          name: "Đinh Thị H",
          age: 65,
          gender: "female",
          diagnosis: "Nhồi máu cơ tim",
          doctor: "BS. Phạm Văn Khoa",
          admissionDate: "13/05/2025",
          severity: "observation"
        }
      ]
    },
    {
      id: "room-301",
      number: "301",
      department: "Hồi sức tích cực",
      building: "Tòa nhà C",
      floor: "Tầng 3",
      type: "icu",
      capacity: 6,
      currentPatients: 5,
      hasNurseCall: true,
      status: "available",
      lastCleaned: "15/05/2025 07:45",
      equipmentStatus: "operational",
      patients: [
        {
          id: "BN100471",
          name: "Trần Văn I",
          age: 70,
          gender: "male",
          diagnosis: "Suy đa cơ quan",
          doctor: "BS. Nguyễn Anh Tuấn",
          admissionDate: "09/05/2025",
          severity: "critical"
        },
        {
          id: "BN100474",
          name: "Lê Thị K",
          age: 58,
          gender: "female",
          diagnosis: "Sốc nhiễm trùng",
          doctor: "BS. Trần Minh Hưng",
          admissionDate: "10/05/2025",
          severity: "critical"
        },
        {
          id: "BN100479",
          name: "Nguyễn Văn L",
          age: 63,
          gender: "male",
          diagnosis: "Suy hô hấp cấp",
          doctor: "BS. Nguyễn Anh Tuấn",
          admissionDate: "12/05/2025",
          severity: "critical"
        },
        {
          id: "BN100483",
          name: "Phạm Thị M",
          age: 55,
          gender: "female",
          diagnosis: "Đột quỵ",
          doctor: "BS. Lê Hoàng Nam",
          admissionDate: "14/05/2025",
          severity: "critical"
        },
        {
          id: "BN100487",
          name: "Võ Văn N",
          age: 67,
          gender: "male",
          diagnosis: "Nhồi máu cơ tim cấp",
          doctor: "BS. Trần Minh Hưng",
          admissionDate: "15/05/2025",
          severity: "critical"
        }
      ]
    },
    {
      id: "room-401",
      number: "401",
      department: "Truyền nhiễm",
      building: "Tòa nhà D",
      floor: "Tầng 4",
      type: "isolation",
      capacity: 1,
      currentPatients: 1,
      hasNurseCall: true,
      status: "full",
      lastCleaned: "15/05/2025 11:30",
      equipmentStatus: "operational",
      patients: [
        {
          id: "BN100491",
          name: "Hoàng Văn P",
          age: 42,
          gender: "male",
          diagnosis: "Lao phổi kháng thuốc",
          doctor: "BS. Trần Thị Mai",
          admissionDate: "10/05/2025",
          severity: "observation"
        }
      ]
    },
    {
      id: "room-402",
      number: "402",
      department: "Truyền nhiễm",
      building: "Tòa nhà D",
      floor: "Tầng 4",
      type: "isolation",
      capacity: 1,
      currentPatients: 0,
      hasNurseCall: true,
      status: "maintenance",
      lastCleaned: "14/05/2025 14:00",
      equipmentStatus: "needs-maintenance",
      patients: []
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  // Fetch data from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        // Uncomment the below code when connecting to actual API
        // const response = await axios.get('/api/inpatient-rooms');
        // setRooms(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Không thể tải dữ liệu phòng bệnh. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    // Uncomment to fetch data from API
    // fetchRooms();
  }, []);

  // Lọc phòng theo từ khóa tìm kiếm, trạng thái và loại phòng
  const filteredRooms = rooms.filter((room) => {
    const matchSearchTerm =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = selectedStatus === "" || room.status === selectedStatus;
    const matchType = selectedType === "" || room.type === selectedType;

    return matchSearchTerm && matchStatus && matchType;
  });

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(
    (room) => room.status === "available"
  ).length;
  const fullRooms = rooms.filter(
    (room) => room.status === "full"
  ).length;
  const maintenanceRooms = rooms.filter(
    (room) => room.status === "maintenance"
  ).length;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Giả lập dữ liệu thời gian thực
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          // Chỉ cập nhật các phòng đang available
          if (room.status === "available") {
            // Random thay đổi +/- 1 bệnh nhân, nhưng không vượt quá capacity
            const change =
              Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const newCurrentPatients = Math.max(
              0,
              Math.min(
                room.currentPatients + change,
                room.capacity
              )
            );

            // Cập nhật trạng thái dựa trên số lượng bệnh nhân
            let newStatus = room.status;
            if (newCurrentPatients >= room.capacity) {
              newStatus = "full";
            }

            return {
              ...room,
              currentPatients: newCurrentPatients,
              status: newStatus as 'available' | 'full' | 'maintenance' | 'reserved',
            };
          }
          return room;
        })
      );
    }, 15000); // Cập nhật mỗi 15 giây

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageMeta
        title="Phòng bệnh | Bệnh viện Đa khoa Trung tâm"
        description="Danh sách phòng bệnh nội trú của bệnh viện"
      />

      {/* Header và Stats */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý phòng bệnh nội trú
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric
            title="Tổng số phòng"
            value={totalRooms}
            icon={ClinicIcon}
            bgColor="bg-blue-200/30"
            iconColor="text-blue-900"
          />

          <Metric
            title="Còn chỗ"
            value={availableRooms}
            icon={ActiveIcon}
            bgColor="bg-green-200/30"
            iconColor="text-green-900"
          />

          <Metric
            title="Đã đầy"
            value={fullRooms}
            icon={FullIcon}
            bgColor="bg-red-200/30"
            iconColor="text-red-600"
          />

          <Metric
            title="Đang bảo trì"
            value={maintenanceRooms}
            icon={WarningIcon}
            bgColor="bg-yellow-200/30"
            iconColor="text-yellow-600"
          />
        </div>
      </div>

      <div className="container mx-auto bg-white border border-gray-200 rounded-xl px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Danh sách phòng bệnh nội trú
          </h3>
          <Link to="/admin/patient-rooms/add">
            <AddButton label="Thêm phòng bệnh" />
          </Link>
        </div>

        {/* Search và Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <SearchInput
              inputRef={inputRef}
              placeholder="Tìm kiếm phòng theo số phòng, khoa, tòa nhà..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-1/4">
            <select
              className="w-full p-2.5 border border-gray-200 shadow-xs rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/10 focus:border-blue-400 appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="available">Còn chỗ</option>
              <option value="full">Đã đầy</option>
              <option value="maintenance">Đang bảo trì</option>
              <option value="reserved">Đã đặt trước</option>
            </select>
          </div>
          <div className="md:w-1/4">
            <select
              className="w-full p-2.5 border border-gray-200 shadow-xs rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/10 focus:border-blue-400 appearance-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Tất cả loại phòng</option>
              <option value="standard">Tiêu chuẩn</option>
              <option value="vip">VIP</option>
              <option value="icu">ICU</option>
              <option value="isolation">Cách ly</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Room Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <InpatientRoomCard key={room.id} {...room} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredRooms.length === 0 && (
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
              Không tìm thấy phòng bệnh
            </h3>
            <p className="text-gray-500">
              Không có phòng bệnh nào phù hợp với từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}

        {/* Pagination - if needed */}
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200">
              Trước
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600">
              1
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200">
              Sau
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default InpatientRooms;