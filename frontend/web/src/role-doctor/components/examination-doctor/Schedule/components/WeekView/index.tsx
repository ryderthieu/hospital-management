import type React from "react"
import type { WeekViewProps } from "./types"
import { formatTimeRange } from "../../services/date.services"

 const WeekView: React.FC<WeekViewProps> = ({ days, appointments, timeSlots }) => {
  const weekdays = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"]

  // Define lunch break time
  const LUNCH_BREAK = {
    start: "11:00",
    end: "13:00",
  }

  

  // Helper function to convert time string (HH:MM) to minutes since start of day
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Find the earliest and latest times in our time slots
  const earliestTime = timeToMinutes(timeSlots[0].start)
  const latestTime = timeToMinutes(timeSlots[timeSlots.length - 1].end)
  const totalMinutes = latestTime - earliestTime

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(
      (app) =>
        app.date.getDate() === day.getDate() &&
        app.date.getMonth() === day.getMonth() &&
        app.date.getFullYear() === day.getFullYear(),
    )
  }

  // Calculate position and height for an appointment
  const getAppointmentStyle = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)

    // Calculate position as percentage of the day
    const top = ((startMinutes - earliestTime) / totalMinutes) * 100
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100

    return {
      top: `${top}%`,
      height: `${height}%`,
    }
  }

  // Calculate lunch break position and height
  const lunchBreakStyle = {
    top: `${((timeToMinutes(LUNCH_BREAK.start) - earliestTime) / totalMinutes) * 100}%`,
    height: `${((timeToMinutes(LUNCH_BREAK.end) - timeToMinutes(LUNCH_BREAK.start)) / totalMinutes) * 100}%`,
  }

  // Check if a day is today
  const isToday = (day: Date): boolean => {
    const today = new Date()
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  // Check if an appointment is currently in progress
  const isAppointmentInProgress = (app: { startTime: string; endTime: string; date: Date }): boolean => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())

    // Only check appointments for today
    if (
      app.date.getDate() !== today.getDate() ||
      app.date.getMonth() !== today.getMonth() ||
      app.date.getFullYear() !== today.getFullYear()
    ) {
      return false
    }

    const [startHours, startMinutes] = app.startTime.split(":").map(Number)
    const [endHours, endMinutes] = app.endTime.split(":").map(Number)

    const appStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHours, startMinutes)

    const appEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHours, endMinutes)

    return now >= appStart && now <= appEnd
  }


  return (
    <div className="grid grid-cols-8 border-t border-l">
      {/* Weekday headers */}
      {weekdays.map((day, index) => {
        // Skip the first empty cell
        if (index === 0) {
          return (
            <div key={index} className="p-2 border-r border-b text-center font-medium">
              {day}
            </div>
          )
        }

        // For day cells, check if it's today
        const currentDay = days[index - 1]
        const dayIsToday = currentDay ? isToday(currentDay) : false

        return (
          <div
            key={index}
            className={`p-2 border-r border-b text-center font-medium ${dayIsToday ? "bg-base-700 text-white" : ""}`}
          >
            <div>{day}</div>
            <div className="text-sm">{index < weekdays.length && currentDay?.getDate()}</div>
          </div>
        )
      })}

      <div className="col-span-8 grid grid-cols-8" style={{ height: "600px" }}>
        {/* Time slots - left column */}
        <div className="col-span-1 border-r relative h-full">
          {/* Lunch break indicator in time column */}
          <div
            className="absolute left-0 right-0 bg-base-100 border-y z-0 flex items-center justify-center"
            style={lunchBreakStyle}
          >
          </div>

          {timeSlots.map((slot, slotIndex) => {
            const startMinutes = timeToMinutes(slot.start)
            const endMinutes = timeToMinutes(slot.end)
            const top = ((startMinutes - earliestTime) / totalMinutes) * 100
            const height = ((endMinutes - startMinutes) / totalMinutes) * 100

            return (
              <div
                key={slotIndex}
                className="absolute border-b py-2 px-1 text-sm font-medium flex justify-center items-center w-full z-10"
                style={{
                  top: `${top}%`,
                  height: `${height}%`,
                }}
              >
                {slot.label}
              </div>
            )
          })}
        </div>

        {/* Days columns with appointments */}
        {days.map((day, dayIndex) => {
          const dayAppointments = getAppointmentsForDay(day)

          return (
            <div key={dayIndex} className="col-span-1 border-r relative h-full">
              {/* Lunch break highlight */}
              <div className="absolute left-0 right-0 bg-base-100 z-0" style={lunchBreakStyle}></div>

              {/* Time slot grid lines */}
              {timeSlots.map((slot, slotIndex) => {
                const startMinutes = timeToMinutes(slot.start)
                const top = ((startMinutes - earliestTime) / totalMinutes) * 100

                return (
                  <div
                    key={slotIndex}
                    className="absolute w-full border-b" 
                    style={{
                      top: `${top}%`,
                      left: 0,
                      right: 0,
                      backgroundColor:
                        slot.start === LUNCH_BREAK.start
                          ? "transparent"
                          : slotIndex % 2 === 0
                            ? "rgba(243, 244, 246, 0.3)"
                            : "transparent",
                      zIndex: 5,
                    }}
                  />
                )
              })}

              {/* Appointments */}
              {dayAppointments.map((app, appIndex) => {
                const style = getAppointmentStyle(app.startTime, app.endTime)
                const inProgress = isAppointmentInProgress(app)

                return (
                  <div
                    key={appIndex}
                    className={`absolute left-0 right-0 mx-1 p-1 rounded text-sm border overflow-hidden ${
                      inProgress ? "bg-[rgba(22,189,202,0.2)] text-white rounded-2xl border-2 border-base-600" : "bg-[rgba(22,37,202,0.1)] z-50 border-2 rounded-2xl border-blue-400"
                    }`}
                    style={{
                      ...style,
                      zIndex: 20,
                    }}
                  >
                    <div className={`font-medium text-md ${inProgress ? "text-base-700" : "text-blue-700"} `}>{app.title}</div>
                    <div className="text-sm text-black">{formatTimeRange(app.startTime, app.endTime)}</div>
                    {app.description && (
                      <div className="text-sm mt-1 truncate text-black ">
                        {app.description}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WeekView
