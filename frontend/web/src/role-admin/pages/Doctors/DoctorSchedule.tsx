import { useState } from "react"
import { ScheduleComponent } from "../../components/Schedule/components/Schedule/index"
import PageMeta from "../../components/common/PageMeta"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"

interface DoctorData {
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  gender: string
  dateOfBirth: string
  department: string
  doctorId: string
  accountType: string
  position: string
  specialty: string
  address: string
  country: string
  city: string
  postalCode: string
  profileImage: string
}

const DoctorSchedule = () => {
  const [doctorData, setDoctorData] = useState<DoctorData>({
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
    address:
      "Tòa S3.02, Vinhomes Grand Park, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
    country: "Việt Nam",
    city: "Thành phố Hồ Chí Minh",
    postalCode: "70000",
    profileImage: "/images/user/doctor-avatar.jpg",
  })

  return (
  <div> 
    <PageMeta
      title={`${doctorData.fullName} | Hồ sơ Bác sĩ`}
      description={`Thông tin chi tiết về ${doctorData.fullName} - ${doctorData.specialty}`}
    />
    <PageBreadcrumb pageTitle={doctorData.fullName} />
    
    <div className="bg-white rounded-xl shadow-md p-6 mt-6 border border-gray-200">
      <ScheduleComponent />
    </div>
  </div>
)

}

export default DoctorSchedule
