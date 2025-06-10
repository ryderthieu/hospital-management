package org.example.paymentservice.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.paymentservice.dto.BillDTOs.*;
import org.example.paymentservice.entity.Bill;
import org.example.paymentservice.entity.BillDetail;
import org.example.paymentservice.repository.BillDetailRepository;
import org.example.paymentservice.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    @PersistenceContext
    EntityManager entityManager;
    
    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillDetailRepository billDetailRepository;

    public Page<BillResponse> getAllBills(int page, int size) {
        if (page <= 0) {
            throw new IllegalArgumentException("Số trang không được nhỏ hơn hoặc bằng 0");
        }
        if (size < 1 || size > 100) {
            size = 10;
        }

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Bill> billPage = billRepository.findAll(pageable);

        return billPage.map(this::convertToResponse);
    }

    public BillResponse getBillById(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
        return convertToResponse(bill);
    }

    @Transactional
    public BillResponse createBill(NewBillRequest request) {
        Bill bill = new Bill();
        bill.setAppointmentId(request.getAppointmentId());
        bill.setPatientId(request.getPatientId());

        if (request.getBillDetails()!=null && !request.getBillDetails().isEmpty()){
            List<BillDetail> billDetails = new ArrayList<BillDetail>();
            for (BillDetail detailRequest : request.getBillDetails()) {
                BillDetail detail = new BillDetail();
                detail.setItemType(detailRequest.getItemType());
                detail.setQuantity(detailRequest.getQuantity());
                detail.setItemId(detailRequest.getItemId());
                detail.setItemName(detailRequest.getItemName());
                detail.setUnitPrice(detailRequest.getUnitPrice());
                detail.setInsuranceDiscount(detailRequest.getInsuranceDiscount().multiply(BigDecimal.valueOf(detail.getQuantity())));
                detail.setBill(bill);
                detail.setTotalPrice(detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
                billDetails.add(detail);
            }
            bill.setBillDetails(billDetails);
        }

        BigDecimal totalPrice = bill.getBillDetails().stream()
            .map(BillDetail::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal insuranceDiscount = bill.getBillDetails().stream()
            .map(BillDetail::getInsuranceDiscount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal amount = totalPrice.subtract(insuranceDiscount);
        
        bill.setTotalCost(totalPrice);
        bill.setInsuranceDiscount(insuranceDiscount);
        bill.setAmount(amount);
        
        Bill savedBill = billRepository.save(bill);
        return convertToResponse(savedBill);
    }

    @Transactional
    public BillResponse updateBill(Long billId, UpdateBillRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

        if (request.getAppointmentId() != null) bill.setAppointmentId(request.getAppointmentId());
        if (request.getStatus() != null) bill.setStatus(request.getStatus());

        Bill updated = billRepository.save(bill);
        return convertToResponse(updated);
    }

    public void deleteBill(Long billId) {
        if (!billRepository.existsById(billId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn");
        }
        billRepository.deleteById(billId);
    }

    @Transactional
    public List<BillDetailResponse> createBillDetail(Long id, List<NewBillDetailRequest> request) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        List<BillDetailResponse> detailResponses = new ArrayList<>();
        for (NewBillDetailRequest detailRequest : request) {
            // Validate itemId for non-CONSULTATION types
            if (detailRequest.getItemType() != BillDetail.ItemType.CONSULTATION && detailRequest.getItemId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Mã thuốc hoặc dịch vụ không được để trống cho loại " + detailRequest.getItemType());
            }

            BillDetail billDetail = new BillDetail();
            billDetail.setBill(bill);
            billDetail.setItemType(detailRequest.getItemType());
            billDetail.setItemId(detailRequest.getItemId());
            billDetail.setItemName(detailRequest.getItemName());
            billDetail.setQuantity(detailRequest.getQuantity());
            billDetail.setUnitPrice(detailRequest.getUnitPrice());
            billDetail.setInsuranceDiscount(detailRequest.getInsuranceDiscount().multiply(BigDecimal.valueOf(detailRequest.getQuantity())));
            billDetail.setTotalPrice(billDetail.getUnitPrice().multiply(BigDecimal.valueOf(billDetail.getQuantity())).setScale(2, RoundingMode.HALF_UP));

            bill.setTotalCost(bill.getTotalCost().add(billDetail.getTotalPrice()));
            bill.setInsuranceDiscount(bill.getInsuranceDiscount().add(billDetail.getInsuranceDiscount()));

            BillDetail savedDetail = billDetailRepository.save(billDetail);
            detailResponses.add(convertToResponse(savedDetail));
        }
        
        bill.setAmount(bill.getTotalCost().subtract(bill.getInsuranceDiscount()));
        billRepository.save(bill);
        return detailResponses;
    }

    public List<BillDetailResponse> getDetailByBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
        List<BillDetail> billDetails = bill.getBillDetails();
        return billDetails.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<BillResponse> getBillsByPatientId(Integer patientId) {
        List<Bill> bills = billRepository.findByPatientId(patientId);
        return bills.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private BillResponse convertToResponse(Bill bill) {
        List<BillDetail> billDetails = bill.getBillDetails();
        List<BillDetailResponse> detailResponses = new ArrayList<BillDetailResponse>();
        for (BillDetail detail : billDetails) {
            BillDetailResponse detailResponse = convertToResponse(detail);
            detailResponses.add(detailResponse);
        }
        return new BillResponse(
                bill.getBillId(),
                bill.getAppointmentId(),
                bill.getPatientId(),
                bill.getTotalCost(),
                bill.getInsuranceDiscount(),
                bill.getAmount(),
                bill.getStatus(),
                bill.getCreatedAt(),
                detailResponses
        );
    }

    private BillDetailResponse convertToResponse(BillDetail detail) {
        return new BillDetailResponse(
                detail.getDetailId(),
                detail.getBill().getBillId(),
                detail.getItemType(),
                detail.getItemId(),
                detail.getItemName(),
                detail.getQuantity(),
                detail.getUnitPrice(),
                detail.getTotalPrice(),
                detail.getInsuranceDiscount(),
                detail.getCreatedAt()
        );
    }
}
