import React, { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import SearchInput from "../../common/SearchInput";
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "../../../api/doctorApi";
import { DoctorDto } from "../../../types/DoctorDto";

const PAGE_SIZE = 10;

const DoctorTable: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    doctorApi
      .getAllDoctors()
      .then((data) => setDoctors(data))
      .finally(() => setLoading(false));
  }, []);

  const totalItems = doctors.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const paginatedData = doctors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleViewSchedule = (doctorId: number | undefined) => {
    if (doctorId !== undefined) {
      navigate(`/admin/doctors/schedule/${doctorId}`);
    }
  };

  const handleViewDetail = (doctorId: number | undefined) => {
    if (doctorId !== undefined) {
      navigate(`/admin/doctors/detail/${doctorId}`);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex justify-start items-center pt-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách bác sĩ
          </h2>
          <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">
            {totalItems} bác sĩ
          </span>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Tìm kiếm..." />
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Lọc
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {paginatedData.map((doctor) => (
          <DoctorCard
            key={doctor.doctorId}
            doctor={doctor}
            onViewSchedule={() => handleViewSchedule(doctor.doctorId)}
            onViewDetail={() => handleViewDetail(doctor.doctorId)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DoctorTable;
