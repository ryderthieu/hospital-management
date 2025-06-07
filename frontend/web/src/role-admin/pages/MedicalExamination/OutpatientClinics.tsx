import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import SearchInput from "../../components/common/SearchInput";
import ClinicCard, {
  ClinicCardProps,
} from "../../components/sections/clinics/ClinicCard";
import { Link } from "react-router-dom";
import Metric from "../../components/sections/statistics/ClinicMetric";
import { ActiveIcon, ClinicIcon, FullIcon, WarningIcon } from "../../components/assets/icons";
import AddButton from "../../components/ui/button/AddButton";

type Clinic = ClinicCardProps;

const OutpatientClinics: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: "clinic-1",
      name: "Phòng khám Nội tổng hợp",
      location: "Khu A",
      floor: "Tầng 1",
      phone: "028 1234 5678",
      specialties: ["Nội khoa", "Tim mạch", "Hô hấp", "Tiêu hóa"],
      workingHours: "7:30 - 16:30 (Thứ 2 - Thứ 6)",
      headDoctor: "BS.CKII. Nguyễn Văn A",
      capacity: 30,
      currentPatients: 18,
      status: "active",
      waitingTime: 15,
    },
    {
      id: "clinic-2",
      name: "Phòng khám Tim mạch",
      location: "Khu B",
      floor: "Tầng 2",
      phone: "028 8765 4321",
      specialties: ["Tim mạch", "Huyết áp", "Mạch máu"],
      workingHours: "7:30 - 16:30 (Thứ 2 - Thứ 6)",
      headDoctor: "BS.CKI. Trần Thị B",
      capacity: 25,
      currentPatients: 23,
      status: "busy",
      waitingTime: 35,
    },
    {
      id: "clinic-3",
      name: "Phòng khám Tai Mũi Họng",
      location: "Khu C",
      floor: "Tầng 1",
      phone: "028 2468 1357",
      specialties: ["Tai", "Mũi", "Họng", "Thính học"],
      workingHours: "7:30 - 16:30 (Thứ 2 - Thứ 6)",
      headDoctor: "PGS.TS. Lê Văn C",
      capacity: 20,
      currentPatients: 20,
      status: "full",
      nextAvailableTime: "14:30",
    },
    {
      id: "clinic-4",
      name: "Phòng khám Nhi",
      location: "Khu D",
      floor: "Tầng 3",
      phone: "028 1357 2468",
      specialties: ["Nhi tổng quát", "Nhi tim mạch", "Nhi tiêu hóa"],
      workingHours: "7:30 - 16:30 (Thứ 2 - Thứ 6)",
      headDoctor: "BSCKII. Phạm Thị D",
      capacity: 35,
      currentPatients: 12,
      status: "active",
      waitingTime: 10,
    },
    {
      id: "clinic-5",
      name: "Phòng khám Răng Hàm Mặt",
      location: "Khu B",
      floor: "Tầng 1",
      phone: "028 9876 5432",
      specialties: ["Răng", "Hàm mặt", "Thẩm mỹ răng"],
      workingHours: "7:30 - 16:30 (Thứ 2 - Thứ 6)",
      headDoctor: "TS.BS. Hoàng Văn E",
      capacity: 15,
      currentPatients: 0,
      status: "inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Lọc phòng khám theo từ khóa tìm kiếm và trạng thái
  const filteredClinics = clinics.filter((clinic) => {
    const matchSearchTerm =
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedStatus === "") {
      return matchSearchTerm;
    } else {
      return matchSearchTerm && clinic.status === selectedStatus;
    }
  });

  const totalItems = clinics.length;
  const activeClinics = clinics.filter(
    (clinic) => clinic.status === "active"
  ).length;
  const busyClinics = clinics.filter(
    (clinic) => clinic.status === "busy"
  ).length;
  const fullClinics = clinics.filter(
    (clinic) => clinic.status === "full"
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
      setClinics((prevClinics) =>
        prevClinics.map((clinic) => {
          // Chỉ cập nhật các phòng đang hoạt động (active hoặc busy)
          if (clinic.status === "active" || clinic.status === "busy") {
            // Random thay đổi +/- 1 bệnh nhân, nhưng không vượt quá capacity
            const change =
              Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            const newCurrentPatients = Math.max(
              0,
              Math.min(
                (clinic.currentPatients || 0) + change,
                clinic.capacity || 0
              )
            );

            // Cập nhật trạng thái dựa trên số lượng bệnh nhân
            let newStatus = clinic.status;
            if (newCurrentPatients >= (clinic.capacity || 0)) {
              newStatus = "full";
            } else if (newCurrentPatients >= (clinic.capacity || 0) * 0.8) {
              newStatus = "busy";
            } else {
              newStatus = "active";
            }

            // Cập nhật thời gian chờ
            const newWaitingTime =
              newStatus === "full"
                ? undefined
                : Math.floor(
                    (newCurrentPatients / (clinic.capacity || 1)) * 45
                  );

            return {
              ...clinic,
              currentPatients: newCurrentPatients,
              status: newStatus,
              waitingTime: newWaitingTime,
              nextAvailableTime: newStatus === "full" ? "14:30" : undefined,
            };
          }
          return clinic;
        })
      );
    }, 10000); // Cập nhật mỗi 10 giây

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageMeta
        title="Phòng khám | Bệnh viện Đa khoa Trung tâm"
        description="Danh sách phòng khám của bệnh viện"
      />

      {/* Header và Stats */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý phòng khám
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric
            title="Tổng số phòng"
            value={totalItems}
            icon={ClinicIcon}
            bgColor="bg-blue-200/30"
            iconColor="text-blue-900"
          />

          <Metric
            title="Đang hoạt động"
            value={activeClinics}
            icon={ActiveIcon}
            bgColor="bg-green-200/30"
            iconColor="text-green-900"
          />

          <Metric
            title="Đông bệnh nhân"
            value={busyClinics}
            icon={WarningIcon}
            bgColor="bg-yellow-200/30"
            iconColor="text-red-600"
          />

          <Metric
            title="Dã đầy"
            value={fullClinics}
            icon={FullIcon}
            bgColor="bg-red-200/30"
            iconColor="text-red-600"
          />
        </div>
      </div>

      <div className="container mx-auto bg-white border border-gray-200 rounded-xl px-6 py-4 space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Danh sách phòng khám/xét nghiệm
          </h3>
        </div>

        {/* Search và Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <SearchInput
              inputRef={inputRef}
              placeholder="Tìm kiếm theo tên khoa hoặc chuyên ngành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-1/4">
          

            <select
              className="w-full p-2.5 border border-gray-200 shadow-xs rounded-lg focus:outline-none focus:ring-3 focus:ring-base-500/10 focus:border-base-400 appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="busy">Đông bệnh nhân</option>
              <option value="full">Đã đầy</option>
              <option value="inactive">Tạm nghỉ</option>
            </select>
          </div>
        </div>

        {/* Clinic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <ClinicCard key={clinic.id} {...clinic} />
          ))}
        </div>

        {filteredClinics.length === 0 && (
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
              Không tìm thấy phòng khám
            </h3>
            <p className="text-gray-500">
              Không có phòng khám nào phù hợp với từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
        <div className="fixed right-5 bottom-5">
          <Link to="/admin/patients/add"> 
            <AddButton />
          </Link>
        </div>
      </div>
    </>
  );
};

export default OutpatientClinics;
