import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Interface for dropdown props
interface StatusDropdownProps {
  initialStatus: string;
  options: string[];
  onStatusChange?: (status: string) => void;
}

// Component for status dropdown menu
const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  initialStatus, 
  options,
  onStatusChange 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const selectStatus = (status: string): void => {
    setSelectedStatus(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative mb-2">
      <div className="bg-base-300 rounded py-2 px-4 flex items-center">
        <div className="w-3 h-3 bg-base-700 rounded-full mr-2"></div>
        <span className="text-sm font-medium text-black flex items-center w-full">
          {selectedStatus}
          <button 
            className="ml-auto focus:outline-none" 
            onClick={toggleDropdown}
            type="button"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <ChevronUp size={18} className="text-black" />
            ) : (
              <ChevronDown size={18} className="text-black" />
            )}
          </button>
        </span>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded shadow-lg z-10 border border-gray-200">
          {options.map((option) => (
            <div 
              key={option}
              className={`py-2 px-4 flex items-center cursor-pointer ${
                option === selectedStatus ? "bg-base-300" : "hover:bg-gray-100"
              }`}
              onClick={() => selectStatus(option)}
              role="menuitem"
            >
              <div className="w-3 h-3 bg-base-700 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-black">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Interface for component props
interface PatientStatusSectionProps {
  roomNumber?: string | number;
  initialTestingStatus?: string;
  initialMedicationStatus?: string;
  onTestingStatusChange?: (status: string) => void;
  onMedicationStatusChange?: (status: string) => void;
}

export const PatientStatusSection: React.FC<PatientStatusSectionProps> = ({
  roomNumber = "305",
  initialTestingStatus = "Đang xét nghiệm",
  initialMedicationStatus = "Chưa kê thuốc",
  onTestingStatusChange,
  onMedicationStatusChange
}) => {
  // Options for testing status dropdown
  const testingOptions: string[] = [
    "Đang xét nghiệm",
    "Chờ kết quả",
    "Đã có kết quả",
    "Cần xét nghiệm lại"
  ];

  // Options for medication status dropdown
  const medicationOptions: string[] = [
    "Chưa kê thuốc",
    "Đã kê thuốc",
    "Đã phát thuốc",
  ];

  return (
    <div className="bg-base-100 rounded-lg p-4 mb-6">
      <h3 className="text-black font-medium mb-2">
        Trạng thái hiện tại
      </h3>
      
      {/* Room number - not a dropdown */}
      <div className="bg-base-300 rounded py-2 px-4 mb-2 flex items-center">
        <div className="w-3 h-3 bg-base-700 rounded-full mr-2"></div>
        <span className="text-sm font-medium text-black flex items-center">
          Phòng bệnh số: {roomNumber}
        </span>
      </div>
      
      {/* Dropdown for testing status */}
      <StatusDropdown 
        initialStatus={initialTestingStatus} 
        options={testingOptions} 
        onStatusChange={onTestingStatusChange}
      />
      
      {/* Dropdown for medication status */}
      <StatusDropdown 
        initialStatus={initialMedicationStatus} 
        options={medicationOptions}
        onStatusChange={onMedicationStatusChange}
      />
    </div>
  );
};