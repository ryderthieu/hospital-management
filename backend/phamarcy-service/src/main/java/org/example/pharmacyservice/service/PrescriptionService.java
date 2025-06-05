package org.example.pharmacyservice.service;

import org.example.pharmacyservice.dto.PrescriptionDTOs;
import org.example.pharmacyservice.entity.Medicine;
import org.example.pharmacyservice.entity.Prescription;
import org.example.pharmacyservice.entity.PrescriptionDetail;
import org.example.pharmacyservice.repository.MedicineRepository;
import org.example.pharmacyservice.repository.PrescriptionDetailRepository;
import org.example.pharmacyservice.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionDetailRepository prescriptionDetailRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineService medicineService;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               PrescriptionDetailRepository prescriptionDetailRepository,
                               MedicineRepository medicineRepository,
                               MedicineService medicineService) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionDetailRepository = prescriptionDetailRepository;
        this.medicineRepository = medicineRepository;
        this.medicineService = medicineService;
    }

    private PrescriptionDTOs.PrescriptionResponse mapToPrescriptionResponse(Prescription prescription) {
        List<PrescriptionDTOs.PrescriptionDetailResponse> detailResponses = prescription.getPrescriptionDetails().stream()
                .map(this::mapToPrescriptionDetailResponse)
                .collect(Collectors.toList());

        return new PrescriptionDTOs.PrescriptionResponse(
                prescription.getPrescriptionId(),
                prescription.getAppointmentId(),
                prescription.getFollowUpDate(),
                prescription.isFollowUp(),
                prescription.getDiagnosis(),
                prescription.getSystolicBloodPressure(),
                prescription.getDiastolicBloodPressure(),
                prescription.getHeartRate(),
                prescription.getBloodSugar(),
                prescription.getNote(),
                prescription.getCreatedAt() != null ? prescription.getCreatedAt().toLocalDateTime() : null,
                detailResponses
        );
    }

    private PrescriptionDTOs.PrescriptionDetailResponse mapToPrescriptionDetailResponse(PrescriptionDetail detail) {
        return new PrescriptionDTOs.PrescriptionDetailResponse(
                detail.getDetailId(),
                detail.getPrescription().getPrescriptionId(),
                medicineService.mapToMedicineResponse(detail.getMedicine()),
                detail.getDosage(),
                detail.getFrequency(),
                detail.getDuration(),
                detail.getPrescriptionNotes(),
                detail.getCreatedAt()
        );
    }

    @Transactional
    public PrescriptionDTOs.PrescriptionResponse createPrescription(PrescriptionDTOs.CreatePrescriptionRequest request) {
        Prescription prescription = new Prescription();
        prescription.setAppointmentId(request.getAppointmentId());
        prescription.setFollowUpDate(request.getFollowUpDate());
        prescription.setFollowUp(request.isFollowUp());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setSystolicBloodPressure(request.getSystolicBloodPressure());
        prescription.setDiastolicBloodPressure(request.getDiastolicBloodPressure());
        prescription.setHeartRate(request.getHeartRate());
        prescription.setBloodSugar(request.getBloodSugar());
        prescription.setNote(request.getNote());
        prescription.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));


        if (request.getPrescriptionDetails() != null && !request.getPrescriptionDetails().isEmpty()) {
            List<PrescriptionDetail> details = new ArrayList<PrescriptionDetail>();
            for (PrescriptionDTOs.PrescriptionDetailRequest detailRequest : request.getPrescriptionDetails()) {
                PrescriptionDetail detail = new PrescriptionDetail();
                detail.setPrescription(prescription);

                Medicine medicine = medicineRepository.findById(detailRequest.getMedicineId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + detailRequest.getMedicineId()));

                detail.setMedicine(medicine);
                detail.setDosage(detailRequest.getDosage());
                detail.setFrequency(detailRequest.getFrequency());
                detail.setDuration(detailRequest.getDuration());
                detail.setPrescriptionNotes(detailRequest.getPrescriptionNotes());
                details.add(detail);
            }
            prescription.setPrescriptionDetails(details);
        }
        Prescription savedPrescription = prescriptionRepository.save(prescription);

        return mapToPrescriptionResponse(savedPrescription);
    }

    @Transactional(readOnly = true)
    public PrescriptionDTOs.PrescriptionResponse getPrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc với ID: " + id));

        return mapToPrescriptionResponse(prescription);
    }

    @Transactional
    public PrescriptionDTOs.PrescriptionResponse updatePrescription(Long id, PrescriptionDTOs.UpdatePrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc với ID: " + id));

        if (request.getFollowUpDate() != null && !request.getFollowUpDate().equals(prescription.getFollowUpDate())) {
            prescription.setFollowUpDate(request.getFollowUpDate());
        }

        if (request.getIsFollowUp() != null && request.getIsFollowUp() != prescription.isFollowUp()) {
            prescription.setFollowUp(request.getIsFollowUp());
        }

        if (request.getDiagnosis() != null && !request.getDiagnosis().equals(prescription.getDiagnosis())) {
            prescription.setDiagnosis(request.getDiagnosis());
        }

        if (request.getSystolicBloodPressure() != null &&
                !request.getSystolicBloodPressure().equals(prescription.getSystolicBloodPressure())) {
            prescription.setSystolicBloodPressure(request.getSystolicBloodPressure());
        }

        if (request.getDiastolicBloodPressure() != null &&
                !request.getDiastolicBloodPressure().equals(prescription.getDiastolicBloodPressure())) {
            prescription.setDiastolicBloodPressure(request.getDiastolicBloodPressure());
        }

        if (request.getHeartRate() != null &&
                !request.getHeartRate().equals(prescription.getHeartRate())) {
            prescription.setHeartRate(request.getHeartRate());
        }

        if (request.getBloodSugar() != null &&
                !request.getBloodSugar().equals(prescription.getBloodSugar())) {
            prescription.setBloodSugar(request.getBloodSugar());
        }

        if (request.getNote() != null &&
                (prescription.getNote() == null || !request.getNote().equals(prescription.getNote()))) {
            prescription.setNote(request.getNote());
        }

        prescriptionRepository.save(prescription);
        return mapToPrescriptionResponse(prescription);
    }

    @Transactional
    public void deletePrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc với ID: " + id));

        prescriptionRepository.delete(prescription);
    }

    @Transactional
    public PrescriptionDTOs.PrescriptionDetailResponse addMedicineToPrescription(
            PrescriptionDTOs.AddMedicineToPrescriptionRequest request) {

        Prescription prescription = prescriptionRepository.findById(request.getPrescriptionId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc với ID: " + request.getPrescriptionId()));

        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + request.getMedicineId()));

        PrescriptionDetail detail = new PrescriptionDetail();
        detail.setPrescription(prescription);
        detail.setMedicine(medicine);
        detail.setDosage(request.getDosage());
        detail.setFrequency(request.getFrequency());
        detail.setDuration(request.getDuration());
        detail.setPrescriptionNotes(request.getPrescriptionNotes());

        PrescriptionDetail savedDetail = prescriptionDetailRepository.save(detail);
        return mapToPrescriptionDetailResponse(savedDetail);
    }

    @Transactional(readOnly = true)
    public List<PrescriptionDTOs.PrescriptionDetailResponse> getPrescriptionDetails(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc với ID: " + prescriptionId));

        return prescription.getPrescriptionDetails().stream()
                .map(this::mapToPrescriptionDetailResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescriptionDTOs.PrescriptionDetailResponse updatePrescriptionDetail(
            PrescriptionDTOs.UpdatePrescriptionDetailRequest request) {

        PrescriptionDetail detail = prescriptionDetailRepository.findById(request.getDetailId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết đơn thuốc với ID: " + request.getDetailId()));

        if (StringUtils.hasText(request.getDosage()) && !request.getDosage().equals(detail.getDosage())) {
            detail.setDosage(request.getDosage());
        }

        if (StringUtils.hasText(request.getFrequency()) && !request.getFrequency().equals(detail.getFrequency())) {
            detail.setFrequency(request.getFrequency());
        }

        if (StringUtils.hasText(request.getDuration()) && !request.getDuration().equals(detail.getDuration())) {
            detail.setDuration(request.getDuration());
        }

        if (request.getPrescriptionNotes() != null && !request.getPrescriptionNotes().equals(detail.getPrescriptionNotes())) {
            detail.setPrescriptionNotes(request.getPrescriptionNotes());
        }

        PrescriptionDetail updatedDetail = prescriptionDetailRepository.save(detail);
        return mapToPrescriptionDetailResponse(updatedDetail);
    }


    @Transactional
    public void deletePrescriptionDetail(Long detailId) {
        PrescriptionDetail detail = prescriptionDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết đơn thuốc với ID: " + detailId));

        prescriptionDetailRepository.delete(detail);
    }
}