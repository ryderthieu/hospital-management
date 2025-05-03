package org.example.paymentservice.service;

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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillDetailRepository billDetailRepository;

    // Phân trang cho getAllBills
    public Page<BillResponse> getAllBills(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable từ page và size
        Page<Bill> billPage = billRepository.findAll(pageable);

        return billPage.map(this::convertToResponse); // Chuyển đổi Page<Bill> thành Page<BillResponse>
    }

    // Lấy hóa đơn theo ID
    public BillResponse getBillById(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
        return convertToResponse(bill);
    }

    // Tạo hóa đơn mới
    @Transactional
    public BillResponse createBill(NewBillRequest request) {
        Bill bill = new Bill();
        bill.setAppointmentId(request.getAppointmentId());
        bill.setBillDetails(request.getBillDetails());

        Bill savedBill = billRepository.save(bill);

        if (request.getBillDetails()!=null && !request.getBillDetails().isEmpty()){
            for (BillDetail detail : request.getBillDetails()) {
                detail.setBill(savedBill);
                billDetailRepository.save(detail);
            }
        }

        return convertToResponse(savedBill);
    }

    // Cập nhật hóa đơn
    @Transactional
    public BillResponse updateBill(Long billId, UpdateBillRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

        if (request.getAppointmentId() != null) bill.setAppointmentId(request.getAppointmentId());
        if (request.getTotalCost() != null) bill.setTotalCost(request.getTotalCost());
        if (request.getInsuranceDiscount() != null) bill.setInsuranceDiscount(request.getInsuranceDiscount());
        if (request.getAmount() != null) bill.setAmount(request.getAmount());
        if (request.getStatus() != null) bill.setStatus(request.getStatus());

        Bill updated = billRepository.save(bill);
        return convertToResponse(updated);
    }

    // Xóa hóa đơn
    public void deleteBill(Long billId) {
        if (!billRepository.existsById(billId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn");
        }
        billRepository.deleteById(billId);
    }

    // Chuyển đổi Bill thành BillResponse
    private BillResponse convertToResponse(Bill bill) {
        List<BillDetail> billDetails = bill.getBillDetails();

        return new BillResponse(
                bill.getBillId(),
                bill.getAppointmentId(),
                bill.getTotalCost(),
                bill.getInsuranceDiscount(),
                bill.getAmount(),
                bill.getStatus(),
                bill.getCreatedAt(),
                billDetails
        );
    }

}
