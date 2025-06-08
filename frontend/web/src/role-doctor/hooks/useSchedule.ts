"use client"

import { useState, useEffect, useCallback } from "react"
import type { Schedule, CalendarDay, ViewType } from "../types/schedule"
import {
  getDaysInMonth,
  getWeekDays,
  getSchedulesForDay,
  scheduleService,
  calculateTimeDifference,
  isDateInCurrentWeek,
  isDateInCurrentMonth,
} from "../services/scheduleServices"
import { message } from "antd"

export const useSchedule = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<ViewType>("month")
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>([])
  const [totalWeekHours, setTotalWeekHours] = useState<number>(0)
  const [totalMonthHours, setTotalMonthHours] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const scheduleData = await scheduleService.getSchedules()
      setSchedules(scheduleData)
      console.log(scheduleData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải lịch làm việc"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  // Calculate total working hours for week and month
  useEffect(() => {
    if (schedules.length === 0) return

    // Calculate week hours
    let weekHours = 0
    let monthHours = 0

    schedules.forEach((schedule) => {
      const scheduleDate = new Date(schedule.date)
      const hours = calculateTimeDifference(schedule.startTime, schedule.endTime)

      if (isDateInCurrentWeek(scheduleDate, currentDate)) {
        weekHours += hours
      }

      if (isDateInCurrentMonth(scheduleDate, currentDate)) {
        monthHours += hours
      }
    })

    setTotalWeekHours(Number.parseFloat(weekHours.toFixed(1)))
    setTotalMonthHours(Number.parseFloat(monthHours.toFixed(1)))
  }, [schedules, currentDate])

  // Update calendar days when date or view changes
  useEffect(() => {
    let days: Date[] = []

    if (view === "month") {
      days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
    } else {
      days = getWeekDays(currentDate)
    }

    const calDays: CalendarDay[] = days.map((day) => {
      const daySchedules = getSchedulesForDay(schedules, day)

      return {
        date: day,
        isCurrentMonth: day.getMonth() === currentDate.getMonth(),
        schedules: daySchedules,
        scheduleCount: daySchedules.length,
      }
    })

    setCalendarDays(calDays)
  }, [currentDate, view, schedules])

  // Update selected day schedules when selectedDay changes
  useEffect(() => {
    if (selectedDay) {
      const dayschedules = getSchedulesForDay(schedules, selectedDay)
      setSelectedDaySchedules(dayschedules)
    } else {
      setSelectedDaySchedules([])
    }
  }, [selectedDay, schedules])

  const handlePreviousPeriod = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
  }

  const handleCloseScheduleModal = () => {
    setSelectedDay(null)
  }

  return {
    currentDate,
    setCurrentDate,
    view,
    setView,
    loading,
    error,
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
  }
}
