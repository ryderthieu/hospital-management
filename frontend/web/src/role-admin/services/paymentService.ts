import { Bill, BillDto } from "../types/payment";
import { api } from "../../services/api";

export const paymentService = {
  // Get all bills for a patient
  async getBillsByPatientId(patientId: number): Promise<Bill[]> {
    try {
      const response = await api.get<Bill[]>(
        `/payment/bills/patient/${patientId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bills by patient ID:", error);
      throw error;
    }
  },

  // Delete a bill
  async deleteBill(billId: number): Promise<string> {
    try {
      const response = await api.delete<string>(`/payment/bills/${billId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting bill:", error);
      throw error;
    }
  },
};
