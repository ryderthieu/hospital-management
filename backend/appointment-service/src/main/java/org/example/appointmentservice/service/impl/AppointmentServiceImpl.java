package org.example.appointmentservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.client.DoctorServiceClient;
import org.example.appointmentservice.client.PatientServiceClient;
import org.example.appointmentservice.dto.*;
import org.example.appointmentservice.entity.Appointment;
import org.example.appointmentservice.repository.AppointmentRepository;
import org.example.appointmentservice.service.AppointmentService;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import jakarta.annotation.PreDestroy;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientServiceClient patientServiceClient;
    private final DoctorServiceClient doctorServiceClient;
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    @Override
    public List<AppointmentDtos.AppointmentResponse> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return batchMapToAppointmentResponses(appointments);
    }

    @Override
    public AppointmentDtos.AppointmentResponse getAppointmentById(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        return mapToAppointmentResponse(appointment);
    }

    @Override
    public AppointmentDtos.AppointmentResponse createAppointment(AppointmentDtos.AppointmentRequest request) {
        log.info("Tạo cuộc hẹn mới với thông tin: {}", request);

        try {
            // Lấy thông tin lịch khám
            ScheduleDto schedule = doctorServiceClient.getScheduleById(request.getScheduleId());
            log.info("Thông tin lịch khám: {}", schedule);
            
            if (schedule == null) {
                throw new RuntimeException("Không tìm thấy thông tin lịch khám với ID: " + request.getScheduleId());
            }

            // Kiểm tra bác sĩ của lịch khám có khớp với request không
            if (!schedule.getDoctorId().equals(request.getDoctorId())) {
                throw new RuntimeException("Bác sĩ không khớp với lịch khám");
            }

            // Log thông tin thời gian để debug
            log.info("Thời gian đặt khám - Bắt đầu: {}, Kết thúc: {}", request.getSlotStart(), request.getSlotEnd());
            log.info("Thời gian ca trực - Bắt đầu: {}, Kết thúc: {}", schedule.getStartTime(), schedule.getEndTime());

            // Kiểm tra thời gian đặt khám có nằm trong khoảng thời gian của ca trực không
            if (request.getSlotStart().isBefore(schedule.getStartTime())) {
                throw new RuntimeException(String.format(
                    "Thời gian bắt đầu khám (%s) phải sau hoặc bằng thời gian bắt đầu ca trực (%s)",
                    request.getSlotStart(),
                    schedule.getStartTime()
                ));
            }

            if (request.getSlotEnd().isAfter(schedule.getEndTime())) {
                throw new RuntimeException(String.format(
                    "Thời gian kết thúc khám (%s) phải trước hoặc bằng thời gian kết thúc ca trực (%s)",
                    request.getSlotEnd(),
                    schedule.getEndTime()
                ));
            }

            // Tính toán số slot từ giờ bắt đầu ca trực
            int slotIndex = calculateSlotIndex(schedule.getStartTime(), request.getSlotStart());
            log.info("Slot index: {}", slotIndex);
            
            if (slotIndex < 0) {
                throw new RuntimeException(String.format(
                    "Thời gian đặt khám không hợp lệ. Thời gian bắt đầu phải là đầu giờ (phút = 00) và sau thời gian bắt đầu ca trực"
                ));
            }

            // Kiểm tra số lượng cuộc hẹn trong khung giờ hiện tại
            Integer existingAppointments = appointmentRepository.countByScheduleIdAndSlotStart(
                request.getScheduleId(), 
                request.getSlotStart()
            );
            log.info("Số lượng cuộc hẹn hiện tại trong khung giờ: {}", existingAppointments);

            // Kiểm tra xem đã đạt giới hạn 10 cuộc hẹn/khung giờ chưa
            if (existingAppointments >= 10) {
                throw new RuntimeException("Khung giờ này đã đạt giới hạn số lượng đặt khám");
            }

            // Tính số thứ tự: (số slot * 10) + số thứ tự trong slot hiện tại
            Integer appointmentNumber = (slotIndex * 10) + (existingAppointments != null ? existingAppointments : 0) + 1;
            log.info("Tính số thứ tự: slot {} * 10 + {} + 1 = {}", slotIndex, existingAppointments, appointmentNumber);

            // Tạo cuộc hẹn mới
            Appointment appointment = Appointment.builder()
                    .doctorId(request.getDoctorId())
                    .patientId(request.getPatientId())
                    .scheduleId(request.getScheduleId())
                    .symptoms(request.getSymptoms())
                    .slotStart(request.getSlotStart())
                    .slotEnd(request.getSlotEnd())
                    .number(appointmentNumber)
                    .appointmentStatus(Appointment.AppointmentStatus.PENDING)
                    .build();

            log.info("Lưu cuộc hẹn với số thứ tự: {}", appointmentNumber);
            Appointment savedAppointment = appointmentRepository.save(appointment);
            
            return mapToAppointmentResponse(savedAppointment);
        } catch (Exception e) {
            log.error("Lỗi khi tạo cuộc hẹn: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi tạo cuộc hẹn: " + e.getMessage());
        }
    }

    private int calculateSlotIndex(LocalTime shiftStart, LocalTime appointmentTime) {
        if (appointmentTime.isBefore(shiftStart)) {
            return -1;
        }
        
        // Tính số giờ chênh lệch
        int hoursDiff = appointmentTime.getHour() - shiftStart.getHour();
        
        // Nếu phút của giờ đặt khám khác 0, có thể là không hợp lệ
        if (appointmentTime.getMinute() != 0) {
            return -1;
        }
        
        return hoursDiff;
    }

    @Override
    public AppointmentDtos.AppointmentResponse updateAppointment(Integer appointmentId, AppointmentDtos.AppointmentUpdateRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        appointment.setDoctorId(request.getDoctorId());
        appointment.setPatientId(request.getPatientId());
        appointment.setScheduleId(request.getScheduleId());
        appointment.setSymptoms(request.getSymptoms());
        appointment.setNumber(request.getNumber());
        appointment.setAppointmentStatus(request.getAppointmentStatus());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapToAppointmentResponse(updatedAppointment);
    }

    @Override
    public void deleteAppointment(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        appointmentRepository.delete(appointment);
    }

    @Override
    public List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorId(Integer doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        if (appointments.isEmpty()) {
            return Collections.emptyList();
        }
        return batchMapToAppointmentResponses(appointments);
    }

    @Override
    public List<AppointmentDtos.AppointmentResponse> getAppointmentsByPatientId(Integer patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        if (appointments.isEmpty()) {
            return Collections.emptyList();
        }
        return batchMapToAppointmentResponses(appointments);
    }

    @Override
    public List<AppointmentDtos.AppointmentResponse> getTodayAppointmentsByDoctorId(Integer doctorId) {
        log.info("Lấy danh sách cuộc hẹn trong ngày của bác sĩ ID: {}", doctorId);
        
        LocalDate today = LocalDate.now();
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDate(doctorId, today);
        
        if (appointments.isEmpty()) {
            log.info("Không có cuộc hẹn nào trong ngày {} cho bác sĩ ID: {}", today, doctorId);
            return Collections.emptyList();
        }

        return appointments.stream()
                .map(this::mapToAppointmentResponse)
                .sorted(Comparator.comparing(AppointmentDtos.AppointmentResponse::getNumber))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorIdAndDate(Integer doctorId, LocalDate date) {
        log.info("Lấy danh sách cuộc hẹn của bác sĩ ID: {} vào ngày: {}", doctorId, date);
        
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDate(doctorId, date);
        if (appointments.isEmpty()) {
            log.info("Không tìm thấy cuộc hẹn nào cho bác sĩ ID: {} vào ngày: {}", doctorId, date);
            return Collections.emptyList();
        }

        return appointments.stream()
                .map(this::mapToAppointmentResponse)
                .sorted(Comparator.comparing(AppointmentDtos.AppointmentResponse::getNumber))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDtos.AvailableTimeSlotResponse> getAvailableTimeSlots(Integer scheduleId, ScheduleTimeDto scheduleTime) {
        List<AppointmentDtos.AvailableTimeSlotResponse> availableSlots = new ArrayList<>();
        LocalTime currentTime = scheduleTime.getStartTime();

        // Tạo các khung giờ 1 tiếng cho đến hết ca trực
        while (!currentTime.plusHours(1).isAfter(scheduleTime.getEndTime())) {
            LocalTime slotStart = currentTime;
            LocalTime slotEnd = currentTime.plusHours(1);

            // Đếm số lượng cuộc hẹn trong khung giờ này
            Integer existingAppointments = appointmentRepository.countByScheduleIdAndSlotStart(scheduleId, slotStart);
            if (existingAppointments == null) {
                existingAppointments = 0;
            }

            // Tạo response cho khung giờ
            AppointmentDtos.AvailableTimeSlotResponse slot = AppointmentDtos.AvailableTimeSlotResponse.builder()
                    .slotStart(slotStart)
                    .slotEnd(slotEnd)
                    .isAvailable(existingAppointments < 10)
                    .build();

            availableSlots.add(slot);
            currentTime = slotEnd;
        }

        return availableSlots;
    }

    @Override
    public List<AppointmentDtos.AppointmentResponse> getAppointmentsByScheduleId(Integer scheduleId) {
        log.info("Lấy danh sách cuộc hẹn theo lịch khám ID: {}", scheduleId);

        // Kiểm tra lịch khám có tồn tại không
        ScheduleDto schedule = doctorServiceClient.getScheduleById(scheduleId);
        if (schedule == null) {
            throw new RuntimeException("Không tìm thấy thông tin lịch khám với ID: " + scheduleId);
        }

        List<Appointment> appointments = appointmentRepository.findByScheduleIdOrderBySlotStartAsc(scheduleId);
        if (appointments.isEmpty()) {
            log.info("Không có cuộc hẹn nào cho lịch khám ID: {}", scheduleId);
            return Collections.emptyList();
        }

        return batchMapToAppointmentResponses(appointments);
    }

    private List<AppointmentDtos.AppointmentResponse> batchMapToAppointmentResponses(List<Appointment> appointments) {
        if (appointments.isEmpty()) {
            return Collections.emptyList();
        }

        // Thu thập unique IDs
        List<Integer> patientIds = appointments.stream()
                .map(Appointment::getPatientId)
                .distinct()
                .collect(Collectors.toList());

        List<Integer> scheduleIds = appointments.stream()
                .map(Appointment::getScheduleId)
                .distinct()
                .collect(Collectors.toList());

        List<Integer> doctorIds = appointments.stream()
                .map(Appointment::getDoctorId)
                .distinct()
                .collect(Collectors.toList());

        // Tạo cache cho patient và schedule info
        Map<Integer, PatientDto> patientCache = new HashMap<>();
        Map<Integer, ScheduleDto> scheduleCache = new HashMap<>();
        Map<Integer, DoctorDto> doctorCache = new HashMap<>();

        try {
            // Tạo danh sách CompletableFuture cho các API call
            List<CompletableFuture<Void>> futures = new ArrayList<>();

            // Batch lấy thông tin bệnh nhân song song
            for (Integer patientId : patientIds) {
                CompletableFuture<Void> future = CompletableFuture
                    .supplyAsync(() -> {
                        try {
                            return patientServiceClient.getPatientById(patientId);
                        } catch (Exception e) {
                            log.error("Lỗi khi lấy thông tin bệnh nhân ID {}: {}", patientId, e.getMessage());
                            return null;
                        }
                    }, executorService)
                    .thenAccept(patientInfo -> {
                        if (patientInfo != null) {
                            synchronized (patientCache) {
                                patientCache.put(patientId, patientInfo);
                            }
                        }
                    });
                futures.add(future);
            }

            for (Integer doctorId: doctorIds) {
                CompletableFuture<Void> future = CompletableFuture
                        .supplyAsync(() -> {
                            try {
                                return doctorServiceClient.getDoctorById(doctorId);
                            } catch (Exception e) {
                                log.error("Lỗi khi lấy thông tin bác sĩ ID {}: {}", doctorId, e.getMessage());
                                return null;
                            }
                        }, executorService)
                        .thenAccept(doctorInfo -> {
                            if (doctorInfo != null) {
                                synchronized (doctorCache) {
                                    doctorCache.put(doctorId, doctorInfo);
                                }
                            }
                        });
                futures.add(future);
            }

            // Batch lấy thông tin lịch khám song song
            for (Integer scheduleId : scheduleIds) {
                CompletableFuture<Void> future = CompletableFuture
                    .supplyAsync(() -> {
                        try {
                            return doctorServiceClient.getScheduleById(scheduleId);
                        } catch (Exception e) {
                            log.error("Lỗi khi lấy thông tin lịch khám ID {}: {}", scheduleId, e.getMessage());
                            return null;
                        }
                    }, executorService)
                    .thenAccept(scheduleInfo -> {
                        if (scheduleInfo != null) {
                            synchronized (scheduleCache) {
                                scheduleCache.put(scheduleId, scheduleInfo);
                            }
                        }
                    });
                futures.add(future);
            }

            // Chờ tất cả các API call hoàn thành
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin: {}", e.getMessage());
        }

        // Map appointments với thông tin đã cache
        return appointments.stream()
                .map(appointment -> {
                    AppointmentDtos.AppointmentResponse response = new AppointmentDtos.AppointmentResponse();
                    response.setAppointmentId(appointment.getAppointmentId());
                    response.setDoctorId(appointment.getDoctorId());
                    response.setSymptoms(appointment.getSymptoms());
                    response.setNumber(appointment.getNumber());
                    response.setSlotStart(appointment.getSlotStart());
                    response.setSlotEnd(appointment.getSlotEnd());
                    response.setAppointmentStatus(appointment.getAppointmentStatus());
                    response.setCreatedAt(appointment.getCreatedAt());

                    // Set patient info từ cache
                    PatientDto patientInfo = patientCache.get(appointment.getPatientId());
                    if (patientInfo != null) {
                        response.setPatientInfo(patientInfo);
                    }

                    // Set schedule info từ cache
                    ScheduleDto scheduleInfo = scheduleCache.get(appointment.getScheduleId());
                    if (scheduleInfo != null) {
                        response.setSchedule(scheduleInfo);
                    }

                    DoctorDto doctorInfo = doctorCache.get(appointment.getDoctorId());
                    if (doctorInfo != null) {
                        response.setDoctorInfo(doctorInfo);
                    }

                    // Map appointment notes nếu có
                    if (appointment.getAppointmentNotes() != null && !appointment.getAppointmentNotes().isEmpty()) {
                        List<AppointmentNoteDto> notes = appointment.getAppointmentNotes().stream()
                                .map(AppointmentNoteDto::new)
                                .collect(Collectors.toList());
                        response.setAppointmentNotes(notes);
                    }

                    return response;
                })
                .collect(Collectors.toList());
    }

    private AppointmentDtos.AppointmentResponse mapToAppointmentResponse(Appointment appointment) {
        AppointmentDtos.AppointmentResponse response = new AppointmentDtos.AppointmentResponse();
        response.setAppointmentId(appointment.getAppointmentId());
        response.setDoctorId(appointment.getDoctorId());
        response.setSymptoms(appointment.getSymptoms());
        response.setNumber(appointment.getNumber());
        response.setSlotStart(appointment.getSlotStart());
        response.setSlotEnd(appointment.getSlotEnd());
        response.setAppointmentStatus(appointment.getAppointmentStatus());
        response.setCreatedAt(appointment.getCreatedAt());

        // Lấy thông tin bệnh nhân
        try {
            PatientDto patientInfo = patientServiceClient.getPatientById(appointment.getPatientId());
            log.info("Thông tin bệnh nhân: {}", patientInfo);
            if (patientInfo != null) {
                response.setPatientInfo(patientInfo);
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin bệnh nhân ID: {}", appointment.getPatientId(), e);
        }

        // Lấy thông tin lịch khám
        try {
            ScheduleDto scheduleInfo = doctorServiceClient.getScheduleById(appointment.getScheduleId());
            log.info("Thông tin lịch khám: {}", scheduleInfo);
            if (scheduleInfo != null) {
                response.setSchedule(scheduleInfo);
            } else {
                log.warn("Không tìm thấy thông tin lịch khám ID: {}", appointment.getScheduleId());
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin lịch khám ID: {}", appointment.getScheduleId(), e);
        }

        try {
            DoctorDto doctorInfo = doctorServiceClient.getDoctorById(appointment.getDoctorId());
            log.info("Thông tin bác sĩ: {}", doctorInfo);
            if (doctorInfo != null) {
                response.setDoctorInfo(doctorInfo);
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin bác sĩ ID: {}", appointment.getDoctorId(), e);
        }

        // Lấy thông tin ghi chú nếu có
        if (appointment.getAppointmentNotes() != null && !appointment.getAppointmentNotes().isEmpty()) {
            List<AppointmentNoteDto> notes = appointment.getAppointmentNotes().stream()
                    .map(AppointmentNoteDto::new)
                    .collect(Collectors.toList());
            response.setAppointmentNotes(notes);
        }

        return response;
    }

    @Override
    public List<AppointmentResponseTypes.DoctorViewResponse> getAppointmentsByDoctorIdOptimized(Integer doctorId) {
        log.info("Lấy danh sách cuộc hẹn tối ưu cho bác sĩ ID: {}", doctorId);
        
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        if (appointments.isEmpty()) {
            return Collections.emptyList();
        }

        // Thu thập unique patient IDs
        List<Integer> patientIds = appointments.stream()
                .map(Appointment::getPatientId)
                .distinct()
                .collect(Collectors.toList());

        // Tạo cache cho patient info
        Map<Integer, PatientDto> patientCache = new HashMap<>();
        try {
            CompletableFuture<Void> patientFuture = CompletableFuture.runAsync(() -> {
                patientIds.forEach(patientId -> {
                    try {
                        PatientDto patientInfo = patientServiceClient.getPatientById(patientId);
                        if (patientInfo != null) {
                            patientCache.put(patientId, patientInfo);
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi lấy thông tin bệnh nhân ID: {}", patientId, e);
                    }
                });
            }, executorService);

            // Đợi hoàn thành
            patientFuture.get();
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin bệnh nhân: {}", e.getMessage());
        }

        // Thu thập unique schedule IDs
        List<Integer> scheduleIds = appointments.stream()
                .map(Appointment::getScheduleId)
                .distinct()
                .collect(Collectors.toList());

        // Tạo cache cho schedule info
        Map<Integer, ScheduleDto> scheduleCache = new HashMap<>();
        try {
            CompletableFuture<Void> scheduleFuture = CompletableFuture.runAsync(() -> {
                scheduleIds.forEach(scheduleId -> {
                    try {
                        ScheduleDto scheduleInfo = doctorServiceClient.getScheduleById(scheduleId);
                        if (scheduleInfo != null) {
                            scheduleCache.put(scheduleId, scheduleInfo);
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi lấy thông tin lịch khám ID: {}", scheduleId, e);
                    }
                });
            }, executorService);

            // Đợi hoàn thành
            scheduleFuture.get();
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin lịch khám: {}", e.getMessage());
        }

        return appointments.stream()
                .map(appointment -> {
                    AppointmentResponseTypes.DoctorViewResponse response = new AppointmentResponseTypes.DoctorViewResponse();
                    response.setAppointmentId(appointment.getAppointmentId());
                    response.setPatientId(appointment.getPatientId());
                    response.setSymptoms(appointment.getSymptoms());
                    response.setNumber(appointment.getNumber());
                    
                    // Set schedule info từ cache
                    ScheduleDto scheduleInfo = scheduleCache.get(appointment.getScheduleId());
                    if (scheduleInfo != null) {
                        response.setSchedule(scheduleInfo);
                    }
                    
                    response.setAppointmentStatus(appointment.getAppointmentStatus());
                    response.setCreatedAt(appointment.getCreatedAt());

                    // Set patient info từ cache
                    PatientDto patientInfo = patientCache.get(appointment.getPatientId());
                    if (patientInfo != null) {
                        response.setPatientInfo(patientInfo);
                    }

                    return response;
                })
                .sorted(Comparator.comparing(AppointmentResponseTypes.DoctorViewResponse::getNumber))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseTypes.PatientViewResponse> getAppointmentsByPatientIdOptimized(Integer patientId) {
        log.info("Lấy danh sách cuộc hẹn tối ưu cho bệnh nhân ID: {}", patientId);
        
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        if (appointments.isEmpty()) {
            return Collections.emptyList();
        }

        // Thu thập unique IDs
        List<Integer> scheduleIds = appointments.stream()
                .map(Appointment::getScheduleId)
                .distinct()
                .collect(Collectors.toList());

        List<Integer> doctorIds = appointments.stream()
                .map(Appointment::getDoctorId)
                .distinct()
                .collect(Collectors.toList());

        // Tạo cache cho schedule và doctor info
        Map<Integer, ScheduleDto> scheduleCache = new HashMap<>();
        Map<Integer, DoctorDto> doctorCache = new HashMap<>();

        try {
            List<CompletableFuture<Void>> futures = new ArrayList<>();

            // Batch lấy thông tin lịch khám song song
            for (Integer scheduleId : scheduleIds) {
                CompletableFuture<Void> future = CompletableFuture
                    .supplyAsync(() -> {
                        try {
                            return doctorServiceClient.getScheduleById(scheduleId);
                        } catch (Exception e) {
                            log.error("Lỗi khi lấy thông tin lịch khám ID {}: {}", scheduleId, e.getMessage());
                            return null;
                        }
                    }, executorService)
                    .thenAccept(scheduleInfo -> {
                        if (scheduleInfo != null) {
                            synchronized (scheduleCache) {
                                scheduleCache.put(scheduleId, scheduleInfo);
                            }
                        }
                    });
                futures.add(future);
            }

            // Batch lấy thông tin bác sĩ song song
            for (Integer doctorId : doctorIds) {
                CompletableFuture<Void> future = CompletableFuture
                    .supplyAsync(() -> {
                        try {
                            return doctorServiceClient.getDoctorById(doctorId);
                        } catch (Exception e) {
                            log.error("Lỗi khi lấy thông tin bác sĩ ID {}: {}", doctorId, e.getMessage());
                            return null;
                        }
                    }, executorService)
                    .thenAccept(doctorInfo -> {
                        if (doctorInfo != null) {
                            synchronized (doctorCache) {
                                doctorCache.put(doctorId, doctorInfo);
                            }
                        }
                    });
                futures.add(future);
            }

            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin: {}", e.getMessage());
        }

        return appointments.stream()
                .map(appointment -> {
                    AppointmentResponseTypes.PatientViewResponse response = new AppointmentResponseTypes.PatientViewResponse();
                    response.setAppointmentId(appointment.getAppointmentId());
                    response.setDoctorId(appointment.getDoctorId());
                    response.setSymptoms(appointment.getSymptoms());
                    response.setNumber(appointment.getNumber());
                    response.setSlotStart(appointment.getSlotStart());
                    response.setSlotEnd(appointment.getSlotEnd());
                    response.setAppointmentStatus(appointment.getAppointmentStatus());
                    response.setCreatedAt(appointment.getCreatedAt());

                    // Set schedule info từ cache
                    ScheduleDto scheduleInfo = scheduleCache.get(appointment.getScheduleId());
                    if (scheduleInfo != null) {
                        response.setSchedule(scheduleInfo);
                    }

                    // Set doctor info từ cache
                    DoctorDto doctorInfo = doctorCache.get(appointment.getDoctorId());
                    if (doctorInfo != null) {
                        response.setDoctorInfo(doctorInfo);
                        log.info("Đã set thông tin bác sĩ: {}", doctorInfo);
                    } else {
                        log.warn("Không tìm thấy thông tin bác sĩ ID: {}", appointment.getDoctorId());
                    }

                    return response;
                })
                .sorted(Comparator.comparing(AppointmentResponseTypes.PatientViewResponse::getNumber))
                .collect(Collectors.toList());
    }

    // Thêm phương thức để đóng ExecutorService khi service bị destroy
    @PreDestroy
    public void destroy() {
        executorService.shutdown();
    }
}
