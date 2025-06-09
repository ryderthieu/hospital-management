package org.example.pharmacyservice.service;

import lombok.RequiredArgsConstructor;
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
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {
    private final MedicineRepository medicineRepository;
    private final PrescriptionDetailRepository prescriptionDetailRepository;
    private final FileStorageService fileStorageService;

    public MedicineDTOs.MedicineResponse mapToMedicineResponse(Medicine medicine) {
        return new MedicineDTOs.MedicineResponse(
                medicine.getMedicineId(),
                medicine.getMedicineName(),
                medicine.getManufactor(),
                medicine.getCategory(),
                medicine.getDescription(),
                medicine.getUsage(),
                medicine.getUnit(),
                medicine.getInsuranceDiscountPercent(),
                medicine.getInsuranceDiscount(),
                medicine.getSideEffects(),
                medicine.getPrice(),
                medicine.getQuantity(),
                medicine.getAvatar()
        );
    }

    @Transactional
    public MedicineDTOs.MedicineResponse addNewMedicine(MedicineDTOs.NewMedicineRequest request, MultipartFile avatar) {
        Medicine medicine = new Medicine();
        medicine.setMedicineName(request.getMedicineName());
        medicine.setManufactor(request.getManufactor());
        medicine.setCategory(request.getCategory());
        medicine.setDescription(request.getDescription());
        medicine.setPrice(request.getPrice());
        medicine.setUnit(request.getUnit());
        medicine.setQuantity(request.getQuantity());
        medicine.setUsage(request.getUsage());
        BigDecimal discountPercent = request.getInsuranceDiscountPercent();
        if (discountPercent.compareTo(BigDecimal.ZERO) < 0 || discountPercent.compareTo(BigDecimal.ONE) > 0) {
            throw new RuntimeException("Phần trăm giảm giá phải từ 0 đến 1");
        }
        medicine.setInsuranceDiscountPercent(request.getInsuranceDiscountPercent());
        medicine.setInsuranceDiscount(request.getInsuranceDiscountPercent().multiply(request.getPrice()));
        medicine.setSideEffects(request.getSideEffects());

        // Xử lý tải lên ảnh nếu có
        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = fileStorageService.storeFile(avatar);
            medicine.setAvatar(avatarUrl);
        }

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
                        "sideEffects", "price", "quantity", "insuranceDiscount", "insuranceDiscountPercent", "createdAt")
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

        if (request.getInsuranceDiscountPercent() != null && !request.getInsuranceDiscountPercent().equals(medicine.getInsuranceDiscountPercent())) {
            medicine.setInsuranceDiscountPercent(request.getInsuranceDiscountPercent());
            medicine.setInsuranceDiscount(request.getInsuranceDiscountPercent().multiply(medicine.getPrice()));
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

    @Transactional
    public MedicineDTOs.MedicineResponse uploadAvatar(Long id, MultipartFile file) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với id: " + id));

        // Xóa avatar cũ nếu có
        if (medicine.getAvatar() != null) {
            fileStorageService.deleteFile(medicine.getAvatar());
        }

        // Lưu file mới và cập nhật đường dẫn
        String fileName = fileStorageService.storeFile(file);
        medicine.setAvatar(fileName);

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToMedicineResponse(updatedMedicine);
    }

    @Transactional
    public MedicineDTOs.MedicineResponse deleteAvatar(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với id: " + id));

        if (medicine.getAvatar() != null) {
            fileStorageService.deleteFile(medicine.getAvatar());
            medicine.setAvatar(null);
        }

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToMedicineResponse(updatedMedicine);
    }
}