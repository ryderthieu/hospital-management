import { Indication } from "../components/examination-doctor/MedicalOrderModal/types";

export async function fetchMedicalOrder(): Promise<Indication[]> {
  // Gọi API thật tại đây
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
    }
  ];
}

export async function updateMedicalOrder(indications: Indication[]) {
  // Gửi dữ liệu phiếu chỉ định lên backend
  console.log("Saving...", indications);
}

export async function deleteMedicalOrder(id: string) {
  // Gọi API xóa phiếu chỉ định
  console.log("Deleting medical order with id", id);
}

// Mock API: Xóa một chỉ định (nếu có ID thì truyền ID)
export async function deleteIndication(id: string) {
  console.log("Deleting indication at id:", id);
}
