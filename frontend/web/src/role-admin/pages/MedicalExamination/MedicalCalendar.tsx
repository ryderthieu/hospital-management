import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, DateInput } from "@fullcalendar/core";
import { Modal } from "../../components/ui/modal/index.tsx";
import { useModal } from "../../hooks/useModal.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import DatePicker from "../../components/sections/appointments/DatePicker.tsx";
import TimePicker from "../../components/sections/appointments/TimePicker.tsx";
import type { Hook } from "flatpickr/dist/types/options";
import {
  Schedule,
  Patient,
  AppointmentResponse,
  ScheduleDto,
  AppointmentRequest,
} from "../../types/appointment";
import {
  Department,
  Doctor,
  mockDataService,
} from "../../services/mockDataService.ts";
import { appointmentService } from "../../services/appointmentService";
import { scheduleService } from "../../services/scheduleService";
import { patientService } from "../../services/patientService";
import { CalendarEvent, EventStatus } from "../../../types/calendar";
import { formatTimeToVietnamese } from "../../utils/dateUtils";
import { Patient as AppointmentPatient } from "../../types/appointment";
import { Patient as PatientType } from "../../types/patient";

// Function to create datetime string for FullCalendar
const createAppointmentDateTime = (
  date: string,
  time: string
): { start: string; end: string } => {
  if (!date || !time) return { start: date, end: date };

  const [hours, minutes] = time.split(":");
  const startDate = new Date(date);
  startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  // Add 30 minutes for end time
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 30);

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
};

interface AppointmentFormData extends AppointmentRequest {
  slotStart: string;
  slotEnd: string;
  scheduleId: number;
  symptoms: string;
  doctorId: number;
  patientId: number;
}

// Add type for DOM element with style
interface StyledElement extends Element {
  style: CSSStyleDeclaration;
}

interface DatePickerProps extends React.ComponentProps<typeof DatePicker> {
  disabled?: boolean;
}

// Helper function to convert gender to Vietnamese
const getGenderText = (gender: string): string => {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Không xác định";
  }
};

