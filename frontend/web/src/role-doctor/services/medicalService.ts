import type { Indication, Medication, VitalSignData } from "../types/medicin"

export const fetchMedicalOrder = async (): Promise<Indication[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: "1",
      indicationType: "Chụp CTVT sọ não không tiêm thuốc cản quang",
      room: "CT-Scan [02]",
      expectedTime: "10:00",
    },
    {
      id: "2",
      indicationType: "Tổng phân tích tế bào máu",
      room: "Blood Test [01]",
      expectedTime: "10:20",
    },
  ]
}

export const updateMedicalOrder = async (indications: Indication[]) => {
  // In a real app, this would be an API call
  console.log("Saving medical order:", indications)
}

export const deleteIndication = async (id: string) => {
  // In a real app, this would be an API call
  console.log("Deleting indication with id:", id)
}

export const fetchMedications = async (): Promise<Medication[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: "1",
      name: "Ebastine Normon 10mg Orodisperside Tablets",
      dosage: "1",
      unit: "Viên",
      frequency: "Ngày 2 lần",
      instructions: "Sau khi ăn",
      quantity: "56",
    },
    {
      id: "2",
      name: "EPA + DHA (Dashbrain)",
      dosage: "1",
      unit: "Viên",
      frequency: "Ngày 2 lần",
      instructions: "Sau khi ăn",
      quantity: "56",
    },
  ]
}

export const updatePrescription = async (medications: Medication[]) => {
  // In a real app, this would be an API call
  console.log("Saving prescription:", medications)
}

export const deleteMedication = async (id: string) => {
  // In a real app, this would be an API call
  console.log("Deleting medication with id:", id)
}

export const addVitalSign = async (data: VitalSignData): Promise<void> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    console.log("Adding vital sign data:", data)
    setTimeout(resolve, 1000)
  })
}
