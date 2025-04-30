"use client";

import { useState } from "react";

import {
  MapPin,
  Plus,
  Eye,
  FileText,
  CalendarClock,
  ChevronDown,
  Calendar,
  SquarePen,
  Clock,
  Edit,
  Save,
  X,
} from "lucide-react";
import { FormField } from "../../components/examination-doctor/FormField";
import { AddVitalSignModal } from "../../components/examination-doctor/AddVitalSignModal";
import { PrescriptionModal } from "../../components/examination-doctor/PrescriptionModal";
import { IndicationModal } from "../../components/examination-doctor/IndicationModal";

const PatientDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddVitalSignModal, setAddVitalSignModal] = useState(false)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isIndicationModalOpen, setIsIndicationModalOpen] = useState(false);
  const [patientData, setPatientData] = useState({
    name: "Trần Nhật Trường",
    avatar:
      "https://scontent.fsgn22-1.fna.fbcdn.net/v/t39.30808-6/480404053_1006984517940842_142074701260698715_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=r8rFep9IuVYQ7kNvwFjfPpD&_nc_oc=AdkP83gkVNhfVbpKu0-ljcL3QabSF50PJuixSDMIpPOm3ESya0fA9UYxmWi_SYmCoG8iGbQARjWtLuDjIB85epDh&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=2dC9L86bhn3ZNTzRC62APA&oh=00_AfElIn5o44i9rmvFVSmKCtw9BOAVH0AMFy9txWtVa1elOg&oe=6817C0E8",
    clinic: "Dị Ứng - Miễn Dịch Lâm Sàng",
    doctor: "Ths.BS Nguyễn Thiên Tài",
    doctorCode: "BS22521424",
    appointmentTime: "09:20",
    appointmentDate: "2025-04-21",
    appointmentDateTime: "2025-04-21T09:20",
    diagnosis: "MẨY DAY MẨN",
    doctorNotes:
      "Kiêng ăn trứng, thịt gà. Nếu mẩy day xuất hiện kèm triệu chứng tức ngực, khó thở phải nhập viện gấp.",
    followUpDate: "2025-05-21",
    hasFollowUp: true,
    email: "truontn@gmail.com",
    phone: "0961 565 563",
    birthDate: "17/10/2004",
    medicalHistory: "Dị ứng",
    height: "168",
    weight: "60",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving patient data:", patientData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset any changes (in a real app, you might want to reload from the server)
    setIsEditing(false);
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="p-6">
        <div className="flex flex-row">
          {/* Left column - Patient info */}
          <div className="flex-[400px] pr-6">
            <div className="flex flex-row justify-between items-center mb-6">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={patientData.avatar}
                  alt="Patient"
                  className="w-24 h-24 rounded-full mb-3"
                />
                <h2 className="text-lg font-semibold">Trần Nhật Trường</h2>
                <p className="text-gray-600">BN22521584</p>
                <p className="text-gray-600">Nam, 21 tuổi</p>
              </div>

              {/* Current status */}
              <div className="bg-base-100 rounded-lg p-4 mb-6">
                <h3 className="text-black font-medium mb-2">
                  Trạng thái hiện tại
                </h3>

                <div className="bg-base-300 rounded py-2 px-4 mb-2 flex items-center">
                  <div className="w-3 h-3 bg-base-700 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-black flex items-center">
                    Phòng bệnh số:
                  </span>
                </div>

                <div className="bg-base-300 rounded py-2 px-4 mb-2 flex items-center">
                  <div className="w-3 h-3 bg-base-700 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-black flex items-center">
                    Đang xét nghiệm
                    <button className="ml-auto">
                      <ChevronDown size={18} className="text-black" />
                    </button>
                  </span>
                </div>

                <div className="bg-base-300 rounded py-2 px-4 flex items-center">
                  <div className="w-3 h-3 bg-base-700 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-black flex items-center">
                    Chưa kê thuốc
                    <button className="ml-auto">
                      <ChevronDown size={18} className="text-black" />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <div className="flex justify-between items-center mb-4 ">
                <h3 className="text-base-700 font-medium">Thông tin cá nhân</h3>
                <button className="text-base-600 flex items-center text-sm">
                  <SquarePen size={16} className="mr-1" /> Chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-2">
                <div className="w-[200px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">
                      Địa chỉ email
                    </span>
                  </div>
                  <p className="text-black text-sm">ntruong0961@gmail.com</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Số điện thoại
                    </span>
                  </div>
                  <p className="text-black text-sm">0961 565 563</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">
                      Ngày sinh
                    </span>
                  </div>
                  <p className="text-black text-sm">17/10/2004</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Tiền sử bệnh lý
                    </span>
                  </div>
                  <p className="text-black text-sm">Dị ứng</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">
                      Chiều cao (cm)
                    </span>
                  </div>
                  <p className="text-black text-sm">168</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Cân nặng (kg)
                    </span>
                  </div>
                  <p className="text-black text-sm">60</p>
                </div>
              </div>
            </div>

            <div className="h-[2px] my-4 bg-gray-200"></div>

            {/* Medical indicators */}
            <div>
              <div className="flex justify-between items-center mb-4 ">
                <h3 className="text-base-700 font-medium">Sinh hiệu</h3>
                <button className="text-base-600 flex items-center text-sm" onClick={() => setAddVitalSignModal(true)}>
                  <Plus size={16} className="mr-1" /> Thêm sinh hiệu
                </button>
              </div>
              <div className="grid grid-cols-2">
                <div className="w-[200px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">
                      Huyết áp tâm thu (mmHg)
                    </span>
                  </div>
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Mạch (Nhịp/phút)
                    </span>
                  </div>
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>

                <div className="mb-4 w-[210px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">
                      Huyết áp tâm trương (mmHg)
                    </span>
                  </div>
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>

                <div className="mb-4 py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Đường huyết
                    </span>
                  </div>
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>
              </div>
            </div>

            <div className="h-[2px] my-4 bg-gray-200"></div>

            {/* Medical history */}
            <div>
              <h3 className="text-base-700 font-medium mb-4">Lịch sử khám</h3>

              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3">
                    <MapPin size={16} className="text-base-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Dị Ứng - Miễn Dịch Lâm Sàng
                    </p>
                    <p className="text-xs text-gray-500">
                      Ngày khám: 21/03/2025
                    </p>
                  </div>
                  <button className="ml-auto text-base-600">
                    <Eye size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Chẩn đoán: MẨY DAY MẨN</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3">
                    <MapPin size={16} className="text-base-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Dị Ứng - Miễn Dịch Lâm Sàng
                    </p>
                    <p className="text-xs text-gray-500">
                      Ngày khám: 21/02/2025
                    </p>
                  </div>
                  <button className="ml-auto text-base-600">
                    <Eye size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Chẩn đoán: MẨY DAY MẨN</p>
              </div>
            </div>
          </div>

          {/* Right column - Examination details */}
          <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-end mb-4">
                {!isEditing ? (
                  <button
                    className="flex items-center text-base-600"
                    onClick={toggleEditMode}
                  >
                    <Edit size={18} className="mr-1" /> Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="flex items-center text-red-600"
                      onClick={handleCancel}
                    >
                      <X size={18} className="mr-1" /> Hủy
                    </button>
                    <button
                      className="flex items-center text-base-600"
                      onClick={handleSave}
                    >
                      <Save size={18} className="mr-1" /> Lưu
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-5 mb-2">
                <FormField
                  label="Tên bệnh nhân"
                  isEditable={isEditing}
                  value={patientData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />

                <FormField
                  label="Phòng khám"
                  isEditable={isEditing}
                  value={patientData.clinic}
                  onChange={(e) => handleInputChange("clinic", e.target.value)}
                  icon={
                    <MapPin
                      size={16}
                      className="absolute left-2 top-3 text-gray-400"
                    />
                  }
                />

                <FormField
                  label="Bác sĩ phụ trách"
                  isEditable={isEditing}
                  value={patientData.doctor}
                  onChange={(e) => handleInputChange("doctor", e.target.value)}
                />

                <FormField
                  label="Mã bác sĩ"
                  isEditable={isEditing}
                  value={patientData.doctorCode}
                  onChange={(e) =>
                    handleInputChange("doctorCode", e.target.value)
                  }
                />

                <FormField
                  label="Giờ khám"
                  isEditable={isEditing}
                  type="time"
                  value={patientData.appointmentTime}
                  onChange={(e) =>
                    handleInputChange("appointmentTime", e.target.value)
                  }
                  icon={
                    <Clock
                      size={16}
                      className="absolute left-2 top-3 text-gray-400"
                    />
                  }
                />

                <FormField
                  label="Ngày khám"
                  isEditable={isEditing}
                  type="date"
                  value={patientData.appointmentDate}
                  onChange={(e) =>
                    handleInputChange("appointmentDate", e.target.value)
                  }
                  icon={
                    <Calendar
                      size={16}
                      className="absolute left-2 top-3 text-gray-400"
                    />
                  }
                />
              </div>

              <FormField
                label="Chẩn đoán"
                isEditable={isEditing}
                type="textarea"
                rows={4}
                value={patientData.diagnosis}
                onChange={(e) =>
                  handleInputChange("diagnosis", e.target.value)
                }
              />

              <FormField
                label="Lời dặn của bác sĩ"
                isEditable={isEditing}
                type="textarea"
                rows={4}
                value={patientData.doctorNotes}
                onChange={(e) =>
                  handleInputChange("doctorNotes", e.target.value)
                }
              />

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="followup"
                    className="mr-2"
                    checked={patientData.hasFollowUp}
                    onChange={(e) =>
                      handleInputChange("hasFollowUp", e.target.checked)
                    }
                    disabled={!isEditing}
                  />
                  <label htmlFor="followup" className="text-gray-700">
                    Hẹn tái khám
                  </label>
                </div>

                <FormField
                  label=""
                  isEditable={isEditing}
                  icon={
                    <Calendar
                      size={16}
                      className="absolute left-2 top-3 text-gray-400"
                    />
                  }
                  type="date"
                  value={patientData.followUpDate}
                  onChange={(e) =>
                    handleInputChange("followUpDate", e.target.value)
                  }
                  disabled={!patientData.hasFollowUp}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-4">
                  Kết quả xét nghiệm
                </h3>

                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start mb-2">
                    <FileText size={20} className="text-base-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">
                        BN22521584 - Chụp CLVT sọ não không tiêm thuốc cản quang
                      </p>
                      <p className="text-sm text-gray-500">
                        Thời gian trả kết quả dự kiến: 10:00 ngày 21/04/2025
                      </p>
                      <p className="text-sm text-gray-500">
                        Thời gian trả kết quả thực tế: 10:20 ngày 21/04/2025
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Kết luận: Không thấy tụ máu nội sọ. Veo vách ngăn mũi
                        sang phải.
                      </p>
                    </div>
                    <button className="text-base-600">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <FileText size={20} className="text-base-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">
                        BN22521584 - Tổng phân tích tế bào máu
                      </p>
                      <p className="text-sm text-gray-500">
                        Thời gian trả kết quả dự kiến: 10:30 ngày 21/04/2025
                      </p>
                      <p className="text-sm text-gray-500">
                        Thời gian trả kết quả thực tế:
                      </p>
                      <p className="text-sm font-medium mt-1">Kết luận:</p>
                    </div>
                    <button className="text-base-600">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-4">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
                  <CalendarClock size={18} className="mr-2" />
                  Đặt lịch tái khám
                </button>
                <button onClick={() => setIsIndicationModalOpen(true)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
                  <Plus size={18} className="mr-2" />
                  Thêm chỉ định
                </button>
                <button  onClick={() => setIsPrescriptionModalOpen(true)} className="flex items-center px-4 py-2 bg-base-600 text-white rounded-md">
                  <Plus size={18} className="mr-2" />
                  Kê toa thuốc
                </button>
                
              </div>
            </div>
           

            <div className="mt-6 flex justify-end">
              <button className="px-8 py-3 bg-base-600 text-white rounded-md">
                Lưu
              </button>
            </div>
          </div>
        </div>
      </main>
      {showAddVitalSignModal && (<AddVitalSignModal isOpen={showAddVitalSignModal} onClose={() => setAddVitalSignModal(false)} />)}
      {isPrescriptionModalOpen && (<PrescriptionModal isOpen={isPrescriptionModalOpen} onClose={() => setIsPrescriptionModalOpen(false)} />)}
      {isIndicationModalOpen && (<IndicationModal isOpen={isIndicationModalOpen} onClose={() => setIsIndicationModalOpen(false)} />)}
    </div>
  );
};

export default PatientDetail;
