"use client";

import type React from "react";
import type { MonthViewProps } from "./types";

const MonthView: React.FC<MonthViewProps> = ({ calendarDays, onDayClick }) => {
  const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {/* Weekday headers */}
      {weekdays.map((day, index) => (
        <div
          key={index}
          className="p-2 border-r border-b text-center font-medium"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={`border-r border-b min-h-24 p-1 relative ${
            !day.isCurrentMonth
              ? "bg-gray-200"
              : day.date.getDate() === new Date().getDate() &&
                day.date.getMonth() === new Date().getMonth() &&
                day.date.getFullYear() === new Date().getFullYear()
              ? "bg-base-700 text-white font-medium"
              : ""
          }`}
          onClick={() => onDayClick(day.date)}
        >
          <div className="relative w-full h-full">
            <span className="flex items-center justify-center text-lg h-full">
              {day.date.getDate()}
            </span>
            {day.appointmentCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full border text-black border-[#80A7F4] bg-[#E8EFFD]">
                {day.appointmentCount}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
