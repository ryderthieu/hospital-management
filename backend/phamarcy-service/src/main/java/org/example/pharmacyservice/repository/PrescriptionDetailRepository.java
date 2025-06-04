package org.example.pharmacyservice.repository;

import org.example.pharmacyservice.entity.PrescriptionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionDetailRepository extends JpaRepository<PrescriptionDetail, Long> {
}
