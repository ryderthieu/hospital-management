import { useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import UserMetaCard from "../../components/sections/doctor/UserMetaCard"
import UserInfoCard from "../../components/sections/doctor/UserInfoCard"
import UserAddressCard from "../../components/sections/doctor/UserAddressCard"
import PageMeta from "../../components/common/PageMeta"
import { useModal } from "../../hooks/useModal"
import { Modal } from "../../components/ui/modal"
import Button from "../../components/ui/button/Button"
import Input from "../../components/form/input/InputField"
import Label from "../../components/form/Label"

export default function DoctorDetail() {
  const { isOpen: isProfileOpen, openModal: openProfileModal, closeModal: closeProfileModal } = useModal()
  const { isOpen: isInfoOpen, openModal: openInfoModal, closeModal: closeInfoModal } = useModal()
  const { isOpen: isAddressOpen, openModal: openAddressModal, closeModal: closeAddressModal } = useModal()


  const [doctorData, setDoctorData] = useState({
    firstName: "Nguyễn",
    lastName: "Thiên Tài",
    fullName: "BS. Nguyễn Thiên Tài",
    email: "nguyenthientoi@hospital.com",
    phone: "0901 565 563",
    gender: "Nam",
    dateOfBirth: "11/05/1995",
    department: "Nội tim mạch",
    doctorId: "BS22521584",
    accountType: "Bác sĩ",
    position: "Thạc sĩ Bác sĩ (Ths.BS)",
    specialty: "Suy tim",
    address: "Tòa S3.02, Vinhomes Grand Park, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
    country: "Việt Nam",
    city: "Thành phố Hồ Chí Minh",
    postalCode: "70000",
    profileImage: "/images/user/doctor-avatar.jpg",
  })

  const handleSaveProfile = () => {
    console.log("Saving profile changes...")
    closeProfileModal()
  }

  const handleSaveInfo = () => {
    console.log("Saving info changes...")
    closeInfoModal()
  }

  const handleSaveAddress = () => {
    console.log("Saving address changes...")
    closeAddressModal()
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDoctorData((prev) => ({
          ...prev,
          profileImage: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <PageMeta
        title={`${doctorData.fullName} | Hồ sơ Bác sĩ`}
        description={`Thông tin chi tiết về ${doctorData.fullName} - ${doctorData.specialty}`}
      />
      <PageBreadcrumb pageTitle={doctorData.fullName} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Hồ sơ Bác sĩ</h3>
        </div>

        <div className="space-y-6">
          <UserMetaCard doctorData={doctorData} setDoctorData={setDoctorData} />
          <UserInfoCard doctorData={doctorData} setDoctorData={setDoctorData} />
          <UserAddressCard doctorData={doctorData} setDoctorData={setDoctorData} />
        </div>
      </div>

      {/* Profile Image Edit Modal */}
      <Modal isOpen={isProfileOpen} onClose={closeProfileModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900">
          <div className="mb-6">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Chỉnh sửa ảnh đại diện</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tải lên ảnh đại diện mới cho hồ sơ của bạn.</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 overflow-hidden border-2 border-gray-200 rounded-full dark:border-gray-700">
              <img
                src={doctorData.profileImage || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full">
              <Label>Chọn ảnh mới</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500">Định dạng: JPG, JPEG, PNG. Kích thước tối đa: 3MB</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 justify-end">
            <Button size="sm" variant="outline" onClick={closeProfileModal}>
              Hủy
            </Button>
            <Button size="sm" onClick={handleSaveProfile}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Personal Info Edit Modal */}
      <Modal isOpen={isInfoOpen} onClose={closeInfoModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 max-h-[80vh]">
          <div className="mb-6">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa thông tin cá nhân
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cập nhật thông tin cá nhân và nghề nghiệp của bạn.
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Họ và tên đệm</Label>
                <Input type="text" defaultValue={doctorData.firstName} />
              </div>
              <div>
                <Label>Tên</Label>
                <Input type="text" defaultValue={doctorData.lastName} />
              </div>
              <div>
                <Label>Giới tính</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <Label>Ngày sinh</Label>
                <Input type="date" defaultValue="1995-05-11" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" defaultValue={doctorData.email} />
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <Input type="tel" defaultValue={doctorData.phone} />
              </div>
              <div>
                <Label>Khoa trực thuộc</Label>
                <Input type="text" defaultValue={doctorData.department} />
              </div>
              <div>
                <Label>Mã bác sĩ</Label>
                <Input type="text" defaultValue={doctorData.doctorId} />
              </div>
              <div>
                <Label>Chức danh</Label>
                <Input type="text" defaultValue={doctorData.position} />
              </div>
              <div>
                <Label>Chuyên khoa</Label>
                <Input type="text" defaultValue={doctorData.specialty} />
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <Button size="sm" variant="outline" onClick={closeInfoModal}>
                Hủy
              </Button>
              <Button size="sm" onClick={handleSaveInfo}>
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Address Edit Modal */}
      <Modal isOpen={isAddressOpen} onClose={closeAddressModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900">
          <div className="mb-6">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Chỉnh sửa địa chỉ</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cập nhật thông tin địa chỉ của bạn.</p>
          </div>

          <form className="space-y-4">
            <div>
              <Label>Địa chỉ chi tiết</Label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                rows="3"
                defaultValue={doctorData.address}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Quốc gia</Label>
                <Input type="text" defaultValue={doctorData.country} />
              </div>
              <div>
                <Label>Thành phố</Label>
                <Input type="text" defaultValue={doctorData.city} />
              </div>
              <div>
                <Label>Mã bưu điện</Label>
                <Input type="text" defaultValue={doctorData.postalCode} />
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <Button size="sm" variant="outline" onClick={closeAddressModal}>
                Hủy
              </Button>
              <Button size="sm" onClick={handleSaveAddress}>
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}
