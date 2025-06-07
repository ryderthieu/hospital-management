import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';

// Types
interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: Date;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
  appointmentCount: number;
}

type ViewType = 'month' | 'week';

// Utility functions
const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  
  // Get days from previous month to fill first week
  const firstDay = new Date(date).getDay();
  const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday as first day
  
  for (let i = prevMonthDays; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i);
    days.push(prevDate);
  }
  
  // Get all days in current month
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  // Get days from next month to complete last week
  const lastDay = new Date(year, month + 1, 0).getDay();
  const nextMonthDays = lastDay === 0 ? 0 : 7 - lastDay;
  
  for (let i = 1; i <= nextMonthDays; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push(nextDate);
  }
  
  return days;
};

const getWeekDays = (date: Date): Date[] => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday as first day
  
  const monday = new Date(date);
  monday.setDate(diff);
  
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    days.push(nextDate);
  }
  
  return days;
};

const formatMonthYear = (date: Date, locale: string = 'vi-VN'): string => {
  return `${date.getDate()} Tháng ${date.getMonth() + 1} ${date.getFullYear()}`;
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${startDate.getDate()} Tháng ${startDate.getMonth() + 1} ${startDate.getFullYear()} - ${endDate.getDate()} Tháng ${endDate.getMonth() + 1} ${endDate.getFullYear()}`;
};

const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

const generateMockAppointments = (): Appointment[] => {
  // Generate some mock appointments for demonstration
  const today = new Date();
  const appointments: Appointment[] = [];
  
  // Generate appointments for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    // Add morning appointment
    if (Math.random() > 0.5) {
      appointments.push({
        id: `appointment-${date.toISOString()}-1`,
        title: 'Khám bệnh',
        description: 'P[08] Dị ứng - Miễn dịch lâm sàng',
        startTime: '07:00',
        endTime: '11:30',
        date: new Date(date)
      });
    }
    
    // Add afternoon appointment
    if (Math.random() > 0.5) {
      appointments.push({
        id: `appointment-${date.toISOString()}-2`,
        title: 'Khám bệnh',
        description: 'P[08] Dị ứng - Miễn dịch lâm sàng',
        startTime: '13:00',
        endTime: '16:30',
        date: new Date(date)
      });
    }
  }
  
  return appointments;
};

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);
  const [totalWeekHours, setTotalWeekHours] = useState<number>(32.5);
  const [totalMonthHours, setTotalMonthHours] = useState<number>(117);
  
  // Initialize with mock data
  useEffect(() => {
    const mockAppointments = generateMockAppointments();
    setAppointments(mockAppointments);
  }, []);
  
  // Update calendar days when date or view changes
  useEffect(() => {
    let days: Date[] = [];
    
    if (view === 'month') {
      days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    } else {
      days = getWeekDays(currentDate);
    }
    
    const calDays: CalendarDay[] = days.map(day => {
      const dayAppointments = appointments.filter(app => 
        app.date.getDate() === day.getDate() && 
        app.date.getMonth() === day.getMonth() && 
        app.date.getFullYear() === day.getFullYear()
      );
      
      return {
        date: day,
        isCurrentMonth: day.getMonth() === currentDate.getMonth(),
        appointments: dayAppointments,
        appointmentCount: dayAppointments.length
      };
    });
    
    setCalendarDays(calDays);
  }, [currentDate, view, appointments]);
  
  // Update selected day appointments when selectedDay changes
  useEffect(() => {
    if (selectedDay) {
      const dayAppointments = appointments.filter(app => 
        app.date.getDate() === selectedDay.getDate() && 
        app.date.getMonth() === selectedDay.getMonth() && 
        app.date.getFullYear() === selectedDay.getFullYear()
      );
      setSelectedDayAppointments(dayAppointments);
    } else {
      setSelectedDayAppointments([]);
    }
  }, [selectedDay, appointments]);
  
  const handlePreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };
  
  const handleCloseAppointmentModal = () => {
    setSelectedDay(null);
  };
  
  const renderMonthView = () => {
    const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    
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
              !day.isCurrentMonth ? 'bg-gray-100' : 
              day.date.getDate() === new Date().getDate() && 
              day.date.getMonth() === new Date().getMonth() && 
              day.date.getFullYear() === new Date().getFullYear() ? 'bg-teal-900 text-white' : ''
            }`}
            onClick={() => handleDayClick(day.date)}
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
    );
  };
  
  const renderWeekView = () => {
    const weekdays = ['', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const timeSlots = [
      { label: '7:00 - 8:00', start: '07:00', end: '08:00' },
      { label: '8:00 - 9:00', start: '08:00', end: '09:00' },
      { label: '9:00 - 10:00', start: '09:00', end: '10:00' },
      { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
      { label: '11:00 - 11:30', start: '11:00', end: '11:30' },
      { label: '13:00 - 14:00', start: '13:00', end: '14:00' },
      { label: '14:00 - 15:00', start: '14:00', end: '15:00' },
      { label: '15:00 - 16:00', start: '15:00', end: '16:00' },
      { label: '16:00 - 17:00', start: '16:00', end: '17:00' },
      { label: '17:00 - 18:00', start: '17:00', end: '18:00' },
    ];
    
    const days = getWeekDays(currentDate);
    
    return (
      <div className="grid grid-cols-8 border-t border-l">
        {/* Weekday headers */}
        {weekdays.map((day, index) => (
          <div key={index} className="p-2 border-r border-b text-center font-medium">
            {index === 0 ? '' : (
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
            <div className="border-r border-b py-2 px-1 text-xs">
              {slot.label}
            </div>
            
            {/* Appointment slots for each day */}
            {days.map((day, dayIndex) => {
              const dayAppointments = appointments.filter(app => 
                app.date.getDate() === day.getDate() && 
                app.date.getMonth() === day.getMonth() && 
                app.date.getFullYear() === day.getFullYear() &&
                app.startTime <= slot.start && app.endTime >= slot.end
              );
              
              return (
                <div 
                  key={dayIndex} 
                  className={`border-r border-b p-1 ${
                    dayAppointments.length > 0 ? 'bg-blue-100' : ''
                  }`}
                >
                  {dayAppointments.map((app, appIndex) => (
                    <div key={appIndex} className="text-sm bg-blue-200 p-1 rounded mb-1">
                      {app.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  const renderAppointmentModal = () => {
    if (!selectedDay) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {formatMonthYear(selectedDay)}
            </h2>
            <button onClick={handleCloseAppointmentModal} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          {selectedDayAppointments.length > 0 ? (
            <div className="space-y-4">
              {selectedDayAppointments.map((app, index) => (
                <div key={index} className="border rounded-lg p-3 bg-blue-50">
                  <div className="font-medium text-blue-600">{formatTimeRange(app.startTime, app.endTime)}</div>
                  <div className="flex items-center text-blue-700">
                    {app.title}
                    <ChevronDown size={16} className="ml-1" />
                  </div>
                  {app.description && (
                    <div className="text-sm text-gray-600 mt-1">{app.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có lịch hẹn cho ngày này</p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full bg-white">
      {/* Date navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-semibold">
          {view === 'month' 
            ? formatMonthYear(currentDate)
            : formatDateRange(getWeekDays(currentDate)[0], getWeekDays(currentDate)[6])
          }
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePreviousPeriod}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNextPeriod}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
          <div className="flex items-center ml-2">
            <span className="mr-2">Năm</span>
            <select 
              value={currentDate.getFullYear()} 
              onChange={(e) => {
                const newDate = new Date(currentDate);
                newDate.setFullYear(parseInt(e.target.value));
                setCurrentDate(newDate);
              }}
              className="border rounded px-2 py-1"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Working hours summary */}
      <div className="flex mb-4 space-x-8">
        <div>
          <div className="text-sm text-gray-600 mb-1">Tổng số giờ làm việc trong tuần</div>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600" style={{ width: '75%' }}></div>
            </div>
            <span className="ml-2 font-medium">{totalWeekHours}h</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Tổng số giờ làm việc trong tháng</div>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: '85%' }}></div>
            </div>
            <span className="ml-2 font-medium">{totalMonthHours}h</span>
          </div>
        </div>
      </div>
      
      {/* Month tabs */}
      <div className="flex border-b mb-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <button 
            key={month}
            className={`px-4 py-2 ${
              currentDate.getMonth() + 1 === month ? 'border-b-2 border-teal-600 text-teal-600' : ''
            }`}
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(month - 1);
              setCurrentDate(newDate);
            }}
          >
            Tháng {month}
          </button>
        ))}
      </div>
      
      {/* View toggle - Tuần vs. Tháng */}
      <div className="flex justify-end mb-4">
        <div className="flex text-sm">
          <span className="mr-2">Hiển thị:</span>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as ViewType)}
            className="border rounded px-2 py-1"
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
          </select>
        </div>
      </div>
      
      {/* Calendar view */}
      <div className="border rounded-lg overflow-hidden">
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </div>
      
      {/* Appointment modal */}
      {renderAppointmentModal()}
    </div>
  );
};

export default Schedule;
