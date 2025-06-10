import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import InfoField from "../../form/InfoField";
import type {
  PrescriptionResponse,
  PrescriptionDetailResponse,
} from "../../../types/pharmacy";

interface MedicalRecordProps {
  prescription: PrescriptionResponse;
}

const MedicalRecord: React.FC<MedicalRecordProps> = ({ prescription }) => {
  const { isOpen, openModal, closeModal } = useModal();

  // Lấy thông tin tổng hợp từ prescription
  const {
    prescriptionId,
    createdAt,
    note,
    diagnosis,
    prescriptionDetails,
    systolicBloodPressure,
    diastolicBloodPressure,
    heartRate,
    bloodSugar,
  } = prescription;

  // Tổng hợp đơn thuốc dạng bảng
  const renderPrescriptionTable = () => (
    <table className="w-full text-sm bg-gray-50">
      <thead>
        <tr className="bg-white border-b border-gray-200">
          <th className="p-2 text-left">Tên thuốc</th>
          <th className="p-2 text-left">Giá (₫)</th>
          <th className="p-2 text-left">Liều dùng</th>
          <th className="p-2 text-left">Hướng dẫn</th>
          <th className="p-2 text-left">Số lượng</th>
          <th className="p-2 text-left">Thành tiền (₫)</th>
        </tr>
      </thead>
      <tbody>
        {prescriptionDetails.map((detail: PrescriptionDetailResponse) => (
          <tr key={detail.detailId} className="border-b border-gray-200">
            <td className="p-2">{detail.medicine?.medicineName || ""}</td>
            <td className="p-2">
              {detail.medicine?.price?.toLocaleString() || ""}
            </td>
            <td className="p-2">{detail.dosage}</td>
            <td className="p-2">
              {detail.frequency} - {detail.duration}
            </td>
            <td className="p-2">{detail.quantity}</td>
            <td className="p-2">
              {detail.medicine?.price && detail.quantity
                ? (detail.medicine.price * detail.quantity).toLocaleString()
                : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 p-4 justify-between bg-gray-50/50 rounded-lg border-gray-200 border-1">
        {/* Thông tin bệnh án */}
        <div>
          <h3 className="text-gray-600 font-semibold">
            Bệnh án #{prescriptionId}
          </h3>
          <span className="text-gray-400 text-sm font-semibold">
            {createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : ""}
          </span>
        </div>

        {/* Chi tiết bệnh án */}
        <div className="md:w-[55%]">
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Lưu ý: </span>
            {note}
          </p>
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Chẩn đoán: </span>
            {diagnosis}
          </p>
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Sinh hiệu: </span>
            Huyết áp: {systolicBloodPressure}/{diastolicBloodPressure} mmHg,
            Nhịp tim: {heartRate} bpm, Đường huyết: {bloodSugar}
          </p>
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Đơn thuốc: </span>
            {prescriptionDetails
              .map(
                (d) =>
                  `${d.medicine?.medicineName || ""} - ${d.dosage} - ${
                    d.frequency
                  } - ${d.duration} (${d.quantity})`
              )
              .join("; ")}
          </p>
        </div>

        {/* Các nút hành động */}
        <div className="flex gap-2">
          <button
            className="flex size-12 justify-center items-center gap-1 px-3 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            onClick={openModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal khi nhấn vào button xem */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[900px] min-w-[300px] p-6 lg:p-10 mt-80 mb-10"
      >
        <div className="space-y-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-800">
            Bệnh án #{prescriptionId}
          </h3>

          <InfoField label="Lý do khám" value={note} />
          <InfoField label="Chẩn đoán" value={diagnosis} />
          <InfoField
            label="Sinh hiệu"
            value={
              `Huyết áp: ${systolicBloodPressure}/${diastolicBloodPressure} mmHg, ` +
              `Nhịp tim: ${heartRate} bpm, Đường huyết: ${bloodSugar}`
            }
          />

          <div className="grid grid-cols-6 space-y-2">
            <p className="col-span-2 text-sm font-semibold text-gray-500 mb-2">
              Đơn thuốc
            </p>
            <div className="col-span-4 overflow-x-auto border bg-gray-50 border-gray-200 rounded-md">
              {renderPrescriptionTable()}
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
            onClick={() => console.log("View Invoice clicked")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Xem hóa đơn
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MedicalRecord;
