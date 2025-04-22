package org.example.patientservice.service;

import org.example.patientservice.entity.Patients;
import org.example.patientservice.repository.PatientsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientsService {

    @Autowired
    private PatientsRepository patientsRepository;

    public List<Patients> getAllPatients() {
        return patientsRepository.findAll();
    }

    public Optional<Patients> getPatientById(Integer patientId) {
        return patientsRepository.findById(patientId);
    }

    public Patients createPatient(Patients patient) {
        return patientsRepository.save(patient);
    }

    public Patients updatePatient(Integer patientId, Patients patientDetails) {
        Patients patient = getPatientById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id " + patientId));
        patient.setUserId(patientDetails.getUserId());
        patient.setIdentityCard(patientDetails.getIdentityCard());
        patient.setInsuranceNumber(patient.getInsuranceNumber());
        return patientsRepository.save(patient);
    }

    public void deletePatient(Integer patientId) {
        Patients patient = getPatientById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id " + patientId));
        patientsRepository.delete(patient);
    }

    public List<Patients> filterPatients(String filter) {
        if (filter != null && !filter.isEmpty()) {
            List<Patients> patientsByInsuranceNumber = patientsRepository.findByInsuranceNumber(filter);
            if (!patientsByInsuranceNumber.isEmpty()) {
                return patientsByInsuranceNumber;
            }

            List<Patients> patientsByIdentityCard = patientsRepository.findByIdentityCard(filter);
            if (!patientsByIdentityCard.isEmpty()) {
                return patientsByIdentityCard;
            }
        }

        return patientsRepository.findAll();
    }
}
