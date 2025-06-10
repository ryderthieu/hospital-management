import React from "react";
import { Link } from "react-router-dom";
import { ExaminationRoom } from "../../../types/doctor";

const ClinicCard: React.FC<{ clinic: ExaminationRoom }> = ({ clinic }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h5 className="text-base font-semibold text-gray-800">
            {clinic.note || `Phòng ${clinic.roomId}`}
          </h5>
        </div>

        {/* Thông tin cơ bản */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-500 mr-2 mt-0.5"
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
            <span className="text-sm text-gray-600">
              {clinic.building}, Tầng {clinic.floor}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-sm text-gray-600">
              Loại phòng:{" "}
              {clinic.type === "examination" ? "Khám bệnh" : "Xét nghiệm"}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-sm text-gray-600">
              Mã khoa: {clinic.departmentId}
            </span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-5 flex justify-between">
          <Link
            to={`/admin/examination/clinics/${clinic.roomId}/appointments`}
            className="text-base-600 hover:text-base-800 text-sm font-medium"
          >
            Xem lịch hẹn
          </Link>
          <Link
            to={`/admin/outpatient-clinics/${clinic.roomId}`}
            className="text-white bg-base-600 hover:bg-base-700 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;
