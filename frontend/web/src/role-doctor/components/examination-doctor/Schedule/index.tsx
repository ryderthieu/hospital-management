"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, BriefcaseMedical, Calendar } from "lucide-react"
import { Modal, Select, Tabs, Button, Card, Progress, Badge, Tooltip, Empty, Descriptions } from "antd"
import { useSchedule } from "./new/hooks"
import {
  formatMonthYear,
  formatDateRange,
  getWeekDays,
  formatTimeRange,
  formatDayMonthYear,
  formatScheduleDate,
  formatScheduleTime,
  parseScheduleDate,
} from "./new/services"
import type { TimeSlot, MonthViewProps, WeekViewProps, ScheduleModalProps, Schedule } from "./new/types"

const { Option } = Select

// MonthView Component
const MonthView: React.FC<MonthViewProps> = ({ calendarDays, onDayClick }) => {
  const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"]
  const today = new Date()

  return (
    <div className="grid grid-cols-7">
      {/* Weekday headers */}
      {weekdays.map((day, index) => (
        <div
          key={index}
          className="p-3 border-r border-b border-gray-200 text-center font-semibold text-gray-700 bg-gray-50"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarDays.map((day, index) => {
        const isToday =
          day.date.getDate() === today.getDate() &&
          day.date.getMonth() === today.getMonth() &&
          day.date.getFullYear() === today.getFullYear()

        return (
          <div
            key={index}
            className={`border-r border-b border-gray-200 min-h-24 p-2 relative cursor-pointer transition-all duration-200 hover:bg-base-50 ${
              !day.isCurrentMonth
                ? "bg-gray-100 text-gray-400"
                : isToday
                  ? "bg-base-700 text-white font-semibold shadow-lg"
                  : "bg-white text-gray-800 hover:shadow-md"
            }`}
            onClick={() => onDayClick(day.date)}
          >
            <div className="relative w-full h-full">
              <span className="flex items-center justify-center text-lg h-full">{day.date.getDate()}</span>
              {day.scheduleCount > 0 && (
                <Badge
                  count={day.scheduleCount}
                  size="default"
                  className="absolute -top-21 -right-44"
                  style={{
                    backgroundColor: isToday ? "#ffffff" : "#036672",
                    color: isToday ? "#036672" : "#ffffff",
                    fontSize: "10px",
                    minWidth: "16px",
                    height: "16px",
                    lineHeight: "16px",
                  }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// WeekView Component
const WeekView: React.FC<WeekViewProps & { onScheduleClick: (schedule: Schedule) => void }> = ({
  days,
  schedules,
  timeSlots,
  onScheduleClick,
}) => {
  const weekdays = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const allTimeSlots = [
    { label: "6:00", start: "06:00", end: "07:00" },
    { label: "7:00", start: "07:00", end: "08:00" },
    { label: "8:00", start: "08:00", end: "09:00" },
    { label: "9:00", start: "09:00", end: "10:00" },
    { label: "10:00", start: "10:00", end: "11:00" },
    { label: "11:00", start: "11:00", end: "12:00" },
    { label: "12:00", start: "12:00", end: "13:00" },
    { label: "13:00", start: "13:00", end: "14:00" },
    { label: "14:00", start: "14:00", end: "15:00" },
    { label: "15:00", start: "15:00", end: "16:00" },
    { label: "16:00", start: "16:00", end: "17:00" },
    { label: "17:00", start: "17:00", end: "18:00" },
    { label: "18:00", start: "18:00", end: "19:00" },
    { label: "19:00", start: "19:00", end: "20:00" },
    { label: "20:00", start: "20:00", end: "21:00" },
    { label: "21:00", start: "21:00", end: "22:00" },
  ]

  const earliestTime = timeToMinutes(allTimeSlots[0].start)
  const latestTime = timeToMinutes(allTimeSlots[allTimeSlots.length - 1].end)
  const totalMinutes = latestTime - earliestTime

  const getSchedulesForDay = (day: Date) => {
    return schedules.filter((sch) => {
      const scheduleDate = parseScheduleDate(sch.date)
      return (
        scheduleDate.getDate() === day.getDate() &&
        scheduleDate.getMonth() === day.getMonth() &&
        scheduleDate.getFullYear() === day.getFullYear()
      )
    })
  }

  const getScheduleStyle = (startTime: string, endTime: string) => {
    const formattedStartTime = formatScheduleTime(startTime)
    const formattedEndTime = formatScheduleTime(endTime)
    const startMinutes = timeToMinutes(formattedStartTime)
    const endMinutes = timeToMinutes(formattedEndTime)
    const top = ((startMinutes - earliestTime) / totalMinutes) * 100
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100
    return { top: `${top}%`, height: `${Math.max(height, 3)}%` }
  }

  const isToday = (day: Date): boolean => {
    const today = new Date()
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  const isScheduleInProgress = (sch: Schedule): boolean => {
    const now = new Date()
    const scheduleDate = parseScheduleDate(sch.date)

    if (
      scheduleDate.getDate() !== now.getDate() ||
      scheduleDate.getMonth() !== now.getMonth() ||
      scheduleDate.getFullYear() !== now.getFullYear()
    ) {
      return false
    }

    const formattedStartTime = formatScheduleTime(sch.startTime)
    const formattedEndTime = formatScheduleTime(sch.endTime)
    const [startHours, startMinutes] = formattedStartTime.split(":").map(Number)
    const [endHours, endMinutes] = formattedEndTime.split(":").map(Number)

    const schStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes)
    const schEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes)

    return now >= schStart && now <= schEnd
  }

  return (
    <div className="grid grid-cols-8">
      {/* Weekday headers */}
      {weekdays.map((day, index) => {
        if (index === 0) {
          return (
            <div key={index} className="p-3 border-r border-b border-gray-200 text-center font-semibold bg-gray-50">
              Giờ
            </div>
          )
        }

        const currentDay = days[index - 1]
        const dayIsToday = currentDay ? isToday(currentDay) : false

        return (
          <div
            key={index}
            className={`p-3 border-r border-b border-gray-200 text-center font-semibold ${
              dayIsToday ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-700"
            }`}
          >
            <div>{day}</div>
            <div className="text-sm font-normal mt-1">{currentDay?.getDate()}</div>
          </div>
        )
      })}

      <div className="col-span-8 grid grid-cols-8" style={{ height: "700px" }}>
        {/* Time slots column */}
        <div className="col-span-1 border-r border-gray-200 relative h-full bg-gray-50">
          {allTimeSlots.map((slot, slotIndex) => {
            const startMinutes = timeToMinutes(slot.start)
            const top = ((startMinutes - earliestTime) / totalMinutes) * 100
            const height = (60 / totalMinutes) * 100 // 1 hour height

            return (
              <div
                key={slotIndex}
                className="absolute border-b border-gray-200 py-2 px-2 text-sm font-medium flex justify-center items-center w-full z-10 text-gray-700"
                style={{ top: `${top}%`, height: `${height}%` }}
              >
                {slot.label}
              </div>
            )
          })}
        </div>

        {/* Days columns */}
        {days.map((day, dayIndex) => {
          const daySchedules = getSchedulesForDay(day)

          return (
            <div key={dayIndex} className="col-span-1 border-r border-gray-200 relative h-full bg-white">
              {allTimeSlots.map((slot, slotIndex) => {
                const startMinutes = timeToMinutes(slot.start)
                const top = ((startMinutes - earliestTime) / totalMinutes) * 100
                const height = (60 / totalMinutes) * 100

                return (
                  <div
                    key={slotIndex}
                    className="absolute w-full border-b border-gray-100"
                    style={{
                      top: `${top}%`,
                      height: `${height}%`,
                      backgroundColor: slotIndex % 2 === 0 ? "rgba(249, 250, 251, 0.5)" : "transparent",
                      zIndex: 5,
                    }}
                  />
                )
              })}

              {daySchedules.map((sch, schIndex) => {
                const style = getScheduleStyle(sch.startTime, sch.endTime)
                const inProgress = isScheduleInProgress(sch)

                return (
                  <Tooltip key={schIndex} title={`${sch.title} - ${formatTimeRange(sch.startTime, sch.endTime)}`}>
                    <div
                      className={`absolute left-1 right-1 p-2 rounded-lg text-sm border-l-4 shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        inProgress
                          ? "bg-base-50 border-l-base-500 border border-base-200 hover:bg-base-100"
                          : "bg-blue-50 border-l-blue-500 border border-blue-200 hover:bg-blue-100"
                      }`}
                      style={{ ...style, zIndex: 20 }}
                      onClick={() => onScheduleClick(sch)}
                    >
                      <div className={`font-semibold text-sm ${inProgress ? "text-base-700" : "text-blue-700"}`}>
                        {sch.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{formatTimeRange(sch.startTime, sch.endTime)}</div>
                      <div className="text-xs text-gray-600 mt-1">{sch.shift === "MORNING" ? "Buổi sáng" : "Buổi chiều"}</div>
                      <div className="text-xs text-gray-600 mt-1">{sch.roomNote}</div>
                    </div>
                  </Tooltip>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ selectedDay, schedules, onClose }) => {
  if (!selectedDay) return null

  return (
    <Modal
      title={
        <div className="flex items-center">
          <Clock className="mr-2 text-base-600" size={20} />
          <span>Lịch làm việc - {formatDayMonthYear(selectedDay)}</span>
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={700}
      className="schedule-modal"
    >
      {schedules.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có lịch làm việc trong ngày này"
          className="py-8"
        />
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {schedules.map((schedule, index) => (
            <Card key={index} size="small" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <BriefcaseMedical size={16} className="text-base-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">{schedule.title}</h3>
                  </div>

                  <div className="flex items-center mb-2 text-sm text-gray-600">
                    <Clock size={14} className="mr-2" />
                    <span>{formatTimeRange(schedule.startTime, schedule.endTime)}</span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">{schedule.shift === "MORNING" ? "Buổi sáng" : "Buổi chiều"}</div>

                  <div className="text-sm text-gray-600">Địa điểm: {"Tòa nhà " + schedule.building + ", tầng " + schedule.floor + ", " +  schedule.roomNote}</div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </Modal>
  )
}

const ScheduleDetailModal: React.FC<{
  schedule: Schedule | null
  onClose: () => void
}> = ({ schedule, onClose }) => {
  if (!schedule) return null

  return (
    <Modal
      title={
        <div className="flex items-center">
          <BriefcaseMedical className="mr-2 text-base-600" size={20} />
          <span>Chi tiết lịch làm việc</span>
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={600}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Loại công việc" labelStyle={{ fontWeight: "bold" }}>
          <div className="flex items-center">
            {schedule.title}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian" labelStyle={{ fontWeight: "bold" }}>
          <div className="flex items-center">
            {formatTimeRange(schedule.startTime, schedule.endTime)}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày" labelStyle={{ fontWeight: "bold" }}>
          <div className="flex items-center">
            {formatScheduleDate(schedule.date)}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Ca làm việc" labelStyle={{ fontWeight: "bold" }}>
          {schedule.shift === "MORNING" ? "Buổi sáng" : "Buổi chiều"}
        </Descriptions.Item>

        <Descriptions.Item label="Địa điểm" labelStyle={{ fontWeight: "bold" }}>
          <span>{"Tòa nhà " + schedule.building + ", tầng " + schedule.floor + ", " +  schedule.roomNote}</span>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

// Main Schedule Component
export const ScheduleComponent: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    view,
    setView,
    schedules,
    calendarDays,
    selectedDay,
    selectedDaySchedules,
    totalWeekHours,
    totalMonthHours,
    handlePreviousPeriod,
    handleNextPeriod,
    handleDayClick,
    handleCloseScheduleModal,
  } = useSchedule()

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

  const timeSlots: TimeSlot[] = [
    { label: "7:00 - 8:00", start: "07:00", end: "08:00" },
    { label: "8:00 - 9:00", start: "08:00", end: "09:00" },
    { label: "9:00 - 10:00", start: "09:00", end: "10:00" },
    { label: "10:00 - 11:00", start: "10:00", end: "11:00" },
    { label: "11:00 - 12:00", start: "11:00", end: "12:00" },
    { label: "13:00 - 14:00", start: "13:00", end: "14:00" },
    { label: "14:00 - 15:00", start: "14:00", end: "15:00" },
    { label: "15:00 - 16:00", start: "15:00", end: "16:00" },
    { label: "16:00 - 17:00", start: "16:00", end: "17:00" },
    { label: "17:00 - 18:00", start: "17:00", end: "18:00" },
  ]

  const monthTabs = Array.from({ length: 12 }, (_, i) => ({
    key: (i + 1).toString(),
    label: `Tháng ${i + 1}`,
    month: i + 1,
  }))

  const handleMonthChange = (activeKey: string) => {
    const month = Number.parseInt(activeKey)
    const newDate = new Date(currentDate)
    newDate.setMonth(month - 1)
    setCurrentDate(newDate)
  }

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
  }

  const handleCloseScheduleDetail = () => {
    setSelectedSchedule(null)
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 border-b border-gray-200">
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mr-4">
            {view === "month"
              ? formatMonthYear(currentDate)
              : formatDateRange(getWeekDays(currentDate)[0], getWeekDays(currentDate)[6])}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              icon={<ChevronLeft size={16} />}
              onClick={handlePreviousPeriod}
              type="text"
              className="flex items-center justify-center"
            />
            <Button
              icon={<ChevronRight size={16} />}
              onClick={handleNextPeriod}
              type="text"
              className="flex items-center justify-center"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Năm:</span>
            <Select
              value={currentDate.getFullYear()}
              onChange={(year) => {
                const newDate = new Date(currentDate)
                newDate.setFullYear(year)
                setCurrentDate(newDate)
              }}
              style={{ width: 100 }}
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Hiển thị theo:</span>
            <Select value={view} onChange={(value) => setView(value as "month" | "week")} style={{ width: 100 }}>
              <Option value="month">Tháng</Option>
              <Option value="week">Tuần</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Month Tabs */}
      <div className="custom-tabs px-5">
        <Tabs
          activeKey={(currentDate.getMonth() + 1).toString()}
          onChange={handleMonthChange}
          type="line"
          size="large"
          items={monthTabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
          }))}
        />
      </div>

      {/* Working Hours */}
      <div className="flex space-x-8 mb-6 px-4">
        <Card size="small" className="flex-1">
          <div className="text-sm text-gray-600 mb-2">Tổng số giờ làm việc trong tuần</div>
          <div className="flex items-center">
            <Progress
              percent={Math.min(100, (totalWeekHours / 40) * 100)} // Assuming 40 hours is a full work week
              showInfo={false}
              strokeColor={{ from: "#52c41a", to: "#73d13d" }}
              className="flex-1 mr-3"
            />
            <span className="font-semibold text-gray-800">{totalWeekHours}h</span>
          </div>
        </Card>

        <Card size="small" className="flex-1">
          <div className="text-sm text-gray-600 mb-2">Tổng số giờ làm việc trong tháng</div>
          <div className="flex items-center">
            <Progress
              percent={Math.min(100, (totalMonthHours / 160) * 100)} // Assuming 160 hours is a full work month
              showInfo={false}
              strokeColor={{ from: "#1890ff", to: "#40a9ff" }}
              className="flex-1 mr-3"
            />
            <span className="font-semibold text-gray-800">{totalMonthHours}h</span>
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="mx-4 mb-4" bodyStyle={{ padding: 0 }}>
        {view === "month" ? (
          <MonthView calendarDays={calendarDays} onDayClick={handleDayClick} />
        ) : (
          <WeekView
            days={getWeekDays(currentDate)}
            schedules={schedules}
            timeSlots={timeSlots}
            onScheduleClick={handleScheduleClick}
          />
        )}
      </Card>

      {/* Day Appointments Modal */}
      <ScheduleModal selectedDay={selectedDay} schedules={selectedDaySchedules} onClose={handleCloseScheduleModal} />

      {/* Schedule Detail Modal */}
      <ScheduleDetailModal schedule={selectedSchedule} onClose={handleCloseScheduleDetail} />

      <style>{`
        .month-tabs .ant-tabs-nav {
          margin-bottom: 0;
        }

        .month-tabs .ant-tabs-tab {
          margin: 0 2px;
          padding: 4px 12px;
          font-size: 12px;
        }

        .schedule-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }

        .schedule-modal .ant-modal-body {
          padding: 24px;
        }

        .custom-tabs .ant-tabs-nav-list {
          display: flex !important;
          justify-content: space-between !important;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
