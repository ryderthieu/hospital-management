import React from "react";
import { Link } from "react-router-dom";
import InpatientModal from "./InpatientModal";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  diagnosis: string;
  doctor: string;
  admissionDate: string;
  expectedDischargeDate?: string;
  severity: "critical" | "observation" | "normal";
  notes?: string;
}

export interface InpatientRoomCardProps {
  id: string;
  number: string;
  department: string;
  building: string;
  floor: string;
  type: "standard" | "vip" | "icu" | "isolation";
  capacity: number;
  currentPatients: number;
  hasNurseCall?: boolean;
  status: "available" | "full" | "maintenance" | "reserved";
  patients: PatientInfo[];
  lastCleaned?: string;
  equipmentStatus?: "operational" | "needs-maintenance";
}

const InpatientRoomCard: React.FC<InpatientRoomCardProps> = ({
  id,
  number,
  department,
  building,
  floor,
  type,
  capacity,
  currentPatients,
  status = "available",
  patients = [],
  lastCleaned,
  equipmentStatus = "operational",
}) => {
  // Sử dụng useModal hook thay vì useState
  const { isOpen, openModal, closeModal } = useModal();

  const getStatusInfo = () => {
    switch (status) {
      case "available":
        return {
          label: "Còn chỗ",
          colorClass: "bg-green-100 text-green-800",
          indicatorClass: "bg-green-500",
        };
      case "full":
        return {
          label: "Đã đầy",
          colorClass: "bg-red-100 text-red-800",
          indicatorClass: "bg-red-500",
        };
      case "maintenance":
        return {
          label: "Bảo trì",
          colorClass: "bg-gray-100 text-gray-800",
          indicatorClass: "bg-gray-500",
        };
      case "reserved":
        return {
          label: "Đã đặt",
          colorClass: "bg-yellow-100 text-yellow-800",
          indicatorClass: "bg-yellow-500",
        };
      default:
        return {
          label: "Còn chỗ",
          colorClass: "bg-green-100 text-green-800",
          indicatorClass: "bg-green-500",
        };
    }
  };

  const getRoomTypeInfo = () => {
    switch (type) {
      case "standard":
        return {
          label: "Tiêu chuẩn",
          colorClass: "bg-base-100 text-base-800",
        };
      case "vip":
        return {
          label: "VIP",
          colorClass: "bg-purple-100 text-purple-800",
        };
      case "icu":
        return {
          label: "ICU",
          colorClass: "bg-red-100 text-red-800",
        };
      case "isolation":
        return {
          label: "Cách ly",
          colorClass: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          label: "Tiêu chuẩn",
          colorClass: "bg-base-100 text-base-800",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const roomTypeInfo = getRoomTypeInfo();
  const occupancyPercentage = Math.round((currentPatients / capacity) * 100);

  // Đếm theo mức độ bệnh nhân
  const criticalCount = patients.filter(
    (p) => p.severity === "critical"
  ).length;
  const observationCount = patients.filter(
    (p) => p.severity === "observation"
  ).length;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
      <div className="p-6">
        {/* Header with room number, status and badges */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Phòng {number}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded ${roomTypeInfo.colorClass}`}
              >
                {roomTypeInfo.label}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded ${statusInfo.colorClass}`}
              >
                {statusInfo.label}
              </span>
              {equipmentStatus === "needs-maintenance" && (
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Cần bảo trì
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {criticalCount > 0 && (
              <span className="text-xs font-medium px-2 py-1 mr-1 bg-red-100 text-red-800 rounded-full">
                {criticalCount} nguy kịch
              </span>
            )}
          </div>
        </div>

        {/* Department and location */}
        <div className="flex items-start mb-2">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-sm text-gray-600">Khoa {department}</span>
        </div>

        {/* Building and floor */}
        <div className="flex items-start mb-2">
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
          <span className="text-sm text-gray-600">
            {building}, {floor}
          </span>
        </div>

        {/* Occupancy */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Bệnh nhân: {currentPatients}/{capacity} ({occupancyPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                occupancyPercentage >= 90
                  ? "bg-red-500"
                  : occupancyPercentage >= 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Patient quick stats */}
        {patients.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Tình trạng bệnh nhân:
            </h4>
            <div className="flex gap-2 flex-wrap">
              {criticalCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {criticalCount} nguy kịch
                </span>
              )}
              {observationCount > 0 && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {observationCount} theo dõi
                </span>
              )}
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {patients.length - criticalCount - observationCount} bình thường
              </span>
            </div>
          </div>
        )}

        {/* Last cleaned info */}
        {lastCleaned && (
          <div className="flex items-start mb-4">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              Vệ sinh lần cuối: {lastCleaned}
            </span>
          </div>
        )}

        {/* Footer buttons */}
        <div className="mt-5 flex justify-between">
          <button
            onClick={openModal}
            className="text-base-600 hover:text-base-800 text-sm font-medium"
          >
            Xem bệnh nhân
          </button>
          <Link
            to={`/admin/inpatient-rooms/${id}`}
            className="text-white bg-base-600 hover:bg-base-700 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
          >
            Chi tiết
          </Link>
        </div>
      </div>

      {/* Sử dụng Modal và InpatientModal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-4xl p-0 mt-[10vh]"
      >
        <InpatientModal
          isOpen={isOpen}
          onClose={closeModal}
          roomInfo={{
            number,
            department,
            building,
            floor
          }}
          patients={patients}
        />
      </Modal>
    </div>
  );
};

export default InpatientRoomCard;
