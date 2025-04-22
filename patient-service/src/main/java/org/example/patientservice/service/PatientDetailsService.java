package org.example.patientservice.service;

import org.example.patientservice.entity.PatientDetails;
import org.example.patientservice.entity.Patients;
import org.example.patientservice.repository.PatientDetailsRepository;
import org.example.patientservice.repository.PatientsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PatientDetailsService {

    @Autowired
    private PatientDetailsRepository patientDetailsRepository;

    @Autowired
    private PatientsRepository patientsRepository;

    public Optional<PatientDetails> getPatientDetails (Integer patientId) {
        return patientDetailsRepository.findById(patientId);
    }

    public PatientDetails updatePatientDetails(Integer patientId, PatientDetails patientDetails) {
        Optional<PatientDetails> existingPatientDetails = patientDetailsRepository.findById(patientId);

        if (existingPatientDetails.isPresent()) {
            PatientDetails updatedPatientDetails = existingPatientDetails.get();
            updatedPatientDetails.setDiseaseHistory(patientDetails.getDiseaseHistory());
            updatedPatientDetails.setFamilyHistory(patientDetails.getFamilyHistory());
            updatedPatientDetails.setAllergies(patientDetails.getAllergies());
            updatedPatientDetails.setMedications(patientDetails.getMedications());
            updatedPatientDetails.setBloodType(patientDetails.getBloodType());
            updatedPatientDetails.setLifeStyle(patientDetails.getLifeStyle());

            return patientDetailsRepository.save(updatedPatientDetails);
        } else {
            throw new RuntimeException("PatientDetails not found for ID: " + patientId);
        }
    }

    public PatientDetails deletePatientDetails(Integer patientId) {
        PatientDetails patientDetails = getPatientDetails(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id " + patientId));

        patientDetails.setDiseaseHistory(null);
        patientDetails.setFamilyHistory(null);
        patientDetails.setFamilyHistory(null);
        patientDetails.setAllergies(null);
        patientDetails.setMedications(null);
        patientDetails.setBloodType(null);
        patientDetails.setLifeStyle(null);

        return patientDetailsRepository.save(patientDetails);
    }

    public List<PatientDetails> filterPatientDetails(String filter) {
        if (filter != null && !filter.trim().isEmpty()) {
            return patientDetailsRepository.findByBloodTypeContainingIgnoreCase(filter.trim());
        }
        return new ArrayList<>();
    }
}
