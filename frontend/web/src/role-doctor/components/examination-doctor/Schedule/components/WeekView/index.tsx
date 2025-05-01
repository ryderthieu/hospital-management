import React from "react"
import type { WeekViewProps } from "./types"
import { getAppointmentsForTimeSlot } from "../../services/date.services"

const WeekView: React.FC<WeekViewProps> = ({ days, appointments, timeSlots }) => {
  const weekdays = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"]

  return (
    <div className="grid grid-cols-8 border-t border-l">
      {/* Weekday headers */}
      {weekdays.map((day, index) => (
        <div key={index} className="p-2 border-r border-b text-center font-medium">
          {index === 0 ? (
            ""
          ) : (
            <>
              <div>{day}</div>
              <div className="text-sm">{index < weekdays.length - 1 && days[index - 1].getDate()}</div>
            </>
          )}
        </div>
      ))}

      {/* Time slots */}
      {timeSlots.map((slot, slotIndex) => (
        <React.Fragment key={slotIndex}>
          {/* Time label */}
          <div className="border-r border-b py-2 px-1 text-xs">{slot.label}</div>

          {/* Appointment slots for each day */}
          {days.map((day, dayIndex) => {
            const dayAppointments = getAppointmentsForTimeSlot(appointments, day, slot.start, slot.end)

            return (
              <div
                key={dayIndex}
                className={`border-r border-b p-1 ${dayAppointments.length > 0 ? "bg-blue-100" : ""}`}
              >
                {dayAppointments.map((app, appIndex) => (
                  <div key={appIndex} className="text-sm bg-blue-200 p-1 rounded mb-1">
                    {app.title}
                  </div>
                ))}
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

export default WeekView
