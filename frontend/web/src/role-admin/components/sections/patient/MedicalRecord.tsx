import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import Input from "../../form/input/InputField";
import InfoField from "../../form/InfoField";

interface MedicalRecordProps {
  date: string;
  recordNumber: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  vitalSign: string;
}

const MedicalRecord: React.FC<MedicalRecordProps> = ({
  date,
  recordNumber,
  reason,
  diagnosis,
  treatment,
  prescription,
  vitalSign
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    reason,
    diagnosis,
    treatment,
    prescription,
    vitalSign
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    console.log("Updated record:", formData);
    closeModal();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 p-4 justify-between bg-gray-50/50 rounded-lg border-gray-200 border-1">
        {/* Thông tin bệnh án */}
        <div className="">
          <h3 className=" text-gray-600 font-semibold">
            Bệnh án #{recordNumber}
          </h3>
          <span className="text-gray-400 text-sm font-semibold">{date}</span>
        </div>

        {/* Chi tiết bệnh án */}
        <div className="md:w-[55%]">
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Lý do khám: </span>
            {reason}
          </p>
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Chẩn đoán: </span>
            {diagnosis}
          </p>
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Điều trị: </span>
            {treatment}
          </p>
          <p className="text-gray-600 truncate">
            <span className="font-medium text-gray-800">Đơn thuốc: </span>
            {prescription}
          </p>
          <p className="hidden text-gray-600 truncate">
            <span className="font-medium text-gray-800">Sinh hiệu: </span>
            {vitalSign}
          </p>
        </div>

        {/* Các nút hành động */}
        <div className="flex  gap-2">
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
          <button className="flex size-12 justify-center items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        
      </div>

      {/* Modal khi nhan vao button xem */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[900px] min-w-[300px] p-6 lg:p-10 mt-80 mb-10"
      >
        <div className="space-y-6  mb-10">
          <h3 className="text-xl font-semibold text-gray-800">
            Bệnh án #{recordNumber}
          </h3>

          <InfoField
            label="Nguyên nhân khám" 
            value={formData.reason}
          />
        
          <InfoField
            label="Chẩn đoán" 
            value={formData.diagnosis}
          />

          <InfoField
            label="Phương án điều trị" 
            value={formData.treatment}
          />

          <InfoField
            label="Sinh hiệu" 
            value={formData.vitalSign}
          />

          <div className="grid grid-cols-6 space-y-2">
            <p className="col-span-2 text-sm font-semibold text-gray-500 mb-2">
              Đơn thuốc
            </p>
            <div className="col-span-4 overflow-x-auto border bg-gray-50 border-gray-200 rounded-md">
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
                  <tr className="border-b border-gray-200">
                    <td className="p-2">Paracetamol</td>
                    <td className="p-2">1000</td>
                    <td className="p-2">1 - S/T/C</td>
                    <td className="p-2">Sau ăn</td>
                    <td className="p-2">1</td>
                    <td className="p-2">1000</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2">Amoxicillin</td>
                    <td className="p-2">2300</td>
                    <td className="p-2">2 - S/T/C</td>
                    <td className="p-2">Sau ăn</td>
                    <td className="p-2">2</td>
                    <td className="p-2">4600</td>
                  </tr>
                  <tr>
                    <td className="p-2">Ibuprofen</td>
                    <td className="p-2">5000</td>
                    <td className="p-2">3 - S/T/C</td>
                    <td className="p-2">Trước ăn</td>
                    <td className="p-2">3</td>
                    <td className="p-2">15000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">
              Đính kèm:
            </p>
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-gray-200 rounded-md">
                <img
                  src="https://placehold.co/300x300"
                  alt="Attachment 1"
                  className="w-full h-auto"
                />
              </div>
              <div className="border border-gray-200 rounded-md">
                <img
                  src="https://placehold.co/300x300"
                  alt="Attachment 2"
                  className="w-full h-auto"
                />
              </div>
              <div className="border border-gray-200 rounded-md">
                <img
                  src="https://placehold.co/300x300"
                  alt="Attachment 3"
                  className="w-full h-auto"
                />
              </div>
              <div className="border border-gray-200 rounded-md">
                <img
                  src="https://placehold.co/300x300"
                  alt="Attachment 4"
                  className="w-full h-auto"
                />
              </div>
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