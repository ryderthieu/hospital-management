import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

import PageMeta from "../../components/common/PageMeta";
import ReturnButton from "../../components/ui/button/ReturnButton";
import { Modal } from "../../components/ui/modal/index.tsx";
import { useModal } from "../../hooks/useModal.ts";
import { DoctorScheduleEvent, generateDoctorScheduleEvents } from "../../services/DoctorSchedule.mockdata.ts";


// Function to format time to Vietnamese style
const formatTimeToVietnamese = (time: string): string => {
  if (!time) return "";
  
  const [hours, minutes] = time.split(":");
  const hourNum = parseInt(hours, 10);
  const minuteNum = parseInt(minutes, 10);
  
  return `${hourNum}:${minuteNum.toString().padStart(2, '0')}`;
};

// Function to calculate working hours statistics
const calculateWorkingHours = (events: DoctorScheduleEvent[]) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let weeklyHours = 0;
  let monthlyHours = 0;

  events.forEach(event => {
    const eventDate = new Date(event.start);
    const [startHour, startMinute] = event.extendedProps.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.extendedProps.endTime.split(':').map(Number);
    
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const hoursWorked = duration / 60;

    // Skip vacation and break types
    if (event.extendedProps.calendar === 'vacation' || event.extendedProps.calendar === 'break') {
      return;
    }

    // Count for current week
    if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
      weeklyHours += hoursWorked;
    }

    // Count for current month
    if (eventDate >= startOfMonth && eventDate <= endOfMonth) {
      monthlyHours += hoursWorked;
    }
  });

  return {
    weekly: Math.round(weeklyHours * 10) / 10,
    monthly: Math.round(monthlyHours * 10) / 10
  };
};


interface DoctorData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  department: string;
  doctorId: string;
  accountType: string;
  position: string;
  specialty: string;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  profileImage: string;
}

