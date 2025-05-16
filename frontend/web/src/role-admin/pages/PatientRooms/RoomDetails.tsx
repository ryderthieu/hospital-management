import PageMeta from "../../components/common/PageMeta"
import RoomHeader from "../../components/PatientsRoom/RoomHeader"
import DepartmentInfo from "../../components/PatientsRoom/DepartmentInfo"
import StatsCards from "../../components/PatientsRoom/StatsCards"
import CalendarView from "../../components/PatientsRoom/CalendarView"
import PatientsList from "../../components/PatientsRoom/PatientsList"
import PatientDetails from "../../components/PatientsRoom/PatientDetails"
import LocationBanner from "../../components/PatientsRoom/LocationBanner"

export default function RoomDetails() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title="Patients-Room | Admin Dashboard" description="This is Patients Room" />

      <div className="p-6">
        {/* Room header */}
        <RoomHeader />

        {/* Location Banner */}
        <LocationBanner />

        {/* Department info */}
        <DepartmentInfo />

        {/* Stats */}
        <StatsCards />

        {/* Calendar */}
        <CalendarView />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Patient list */}
          <div className="w-full lg:w-6/10">
            <PatientsList />
          </div>

          {/* Patient details */}
          <div className="hidden lg:block lg:w-4/10">
            <PatientDetails />
          </div>
        </div>
      </div>
    </div>
  )
}
