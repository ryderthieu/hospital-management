import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import PageMeta from "../../components/common/PageMeta";
import DatePicker from "../../components/appointments/DatePicker.tsx";
import TimePicker from "../../components/appointments/TimePicker.tsx";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    patientId?: string;
    insuranceId?: string;
    phoneNumber?: string;
    patientAge?: string;
    symptoms?: string;
    eventTime?: string;
    doctorName?: string;
    department?: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Thông tin bệnh nhân
  const [eventTitle, setEventTitle] = useState("");
  const [patientId, setPatientId] = useState("");
  const [insuranceId, setInsuranceId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  
  
  // Thông tin lịch khám 
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  
  // Trạng thái lịch khám
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    "Khẩn cấp": "danger",
    "Đã khám": "success",
    "Chờ khám": "waiting",
    "Hủy": "cancel",
  };

  useEffect(() => {
    setEvents([
      {
        id: "1",
        title: "Nguyễn Văn A",
        extendedProps: { 
          calendar: "danger",
          patientId: "BN001",
          insuranceId: "BH12345678",
          phoneNumber: "0901234567",
          patientAge: "45",
          symptoms: "Sốt cao, ho, đau đầu",
          eventTime: "08:30",
          doctorName: "Bác sĩ Minh",
          department: "Khoa Nội" 
        },
      },
      {
        id: "2",
        title: "Trần Thị B",
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { 
          calendar: "success",
          patientId: "BN002", 
          insuranceId: "BH87654321",
          phoneNumber: "0987654321",
          patientAge: "35",
          symptoms: "Đau bụng, buồn nôn",
          eventTime: "10:00",
          doctorName: "Bác sĩ Hoa",
          department: "Khoa Tiêu hóa"
        },
      },
      {
        id: "3",
        title: "Lê Văn C",
        date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        extendedProps: { 
          calendar: "waiting",
          patientId: "BN003",
          insuranceId: "BH24680135",
          phoneNumber: "0912345678",
          patientAge: "28",
          symptoms: "Khó thở, đau ngực",
          eventTime: "14:15",
          doctorName: "Bác sĩ Nam",
          department: "Khoa Tim mạch"
        },
      },
      {
        id: "4",
        title: "Phạm Thị D",
        date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        extendedProps: { 
          calendar: "cancel",
          patientId: "BN004",
          insuranceId: "BH13579024",
          phoneNumber: "0977889966",
          patientAge: "62",
          symptoms: "Đau khớp, sưng đỏ tại khớp gối",
          eventTime: "09:45",
          doctorName: "Bác sĩ Tâm",
          department: "Khoa Cơ Xương Khớp"
        },
      },
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventDate(selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    
    // Đọc thông tin cơ bản
    setEventTitle(event.title);
    setEventDate(event.start?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    
    // Đọc thông tin chi tiết nếu có
    if (event.extendedProps) {
      const { patientId: pid, insuranceId: iid, phoneNumber: phone, 
              patientAge: age, symptoms: sym, eventTime: time,
              doctorName: doctor, department: dept } = event.extendedProps;
      
      if (pid) setPatientId(pid);
      if (iid) setInsuranceId(iid);
      if (phone) setPhoneNumber(phone);
      if (age) setPatientAge(age);
      if (sym) setSymptoms(sym);
      if (time) setEventTime(time);
      if (doctor) setDoctorName(doctor);
      if (dept) setDepartment(dept);
    }
    
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    // Tạo thông tin chi tiết cho lịch khám
    const eventDetails = {
      patientId,
      insuranceId,
      phoneNumber,
      patientAge,
      symptoms,
      eventTime,
      doctorName,
      department
    };

    if (selectedEvent) {
      // Cập nhật lịch khám đã tồn tại
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventDate,
                extendedProps: { 
                  calendar: eventLevel,
                  ...eventDetails 
                },
              }
            : event
        )
      );
    } else {
      // Thêm lịch khám mới
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventDate,
        allDay: !eventTime,
        extendedProps: { 
          calendar: eventLevel,
          ...eventDetails 
        },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    // Reset thông tin bệnh nhân
    setEventTitle("");
    setPatientId("");
    setInsuranceId("");
    setPhoneNumber("");
    setPatientAge("");
    setSymptoms("");
    
    // Reset thông tin lịch khám
    setEventDate("");
    setEventTime("");
    setDoctorName("");
    setDepartment("");
    
    // Reset trạng thái
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta
        title="Calendar | Admin Dashboard "
        description="This is Calendar Dashboard"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={viLocale}
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Thêm lịch khám +",
                click: openModal,
              },
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10 mt-[20vh]"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Cập nhật lịch khám" : "Thêm lịch khám"}
              </h5>
            </div>
            <div className="">
              <div className="mt-4">
                {/* THÔNG TIN BỆNH NHÂN */}
                <h6 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Thông tin bệnh nhân
                </h6>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Tên bệnh nhân */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Tên bệnh nhân
                    </label>
                    <input
                      id="patient-name"
                      type="text"
                      placeholder="Nhập tên bệnh nhân"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    />
                  </div>
                  
                  {/* Mã BHYT */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Mã BHYT
                    </label>
                    <input
                      id="insurance-id"
                      type="text"
                      placeholder="Nhập mã bảo hiểm y tế"
                      value={insuranceId}
                      onChange={(e) => setInsuranceId(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    />
                  </div>
                  
                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Số điện thoại
                    </label>
                    <input
                      id="phone-number"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    />
                  </div>
                  
                  {/* Tuổi */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Tuổi
                    </label>
                    <input
                      id="patient-age"
                      type="number"
                      placeholder="Nhập tuổi"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    />
                  </div>
                  
                  {/* Triệu chứng */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Triệu chứng
                    </label>
                      <textarea
                        id="symptoms"
                        placeholder="Mô tả triệu chứng bệnh"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    ></textarea>
                  </div>
                </div>

                {/* THÔNG TIN LỊCH KHÁM */}
                <h6 className="mb-4 mt-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Thông tin lịch khám
                </h6>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="md:w-2/3">
                    <DatePicker
                      id="date-picker"
                      label="Ngày khám"
                      placeholder="Chọn ngày khám"
                      onChange={(_, currentDateString) => {
                        setEventDate(currentDateString);
                      }}
                    />
                  </div>
                  <div className="md:w-1/3">
                    <TimePicker
                      id="time-picker"
                      label="Giờ khám"
                      placeholder="Chọn giờ khám"
                      onChange={(_, currentDateString) => {
                        setEventTime(currentDateString);
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                  {/* Bác sĩ phụ trách */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Bác sĩ phụ trách
                    </label>
                    <input
                      id="doctor-name"
                      type="text"
                      placeholder="Nhập tên bác sĩ"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    />
                  </div>
                  
                  {/* Khoa */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Khoa
                    </label>
                    <input
                      id="department"
                      type="text"
                      placeholder="Nhập tên khoa"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    />
                  </div>
                </div>
                
                {/* Trạng thái lịch khám */}
                <div className="mt-6">
                  <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Trạng thái
                  </label>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                    {Object.entries(calendarsEvents).map(([key, value]) => (
                      <div key={key} className="n-chk">
                        <div
                          className={`form-check form-check-${value} form-check-inline`}
                        >
                          <label
                            className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                            htmlFor={`modal${key}`}
                          >
                            <span className="relative">
                              <input
                                className="sr-only form-check-input"
                                type="radio"
                                name="event-level"
                                value={key}
                                id={`modal${key}`}
                                checked={eventLevel === key}
                                onChange={() => setEventLevel(key)}
                              />
                              <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                                <span
                                  className={`h-2 w-2 rounded-full bg-white ${
                                    eventLevel === key ? "block" : "hidden"
                                  }`}
                                ></span>
                              </span>
                            </span>
                            {key}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Hủy
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-base-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-base-600 sm:w-auto"
              >
                {selectedEvent ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: {
  event: {
    title: string;
    extendedProps: { calendar: string };
  };
  timeText: string;
}) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
