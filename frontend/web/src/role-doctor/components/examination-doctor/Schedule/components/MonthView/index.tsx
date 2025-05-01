"use client"

import type React from "react"
import type { MonthViewProps } from "./types"

const MonthView: React.FC<MonthViewProps> = ({ calendarDays, onDayClick }) => {
  const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"]

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {/* Weekday headers */}
      {weekdays.map((day, index) => (
        <div key={index} className="p-2 border-r border-b text-center font-medium">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={`border-r border-b min-h-24 p-1 relative ${
            !day.isCurrentMonth
              ? "bg-gray-100"
              : day.date.getDate() === new Date().getDate() &&
                  day.date.getMonth() === new Date().getMonth() &&
                  day.date.getFullYear() === new Date().getFullYear()
                ? "bg-teal-900 text-white"
                : ""
          }`}
          onClick={() => onDayClick(day.date)}
        >
          <div className="flex justify-between">
            <span className="text-lg">{day.date.getDate()}</span>
            {day.appointmentCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-gray-200">
                {day.appointmentCount}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MonthView
