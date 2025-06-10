import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import SearchInput from "../../components/common/SearchInput";
import ClinicCard from "../../components/sections/clinics/ClinicCard";
import { Link } from "react-router-dom";
import Metric from "../../components/sections/statistics/ClinicMetric";
import { ClinicIcon } from "../../components/assets/icons";
import AddButton from "../../components/ui/button/AddButton";
import { doctorService } from "../../services/doctorService";
import { ExaminationRoom } from "../../types/doctor";

const OutpatientClinics: React.FC = () => {
  const [clinics, setClinics] = useState<ExaminationRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Lấy danh sách phòng khám từ API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await doctorService.getAllExaminationRooms();
        setClinics(data);
      } catch (error) {
        setClinics([]);
      }
    };
    fetchRooms();
  }, []);

  // Lọc phòng khám theo từ khóa tìm kiếm
  const filteredClinics = clinics.filter((clinic) => {
    const matchSearchTerm =
      clinic.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.building?.toLowerCase().includes(searchTerm.toLowerCase());

    // Nếu có filter trạng thái (nếu bạn có trường status)
    if (selectedStatus === "") {
      return matchSearchTerm;
    } else {
      // Nếu ExaminationRoom có trường status thì lọc, không thì bỏ dòng này
      return matchSearchTerm && clinic.type === selectedStatus;
    }
  });

  // Thống kê (nếu cần)
  const totalItems = clinics.length;

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

  return (
    <>
      <PageMeta
        title="Phòng khám | Bệnh viện Đa khoa Trung tâm"
        description="Danh sách phòng khám của bệnh viện"
      />

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
        </div>
      </div>

      <div className="container mx-auto bg-white border border-gray-200 rounded-xl px-6 py-4 space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Danh sách phòng khám/xét nghiệm
          </h3>
        </div>

        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <SearchInput
              inputRef={inputRef}
              placeholder="Tìm kiếm theo ghi chú hoặc tòa nhà..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Clinic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <ClinicCard key={clinic.roomId} clinic={clinic} />
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
          <Link to="/admin/outpatient-clinics/add">
            <AddButton />
          </Link>
        </div>
      </div>
    </>
  );
};

export default OutpatientClinics;
