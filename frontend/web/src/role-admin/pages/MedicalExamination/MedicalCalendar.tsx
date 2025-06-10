import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../components/ui/modal/index.tsx";
import { useModal } from "../../hooks/useModal.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import DatePicker from "../../components/sections/appointments/DatePicker.tsx";
import TimePicker from "../../components/sections/appointments/TimePicker.tsx";
import {
  CalendarEvent,
  EVENT_STATUS_MAP,
  AppointmentRequest,
} from "../../types/appointment";
import {
  Department,
  Doctor,
  mockDataService,
} from "../../services/mockDataService.ts";
import { appointmentService } from "../../services/appointmentService";
import { AppointmentResponse } from "../../types/appointment";

// Function to format time to Vietnamese style
const formatTimeToVietnamese = (time: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const hourNum = parseInt(hours, 10);
  const minuteNum = parseInt(minutes, 10);

  return `${hourNum}:${minuteNum.toString().padStart(2, "0")}`;
};

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

const MedicalCalendar: React.FC = () => {
  // State cho form tạo lịch khám mới
  const [appointmentForm, setAppointmentForm] = useState<AppointmentRequest>({
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
  const [eventDate, setEventDate] = useState("");
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
      const calendarRows = document.querySelectorAll(
        ".fc-scrollgrid-sync-table tbody tr"
      );
      if (calendarRows && calendarRows.length) {
        calendarRows.forEach((row) => {
          (row as HTMLElement).style.height = "120px";
        });

        // Special fix for the problematic second row
        const secondRow = document.querySelector(
          ".fc-scrollgrid-sync-table tbody tr:nth-child(2)"
        );
        if (secondRow) {
          (secondRow as HTMLElement).style.height = "120px";
          (secondRow as HTMLElement).style.minHeight = "120px";

          // Also fix all cells in the second row
          const cells = secondRow.querySelectorAll("td");
          cells.forEach((cell) => {
            (cell as HTMLElement).style.height = "120px";
            (cell as HTMLElement).style.minHeight = "120px";
          });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [events]); // Re-apply when events change which might affect layout

  // Handler khi chọn ngày
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventDate(selectInfo.startStr);
    openModal();
  };

  // Handler khi click vào sự kiện
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);

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

  // Handler khi click vào ngày (hiển thị danh sách ca khám)
  const handleDateClick = (dateStr: string) => {
    const dateEvents = events.filter((event) => {
      const eventDate = new Date(event.start).toISOString().split("T")[0];
      return eventDate === dateStr;
    });

    setSelectedDate(dateStr);
    setDayEvents(dateEvents);
    openDayModal();
  };

  // Handler khi click vào từng ca khám trong danh sách
  const handleAppointmentClick = (appointment: CalendarEvent) => {
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

    setSelectedEvent(appointment);

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

    // Xóa lỗi (nếu có)
    if (errors.departmentId) {
      setErrors((prev) => ({ ...prev, departmentId: "" }));
    }
  };

  // Handler khi thay đổi bác sĩ
  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDocId = e.target.value;
    setDoctorId(selectedDocId);

    // Tìm tên bác sĩ tương ứng
    const selectedDoc = filteredDoctors.find((doc) => doc.id === selectedDocId);
    setDoctorName(selectedDoc?.name || "");

    // Xóa lỗi (nếu có)
    if (errors.doctorId) {
      setErrors((prev) => ({ ...prev, doctorId: "" }));
    }
  };

  // Validate form chỉ với các trường cần thiết
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!appointmentForm.slotStart) newErrors.slotStart = "Chọn giờ bắt đầu";
    if (!appointmentForm.slotEnd) newErrors.slotEnd = "Chọn giờ kết thúc";
    if (!appointmentForm.scheduleId) newErrors.scheduleId = "Nhập mã lịch khám";
    if (!appointmentForm.symptoms) newErrors.symptoms = "Nhập triệu chứng";
    if (!appointmentForm.doctorId) newErrors.doctorId = "Chọn bác sĩ";
    if (!appointmentForm.patientId) newErrors.patientId = "Nhập mã bệnh nhân";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm tạo lịch khám mới
  const handleCreateAppointment = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await appointmentService.createAppointment(appointmentForm);
      closeModal();
      setAppointmentForm({
        slotStart: "",
        slotEnd: "",
        scheduleId: 0,
        symptoms: "",
        doctorId: 0,
        patientId: 0,
      });
      setNotification({
        type: "success",
        message: "Tạo lịch khám thành công!",
      });
      setTimeout(() => setNotification(null), 5000);
      // Reload lại danh sách lịch khám từ API
      fetchAppointments();
    } catch (error) {
      setNotification({ type: "error", message: "Tạo lịch khám thất bại!" });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle đóng modal
  const handleCloseModal = () => {
    closeModal();
    resetModalFields();
  };

  // Làm trống các trường thông tin
  const resetModalFields = () => {
    // Reset thông tin bệnh nhân
    setPatientName("");
    setPatientId("");
    setInsuranceId("");
    setPhoneNumber("");
    setPatientAge(0);
    setSymptoms("");

    // Reset thông tin lịch khám
    setEventDate("");
    setEventTime("");
    setDoctorName("");
    setDoctorId("");
    setDepartment("");
    setDepartmentId("");

    // Reset trạng thái
    setEventLevel("");
    setSelectedEvent(null);
    setErrors({});
  };

  // Lấy danh sách lịch khám từ API khi mount và khi thêm mới thành công
  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getAllAppointments(0, 200);
      const apiEvents = res.content
        .map((item) => {
          let date = "";
          if (item.schedule && item.schedule.date) {
            date = item.schedule.date;
          } else if (item.createdAt) {
            date = item.createdAt.split("T")[0];
          }
          if (!date) return null;
          const start = `${date}T${item.slotStart}`;
          const end = `${date}T${item.slotEnd}`;
          return {
            id: item.appointmentId,
            title:
              item.patientInfo?.fullName || `Lịch khám #${item.appointmentId}`,
            start,
            end,
            extendedProps: {
              calendar:
                item.appointmentStatus === "COMPLETED"
                  ? "success"
                  : item.appointmentStatus === "CANCELLED"
                  ? "danger"
                  : item.appointmentStatus === "CONFIRMED"
                  ? "warning"
                  : "waiting",
              patientId: item.patientInfo?.patientId || "",
              symptoms: item.symptoms,
              doctorId: item.doctorId,
              // Thêm các trường khác nếu cần
            },
          };
        })
        .filter(Boolean);
      setEvents(apiEvents as CalendarEvent[]);
    } catch (error) {
      console.error("Không thể tải lịch khám từ API:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
            dayCellDidMount={(arg) => {
              // Remove "+ thêm" buttons from day cells
              const addButtonElements = arg.el.querySelectorAll(
                ".fc-daygrid-day-bottom"
              );
              addButtonElements.forEach((element) => {
                element.style.display = "none";
              });
            }}
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
          className="max-w-[500px] lg:p-8 mt-[30vh] mb-8"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <h5 className="mb-4 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Thêm lịch khám
            </h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateAppointment();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Giờ bắt đầu */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    id="slot-start"
                    placeholder="Chọn giờ bắt đầu"
                    value={appointmentForm.slotStart}
                    onChange={(_, val) =>
                      setAppointmentForm((prev) => ({
                        ...prev,
                        slotStart: val,
                      }))
                    }
                    error={errors.slotStart}
                  />
                  {errors.slotStart && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.slotStart}
                    </p>
                  )}
                </div>
                {/* Giờ kết thúc */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    id="slot-end"
                    placeholder="Chọn giờ kết thúc"
                    value={appointmentForm.slotEnd}
                    onChange={(_, val) =>
                      setAppointmentForm((prev) => ({ ...prev, slotEnd: val }))
                    }
                    error={errors.slotEnd}
                  />
                  {errors.slotEnd && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.slotEnd}
                    </p>
                  )}
                </div>
              </div>
              {/* Mã lịch khám */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mã lịch khám <span className="text-red-500">*</span>
                </label>
                <input
                  id="schedule-id"
                  type="number"
                  placeholder="Nhập mã lịch khám"
                  value={appointmentForm.scheduleId || ""}
                  onChange={(e) =>
                    setAppointmentForm((prev) => ({
                      ...prev,
                      scheduleId: Number(e.target.value),
                    }))
                  }
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  required
                />
                {errors.scheduleId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.scheduleId}
                  </p>
                )}
              </div>
              {/* Triệu chứng */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Triệu chứng <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="symptoms"
                  placeholder="Mô tả triệu chứng bệnh"
                  value={appointmentForm.symptoms}
                  onChange={(e) =>
                    setAppointmentForm((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }))
                  }
                  className="dark:bg-dark-900 h-20 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                  required
                ></textarea>
                {errors.symptoms && (
                  <p className="text-red-500 text-xs mt-1">{errors.symptoms}</p>
                )}
              </div>
              {/* Bác sĩ */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mã bác sĩ <span className="text-red-500">*</span>
                </label>
                <input
                  id="doctor-id"
                  type="number"
                  placeholder="Nhập mã bác sĩ"
                  value={appointmentForm.doctorId || ""}
                  onChange={(e) =>
                    setAppointmentForm((prev) => ({
                      ...prev,
                      doctorId: Number(e.target.value),
                    }))
                  }
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  required
                />
                {errors.doctorId && (
                  <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>
                )}
              </div>
              {/* Bệnh nhân */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mã bệnh nhân <span className="text-red-500">*</span>
                </label>
                <input
                  id="patient-id"
                  type="number"
                  placeholder="Nhập mã bệnh nhân"
                  value={appointmentForm.patientId || ""}
                  onChange={(e) =>
                    setAppointmentForm((prev) => ({
                      ...prev,
                      patientId: Number(e.target.value),
                    }))
                  }
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  required
                />
                {errors.patientId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.patientId}
                  </p>
                )}
              </div>
              {/* Nút submit */}
              <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-base-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-base-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {isSubmitting ? "Đang xử lý..." : "Thêm"}
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

const renderEventContent = (eventInfo: {
  event: {
    title: string;
    start: Date | null;
    extendedProps: { calendar: string; eventTime?: string };
  };
  timeText: string;
}) => {
  const colorClass = `fc-event-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;

  // Use eventTime from extendedProps if available, otherwise use timeText
  const displayTime =
    eventInfo.event.extendedProps.eventTime || eventInfo.timeText;

  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm bg-white`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{displayTime}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default MedicalCalendar;
