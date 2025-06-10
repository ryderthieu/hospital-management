import type {
  Medicine,
  MedicineRequest,
  MedicineUpdateRequest,
  PrescriptionResponse,
  PrescriptionDetailRequest,
} from "../types/pharmacy";
import { api } from "../../services/api";

export const medicineService = {
  // Get all medicines
  async getAllMedicines(): Promise<Medicine[]> {
    try {
      console.log("Calling API: /pharmacy/medicines");
      const response = await api.get<Medicine[]>("/pharmacy/medicines");
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getAllMedicines:", error);
      throw error;
    }
  },

  // Get medicine by ID
  async getMedicineById(medicineId: number): Promise<Medicine> {
    try {
      const response = await api.get<Medicine>(
        `/pharmacy/medicines/${medicineId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting medicine by ID:", error);
      throw error;
    }
  },

  // Search medicines
  async searchMedicine(name?: string, category?: string): Promise<Medicine[]> {
    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (category) params.append("category", category);

      console.log("Searching medicines with params:", params.toString());
      const response = await api.get<Medicine[]>(
        `/pharmacy/medicines/search?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching medicines:", error);
      throw error;
    }
  },

  // Create new medicine
  async addMedicine(medicineData: MedicineRequest): Promise<Medicine> {
    try {
      const response = await api.post<Medicine>(
        "/pharmacy/medicines",
        medicineData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding medicine:", error);
      throw error;
    }
  },

  // Update medicine
  async updateMedicine(
    medicineId: number,
    data: MedicineUpdateRequest
  ): Promise<Medicine> {
    try {
      const response = await api.put<Medicine>(
        `/pharmacy/medicines/${medicineId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating medicine:", error);
      throw error;
    }
  },

  // Delete medicine
  async deleteMedicine(medicineId: number): Promise<string> {
    try {
      const response = await api.delete<string>(
        `/pharmacy/medicines/${medicineId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting medicine:", error);
      throw error;
    }
  },

  // Get medicines by category
  async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    try {
      const response = await api.get<Medicine[]>(
        `/pharmacy/medicines/search?category=${category}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting medicines by category:", error);
      throw error;
    }
  },

  // Get low stock medicines (custom implementation)
  async getLowStockMedicines(threshold = 10): Promise<Medicine[]> {
    try {
      const allMedicines = await this.getAllMedicines();
      return allMedicines.filter((medicine) => medicine.quantity <= threshold);
    } catch (error) {
      console.error("Error getting low stock medicines:", error);
      throw error;
    }
  },

  // Update medicine quantity (using update medicine endpoint)
  async updateMedicineQuantity(
    medicineId: number,
    quantity: number
  ): Promise<Medicine> {
    try {
      const response = await api.put<Medicine>(
        `/pharmacy/medicines/${medicineId}`,
        { quantity }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating medicine quantity:", error);
      throw error;
    }
  },

  // Get all prescriptions by patientId
  async getPrescriptionsByPatientId(
    patientId: number
  ): Promise<PrescriptionResponse[]> {
    try {
      const response = await api.get<PrescriptionResponse[]>(
        `/pharmacy/prescriptions/patient/${patientId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting prescriptions by patient ID:", error);
      throw error;
    }
  },

  // Create a new prescription
  async createPrescription(
    prescriptionData: PrescriptionResponse
  ): Promise<PrescriptionResponse> {
    try {
      const response = await api.post<PrescriptionResponse>(
        "/pharmacy/prescriptions",
        prescriptionData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating prescription:", error);
      throw error;
    }
  },

  // Add a new prescription detail
  async addPrescriptionDetail(
    prescriptionDetail: PrescriptionDetailRequest
  ): Promise<PrescriptionResponse> {
    try {
      const response = await api.post<PrescriptionResponse>(
        "/pharmacy/prescription/details",
        prescriptionDetail
      );
      return response.data;
    } catch (error) {
      console.error("Error adding prescription detail:", error);
      throw error;
    }
  },
};
