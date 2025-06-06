import PageMeta from "../../components/common/PageMeta"
import RoomHeader from "../../components/sections/patients-room/RoomHeader"
import DepartmentInfo from "../../components/sections/patients-room/DepartmentInfo"
import StatsCards from "../../components/sections/patients-room/StatsCards"
import CalendarView from "../../components/sections/patients-room/CalendarView"
import PatientsList from "../../components/sections/patients-room/PatientsList"
import PatientDetails from "../../components/sections/patients-room/PatientDetails"
import LocationBanner from "../../components/sections/patients-room/LocationBanner"

export default function RoomDetail() {
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
