package org.example.phamarcyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.example.phamarcyservice.entity.Medicine;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Medicine> findByMedicineNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.category) LIKE LOWER(CONCAT('%', :category, '%'))")
    List<Medicine> findByCategoryContainingIgnoreCase(@Param("category") String category);

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :name, '%')) AND LOWER(m.category) LIKE LOWER(CONCAT('%', :category, '%'))")
    List<Medicine> findByMedicineNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(
            @Param("name") String name, @Param("category") String category);
}