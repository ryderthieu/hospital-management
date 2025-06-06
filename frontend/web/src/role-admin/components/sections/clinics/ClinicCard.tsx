import React from 'react';
import { Link } from 'react-router-dom';

export interface ClinicCardProps {
  id: string;
  name: string;
  location: string;
  floor: string;
  phone: string;
  specialties: string[];
  workingHours: string;
  headDoctor?: string;
  capacity?: number;
  currentPatients?: number;
  status?: 'active' | 'busy' | 'full' | 'inactive';
  nextAvailableTime?: string;
  waitingTime?: number; // Thời gian chờ trung bình (phút)
}

const ClinicCard: React.FC<ClinicCardProps> = ({
  id,
  name,
  location,
  floor,
  phone,
  specialties,
  workingHours,
  headDoctor,
  capacity = 0,
  currentPatients = 0,
  status = 'active',
  nextAvailableTime,
  waitingTime,
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'active':
        return {
          label: 'Hoạt động',
          colorClass: 'bg-green-100 text-green-800',
          indicatorClass: 'bg-green-500',
        };
      case 'busy':
        return {
          label: 'Đông bệnh nhân',
          colorClass: 'bg-yellow-100 text-yellow-800',
          indicatorClass: 'bg-yellow-500',
        };
      case 'full':
        return {
          label: 'Đã đầy',
          colorClass: 'bg-red-100 text-red-800',
          indicatorClass: 'bg-red-500',
        };
      case 'inactive':
        return {
          label: 'Tạm nghỉ',
          colorClass: 'bg-gray-100 text-gray-800',
          indicatorClass: 'bg-gray-500',
        };
      default:
        return {
          label: 'Đang hoạt động',
          colorClass: 'bg-green-100 text-green-800',
          indicatorClass: 'bg-green-500',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const occupancyPercentage = capacity > 0 ? Math.min(Math.round((currentPatients / capacity) * 100), 100) : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h5 className="text-base font-semibold text-gray-800">
            {name}
          </h5>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.colorClass}`}>
              <span className={`w-2 h-2 ${statusInfo.indicatorClass} rounded-full mr-1.5 flex-shrink-0`}></span>
              {statusInfo.label}
            </span>
        </div>
        </div>
        
        
        {/* Phần thông tin cơ bản */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-500 mr-2 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {location}, {floor}
            </span>
          </div>

          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {phone}
            </span>
          </div>

          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-500 mr-2 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {workingHours}
            </span>
          </div>

          {headDoctor && (
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Bác sĩ phụ trách: {headDoctor}
              </span>
            </div>
          )}
        </div>

        {/* Phần thông tin tình trạng phòng khám */}
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700 font-medium">Số bệnh nhân hiện tại</span>
            <span className="text-sm text-gray-700 font-semibold">
              {currentPatients}/{capacity} ({occupancyPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                occupancyPercentage >= 90 ? 'bg-red-600' : 
                occupancyPercentage >= 70 ? 'bg-yellow-400' : 'bg-green-500'
              }`} 
              style={{ width: `${occupancyPercentage}%` }}></div>
          </div>

          {waitingTime !== undefined && (
            <div className="flex items-center mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">
                Thời gian chờ ước tính: <span className="font-medium">{waitingTime} phút</span>
              </span>
            </div>
          )}

          {nextAvailableTime && status === 'full' && (
            <div className="flex items-center mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600">
                Lịch trống tiếp theo: <span className="font-medium">{nextAvailableTime}</span>
              </span>
            </div>
          )}
        </div>

        {/* Phần chuyên khoa */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Chuyên khoa:
          </h4>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <span
                key={index}
                className="bg-base-50 text-base-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-5 flex justify-between">
          <Link 
            to={`/admin/examination/clinics/${id}/appointments`}
            className="text-base-600 hover:text-base-800 text-sm font-medium"
          >
            Xem lịch hẹn
          </Link>
          <Link
            to={`/admin/outpatient-clinics/${id}`}
            className="text-white bg-base-600 hover:bg-base-700 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;