package org.example.paymentservice.repository;

import org.example.paymentservice.entity.Bill;
import org.example.paymentservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBillBillId(Long billId);
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    Optional<Transaction> findFirstByBillOrderByCreatedAtDesc(Bill bill);
    List<Transaction> findAllByBillOrderByCreatedAtDesc(Bill bill);
}