const DoctorSchedule = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isAddModalOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  const [events, setEvents] = useState<DoctorScheduleEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DoctorScheduleEvent | null>(null);
  const [workingHours, setWorkingHours] = useState({ weekly: 0, monthly: 0 });
  
  // Add new event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    calendar: 'morning' as 'morning' | 'afternoon' | 'surgery' | 'meeting',
    department: '',
    location: '',
    description: ''
  });

  const [doctorData] = useState<DoctorData>({
    firstName: "Nguyễn",
    lastName: "Thiên Tài",
    fullName: "BS. Nguyễn Thiên Tài",
    email: "nguyenthientoi@hospital.com",
    phone: "0901 565 563",
    gender: "Nam",
    dateOfBirth: "11/05/1995",
    department: "Nội tim mạch",
    doctorId: "BS22521584",
    accountType: "Bác sĩ",
    position: "Thạc sĩ Bác sĩ (Ths.BS)",
    specialty: "Suy tim",
    address: "Tòa S3.02, Vinhomes Grand Park, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
    country: "Việt Nam",
    city: "Thành phố Hồ Chí Minh",
    postalCode: "70000",
    profileImage: "/images/user/doctor-avatar.jpg",
  });

  // Load mock schedule data
  useEffect(() => {
    const mockEvents = generateDoctorScheduleEvents();
    setEvents(mockEvents);
    
    // Calculate working hours statistics
    const hours = calculateWorkingHours(mockEvents);
    setWorkingHours(hours);
  }, []);

  // Handler khi click vào sự kiện
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as DoctorScheduleEvent);
    openModal();
  };

  // Handle đóng modal
  const handleCloseModal = () => {
    closeModal();
    setSelectedEvent(null);
  };

  // Handle thêm lịch mới
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newScheduleEvent: DoctorScheduleEvent = {
      id: `custom-${Date.now()}`,
      title: newEvent.title,
      start: `${newEvent.date}T${newEvent.startTime}:00`,
      end: `${newEvent.date}T${newEvent.endTime}:00`,
      extendedProps: {
        calendar: newEvent.calendar,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        department: newEvent.department || 'Nội tim mạch',
        location: newEvent.location || 'Phòng khám P102',
        type: newEvent.calendar === 'surgery' ? 'surgery' : newEvent.calendar === 'meeting' ? 'meeting' : 'consultation',
        description: newEvent.description
      }
    };

    const updatedEvents = [...events, newScheduleEvent];
    setEvents(updatedEvents);
    
    // Recalculate working hours
    const hours = calculateWorkingHours(updatedEvents);
    setWorkingHours(hours);

    // Reset form and close modal
    setNewEvent({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      calendar: 'morning',
      department: '',
      location: '',
      description: ''
    });
    closeAddModal();
  };

  // Handle đóng modal thêm lịch
  const handleCloseAddModal = () => {
    closeAddModal();
    setNewEvent({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      calendar: 'morning',
      department: '',
      location: '',
      description: ''
    });
  };

  // Function to render event content với style đẹp
  const renderEventContent = (eventInfo: {
    event: {
      title: string;
      extendedProps: { calendar: string; type: string; startTime: string; endTime: string };
    };
    timeText: string;
  }) => {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
    
    // Format time theo kiểu Việt Nam
    const startTime = formatTimeToVietnamese(eventInfo.event.extendedProps.startTime);
    const endTime = formatTimeToVietnamese(eventInfo.event.extendedProps.endTime);
    const formattedTime = `${startTime} - ${endTime}`;
    
    return (
      <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time">{formattedTime}</div>
        <div className="fc-event-title flex items-center">
          <span className="ml-1">{eventInfo.event.title}</span>
        </div>
      </div>
    );
  };


  return (
    <div>
      <PageMeta
        title={`${doctorData.fullName} | Lịch làm việc Bác sĩ`}
        description={`Lịch làm việc của ${doctorData.fullName} - ${doctorData.specialty}`}
      />
      
      <div className="flex justify-start items-center mb-6">
        <ReturnButton />
        <h3 className="font-semibold tracking-tight">
          Lịch làm việc - Bác sĩ: {`${doctorData.fullName}`}
        </h3>
      </div>

      
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar doctor-schedule-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={viLocale}
            headerToolbar={{
              left: "prev,next today addScheduleButton",
              center: "title",
              right: "dayGridMonth",
            }}
            customButtons={{
              addScheduleButton: {
                text: "Thêm lịch làm việc +",
                click: openAddModal,
              },
            }}
            events={events}
            selectable={true}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="19:00:00"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            allDaySlot={false}
            weekends={false}
            eventDisplay="block"
            dayMaxEvents={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '07:00',
              endTime: '18:00',
            }}
          />
        </div>

        {/* Modal chi tiết lịch làm việc */}
        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          className="max-w-[500px] lg:p-8 mt-[20vh] mb-8"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-4 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                Chi tiết lịch làm việc
              </h5>
            </div>
            
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hoạt động
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {selectedEvent.title}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian bắt đầu
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {formatTimeToVietnamese(selectedEvent.extendedProps.startTime)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian kết thúc
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {formatTimeToVietnamese(selectedEvent.extendedProps.endTime)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa điểm
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {selectedEvent.extendedProps.location}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoa/Phòng ban
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {selectedEvent.extendedProps.department}
                    </div>
                  </div>

                  {selectedEvent.extendedProps.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {selectedEvent.extendedProps.description}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEvent.extendedProps.calendar === 'morning' 
                          ? 'bg-teal-100 text-teal-800' 
                          : selectedEvent.extendedProps.calendar === 'afternoon'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedEvent.extendedProps.calendar === 'surgery'
                          ? 'bg-red-100 text-red-800'
                          : selectedEvent.extendedProps.calendar === 'meeting'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedEvent.extendedProps.calendar === 'vacation'
                          ? 'bg-red-100 text-red-800'
                          : selectedEvent.extendedProps.calendar === 'break'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedEvent.extendedProps.calendar === 'morning' && 'Ca sáng'}
                        {selectedEvent.extendedProps.calendar === 'afternoon' && 'Ca chiều'}
                        {selectedEvent.extendedProps.calendar === 'surgery' && 'Phẫu thuật'}
                        {selectedEvent.extendedProps.calendar === 'meeting' && 'Hội chẩn'}
                        {selectedEvent.extendedProps.calendar === 'working' && 'Đang làm việc'}
                        {selectedEvent.extendedProps.calendar === 'vacation' && 'Nghỉ phép'}
                        {selectedEvent.extendedProps.calendar === 'break' && 'Nghỉ ngơi'}
                        {selectedEvent.extendedProps.calendar === 'free' && 'Rảnh rỗi'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    className="btn btn-secondary flex justify-center rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-300"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* Modal thêm lịch làm việc mới */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          className="max-w-[600px] lg:p-8 mt-[10vh] mb-8"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-4 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                Thêm lịch làm việc mới
              </h5>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hoạt động <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: Khám bệnh, Phẫu thuật..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại ca làm việc <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newEvent.calendar}
                      onChange={(e) => setNewEvent({...newEvent, calendar: e.target.value as 'morning' | 'afternoon' | 'surgery' | 'meeting'})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Chọn loại ca làm việc"
                    >
                      <option value="morning">Ca sáng</option>
                      <option value="afternoon">Ca chiều</option>
                      <option value="surgery">Phẫu thuật</option>
                      <option value="meeting">Hội chẩn</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Chọn thời gian bắt đầu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Chọn thời gian kết thúc"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoa/Phòng ban
                    </label>
                    <input
                      type="text"
                      value={newEvent.department}
                      onChange={(e) => setNewEvent({...newEvent, department: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: Nội tim mạch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: Phòng khám P102"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Mô tả chi tiết về hoạt động..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleCloseAddModal}
                  type="button"
                  className="px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddEvent}
                  type="button"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Thêm lịch
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DoctorSchedule;
