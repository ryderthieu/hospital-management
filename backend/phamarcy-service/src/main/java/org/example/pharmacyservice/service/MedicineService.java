package org.example.pharmacyservice.service;

import org.example.pharmacyservice.dto.MedicineDTOs;
import org.example.pharmacyservice.entity.Medicine;
import org.example.pharmacyservice.repository.MedicineRepository;
import org.example.pharmacyservice.repository.PrescriptionDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {
    private final MedicineRepository medicineRepository;
    private final PrescriptionDetailRepository prescriptionDetailRepository;

    @Autowired
    public MedicineService(MedicineRepository medicineRepository,
                           PrescriptionDetailRepository prescriptionDetailRepository) {
        this.medicineRepository = medicineRepository;
        this.prescriptionDetailRepository = prescriptionDetailRepository;
    }

    public MedicineDTOs.MedicineResponse mapToMedicineResponse(Medicine medicine) {
        return new MedicineDTOs.MedicineResponse(
                medicine.getMedicineId(),
                medicine.getMedicineName(),
                medicine.getManufactor(),
                medicine.getCategory(),
                medicine.getDescription(),
                medicine.getUsage(),
                medicine.getUnit(),
                medicine.isInsuranceCovered(),
                medicine.getSideEffects(),
                medicine.getPrice(),
                medicine.getQuantity()
        );
    }

    @Transactional
    public MedicineDTOs.MedicineResponse addNewMedicine(MedicineDTOs.NewMedicineRequest request) {
        Medicine medicine = new Medicine();
        medicine.setMedicineName(request.getMedicineName());
        medicine.setManufactor(request.getManufactor());
        medicine.setCategory(request.getCategory());
        medicine.setDescription(request.getDescription());
        medicine.setPrice(request.getPrice());
        medicine.setUnit(request.getUnit());
        medicine.setQuantity(request.getQuantity());
        medicine.setUsage(request.getUsage());
        medicine.setInsuranceCovered(request.isInsuranceCovered());
        medicine.setSideEffects(request.getSideEffects());
        medicineRepository.save(medicine);
        return mapToMedicineResponse(medicine);
    }

    @Transactional(readOnly = true)
    public List<MedicineDTOs.MedicineResponse> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(this::mapToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicineDTOs.MedicineResponse getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + id));
        return mapToMedicineResponse(medicine);
    }

    @Transactional(readOnly = true)
    public List<MedicineDTOs.MedicineResponse> searchMedicine(String name, String category) {
        Medicine example = new Medicine();

        System.out.print(name);
        if (name != null && !name.trim().isEmpty()) {
            example.setMedicineName(name);
        }

        if (category != null && !category.trim().isEmpty()) {
            example.setCategory(category);
        }

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreNullValues()
                .withIgnorePaths("medicineId", "manufactor", "description", "usage", "unit",
                        "sideEffects", "price", "quantity", "insuranceCovered", "createdAt")
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnoreCase();

        return medicineRepository.findAll(Example.of(example, matcher)).stream()
                .map(this::mapToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicineDTOs.MedicineResponse updateMedicine(Long id, MedicineDTOs.UpdateMedicineRequest request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + id));

        if (StringUtils.hasText(request.getMedicineName()) && !request.getMedicineName().equals(medicine.getMedicineName())) {
            medicine.setMedicineName(request.getMedicineName());
        }

        if (StringUtils.hasText(request.getManufactor()) && !request.getManufactor().equals(medicine.getManufactor())) {
            medicine.setManufactor(request.getManufactor());
        }

        if (StringUtils.hasText(request.getCategory()) && !request.getCategory().equals(medicine.getCategory())) {
            medicine.setCategory(request.getCategory());
        }

        if (StringUtils.hasText(request.getDescription()) && !request.getDescription().equals(medicine.getDescription())) {
            medicine.setDescription(request.getDescription());
        }

        if (request.getPrice() != null && !request.getPrice().equals(medicine.getPrice())) {
            medicine.setPrice(request.getPrice());
        }

        if (StringUtils.hasText(request.getUnit()) && !request.getUnit().equals(medicine.getUnit())) {
            medicine.setUnit(request.getUnit());
        }

        if (request.getQuantity() != null && !request.getQuantity().equals(medicine.getQuantity())) {
            medicine.setQuantity(request.getQuantity());
        }

        if (StringUtils.hasText(request.getUsage()) && !request.getUsage().equals(medicine.getUsage())) {
            medicine.setUsage(request.getUsage());
        }

        if (request.getInsuranceCovered() != null && !request.getInsuranceCovered().equals(medicine.isInsuranceCovered())) {
            medicine.setInsuranceCovered(request.getInsuranceCovered());
        }


        if (StringUtils.hasText(request.getSideEffects()) && !request.getSideEffects().equals(medicine.getSideEffects())) {
            medicine.setSideEffects(request.getSideEffects());
        }

        medicineRepository.save(medicine);
        return mapToMedicineResponse(medicine);
    }


    @Transactional
    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + id));

        if (!medicine.getPrescriptionDetails().isEmpty()) {
            throw new RuntimeException("Không thể xóa thuốc đã được kê trong đơn thuốc");
        }

        medicineRepository.delete(medicine);
    }
}