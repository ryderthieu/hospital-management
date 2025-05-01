"use client"

import type React from "react"
import { X, ChevronDown } from "lucide-react"
import type { AppointmentModalProps } from "./types"
import { formatMonthYear, formatTimeRange } from "../../services/date.services"

const AppointmentModal: React.FC<AppointmentModalProps> = ({ selectedDay, appointments, onClose }) => {
  if (!selectedDay) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formatMonthYear(selectedDay)}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((app, index) => (
              <div key={index} className="border rounded-lg p-3 bg-blue-50">
                <div className="font-medium text-blue-600">{formatTimeRange(app.startTime, app.endTime)}</div>
                <div className="flex items-center text-blue-700">
                  {app.title}
                  <ChevronDown size={16} className="ml-1" />
                </div>
                {app.description && <div className="text-sm text-gray-600 mt-1">{app.description}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Không có lịch hẹn cho ngày này</p>
        )}
      </div>
    </div>
  )
}

export default AppointmentModal
