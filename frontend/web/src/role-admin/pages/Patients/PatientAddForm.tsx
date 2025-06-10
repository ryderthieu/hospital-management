import type { FormEvent } from "react";
import { useState } from "react";
import { Calendar, ChevronDown, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreatePatientRequest } from "../../types/patient";
import { patientService } from "../../services/patientService";
import { parse, format } from "date-fns";

export default function PatientAddForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreatePatientRequest>({
    email: "",
    phone: "",
    password: "",
    identityNumber: "",
    insuranceNumber: "",
    fullName: "",
    birthday: "",
    avatar: "",
    gender: "OTHER",
    address: "",
    allergies: "",
    height: undefined,
    weight: undefined,
    bloodType: "O+",
    emergencyContactDtos: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const birthday =
        formData.birthday && formData.birthday.includes("/")
          ? format(
              parse(formData.birthday, "dd/MM/yyyy", new Date()),
              "yyyy-MM-dd"
            )
          : formData.birthday;
      const dataToSend = { ...formData, birthday };
      await patientService.createPatient(dataToSend);
      alert("Thêm bệnh nhân thành công!");
      navigate("/admin/patients");
    } catch (error: any) {
      alert(
        "Có lỗi khi thêm bệnh nhân!\n" + JSON.stringify(error.response?.data)
      );
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center mb-6">
        <Link
          to="/admin/patients"
          className="text-base-600 hover:text-base-700 flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span className="text-xl font-medium text-base-600">
            Thêm bệnh nhân
          </span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-red-600 mb-6">
          Thông tin cơ bản
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="VD: Nguyễn Văn A..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="VD: email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="VD: 0917165628"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                CCCD/CMND <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="identityNumber"
                value={formData.identityNumber}
                onChange={handleChange}
                placeholder="VD: 0123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">BHYT</label>
              <input
                type="text"
                name="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={handleChange}
                placeholder="VD: ytaucsonns"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                  required
                />
                <Calendar
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Giới tính
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500 appearance-none"
                >
                  <option value="OTHER">Khác</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-base-600 font-medium">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Ảnh đại diện (URL)
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="URL ảnh đại diện"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">Dị ứng</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Nhập dị ứng (nếu có)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height ?? ""}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Cân nặng (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight ?? ""}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Nhóm máu
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-base-600 text-white font-medium rounded-md hover:bg-base-700 focus:outline-none focus:ring-2 focus:ring-base-500 focus:ring-offset-2"
            >
              Lưu thông tin
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => navigate("/admin/patients")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
