"use client"

import { useState, useEffect } from "react"
import type { Appointment, CalendarDay, ViewType } from "../../types/schedule.types"
import { getDaysInMonth, getWeekDays, getAppointmentsForDay } from "../../services/date.services"
import { generateMockAppointments } from "../../services/mock.services"

export const useSchedule = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<ViewType>("month")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([])
  const [totalWeekHours] = useState<number>(32.5)
  const [totalMonthHours] = useState<number>(117)

  // Initialize with mock data
  useEffect(() => {
    const mockAppointments = generateMockAppointments()
    setAppointments(mockAppointments)
  }, [])

  // Update calendar days when date or view changes
  useEffect(() => {
    let days: Date[] = []

    if (view === "month") {
      days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
    } else {
      days = getWeekDays(currentDate)
    }

    const calDays: CalendarDay[] = days.map((day) => {
      const dayAppointments = getAppointmentsForDay(appointments, day)

      return {
        date: day,
        isCurrentMonth: day.getMonth() === currentDate.getMonth(),
        appointments: dayAppointments,
        appointmentCount: dayAppointments.length,
      }
    })

    setCalendarDays(calDays)
  }, [currentDate, view, appointments])

  // Update selected day appointments when selectedDay changes
  useEffect(() => {
    if (selectedDay) {
      const dayAppointments = getAppointmentsForDay(appointments, selectedDay)
      setSelectedDayAppointments(dayAppointments)
    } else {
      setSelectedDayAppointments([])
    }
  }, [selectedDay, appointments])

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

  const handleCloseAppointmentModal = () => {
    setSelectedDay(null)
  }

  return {
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
  }
}
