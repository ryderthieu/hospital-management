"use client"

import type React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSchedule } from "./hooks"
import { formatMonthYear, formatDateRange, getWeekDays } from "../../services/date.services"
import type { TimeSlot, ViewType } from "../../types/schedule.types"
import MonthView from "../MonthView"
import WeekView from "../WeekView"
import AppointmentModal from "../AppointmentModal"

export const ScheduleComponent: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    view,
    setView,
    appointments,
    calendarDays,
    selectedDay,
    selectedDayAppointments,
    totalWeekHours,
    totalMonthHours,
    handlePreviousPeriod,
    handleNextPeriod,
    handleDayClick,
    handleCloseAppointmentModal,
  } = useSchedule()

  // Time slots for week view
  const timeSlots: TimeSlot[] = [
    { label: "7:00 - 8:00", start: "07:00", end: "08:00" },
    { label: "8:00 - 9:00", start: "08:00", end: "09:00" },
    { label: "9:00 - 10:00", start: "09:00", end: "10:00" },
    { label: "10:00 - 11:00", start: "10:00", end: "11:00" },
    { label: "Nghỉ trưa", start: "11:00", end: "13:00" },
    { label: "13:00 - 14:00", start: "13:00", end: "14:00" },
    { label: "14:00 - 15:00", start: "14:00", end: "15:00" },
    { label: "15:00 - 16:00", start: "15:00", end: "16:00" },
    { label: "16:00 - 17:00", start: "16:00", end: "17:00" },
    { label: "17:00 - 18:00", start: "17:00", end: "18:00" },
  ]

  return (
    <div className="w-full ">
      {/* Date navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-semibold">
          {view === "month"
            ? formatMonthYear(currentDate)
            : formatDateRange(getWeekDays(currentDate)[0], getWeekDays(currentDate)[6])}
          <button onClick={handlePreviousPeriod} className="p-2 ml-2 rounded-full hover:bg-base-200">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNextPeriod} className="p-2 ml-2 rounded-full hover:bg-base-200">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center ml-2">
            <span className="mr-2">Năm</span>
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => {
                const newDate = new Date(currentDate)
                newDate.setFullYear(Number.parseInt(e.target.value))
                setCurrentDate(newDate)
              }}
              className="border rounded outline-none focus:ring-base-200 focus:border-base-500 px-2 py-1"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      
      {/* Month tabs */}
      <div className="flex justify-between border-b mb-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <button
            key={month}
            className={`px-4 py-2  ${
              currentDate.getMonth() + 1 === month ? "font-bold border-b-2 border-base-600 text-base-600" : ""
            }`}
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(month - 1)
              setCurrentDate(newDate)
            }}
          >
            Tháng {month}
          </button>
        ))}
      </div>


      {/* Working hours summary */}
      <div className="flex mb-4 space-x-8 border border-gray-200 rounded-sm p-3 bg-white">
        <div>
          <div className="text-sm text-gray-600 mb-1">Tổng số giờ làm việc trong tuần</div>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600" style={{ width: "75%" }}></div>
            </div>
            <span className="ml-2 font-medium">{totalWeekHours}h</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Tổng số giờ làm việc trong tháng</div>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "85%" }}></div>
            </div>
            <span className="ml-2 font-medium">{totalMonthHours}h</span>
          </div>
        </div>
      </div>

      {/* View toggle - Tuần vs. Tháng */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center text-md">
          <span className="mr-2">Hiển thị theo:</span>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as ViewType)}
            className="border rounded-sm outline-none focus:ring-base-200 focus:border-base-500 px-2 py-1"
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
          </select>
        </div>
      </div>

      {/* Calendar view */}
      <div className="border rounded-lg bg-white overflow-hidden">
        {view === "month" ? (
          <MonthView calendarDays={calendarDays} onDayClick={handleDayClick} />
        ) : (
          <WeekView days={getWeekDays(currentDate)} appointments={appointments} timeSlots={timeSlots} />
        )}
      </div>

      {/* Appointment modal */}
      <AppointmentModal
        selectedDay={selectedDay}
        appointments={selectedDayAppointments}
        onClose={handleCloseAppointmentModal}
      />
    </div>
  )
}

