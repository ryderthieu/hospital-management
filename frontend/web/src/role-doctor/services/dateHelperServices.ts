import dayjs from 'dayjs';

// Convert string từ database sang dayjs object cho Ant Design DatePicker
export const stringToDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = dayjs(dateString);
  return date.isValid() ? date : null;
};

// Convert dayjs object từ Ant Design DatePicker sang string cho database
export const dateToString = (date: any) => {
  if (!date) return null;
  if (dayjs.isDayjs(date)) {
    return date.format('YYYY-MM-DD');
  }
  // Fallback nếu không phải dayjs object
  const parsedDate = dayjs(date);
  return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null;
};