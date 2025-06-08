import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { patientService } from "../../../../services/patientService";
import { Patient } from "../../../../types/patient";
import SearchInput from "../../common/SearchInput";
import DatePicker from "../appointments/DatePicker";
import Badge from "../../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { DeleteConfirmationModal } from "../../ui/modal/DeleteConfirmationModal";

export default function PatientTable() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    patientService
      .getAllPatients()
      .then((data) => setPatients(data))
      .catch((err) => {
        console.error("API error:", err);
        setPatients([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleView = (patientId: Number) => {
    navigate(`/admin/patients/${patientId}`);
  };

  const handleDelete = (patientId: Number) => {
    setPatientToDelete(patientId.toString());
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    patientService
      .deletePatient(patientToDelete!)
      .then(() => {
        setPatients((prev) =>
          prev.filter(
            (patient) => patient.patientId.toString() !== patientToDelete
          )
        );
      })
      .catch((err) => {
        console.error("Error deleting patient:", err);
      })
      .finally(() => {
        setModalOpen(false);
        setPatientToDelete(null);
      });
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] px-3">
      <div className="flex justify-start items-center px-5 pt-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Danh sách bệnh nhân
        </h2>
        <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">
          50.0000 bệnh nhân
        </span>
      </div>
      <div className="flex justify-center items-center p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          {/* Search Bar */}
          <SearchInput inputRef={inputRef} placeholder="Tìm kiếm..." />

          {/* Dropdown for Sorting */}
          <div className="relative">
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
              </svg>
            </div>
          </div>

          {/* Dropdown for Gender */}
          <div>
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
              <option value="all">Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          {/* Date Range Picker */}
          <div>
            <DatePicker
              id="date-picker"
              placeholder="Từ ngày"
              onChange={(dates, currentDateString) => {
                console.log({ dates, currentDateString });
              }}
            />
          </div>

          <div>
            <DatePicker
              id="date-picker"
              placeholder="Đến ngày"
              onChange={(dates, currentDateString) => {
                console.log({ dates, currentDateString });
              }}
            />
          </div>
        </div>

        {/* Filter Button */}
        <div className="">
          <button className="h-11 w-20 rounded-lg ml-2 bg-base-700 text-white text-sm font-medium shadow-theme-xs hover:bg-base-600 focus:outline-hidden focus:ring-3 focus:ring-base-600/50">
            Lọc
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-3 font-medium text-slate-500 text-start text-theme-sm dark:text-slate-400"
              >
                Họ tên
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-slate-500 text-start text-theme-sm dark:text-slate-400"
              >
                Mã bệnh nhân
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-slate-500 text-start text-theme-sm dark:text-slate-400"
              >
                Ngày tạo
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-slate-500 text-start text-theme-sm dark:text-slate-400"
              >
                Giới tính
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-slate-500 text-start text-theme-sm dark:text-slate-400"
              >
                Nhóm máu
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-slate-500 text-start text-theme-sm dark:text-slate-400"
              >
                Ngày sinh
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-slate-500 text-start text-theme-sm dark:text-slate-400"
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {patients.map((patient) => (
              <TableRow key={patient.identityNumber}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {patient.fullName}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {patient.patientId.toString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {patient.createdAt
                    ? format(new Date(patient.createdAt), "dd/MM/yyyy")
                    : ""}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      patient.gender === "MALE"
                        ? "success"
                        : patient.gender === "FEMALE"
                        ? "warning"
                        : "error"
                    }
                  >
                    {patient.gender === "MALE"
                      ? "Nam"
                      : patient.gender === "FEMALE"
                      ? "Nữ"
                      : "Khác"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start font-bold text-theme-sm dark:text-gray-400">
                  {patient.bloodType}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {patient.birthday}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-md dark:text-gray-400">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(patient.patientId)}
                      className="flex items-center gap-2 px-5 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => handleDelete(patient.patientId)}
                      className="flex items-center gap-2 px-5 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      Xóa
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa bệnh nhân này? Thao tác này sẽ không thể hoàn tác."
      />
    </div>
  );
}
