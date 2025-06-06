import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useEffect, useRef, useState } from "react";
import { DeleteConfirmationModal } from "../../ui/modal/DeleteConfirmationModal";
import { useNavigate } from "react-router";
import DatePicker from "../appointments/DatePicker";
import SearchInput from "../../common/SearchInput";

interface Patient {
  id: string;
  user: {
    image: string,
    name: string,
    phoneNumber: string,
  };
  createAt: string;
  gender: "Nam" | "Nữ" | "Khác",
  bloodType: string;
  birthday: string;
}

// Define the table data using the interface
const tableData: Patient[] = [
  {
    id: "BN001",
    user: {
      image: "/images/user/user-17.jpg",
      name: "Trần Nhật T",
      phoneNumber: "0987654321",
    },
    gender: "Nam",
    createAt: "30/04/2025",
    bloodType: "O+",
    birthday: "19/07/2004",
  },
  {
    id: "BN002",
    user: {
      image: "/images/user/user-18.jpg",
      name: "Trịnh Thị Phương Q",
      phoneNumber: "0987654321",
    },
    gender: "Khác",
    createAt: "30/04/2025",
    bloodType: "A+",
    birthday: "19/07/2004",
  },
  {
    id: "BN003",
    user: {
      image: "/images/user/user-17.jpg",
      name: "Trần Đỗ Phương N",
      phoneNumber: "0987654321",
    },
    gender: "Nữ",
    createAt: "30/04/2025",
    bloodType: "B+",
    birthday: "19/07/2004",
  },
  {
    id: "BN004",
    user: {
      image: "/images/user/user-20.jpg",
      name: "Trần Ngọc Anh T",
      phoneNumber: "0987654321",
    },
    gender: "Khác",
    createAt: "30/04/2025",
    bloodType: "AB",
    birthday: "19/07/2004",
  },
  {
    id: "BN005",
    user: {
      image: "/images/user/user-21.jpg",
      name: "Lê Thiện N",
      phoneNumber: "0987654321",
    },
    gender: "Nữ",
    createAt: "30/04/2025",
    bloodType: "O+",
    birthday: "19/07/2004",
  },
  {
    id: "BN006",
    user: {
      image: "/images/user/user-21.jpg",
      name: "Huỳnh Văn T",
      phoneNumber: "0987654321",
    },
    gender: "Nam",
    createAt: "30/04/2025",
    bloodType: "O-",
    birthday: "19/07/2004",
  },
];

export default function PatientTable() {
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


  const [isModalOpen, setModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleView = (patientId: string) => {
  console.log(`Viewing patient with ID: ${patientId}`);
  navigate(`/admin/patients/${patientId}`);
  };

  const handleDelete = (patientId: string) => {
    setPatientToDelete(patientId);
    setModalOpen(true);
    console.log(`Deleting patient with ID: ${patientId}`);    
  };

  const handleConfirmDelete = () => {
    // Perform the actual deletion logic here
    console.log(`Deleting patient  with ID: ${patientToDelete}`);
    
    // Close the modal
    setModalOpen(false);
    setPatientToDelete(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] px-3">
      <div className="flex justify-start items-center px-5 pt-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách bệnh nhân</h2>
        <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">50.0000 bệnh nhân</span>
      </div>
      <div className="flex justify-center items-center p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          {/* Search Bar */}
          <SearchInput inputRef={inputRef} placeholder="Tìm kiếm..."/>

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
            {tableData.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={patient.user.image}
                        alt={patient.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {patient.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {patient.user.phoneNumber}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {patient.id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {patient.createAt}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      patient.gender === "Nam"
                        ? "success"
                        : patient.gender === "Nữ"
                        ? "warning"
                        : "error"
                    }
                  >
                    {patient.gender}
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
                      onClick={() => handleView(patient.id)}
                      className="flex items-center gap-2 px-5 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Xem
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="flex items-center gap-2 px-5 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
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
        message="Bạn có chắc chắn muốn xóa bệnh nhân này? Thao tác này sẽ không thể hoàn tác.
"
      />
    </div>
  );
}
