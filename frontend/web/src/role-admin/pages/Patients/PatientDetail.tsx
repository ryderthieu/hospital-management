import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PatientDetailLayout } from "../../components/sections/patient";
import ReturnButton from "../../components/ui/button/ReturnButton";
import { useEffect, useState } from "react";
import { patientService } from "../../services/patientService";
import { Patient } from "../../types/patient";
export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const fetchedPatient = await patientService.getPatientById(
          Number(patientId)
        );
        setPatient(fetchedPatient);
      } catch (error) {
        console.error("Failed to fetch patient details:", error);
      }
    };

    fetchPatient();
  }, [patientId]);

  return (
    <>
      <PageMeta
        title="Chi tiết bệnh nhân| Bệnh viện đa khoa Wecare"
        description="Chi tiết bệnh nhân"
      />

      <div className="flex justify-start items-center mb-6">
        <ReturnButton />
        <h3 className="font-semibold tracking-tight">
          Bệnh nhân: {patient?.fullName}
        </h3>
      </div>
      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        </div> */}
      <PatientDetailLayout />
    </>
  );
}
