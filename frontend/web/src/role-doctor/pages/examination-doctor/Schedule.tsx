import type React from "react"
import { ScheduleComponent } from "../../components/examination-doctor/Schedule/index"

const Schedule: React.FC = () => {
  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <ScheduleComponent />
    </div>
  )
}

export default Schedule
