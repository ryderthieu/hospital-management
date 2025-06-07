"use client"

import React, { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { fontFamily } from "../../../context/FontContext"

interface DatePickerModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (date: string) => void
  selectedDate: string
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedDate,
}) => {
  // Parse selectedDate string to Date object
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // Format Date object to string
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Format date for display header
  const formatDisplayDate = (date: Date): string => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    const dayName = days[date.getDay()]
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${dayName}, ${day}/${month}/${year}`
  }

  // Format month year for calendar header
  const formatMonthYear = (date: Date): string => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const [currentDate, setCurrentDate] = useState<Date>(parseDate(selectedDate))
  const [viewDate, setViewDate] = useState<Date>(parseDate(selectedDate))
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)

  // Generate years (from 1900 to 2100)
  const generateYears = () => {
    const years = []
    for (let year = 1900; year <= 2100; year++) {
      years.push(year)
    }
    return years
  }

  // Generate months
  const generateMonths = () => {
    return [
      { value: 0, label: 'Tháng 1' },
      { value: 1, label: 'Tháng 2' },
      { value: 2, label: 'Tháng 3' },
      { value: 3, label: 'Tháng 4' },
      { value: 4, label: 'Tháng 5' },
      { value: 5, label: 'Tháng 6' },
      { value: 6, label: 'Tháng 7' },
      { value: 7, label: 'Tháng 8' },
      { value: 8, label: 'Tháng 9' },
      { value: 9, label: 'Tháng 10' },
      { value: 10, label: 'Tháng 11' },
      { value: 11, label: 'Tháng 12' },
    ]
  }

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    
    // First day of the month
    const firstDay = new Date(year, month, 1)
    
    // Start from Monday (1) instead of Sunday (0)
    const startDate = new Date(firstDay)
    const dayOfWeek = firstDay.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(firstDay.getDate() - daysToSubtract)
    
    const days = []
    const currentDateObj = new Date(startDate)
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj))
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }
    
    return days
  }

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
  }

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate)
    newDate.setMonth(viewDate.getMonth() - 1)
    setViewDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(viewDate)
    newDate.setMonth(viewDate.getMonth() + 1)
    setViewDate(newDate)
  }

  const handleMonthYearSelect = (month: number, year: number) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(month)
    newDate.setFullYear(year)
    setViewDate(newDate)
    setShowMonthYearPicker(false)
  }

  const handleConfirm = () => {
    const formattedDate = formatDate(currentDate)
    onSelect(formattedDate)
    onClose()
  }

  const handleCancel = () => {
    // Reset to original date
    setCurrentDate(parseDate(selectedDate))
    setViewDate(parseDate(selectedDate))
    setShowMonthYearPicker(false)
    onClose()
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date): boolean => {
    return date.toDateString() === currentDate.toDateString()
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === viewDate.getMonth()
  }

  const calendarDays = getCalendarDays()
  const years = generateYears()
  const months = generateMonths()

  if (showMonthYearPicker) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowMonthYearPicker(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.pickerTitle, { fontFamily: fontFamily.medium }]}>
              Chọn tháng và năm
            </Text>
            
            <View style={styles.pickerContainer}>
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerColumnTitle, { fontFamily: fontFamily.medium }]}>Tháng</Text>
                <ScrollView style={styles.pickerScrollView} showsVerticalScrollIndicator={false}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      style={[
                        styles.pickerItem,
                        month.value === viewDate.getMonth() && styles.selectedPickerItem
                      ]}
                      onPress={() => handleMonthYearSelect(month.value, viewDate.getFullYear())}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          { fontFamily: fontFamily.regular },
                          month.value === viewDate.getMonth() && styles.selectedPickerItemText
                        ]}
                      >
                        {month.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerColumnTitle, { fontFamily: fontFamily.medium }]}>Năm</Text>
                <ScrollView 
                  style={styles.pickerScrollView} 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 10 }}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        year === viewDate.getFullYear() && styles.selectedPickerItem
                      ]}
                      onPress={() => handleMonthYearSelect(viewDate.getMonth(), year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          { fontFamily: fontFamily.regular },
                          year === viewDate.getFullYear() && styles.selectedPickerItemText
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowMonthYearPicker(false)}
              >
                <Text style={[styles.cancelButtonText, { fontFamily: fontFamily.medium }]}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={() => setShowMonthYearPicker(false)}
              >
                <Text style={[styles.confirmButtonText, { fontFamily: fontFamily.medium }]}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Selected Date Display */}
          <View style={styles.selectedDateContainer}>
            <Text style={[styles.selectedDateText, { fontFamily: fontFamily.regular }]}>
              {formatDisplayDate(currentDate)}
            </Text>
            <Icon name="keyboard-arrow-up" size={24} color="#666" />
          </View>

          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
              <Icon name="chevron-left" size={24} color="#333" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowMonthYearPicker(true)}>
              <Text style={[styles.monthYearText, { fontFamily: fontFamily.medium }]}>
                {formatMonthYear(viewDate)}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Days of Week Header */}
          <View style={styles.daysHeader}>
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <Text key={day} style={[styles.dayHeaderText, { fontFamily: fontFamily.regular }]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((date, index) => {
              const isCurrentMonthDate = isCurrentMonth(date)
              const isTodayDate = isToday(date)
              const isSelectedDate = isSelected(date)
              
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.dayCell}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { fontFamily: fontFamily.regular },
                      !isCurrentMonthDate && styles.otherMonthDayText,
                      isSelectedDate && styles.selectedDayText,
                      isTodayDate && !isSelectedDate && styles.todayDayText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={[styles.cancelButtonText, { fontFamily: fontFamily.medium }]}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={[styles.confirmButtonText, { fontFamily: fontFamily.medium }]}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -175 }, { translateY: -250 }],
    width: 350,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContent: {
    padding: 20,
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedDateText: {
    fontSize: 16,
    color: "#333",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 18,
    color: "#333",
    textDecorationLine: "underline",
  },
  daysHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#999",
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  dayText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    width: 36,
    height: 36,
    lineHeight: 36,
    textAlignVertical: "center",
    borderRadius: 18,
  },
  selectedDayText: {
    color: "#fff",
    backgroundColor: "#00BCD4",
    overflow: "hidden",
  },
  todayDayText: {
    color: "#00BCD4",
    borderWidth: 2,
    borderColor: "#00BCD4",
  },
  otherMonthDayText: {
    color: "#CCC",
  },
  // Month/Year Picker Styles
  pickerTitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    height: 300,
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerColumnTitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  pickerScrollView: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedPickerItem: {
    backgroundColor: "#00BCD4",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  selectedPickerItemText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#00BCD4",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
})

export default DatePickerModal