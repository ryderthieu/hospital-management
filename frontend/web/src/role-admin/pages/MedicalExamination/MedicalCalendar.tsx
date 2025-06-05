import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../components/ui/modal/index.tsx";
import { useModal } from "../../hooks/useModal.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import DatePicker from "../../components/appointments/DatePicker.tsx";
import TimePicker from "../../components/appointments/TimePicker.tsx";
import { CalendarEvent, EVENT_STATUS_MAP } from "../../types/appointment.ts";
import { Department, Doctor, mockDataService } from "../../services/mockDataService.ts";

const MedicalCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const { isOpen, openModal, closeModal } = useModal();

  // Load danh sách khoa khi component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await mockDataService.getDepartments();
        setDepartmentList(departments);
      } catch (error) {
        console.error("Error fetching department: ", error);
      }
    }

    fetchDepartments();
  }, []);

  // Load danh sách bác sĩ khi khoa thay đổi
  useEffect(() => {
    if(!departmentId) {
      setFilteredDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctors = await mockDataService.getDoctorsByDepartment(departmentId);
        setFilteredDoctors(doctors);
      } catch (error) {
        console.error("Error fetching doctors: ", error);
      } finally {
        setIsLoadingDoctors(false);
      }
    }

    fetchDoctors();
  }, [departmentId]);

  // Dữ liệu mẫu cho lịch khám sẵn
  useEffect(() => {
    setEvents([
      {
        id: "1",
        title: "Nguyễn Văn A",
        start: new Date(Date.now()).toISOString().split("T")[0],
        extendedProps: { 
          calendar: "danger",
          patientName: "Nguyễn Văn A",
          patientId: "BN001",
          insuranceId: "BH12345678",
          phoneNumber: "0901234567",
          patientAge: 45,
          symptoms: "Sốt cao, ho, đau đầu",
          eventTime: "08:30",
          doctorName: "Phạm Văn Minh",
          department: "Khoa Nội",
          departmentId: "dept-1",
          doctorId: "doc-1"
        },
      },
      {
        id: "2",
        title: "Trần Thị B",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { 
          calendar: "success",
          patientName: "Trần Thị B",
          patientId: "BN002", 
          insuranceId: "BH87654321",
          phoneNumber: "0987654321",
          patientAge: 35,
          symptoms: "Đau bụng, buồn nôn",
          eventTime: "10:00",
          doctorName: "Trương Thị Mỹ Hoa",
          department: "Khoa Tiêu hóa",
          departmentId: "dept-7",
          doctorId: "doc-4"
        },
      },
      {
        id: "3",
        title: "Lê Văn C",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        extendedProps: { 
          calendar: "waiting",
          patientName: "Lê Văn C",
          patientId: "BN003",
          insuranceId: "BH24680135",
          phoneNumber: "0912345678",
          patientAge: 28,
          symptoms: "Khó thở, đau ngực",
          eventTime: "14:15",
          doctorName: "Đỗ Thành Nam",
          department: "Khoa Tim mạch",
          departmentId: "dept-3",
          doctorId: "doc-3"
        },
      },
      {
        id: "4",
        title: "Phạm Thị D",
        start: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        extendedProps: { 
          calendar: "cancel",
          patientName: "Phạm Thị D",
          patientId: "BN004",
          insuranceId: "BH13579024",
          phoneNumber: "0977889966",
          patientAge: 62,
          symptoms: "Đau khớp, sưng đỏ tại khớp gối",
          eventTime: "09:45",
          doctorName: "Lâm Tâm Như",
          department: "Khoa Cơ Xương Khớp",
          departmentId: "dept-6",
          doctorId: "doc-6"
        },
      },
    ]);
  }, []);


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
        doctorId: docId
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

  // Handler khi thay đổi khoa
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDeptId = e.target.value;
    setDepartmentId(selectedDeptId);

    // Tìm tên khoa tương ứng
    const selectedDept = departmentList.find(dept => dept.id === selectedDeptId);
    setDepartment(selectedDept?.name || "");

    // Reset thông tin bác sĩ khi đổi khoa
    setDoctorId("");
    setDoctorName("");

    // Xóa lỗi (nếu có)
    if(errors.departmentId) {
      setErrors(prev => ({ ...prev, departmentId: ""}));
    }
  }

  // Handler khi thay đổi bác sĩ
  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDocId = e.target.value;
    setDoctorId(selectedDocId);

    // Tìm tên bác sĩ tương ứng
    const selectedDoc = filteredDoctors.find(doc => doc.id === selectedDocId);
    setDoctorName(selectedDoc?.name || "");

    // Xóa lỗi (nếu có)
    if(errors.doctorId) {
      setErrors(prev => ({ ...prev, doctorId: ""}));
    }
  }


  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[0-9]{10}$/

    if (!patientName) newErrors.patientName = "Vui lòng nhập tên bệnh nhân";
    if (!eventDate) newErrors.eventDate = "Vui lòng chọn ngày khám";
    if (!eventTime) newErrors.eventTime = "Vui lòng chọn giờ khám";
    if (!departmentId) newErrors.departmentId = "Vui lòng chọn khoa";
    if (!doctorId) newErrors.doctorId = "Vui lòng chọn bác sĩ";
    if (!eventLevel) newErrors.eventLevel = "Vui lòng chọn trạng thái";
    if (!phoneNumber) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ (phải có 10 chữ số)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  // Handle khi thêm hoặc cập nhật sự kiện
  const handleAddOrUpdateEvent = () => {
    if(!validateForm()){
      return;
    }

    setIsSubmitting(true);

    // Tạo thông tin chi tiết cho lịch khám
    const eventDetails = {
      patientName,
      patientId,
      insuranceId,
      phoneNumber,
      patientAge,
      symptoms,
      doctorName,
      department,
      departmentId,
      doctorId
    };

    try {
      if (selectedEvent) {
        // Cập nhật lịch khám đã tồn tại
        setEvents((prevEvents) => 
          prevEvents.map((event) => 
            event.id === selectedEvent.id 
            ? {
              ...event,
              title: patientName,
              start: eventDate,
              extendedProps: {
                calendar: eventLevel as any,
                eventTime: eventTime,
                ...eventDetails
              }
            }
            : event
          )
        ); 
          
        closeModal();
        resetModalFields();
      } else {
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: patientName,
          start: eventDate,
          extendedProps: { 
            calendar: eventLevel as any,
            eventTime: eventTime,
            ...eventDetails 
          },
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);

        closeModal();
        resetModalFields();
      }
    } catch (error) {
      console.error("Error save appointment: ", error);
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle đóng modal
  const handleCloseModal = () => {
    closeModal();
    resetModalFields();
  }

  
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

  return (
    <>
      <PageMeta
        title="Calendar | Admin Dashboard "
        description="This is Calendar Dashboard"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
          onClose={handleCloseModal}
          className="max-w-[700px] lg:p-10 lg:pb-8 mt-[30vh] mb-8"
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
                      Tên bệnh nhân <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="patient-name"
                      type="text"
                      placeholder="Nhập tên bệnh nhân"
                      value={patientName}
                      onChange={(e) => {
                        setPatientName(e.target.value);
                        if (errors.patientName) {
                          setErrors(prev => ({ ...prev, patientName: "" }));
                        }
                      }}
                      className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${errors.patientName ? 'border-red-500' : 'border-gray-300'} bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800`}
                    />
                    {errors.patientName && (
                      <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>
                    )}
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
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone-number"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      value={phoneNumber}
                       onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (errors.phoneNumber) {
                            setErrors(prev => ({ ...prev, phoneNumber: "" }));
                          }
                        }}
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
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
                      onChange={(e) => setPatientAge(Number(e.target.value))}
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
                      label={<>Ngày khám <span className="text-red-500">*</span></>}
                      placeholder="Chọn ngày khám"
                      value={eventDate}
                      onChange={(_, currentDateString) => {
                        setEventDate(currentDateString);
                        if (errors.eventDate) {
                          setErrors(prev => ({ ...prev, eventDate: "" }));
                        }
                      }}
                      error={errors.eventDate}
                    />
                  </div>
                  <div className="md:w-1/3">
                    <TimePicker
                      id="time-picker"
                      label={<>Giờ khám <span className="text-red-500">*</span></>}
                      placeholder="Chọn giờ khám"
                      value={eventTime}
                      onChange={(_, currentTimeString) => {
                        setEventTime(currentTimeString);
                        if (errors.eventTime) {
                          setErrors(prev => ({ ...prev, eventTime: "" }));
                        }
                      }}
                      error={errors.eventTime}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                  {/* Khoa */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Khoa <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="department"
                      value={departmentId}
                      onChange={handleDepartmentChange}
                      className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${errors.departmentId ? 'border-red-500' : 'border-gray-300'} bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800`}
                    >
                      <option value="">-- Chọn khoa --</option>
                      {departmentList.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.departmentId && (
                      <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>
                    )}
                  </div>
                  
                  {/* Bác sĩ phụ trách */}
                  <div className="space-y-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Bác sĩ phụ trách <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="doctor"
                      value={doctorId}
                      onChange={handleDoctorChange}
                      disabled={!departmentId || isLoadingDoctors}
                      className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${errors.doctorId ? 'border-red-500' : 'border-gray-300'} bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-base-300 focus:outline-hidden focus:ring-3 focus:ring-base-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-base-800 ${(!departmentId || isLoadingDoctors) ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      <option value="">
                        {isLoadingDoctors 
                          ? "Đang tải..." 
                          : !departmentId 
                            ? "Vui lòng chọn khoa trước" 
                            : "-- Chọn bác sĩ --"}
                      </option>
                      {!isLoadingDoctors && filteredDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && (
                      <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>
                    )}
                  </div>
                </div>
                
                {/* Trạng thái lịch khám */}
                <div className="mt-6">
                  <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                    {Object.entries(EVENT_STATUS_MAP).map(([key, value]) => (
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
                                value={value}
                                id={`modal${key}`}
                                checked={eventLevel === value}
                                onChange={() => {
                                  setEventLevel(value);
                                  if (errors.eventLevel) {
                                    setErrors(prev => ({ ...prev, eventLevel: "" }));
                                  }
                                }}
                              />
                              <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                                <span
                                  className={`h-2 w-2 rounded-full bg-white ${
                                    eventLevel === value ? "block" : "hidden"
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
                  {errors.eventLevel && (
                    <p className="text-red-500 text-xs mt-1">{errors.eventLevel}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={handleCloseModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Hủy
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                disabled={isSubmitting}
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-base-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-base-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              >
                {isSubmitting ? (
                  "Đang xử lý..."
                ) : (
                  selectedEvent ? "Cập nhật" : "Thêm"
                )}
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

export default MedicalCalendar;