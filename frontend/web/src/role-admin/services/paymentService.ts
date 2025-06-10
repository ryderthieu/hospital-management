import { Bill, BillDto } from "../types/payment";
import { api } from "../../services/api";
import axios from "axios";

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

  // Get transactions by bill ID
  async getTransactionsByBillId(billId: number): Promise<any[]> {
    try {
      const response = await api.get(`/payment/transactions/bill/${billId}`);
      if (response.data.error === 0) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Không thể lấy danh sách giao dịch');
    } catch (error) {
      console.error("Error fetching transactions by bill ID:", error);
      throw error;
    }
  },

  // Create payment link for a bill
  async createPayment(billId: number): Promise<string> {
    try {
      const response = await api.post(`/payment/transactions/create-payment/${billId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  },

  // Process cash payment for a bill
  async processCashPayment(billId: number): Promise<void> {
    try {
      const response = await api.post(`/payment/transactions/cash-payment/${billId}`);
      return response.data;
    } catch (error) {
      console.error("Error processing cash payment:", error);
      throw error;
    }
  },

  async handlePaymentSuccess(billId: number): Promise<void> {
    const response = await axios.get(`/payment/transactions/${billId}/success`);
    if (response.data.error !== 0) {
      throw new Error(response.data.message || 'Không thể cập nhật trạng thái thanh toán');
    }
  },

  async checkPaymentStatus(billId: number): Promise<boolean> {
    try {
      const response = await api.get(`/payment/transactions/${billId}`);
      if (response.data.error === 0) {
        const paymentInfo = response.data.data;
        // Nếu trạng thái là success, gọi API cập nhật
        if (paymentInfo.status === 'PAID') {
          await this.handlePaymentSuccess(billId);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  }
};
