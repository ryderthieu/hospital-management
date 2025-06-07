import { useEffect, useState } from "react";
import { Medication } from "./types";
import { fetchMedications, updatePrescription, deleteMedication } from "../../../services/prescriptionApi";

export function usePrescriptionModal() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchMedications().then(setMedications);
  }, []);

  const updateField = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const deleteMed = async (index: number) => {
    const med = medications[index];
    if (med.id) await deleteMedication(med.id);
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const save = async () => {
    await updatePrescription(medications);
  };

  return {
    medications,
    searchInput,
    setSearchInput,
    updateField,
    deleteMed,
    save
  };
}