const MedicalCalendar: React.FC = () => {
  // State cho form tạo lịch khám mới
  const [appointmentForm, setAppointmentForm] = useState<AppointmentFormData>({
    slotStart: "",
    slotEnd: "",
    scheduleId: 0,
    symptoms: "",
    doctorId: 0,
    patientId: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);

  // Thông tin bệnh nhân
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [insuranceId, setInsuranceId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientAge, setPatientAge] = useState(0);
  const [symptoms, setSymptoms] = useState("");

  // Thông tin lịch khám
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  // Khoa và bác sĩ
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  // Trạng thái lịch khám
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);

  // Multiple modals
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDayModalOpen,
    openModal: openDayModal,
    closeModal: closeDayModal,
  } = useModal();

  // State for success message modal
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // State cho thông báo
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // States for schedule selection
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  // States for patient selection
  const [patients, setPatients] = useState<AppointmentPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<AppointmentPatient | null>(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  // Load danh sách khoa khi component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await mockDataService.getDepartments();
        setDepartmentList(departments);
      } catch (error) {
        console.error("Error fetching department: ", error);
      }
    };

    fetchDepartments();
  }, []);

  // Load danh sách bác sĩ khi khoa thay đổi
  useEffect(() => {
    if (!departmentId) {
      setFilteredDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctors = await mockDataService.getDoctorsByDepartment(
          departmentId
        );
        setFilteredDoctors(doctors);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [departmentId]);

  // This effect ensures consistent row heights in the calendar after rendering
  useEffect(() => {
    // Add a small delay to allow the calendar to render fully
    const timer = setTimeout(() => {
      // Force equal heights for all rows in the calendar
      const calendarRows = document.querySelectorAll<HTMLTableRowElement>(
        ".fc-scrollgrid-sync-table tbody tr"
      );
      if (calendarRows && calendarRows.length) {
        calendarRows.forEach((row) => {
          if (row instanceof HTMLTableRowElement) {
            row.style.height = "120px";
          }
        });

        // Special fix for the problematic second row
        const secondRow = document.querySelector<HTMLTableRowElement>(
          ".fc-scrollgrid-sync-table tbody tr:nth-child(2)"
        );
        if (secondRow instanceof HTMLTableRowElement) {
          secondRow.style.height = "120px";
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [events]);

  // Handle date selection
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventDate(selectInfo.startStr);
    openModal();
  };

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const calendarEvent: CalendarEvent = {
      id: event.id,
      title: event.title,
      start: event.start?.toISOString() || "",
      end: event.end?.toISOString() || "",
      extendedProps: {
        calendar: event.extendedProps.calendar as EventStatus,
        patientName: event.title,
        patientId: event.extendedProps.patientId,
        insuranceId: event.extendedProps.insuranceId,
        phoneNumber: event.extendedProps.phoneNumber,
        patientAge: event.extendedProps.patientAge,
        symptoms: event.extendedProps.symptoms,
        eventTime: event.extendedProps.eventTime,
        doctorName: event.extendedProps.doctorName,
        department: event.extendedProps.department,
        departmentId: event.extendedProps.departmentId,
        doctorId: event.extendedProps.doctorId,
      },
    };
    setSelectedEvent(calendarEvent);

    // Đọc thông tin cơ bản
    setPatientName(event.title);
    setEventDate(event.start?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);

    // Đọc thông tin chi tiết nếu có
    if (event.extendedProps) {
      const {
        patientId: pid,
        insuranceId: iid,
        phoneNumber: phone,
        patientAge: age,
        symptoms: sym,
        eventTime: time,
        doctorName: doctor,
        department: dept,
        departmentId: deptId,
        doctorId: docId,
      } = event.extendedProps;

      if (pid) setPatientId(pid);
      if (iid) setInsuranceId(iid);
      if (phone) setPhoneNumber(phone);
      if (age) setPatientAge(age);
      if (sym) setSymptoms(sym);
      if (time) setEventTime(time);
      if (doctor) setDoctorName(doctor);
      if (dept) setDepartment(dept);
      if (deptId) setDepartmentId(deptId);
      if (docId) setDoctorId(docId);
    }

    openModal();
  };

  // Handle date click
  const handleDateClick = (dateStr: string) => {
    const dateEvents = events.filter((event) => {
      const eventDate = new Date(event.start).toISOString().split("T")[0];
      return eventDate === dateStr;
    });

    setSelectedDate(dateStr);
    setDayEvents(dateEvents);
    openDayModal();
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: CalendarEvent) => {
    setSelectedEvent(appointment);

    // Điền dữ liệu appointment vào form
    setPatientName(appointment.extendedProps.patientName || appointment.title);
    setPatientId(appointment.extendedProps.patientId || "");
    setInsuranceId(appointment.extendedProps.insuranceId || "");
    setPhoneNumber(appointment.extendedProps.phoneNumber || "");
    setPatientAge(appointment.extendedProps.patientAge || 0);
    setSymptoms(appointment.extendedProps.symptoms || "");
    setEventDate(new Date(appointment.start).toISOString().split("T")[0]);
    setEventTime(appointment.extendedProps.eventTime || "");
    setDoctorName(appointment.extendedProps.doctorName || "");
    setDoctorId(appointment.extendedProps.doctorId || "");
    setDepartment(appointment.extendedProps.department || "");
    setDepartmentId(appointment.extendedProps.departmentId || "");
    setEventLevel(appointment.extendedProps.calendar || "");

    // Đóng modal danh sách và mở modal cập nhật lịch khám
    closeDayModal();
    openModal();
  };

  // No longer needed as we're opening edit form directly
  // Removed unused handlePatientClick function

  // Handler khi thay đổi khoa
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDeptId = e.target.value;
    setDepartmentId(selectedDeptId);

    // Tìm tên khoa tương ứng
    const selectedDept = departmentList.find(
      (dept) => dept.id === selectedDeptId
    );
    setDepartment(selectedDept?.name || "");

    // Reset thông tin bác sĩ khi đổi khoa
    setDoctorId("");
    setDoctorName("");

    // Reset schedules
    setSchedules([]);
    setSelectedSchedule(null);

    // Xóa lỗi (nếu có)
    if (errors.departmentId) {
      setErrors((prev) => ({ ...prev, departmentId: "" }));
    }
  };

  // Handle doctor change
  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDocId = e.target.value;
    setDoctorId(selectedDocId);

    // Tìm tên bác sĩ tương ứng
    const selectedDoc = filteredDoctors.find((doc) => doc.id === selectedDocId);
    setDoctorName(selectedDoc?.name || "");

    // Reset schedules
    setSchedules([]);
    setSelectedSchedule(null);

    // Load schedules if date is selected
    if (selectedDate) {
      loadSchedulesByDoctorAndDate(selectedDocId, selectedDate);
    }

    // Xóa lỗi (nếu có)
    if (errors.doctorId) {
      setErrors((prev) => ({ ...prev, doctorId: "" }));
    }
  };

  // Load schedules for selected doctor and date
  const loadSchedulesByDoctorAndDate = async (doctorId: string, date: string) => {
    if (!doctorId || !date) return;
    setIsLoadingSchedules(true);
    try {
      const schedules = await mockDataService.getSchedulesByDoctorAndDate(doctorId, date);
      setSchedules(schedules);
    } catch (error) {
      console.error("Error loading schedules:", error);
      setNotification({
        type: "error",
        message: "Không thể tải danh sách lịch trống",
      });
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  // Update loadSchedulesByDate to use new function
  const loadSchedulesByDate = async (date: string) => {
    if (!doctorId) {
      setNotification({
        type: "error",
        message: "Vui lòng chọn bác sĩ trước",
      });
      return;
    }
    await loadSchedulesByDoctorAndDate(doctorId, date);
  };

  // Load schedule details
  const loadScheduleDetails = async (scheduleId: number) => {
    try {
      const response = await appointmentService.getScheduleById(scheduleId);
      const schedule = response.data as Schedule;
      setSelectedSchedule(schedule);
      // Auto-fill doctor info from schedule
      setAppointmentForm(prev => ({
        ...prev,
        doctorId: schedule.doctorId
      }));
    } catch (error) {
      console.error("Error loading schedule details:", error);
      setNotification({
        type: "error",
        message: "Không thể tải thông tin lịch khám",
      });
    }
  };

  // Load patients list
  const loadPatients = async () => {
    setIsLoadingPatients(true);
    try {
      const patients = await mockDataService.getPatients();
      setPatients(patients);
    } catch (error) {
      console.error("Error loading patients:", error);
      setNotification({
        type: "error",
        message: "Không thể tải danh sách bệnh nhân",
      });
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Load patient details
  const loadPatientDetails = async (patientId: number) => {
    try {
      const patient = await mockDataService.getPatientById(patientId);
      setSelectedPatient(patient);
    } catch (error) {
      console.error("Error loading patient details:", error);
      setNotification({
        type: "error",
        message: "Không thể tải thông tin bệnh nhân",
      });
    }
  };

  // Format time range
  const formatTimeRange = (start: string, end: string): string => {
    const startTime = start ? formatTimeToVietnamese(start) : "";
    const endTime = end ? formatTimeToVietnamese(end) : "";
    return startTime && endTime ? `${startTime} - ${endTime}` : "";
  };

  // Load patients when component mounts
  useEffect(() => {
    loadPatients();
  }, []);

  // Reset form helper
  const resetModalFields = () => {
    setEventDate("");
    setSchedules([]);
    setSelectedSchedule(null);
    setSelectedPatient(null);
    setSymptoms("");
    setDepartmentId("");
    setDoctorId("");
    setErrors({});
  };

  // Handle close modal
  const handleCloseModal = () => {
    closeModal();
    resetModalFields();
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedSchedule) {
      newErrors.scheduleId = "Vui lòng chọn lịch trống";
    }
    
    if (!selectedPatient) {
      newErrors.patientId = "Vui lòng chọn bệnh nhân";
    }
    
    if (!symptoms.trim()) {
      newErrors.symptoms = "Vui lòng nhập triệu chứng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create appointment
  const handleCreateAppointment = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (!selectedSchedule || !selectedPatient) return;

      // Prepare appointment data
      const appointmentData = {
        scheduleId: selectedSchedule.id,
        patientId: selectedPatient.id,
        doctorId: parseInt(doctorId),
        symptoms: symptoms,
        slotStart: selectedSchedule.startTime,
        slotEnd: selectedSchedule.endTime
      };

      await mockDataService.createAppointment(appointmentData);
      
      // Handle success
      closeModal();
      resetModalFields();
      setNotification({
        type: "success",
        message: "Đặt lịch khám thành công!"
      });
      
      // Reload appointments after success
      await fetchAppointments();
      
    } catch (error) {
      console.error("Error creating appointment:", error);
      setNotification({
        type: "error",
        message: "Đặt lịch khám thất bại. Vui lòng thử lại!"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle date change for flatpickr
  const handleDateChange: Hook = (dates) => {
    if (!dates.length) return;
    const dateStr = dates[0].toISOString().split("T")[0];
    setSelectedDate(dateStr);
    loadSchedulesByDate(dateStr);
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const appointments = await mockDataService.getAppointments();
      const apiEvents = appointments.map((item): CalendarEvent => {
        const date = item.schedule?.date || new Date().toISOString().split("T")[0];
        const start = `${date}T${item.slotStart || ""}`;
        const end = `${date}T${item.slotEnd || ""}`;
        
        return {
          id: item.id.toString(),
          title: item.patientInfo?.fullName || `Lịch khám #${item.id}`,
          start,
          end,
          extendedProps: {
            calendar: item.status as EventStatus,
            patientName: item.patientInfo?.fullName || "",
            patientId: item.patientInfo?.id?.toString() || "",
            insuranceId: item.patientInfo?.insuranceId || "",
            phoneNumber: item.patientInfo?.phoneNumber || "",
            patientAge: item.patientInfo?.age || 0,
            symptoms: item.symptoms || "",
            eventTime: item.slotStart || "",
            doctorName: item.schedule?.doctorName || "",
            department: item.schedule?.departmentName || "",
            departmentId: item.schedule?.departmentId?.toString() || "",
            doctorId: item.doctorId?.toString() || "",
          },
        };
      });
      setEvents(apiEvents);
    } catch (error) {
      console.error("Không thể tải lịch khám:", error);
      setEvents([]); // Set empty array on error
    }
  };

  // Load appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Fix the dayCellDidMount error
  const handleDayCellDidMount = (arg: { el: Element }) => {
    const addButtonElements = arg.el.querySelectorAll(
      ".fc-daygrid-day-bottom"
    );
    addButtonElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.display = "none";
      }
    });
  };

  // Render event content with safe type checking
  const renderEventContent = (eventInfo: {
    event: {
      title: string;
      start: Date | null;
      extendedProps: { calendar: string; eventTime?: string };
    };
    timeText: string;
  }) => {
    const { event } = eventInfo;
    const time = event.extendedProps.eventTime || eventInfo.timeText;
    return (
      <div className="flex flex-col gap-1 p-1">
        <div className="flex items-center gap-2">
          <div
            className={`size-2 rounded-full ${
              event.extendedProps.calendar === "success"
                ? "bg-green-500"
                : event.extendedProps.calendar === "danger"
                ? "bg-red-500"
                : event.extendedProps.calendar === "warning"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          />
          <span className="text-sm font-medium">{event.title}</span>
        </div>
        {time && (
          <div className="text-xs text-gray-500">
            <span>{formatTimeToVietnamese(time)}</span>
          </div>
        )}
      </div>
    );
  };

  // Handle schedule selection
  const handleScheduleSelect = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setErrors((prev) => ({ ...prev, scheduleId: "" }));
  };

  // Handle patient selection
  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    if (!patientId) {
      setSelectedPatient(null);
      return;
    }
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
    setErrors(prev => ({ ...prev, patientId: "" }));
  };

  return (
    <>
      <PageMeta
        title="Calendar | Admin Dashboard "
        description="This is Calendar Dashboard"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar" style={{ position: "relative" }}>
          {/* Hidden element to force uniform row heights across the calendar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              pointerEvents: "none",
              visibility: "hidden",
            }}
            className="calendar-height-enforcer"
          ></div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={viLocale}
            fixedWeekCount={true} /* Force fixed number of rows */
            height="auto"
            contentHeight="auto"
            aspectRatio={1.8} /* Improve aspect ratio for better display */
            dayMaxEventRows={0} /* Force all days to have same height */
            stickyHeaderDates={true} /* Keep headers visible during scroll */
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth",
            }}
            events={events}
            selectable={true}
            select={(selectInfo) => {
              // Kiểm tra xem ô được chọn có sự kiện nào không
              const dateStr = selectInfo.startStr;
              const dateEvents = events.filter((event) => {
                const eventDate = new Date(event.start)
                  .toISOString()
                  .split("T")[0];
                return eventDate === dateStr;
              });

              // Chỉ mở modal thêm lịch khám khi không có sự kiện nào trong ngày đó
              if (dateEvents.length === 0) {
                handleDateSelect(selectInfo);
              }
            }}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            dayCellDidMount={handleDayCellDidMount}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            displayEventTime={true}
            // Giờ làm việc từ 6:30 đến 17:00
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6], // Thứ 2 đến Thứ 7
              startTime: "06:30",
              endTime: "17:00",
            }}
            slotMinTime="06:00"
            slotMaxTime="18:00"
            // Cải thiện hiển thị khi có nhiều sự kiện
            dayMaxEvents={false} // Không giới hạn events để hiển thị số lượng
            moreLinkClick={(info) => {
              // Khi click vào "+X more", hiển thị modal với danh sách ca khám
              handleDateClick(info.date.toISOString().split("T")[0]);
            }}
            eventMaxStack={3} // Tối đa 3 sự kiện xếp chồng lên nhau
            // Cải thiện hiển thị thời gian
            slotDuration="00:15:00" // Chia slot 15 phút
            slotLabelInterval="01:00:00" // Hiển thị label mỗi 1 tiếng
            // Custom hiển thị ngày với số lượng bệnh nhân
            dayCellContent={(info) => {
              const dayEvents = events.filter((event) => {
                const eventDate = new Date(event.start)
                  .toISOString()
                  .split("T")[0];
                const cellDate = info.date.toISOString().split("T")[0];
                return eventDate === cellDate;
              });

              const appointmentCount = dayEvents.length;

              return (
                <div
                  className={`h-full w-full relative cursor-pointer transition-colors duration-200 ${
                    appointmentCount === 0
                      ? "hover:bg-gray-50"
                      : appointmentCount <= 10
                      ? "bg-green-50 hover:bg-green-100"
                      : appointmentCount <= 50
                      ? "bg-yellow-50 hover:bg-yellow-100"
                      : appointmentCount <= 100
                      ? "bg-orange-50 hover:bg-orange-100"
                      : "bg-red-50 hover:bg-red-100"
                  }`}
                  onClick={(e) => {
                    // Ngăn không cho sự kiện lan truyền để không kích hoạt chức năng select
                    e.stopPropagation();

                    if (appointmentCount > 0) {
                      handleDateClick(info.date.toISOString().split("T")[0]);
                    }
                  }}
                >
                  <div className="p-2">
                    <div className="font-medium text-gray-900">
                      {info.dayNumberText}
                    </div>
                    {appointmentCount > 0 && (
                      <div
                        className={`mt-1 text-xs font-semibold px-2 py-1 rounded-full text-center ${
                          appointmentCount <= 10
                            ? "bg-green-100 text-green-800"
                            : appointmentCount <= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : appointmentCount <= 100
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointmentCount} ca khám
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
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
          onClose={handleCloseModal}
          className="max-w-[700px] lg:p-8 mt-[10vh] mb-8"
        >
          <div className="flex flex-col px-4">
            <div className="flex justify-between items-center mb-6">
              <h5 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                Thêm lịch khám mới
              </h5>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateAppointment();
              }}
              className="space-y-6"
            >
              {/* Chọn ngày và schedule */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h6 className="font-medium text-gray-700 mb-3">Chọn lịch trống</h6>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Chọn khoa */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Khoa <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={departmentId}
                      onChange={handleDepartmentChange}
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
                    >
                      <option value="">Chọn khoa</option>
                      {departmentList.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chọn bác sĩ */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Bác sĩ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={doctorId}
                      onChange={handleDoctorChange}
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
                      disabled={!departmentId || isLoadingDoctors}
                    >
                      <option value="">
                        {isLoadingDoctors
                          ? "Đang tải..."
                          : departmentId
                          ? "Chọn bác sĩ"
                          : "Vui lòng chọn khoa trước"}
                      </option>
                      {filteredDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ngày khám */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                      Ngày khám <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      id="appointment-date"
                      onChange={handleDateChange}
                      value={selectedDate || ""}
                      error={errors.date}
                      disabled={!doctorId}
                    />
                  </div>
                </div>

                {/* Schedule selection */}
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    Lịch trống <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        onClick={() => handleScheduleSelect(schedule)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSchedule?.id === schedule.id
                            ? "border-base-500 bg-base-50"
                            : "border-gray-200 hover:border-base-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            schedule.status === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : schedule.status === "FULL"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {schedule.status === "AVAILABLE"
                              ? "Còn trống"
                              : schedule.status === "FULL"
                              ? "Đã đầy"
                              : "Đã hủy"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Số bệnh nhân: {schedule.currentPatients}/{schedule.maxPatients}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.scheduleId && (
                    <p className="text-red-500 text-xs mt-1">{errors.scheduleId}</p>
                  )}
                </div>

                {/* Thông tin bác sĩ và khoa */}
                {selectedSchedule && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Bác sĩ:</span>{" "}
                        <span className="text-gray-800">{selectedSchedule.doctorName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Khoa:</span>{" "}
                        <span className="text-gray-800">{selectedSchedule.departmentName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Thời gian:</span>{" "}
                        <span className="text-gray-800">{formatTimeRange(selectedSchedule.startTime, selectedSchedule.endTime)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Số bệnh nhân:</span>{" "}
                        <span className="text-gray-800">{selectedSchedule.currentPatients}/{selectedSchedule.maxPatients}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chọn bệnh nhân */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h6 className="font-medium text-gray-700 mb-3">Thông tin bệnh nhân</h6>
                
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    Bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedPatient?.id || ""}
                    onChange={handlePatientChange}
                    className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
                    required
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.fullName} - {patient.phoneNumber} - {getGenderText(patient.gender)}
                      </option>
                    ))}
                  </select>
                  {errors.patientId && (
                    <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>
                  )}
                </div>

                {/* Show selected patient details */}
                {selectedPatient && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin bệnh nhân</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Họ tên:</span>{" "}
                        <span className="text-gray-800">{selectedPatient.fullName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Số điện thoại:</span>{" "}
                        <span className="text-gray-800">{selectedPatient.phoneNumber}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Tuổi:</span>{" "}
                        <span className="text-gray-800">{selectedPatient.age}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Giới tính:</span>{" "}
                        <span className="text-gray-800">{getGenderText(selectedPatient.gender)}</span>
                      </div>
                      {selectedPatient.insuranceNumber && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-600">Số BHYT:</span>{" "}
                          <span className="text-gray-800">{selectedPatient.insuranceNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Triệu chứng */}
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">
                    Triệu chứng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Nhập triệu chứng"
                    className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm"
                  />
                  {errors.symptoms && (
                    <p className="text-red-500 text-xs mt-1">{errors.symptoms}</p>
                  )}
                </div>
              </div>

              {/* Nút điều khiển */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSchedule || !selectedPatient}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Thêm lịch khám"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal hiển thị danh sách ca khám trong ngày - sử dụng bên dưới */}

        {/* Modal hiển thị danh sách ca khám trong ngày */}
        <Modal
          isOpen={isDayModalOpen}
          onClose={closeDayModal}
          className="max-w-[700px] lg:p-8 lg:pb-6 mt-[10vh] mb-8 max-h-[80vh]"
        >
          <div className="flex flex-col px-4">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                Danh sách ca khám ngày {selectedDate}
              </h5>
              <p className="text-sm text-gray-600 mb-4">
                Tổng số:{" "}
                <span className="font-semibold text-base-600">
                  {dayEvents.length} ca khám
                </span>
              </p>
            </div>
            <div className="mt-4 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
              {dayEvents.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-8">
                  Không có ca khám nào trong ngày này.
                </p>
              ) : (
                <div className="space-y-3">
                  {dayEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md hover:border-base-300 transition-all duration-200"
                      onClick={() => handleAppointmentClick(event)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">
                            #{index + 1}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              event.extendedProps.calendar === "success"
                                ? "bg-green-100 text-green-800"
                                : event.extendedProps.calendar === "danger"
                                ? "bg-red-100 text-red-800"
                                : event.extendedProps.calendar === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {event.extendedProps.calendar === "success"
                              ? "Hoàn thành"
                              : event.extendedProps.calendar === "danger"
                              ? "Khẩn cấp"
                              : event.extendedProps.calendar === "warning"
                              ? "Đang chờ"
                              : "Chờ xác nhận"}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-base-600">
                          {formatTimeToVietnamese(
                            event.extendedProps.eventTime
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                          {event.title}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Mã BN:</span>{" "}
                            {event.extendedProps.patientId}
                          </div>
                          <div>
                            <span className="font-medium">SĐT:</span>{" "}
                            {event.extendedProps.phoneNumber}
                          </div>
                          <div>
                            <span className="font-medium">Bác sĩ:</span>{" "}
                            {event.extendedProps.doctorName}
                          </div>
                          <div>
                            <span className="font-medium">Khoa:</span>{" "}
                            {event.extendedProps.department}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>

        {/* Modal thông báo thành công */}
        <Modal
          isOpen={!!notification}
          onClose={() => setNotification(null)}
          className="max-w-xs mt-[30vh]"
        >
          <div className="p-6 text-center">
            <div
              className={`text-3xl mb-2 ${
                notification?.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {notification?.type === "success" ? "✔" : "✖"}
            </div>
            <div className="font-semibold text-lg mb-2">
              {notification?.message}
            </div>
            <div className="text-gray-500 text-sm">
              {notification?.type === "success"
                ? "Lịch khám mới đã được thêm vào hệ thống."
                : "Vui lòng kiểm tra lại thông tin hoặc thử lại sau."}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default MedicalCalendar;
