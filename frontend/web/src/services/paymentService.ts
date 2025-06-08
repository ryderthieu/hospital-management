import { api } from "./api";
import { Bill, BillDto } from "../types/payment";

export const paymentService = {
  async getBillsByPatientId(patientId: number): Promise<Bill[]> {
    const response = await api.get<Bill[]>(`/payment/bills`);
    return response.data;
  },
};
