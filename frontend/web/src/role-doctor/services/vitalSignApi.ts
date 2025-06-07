import { VitalSignData } from "../components/examination-doctor/VitalSignModal/types";

export const addVitalSign = async (data: VitalSignData): Promise<void> => {
  // Giả lập gọi API
  return new Promise((resolve) => {
    console.log("Gửi dữ liệu sinh hiệu:", data)
    setTimeout(resolve, 1000)
  })
}
