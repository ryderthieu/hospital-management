import React from "react";

interface AppointmentCardProps {
  title: string;
  doctor: string;
  date: string;
  time: string;
  status: "pending" | "completed" | "cancelled";
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  title,
  doctor,
  date,
  time,
  status,
}) => {
  const statusBgColor = {
    pending: "bg-amber-100/50",
    completed: "bg-green-100",
    cancelled: "bg-red-100",
  };

  const statusTextColor = {
    pending: "text-yellow-600",
    completed: "text-green-700",
    cancelled: "text-red-700",
  };

  return (
    <div className={`grid grid-cols-6 overflow-hidden border border-gray-200 rounded-lg`}>
        <div className={`h-full w-full grid place-items-center ${statusBgColor[status]}`}>
            <div className={`mt-2 text-md font-bold ${statusTextColor[status]} `}>
                {status === "pending" && "Đang chờ"}
                {status === "completed" && "Hoàn thành"}
                {status === "cancelled" && "Đã hủy"}
            </div>
        </div>  
        <div className="flex justify-between px-4 py-5 items-center col-span-5">
            <div>
                <h3 className="font-medium">{title}</h3>
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