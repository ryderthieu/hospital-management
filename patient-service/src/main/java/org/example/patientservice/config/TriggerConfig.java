package org.example.patientservice.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TriggerConfig {

    private final JdbcTemplate jdbc;

    @PostConstruct
    public void init() {
        log.info("Initializing triggers...");
        createTriggerIfNotExists("trigger_create_patient_details", this::createTriggerPatientDetails);
        createTriggerIfNotExists("trigger_create_emergency_contacts", this::createTriggerEmergencyContacts);
        createTriggerIfNotExists("trigger_create_medical_records", this::createTriggerMedicalRecords);
    }

    private void createTriggerIfNotExists(String triggerName, Runnable createTrigger) {
        String query = """
            SELECT tgname FROM pg_trigger 
            WHERE tgname = ? 
            AND NOT tgisinternal
        """;
        try {
            String result = jdbc.queryForObject(query, String.class, triggerName);
            log.warn("Trigger '{}' already exists. Skipping creation.", triggerName);
        } catch (EmptyResultDataAccessException e) {
            log.info("Creating trigger '{}'", triggerName);
            createTrigger.run();
        } catch (Exception ex) {
            log.error("Error checking for trigger '{}': {}", triggerName, ex.getMessage());
        }
    }

    private void createTriggerPatientDetails() {
        String func = """
            CREATE OR REPLACE FUNCTION auto_create_patient_details()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO patient_details (
                    patient_id, disease_history, family_history, allergies, 
                    medications, blood_type, life_style
                )
                VALUES (
                    NEW.patient_id, NULL, NULL, NULL, NULL, NULL, NULL
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """;

        String trigger = """
            CREATE TRIGGER trigger_create_patient_details
            AFTER INSERT ON patients
            FOR EACH ROW
            EXECUTE FUNCTION auto_create_patient_details();
        """;

        jdbc.execute(func);
        jdbc.execute(trigger);
        log.info("Trigger 'trigger_create_patient_details' created successfully.");
    }

    private void createTriggerEmergencyContacts() {
        String func = """
            CREATE OR REPLACE FUNCTION auto_create_emergency_contacts()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO emergency_contacts (
                    patient_id, contact_name, contact_phone, relationship
                )
                VALUES (
                    NEW.patient_id, NULL, NULL, 'OTHERS'
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """;

        String trigger = """
            CREATE TRIGGER trigger_create_emergency_contacts
            AFTER INSERT ON patients
            FOR EACH ROW
            EXECUTE FUNCTION auto_create_emergency_contacts();
        """;

        jdbc.execute(func);
        jdbc.execute(trigger);
        log.info("Trigger 'trigger_create_emergency_contacts' created successfully.");
    }

    private void createTriggerMedicalRecords() {
        String func = """
            CREATE OR REPLACE FUNCTION auto_create_medical_records()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO medical_records (
                    patient_id, doctor_id, diagnosis, prescribed_medication, 
                    appointment_date, treatment_plan, follow_up_date, summary
                )
                VALUES (
                    NEW.patient_id, NULL, NULL, NULL, NULL, NULL, NULL, NULL
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """;

        String trigger = """
            CREATE TRIGGER trigger_create_medical_records
            AFTER INSERT ON patients
            FOR EACH ROW
            EXECUTE FUNCTION auto_create_medical_records();
        """;

        jdbc.execute(func);
        jdbc.execute(trigger);
        log.info("Trigger 'trigger_create_medical_records' created successfully.");
    }
}
