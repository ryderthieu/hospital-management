import React from "react";
interface AppointmentCardProps {
  symptoms: string;
  doctor: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  symptoms,
  doctor,
  date,
  time,
  status,
}) => {
  const statusBgColor = {
    PENDING: "bg-amber-100/50",
    CONFIRMED: "bg-blue-100",
    COMPLETED: "bg-green-100",
    CANCELLED: "bg-red-100",
  };

  const statusTextColor = {
    PENDING: "text-yellow-600",
    CONFIRMED: "text-blue-700",
    COMPLETED: "text-green-700",
    CANCELLED: "text-red-700",
  };

  return (
    <div
      className={`grid grid-cols-6 overflow-hidden border border-gray-200 rounded-lg`}
    >
      <div
        className={`h-full w-full grid place-items-center ${statusBgColor[status]}`}
      >
        <div className={`mt-2 text-md font-bold ${statusTextColor[status]} `}>
          {status === "PENDING" && "Đang chờ"}
          {status === "CONFIRMED" && "Đã xác nhận"}
          {status === "COMPLETED" && "Đã hoàn thành"}
          {status === "CANCELLED" && "Đã hủy"}
        </div>
      </div>
      <div className="flex justify-between px-4 py-5 items-center col-span-5">
        <div>
          <h3 className="font-medium">{symptoms}</h3>
          <p className="text-gray-600 text-sm">{doctor}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{date}</p>
          <p className="text-gray-600 text-sm">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
