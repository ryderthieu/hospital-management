package org.example.paymentservice.repository;

import org.example.paymentservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBillBillId(Long billId);
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
}
