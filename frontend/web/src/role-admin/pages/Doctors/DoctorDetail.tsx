import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doctorService } from "../../../services/doctorService";
import { departmentService } from "../../../services/departmentService";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import ReturnButton from "../../components/ui/button/ReturnButton";
import { Doctor } from "../../../types/doctor";
import { ACADEMIC_DEGREE_LABELS } from "../../../types/doctor";

// Extended Doctor interface for DoctorDetail page with additional fields
interface DoctorDetailData extends Doctor {
  phone: string;
  email: string;
  departmentId: number;
  departmentName: string;
  consultationFee?: number;
}

export default function DoctorDetail() {
  const { doctorId } = useParams();
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const [doctorData, setDoctorData] = useState<DoctorDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<{[key: number]: string}>({});
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    console.log("doctorId:", doctorId);
    if (!doctorId || isNaN(Number(doctorId))) {
      setLoading(false);
      setDoctorData(null);
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch departments first to create ID-to-name mapping
        const departmentsData = await departmentService.getAllDepartments();
        console.log("Departments data:", departmentsData);
        
        const departmentMapping: {[key: number]: string} = {};
        departmentsData.forEach(dept => {
          if (dept.departmentId) {
            departmentMapping[dept.departmentId] = dept.departmentName;
          }
        });
        console.log("Department mapping:", departmentMapping);
        setDepartments(departmentMapping);

        // Fetch doctor data
        const data = await doctorService.getDoctorById(Number(doctorId));
        console.log("Doctor data:", data);
        console.log("Doctor data keys:", Object.keys(data));
        console.log("Doctor departmentId (direct):", data.departmentId);
        console.log("Doctor departmentName (direct):", data.departmentName);
        
        // Use mapping to get department name - prioritize API data first, then mapping
        const departmentName = data.departmentName || 
          (data.departmentId ? departmentMapping[data.departmentId] : "") || 
          "";
        
        console.log("Final department name:", departmentName);
        console.log("departmentMapping[data.departmentId]:", data.departmentId ? departmentMapping[data.departmentId] : "N/A");

        setDoctorData({
          ...data,
          // Ensure these fields are properly set for backward compatibility
          departmentId: data.departmentId ?? 0,
          departmentName: departmentName,
        });
      } catch (err) {
        console.error("API error:", err);
        setDoctorData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleSave = async () => {
    if (!doctorData) return;
    
    setSaving(true);
    try {
      // Get form data using more reliable method
      const form = document.querySelector('form') as HTMLFormElement;
      if (!form) {
        throw new Error("Form not found");
      }
      
      // Create update payload using more reliable selectors
      const inputs = form.querySelectorAll('input, select, textarea');
      const values: any = {};
      
      inputs.forEach((input: any) => {
        if (input.name) {
          values[input.name] = input.value;
        }
      });

      console.log("Form values extracted:", values);
      console.log("Original doctor data:", doctorData);

      // Validate required fields
      if (!values.fullName || values.fullName.trim() === '') {
        throw new Error("Họ tên không được để trống");
      }
      if (!values.identityNumber || values.identityNumber.trim() === '') {
        throw new Error("Số CMND/CCCD không được để trống");
      }
      if (!values.specialization || values.specialization.trim() === '') {
        throw new Error("Chuyên môn không được để trống");
      }
      if (!values.phone || values.phone.trim() === '') {
        throw new Error("Số điện thoại không được để trống");
      }

      // Check if doctor has user data
      if (!doctorData.userId) {
        throw new Error("Bác sĩ này chưa có tài khoản người dùng. Vui lòng liên hệ admin để tạo tài khoản.");
      }

      // Map form values to API structure matching backend DoctorDto exactly
      const updateData = {
        // Required fields - must not be null or empty
        phone: values.phone?.trim() || doctorData.phone || "0123456789", // Backend requires non-empty phone
        identityNumber: values.identityNumber.trim(),
        fullName: values.fullName.trim(),
        birthday: values.birthday, // LocalDate format expected
        gender: values.gender, // Enum: MALE, FEMALE
        academicDegree: values.academicDegree, // Enum value
        specialization: values.specialization.trim(),
        type: values.type || doctorData.type, // Enum: EXAMINATION, SERVICE
        departmentId: parseInt(values.departmentId) || doctorData.departmentId,
        
        // Optional fields
        email: values.email?.trim() || doctorData.email || "",
        address: values.address || "",
        avatar: doctorData.avatar || "",
        consultationFee: parseFloat(values.consultationFee) || doctorData.consultationFee || 0,
        
        // Keep existing system fields
        doctorId: doctorData.doctorId,
        userId: doctorData.userId,
        createdAt: doctorData.createdAt,
      };

      console.log("Updating doctor with data:", updateData);
      
      // Call API to update doctor
      const updatedDoctor = await doctorService.updateDoctor(doctorData.doctorId!, updateData);
      
      // Update local state with the response
      const departmentName = updatedDoctor.departmentName || 
        (updatedDoctor.departmentId ? departments[updatedDoctor.departmentId] : "") || 
        "";

      setDoctorData({
        ...updatedDoctor,
        departmentId: updatedDoctor.departmentId ?? 0,
        departmentName: departmentName,
      });

      console.log("Doctor updated successfully!");
      alert("Cập nhật thông tin bác sĩ thành công!");
      closeEditModal();
    } catch (error) {
      console.error("Error updating doctor:", error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      alert("Có lỗi xảy ra khi cập nhật thông tin bác sĩ. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!doctorData) return <div>Không tìm thấy bác sĩ</div>;

  return (
    <div className="min-h-screen">
      <PageMeta
        title={`${doctorData.fullName} | Hồ sơ Bác sĩ`}
        description={`Thông tin chi tiết về ${doctorData.fullName} - ${doctorData.specialization}`}
      />

      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ReturnButton />
            <h1 className="text-xl font-semibold text-gray-900">
              Hồ sơ bác sĩ: {doctorData.fullName}
            </h1>
          </div>
          <button
            onClick={openEditModal}
            className="px-6 py-[10px] bg-base-600 text-white rounded-lg hover:bg-base-700 font-medium transition-colors"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="mx-auto pt-6">
        <div className="space-y-6">
          {/* Account Information Section */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông tin tài khoản
                  </h2>
                  <p className="text-sm text-gray-500">
                    Thông tin đăng nhập và liên hệ
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ảnh đại diện
                  </label>
                  <div className="size-30 rounded-xl border-2 border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={doctorData.avatar || "/placeholder.svg"}
                      alt="Doctor Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-4">
                  <div className="grid grid-row gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={doctorData.phone || ""}
                        disabled
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={doctorData.email || ""}
                        disabled
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                  <p className="text-sm text-gray-500">
                    Thông tin cơ bản của bác sĩ
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã bác sĩ
                  </label>
                  <input
                    type="text"
                    value={doctorData.doctorId?.toString() || ""}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={doctorData.fullName}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số CMND/CCCD
                  </label>
                  <input
                    type="text"
                    value={doctorData.identityNumber || ""}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={doctorData.birthday}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <input
                    type="text"
                    value={doctorData.gender === "MALE" ? "Nam" : doctorData.gender === "FEMALE" ? "Nữ" : "Khác"}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    value={doctorData.address}
                    disabled
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông tin chuyên môn
                  </h2>
                  <p className="text-sm text-gray-500">
                    Trình độ, chuyên ngành và khoa làm việc của bác sĩ
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoa
                  </label>
                  <input
                    type="text"
                    value={doctorData.departmentName || ""}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Học hàm học vị
                  </label>
                  <input
                    type="text"
                    value={ACADEMIC_DEGREE_LABELS[doctorData.academicDegree as keyof typeof ACADEMIC_DEGREE_LABELS] || doctorData.academicDegree}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên môn
                  </label>
                  <input
                    type="text"
                    value={doctorData.specialization}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bác sĩ
                  </label>
                  <input
                    type="text"
                    value={doctorData.type === "EXAMINATION" ? "Khám bệnh" : "Dịch vụ"}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phí khám (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={doctorData.consultationFee?.toLocaleString('vi-VN') || "0"}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[800px] m-4"
      >
        <div className="relative w-full p-6 overflow-y-auto bg-white rounded-2xl max-h-[80vh]">
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              Chỉnh sửa thông tin bác sĩ
            </h4>
            <p className="text-sm text-gray-500">
              Cập nhật thông tin chi tiết của bác sĩ.
            </p>
          </div>

          <form className="space-y-6">
            {/* Personal Information */}
            <div>
              <h5 className="text-base font-medium text-gray-900 mb-4">Thông tin cá nhân</h5>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã bác sĩ
                  </label>
                  <input
                    type="text"
                    value={doctorData.doctorId?.toString() || ""}
                    disabled
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={doctorData.phone || ""}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={doctorData.email || ""}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                    placeholder="Nhập email (không bắt buộc)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={doctorData.fullName}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số CMND/CCCD *
                  </label>
                  <input
                    type="text"
                    name="identityNumber"
                    defaultValue={doctorData.identityNumber}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    defaultValue={doctorData.birthday}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select 
                    name="gender"
                    defaultValue={doctorData.gender}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    defaultValue={doctorData.address}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h5 className="text-base font-medium text-gray-900 mb-4">Thông tin chuyên môn</h5>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoa
                  </label>
                  <select
                    name="departmentId"
                    defaultValue={doctorData.departmentId}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  >
                    <option value="">-- Chọn khoa --</option>
                    {Object.entries(departments).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Học hàm học vị
                  </label>
                  <select
                    name="academicDegree"
                    defaultValue={doctorData.academicDegree}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  >
                    {Object.entries(ACADEMIC_DEGREE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên môn
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    defaultValue={doctorData.specialization}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bác sĩ
                  </label>
                  <select
                    name="type"
                    defaultValue={doctorData.type}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  >
                    <option value="EXAMINATION">Khám bệnh</option>
                    <option value="SERVICE">Dịch vụ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phí khám (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    defaultValue={doctorData.consultationFee}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 transition-colors outline-0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-6 py-[10px] border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-[10px] bg-base-600 text-white rounded-lg hover:bg-base-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
