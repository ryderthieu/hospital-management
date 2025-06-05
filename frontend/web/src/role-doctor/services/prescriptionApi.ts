import { Medication } from "../components/examination-doctor/PrescriptionModal/types";

export async function fetchMedications(): Promise<Medication[]> {
  // Gọi API thật tại đây
  return [
    {
      id: "1",
      name: "Ebastine Normon 10mg Orodisperside Tablets",
      dosage: "1",
      unit: "Viên",
      frequency: "Ngày 2 lần",
      instructions: "Sau khi ăn",
      quantity: "56"
    },
    {
      id: "2",
      name: "EPA + DHA (Dashbrain)",
      dosage: "1",
      unit: "Viên",
      frequency: "Ngày 2 lần",
      instructions: "Sau khi ăn",
      quantity: "56"
    }
  ];
}

export async function updatePrescription(medications: Medication[]) {
  // Gửi dữ liệu toa thuốc lên backend
  console.log("Saving...", medications);
}

export async function deleteMedication(id: string) {
  // Gọi API xóa thuốc
  console.log("Deleting medication with id", id);
}
