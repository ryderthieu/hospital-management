package org.example.patientservice.service;

import org.example.patientservice.entity.EmergencyContacts;
import org.example.patientservice.entity.MedicalRecords;
import org.example.patientservice.entity.Patients;
import org.example.patientservice.repository.MedicalRecordsRepository;
import org.example.patientservice.repository.PatientsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordsService {

    @Autowired
    private MedicalRecordsRepository medicalRecordsRepository;

    @Autowired
    private PatientsRepository patientsRepository;

    public List<MedicalRecords> getAllMedicalRecords(Integer patientId) {
        return medicalRecordsRepository.findByPatientPatientId(patientId);
    }

    public Optional<MedicalRecords> getMedicalRecordById(Integer recordId, Integer patientId) {
        return medicalRecordsRepository.findByRecordIdAndPatientPatientId(recordId, patientId);
    }

    public MedicalRecords createMedicalRecord(Integer patientId, MedicalRecords medicalRecord) {
        Patients patient = patientsRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));

        medicalRecord.setPatient(patient);
        return medicalRecordsRepository.save(medicalRecord);
    }

    public MedicalRecords updateMedicalRecord(Integer patientId, Integer recordId, MedicalRecords medicalRecord) {
        MedicalRecords updateRecord = medicalRecordsRepository
                .findByRecordIdAndPatientPatientId(recordId, patientId)
                .orElseThrow(() -> new RuntimeException("Record not found with id " + recordId + " for patient " + patientId));

        updateRecord.setDiagnosis(medicalRecord.getDiagnosis());
        updateRecord.setPrescribedMedication(medicalRecord.getPrescribedMedication());
        updateRecord.setAppointmentDate(medicalRecord.getAppointmentDate());
        updateRecord.setTreatmentPlan(medicalRecord.getTreatmentPlan());
        updateRecord.setFollowUpDate(medicalRecord.getFollowUpDate());
        updateRecord.setSummary(medicalRecord.getSummary());

        return medicalRecordsRepository.save(updateRecord);
    }

    public void deleteMedicalRecord(Integer patientId, Integer recordId) {
        MedicalRecords deleteRecord = medicalRecordsRepository
                .findByRecordIdAndPatientPatientId(recordId, patientId)
                .orElseThrow(() -> new RuntimeException("Record not found with id " + recordId + " for patient " + patientId));

        medicalRecordsRepository.delete(deleteRecord);
    }
}
