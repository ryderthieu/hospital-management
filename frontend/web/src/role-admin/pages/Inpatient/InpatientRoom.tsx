import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import SearchInput from "../../components/common/SearchInput";
import InpatientRoomCard from "../../components/sections/inpatients/InpatientRoomCard";
import { Link } from "react-router-dom";
import AddButton from "../../components/ui/button/AddButton";
import type { PatientRoom } from "../../types/patient";
import { patientService } from "../../services/patientService";

const InpatientRooms: React.FC = () => {
  const [rooms, setRooms] = useState<PatientRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAllPatientRooms();
      setRooms(response);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải dữ liệu phòng bệnh. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchSearchTerm =
      room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.note?.toLowerCase().includes(searchTerm.toLowerCase()) ?? "");
    return matchSearchTerm;
  });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <PageMeta
        title="Phòng bệnh | Bệnh viện Đa khoa Trung tâm"
        description="Danh sách phòng bệnh nội trú của bệnh viện"
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quản lý phòng bệnh nội trú
        </h2>
      </div>

      <div className="container mx-auto bg-white border border-gray-200 rounded-xl px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Danh sách phòng bệnh nội trú
          </h3>
          <Link to="/admin/patients/patient-rooms/add">
            <AddButton />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <SearchInput
              inputRef={inputRef}
              placeholder="Tìm kiếm phòng theo số phòng hoặc ghi chú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Room Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <InpatientRoomCard
                key={room.roomId}
                room={room}
                onDeleted={fetchRooms}
              />
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
              Không có phòng bệnh nào phù hợp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default InpatientRooms;
