package org.example.paymentservice.repository;

import org.example.paymentservice.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail, Long > {

}
