import { DateOption } from '../types';

export const generateRealTimeDates = (daysCount: number = 7): DateOption[] => {
  const dates: DateOption[] = [];
  const today = new Date();
  
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const day = dayNames[date.getDay()];
    const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
    
    // Auto-disable past dates and optionally weekends
    const isPast = date < today && date.toDateString() !== today.toDateString();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    dates.push({
      id: date.toISOString().split('T')[0], // YYYY-MM-DD format
      day,
      date: dateStr,
      disabled: isPast, // You can add || isWeekend if needed
      isToday: i === 0,
      isWeekend
    });
  }
  
  return dates;
};

export const getAvailableSlots = (dateId: string): number => {
  // Mock function - replace with real API call
  const date = new Date(dateId);
  const dayOfWeek = date.getDay();
  
  // Weekend has fewer slots
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return Math.floor(Math.random() * 4) + 1; // 1-4 slots
  }
  
  // Weekdays have more slots
  return Math.floor(Math.random() * 8) + 2; // 2-9 slots
};

export const isDateAvailable = (dateId: string): boolean => {
  const date = new Date(dateId);
  const today = new Date();
  
  // Not available if it's in the past
  if (date < today && date.toDateString() !== today.toDateString()) {
    return false;
  }
  
  // Not available if it's too far in the future (e.g., more than 30 days)
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  
  return date <= maxDate;
};