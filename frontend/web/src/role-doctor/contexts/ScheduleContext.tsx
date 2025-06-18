"use client"

import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"
import { message } from "antd"
import {
  scheduleService,
  calculateTimeDifference,
  isDateInCurrentWeek,
  isDateInCurrentMonth,
  getDaysInMonth,
  getWeekDays,
  getSchedulesForDay,
} from "../services/scheduleServices"
import type { Schedule, CalendarDay, ViewType } from "../types/schedule"

interface ScheduleContextType {
  // Data
  schedules: Schedule[]
  calendarDays: CalendarDay[]
  selectedDay: Date | null
  selectedDaySchedules: Schedule[]
  totalWeekHours: number
  totalMonthHours: number

  // View state
  currentDate: Date
  view: ViewType

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  setCurrentDate: (date: Date) => void
  setView: (view: ViewType) => void
  handlePreviousPeriod: () => void
  handleNextPeriod: () => void
  handleDayClick: (day: Date) => void
  handleCloseScheduleModal: () => void
  refreshSchedules: () => Promise<void>

  // Cache management
  clearCache: () => void
  isDataStale: () => boolean
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

interface ScheduleProviderProps {
  children: ReactNode
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  // Data states
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>([])
  const [totalWeekHours, setTotalWeekHours] = useState<number>(0)
  const [totalMonthHours, setTotalMonthHours] = useState<number>(0)

  // View states
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<ViewType>("month")

  // Loading states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache management
  const lastFetchTime = useRef<number>(0)
  const cacheTimeout = 5 * 60 * 1000 // 5 minutes
  const isInitialized = useRef(false)

  // Check if data is stale
  const isDataStale = useCallback(() => {
    return Date.now() - lastFetchTime.current > cacheTimeout
  }, [])

  // Fetch schedules from API
  const fetchSchedules = useCallback(
    async (force = false) => {
      // Don't fetch if data is fresh and not forced
      if (!force && !isDataStale() && isInitialized.current) {
        return
      }

      try {
        setLoading(true)
        setError(null)

        const scheduleData = await scheduleService.getSchedules()
        setSchedules(scheduleData)

        lastFetchTime.current = Date.now()
        isInitialized.current = true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể tải lịch làm việc"
        setError(errorMessage)
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [isDataStale],
  )

  // Calculate total working hours for week and month
  React.useEffect(() => {
    if (schedules.length === 0) return

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
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (selectedDay) {
      const daySchedules = getSchedulesForDay(schedules, selectedDay)
      setSelectedDaySchedules(daySchedules)
    } else {
      setSelectedDaySchedules([])
    }
  }, [selectedDay, schedules])

  // Navigation handlers
  const handlePreviousPeriod = useCallback(() => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }, [currentDate, view])

  const handleNextPeriod = useCallback(() => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }, [currentDate, view])

  const handleDayClick = useCallback((day: Date) => {
    setSelectedDay(day)
  }, [])

  const handleCloseScheduleModal = useCallback(() => {
    setSelectedDay(null)
  }, [])

  // Refresh schedules (force fetch)
  const refreshSchedules = useCallback(async () => {
    await fetchSchedules(true)
  }, [fetchSchedules])

  // Clear cache
  const clearCache = useCallback(() => {
    setSchedules([])
    setCalendarDays([])
    setSelectedDay(null)
    setSelectedDaySchedules([])
    setTotalWeekHours(0)
    setTotalMonthHours(0)
    lastFetchTime.current = 0
    isInitialized.current = false
  }, [])

  // Auto-fetch on mount
  React.useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const contextValue: ScheduleContextType = {
    // Data
    schedules,
    calendarDays,
    selectedDay,
    selectedDaySchedules,
    totalWeekHours,
    totalMonthHours,

    // View state
    currentDate,
    view,

    // Loading states
    loading,
    error,

    // Actions
    setCurrentDate,
    setView,
    handlePreviousPeriod,
    handleNextPeriod,
    handleDayClick,
    handleCloseScheduleModal,
    refreshSchedules,

    // Cache management
    clearCache,
    isDataStale,
  }

  return <ScheduleContext.Provider value={contextValue}>{children}</ScheduleContext.Provider>
}

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error("useScheduleContext must be used within a ScheduleProvider")
  }
  return context
}
