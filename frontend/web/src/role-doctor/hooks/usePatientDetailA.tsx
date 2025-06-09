import { useState, useEffect } from 'react'
import type { PatientDetail } from "../types/patient"
import type { Prescription } from "../types/prescription"
import type { ServiceOrder } from "../types/serviceOrder"
import { api } from "../../services/api"

interface UsePatientDetailReturn {
  // Data
  patientDetail: PatientDetail | null
  currentPrescription: Prescription | null
  serviceOrders: ServiceOrder[]
  
  // Loading states
  isLoadingPatient: boolean
  isLoadingPrescription: boolean
  isLoadingServiceOrders: boolean
  
  // Error states
  patientError: string | null
  prescriptionError: string | null
  serviceOrdersError: string | null
  
  // Patient methods
  fetchPatientDetail: (appointmentId: number) => Promise<void>
  
  // Prescription methods
  fetchCurrentPrescription: (appointmentId: number) => Promise<void>
  createPrescription: () => Promise<Prescription | null>
  updatePrescription: (prescriptionId: number) => Promise<any>
  deletePrescription: (prescriptionId: number) => Promise<any>
  
  // Service Order methods
  fetchServiceOrdersByAppointment: (appointmentId: number) => Promise<void>
  fetchAllServiceOrders: (serviceId: number) => Promise<ServiceOrder[]>
  fetchServiceOrderById: (serviceId: number, orderId: number) => Promise<ServiceOrder | null>
  createServiceOrder: (serviceId: number, serviceOrder: ServiceOrder) => Promise<ServiceOrder | null>
  updateServiceOrder: (serviceId: number, orderId: number, serviceOrder: ServiceOrder) => Promise<ServiceOrder | null>
  deleteServiceOrder: (serviceId: number, orderId: number) => Promise<boolean>
}

export const usePatientDetail = ({ appointmentId }: { appointmentId: number }): UsePatientDetailReturn => {
  // State
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null)
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  
  // Loading states
  const [isLoadingPatient, setIsLoadingPatient] = useState(false)
  const [isLoadingPrescription, setIsLoadingPrescription] = useState(false)
  const [isLoadingServiceOrders, setIsLoadingServiceOrders] = useState(false)
  
  // Error states
  const [patientError, setPatientError] = useState<string | null>(null)
  const [prescriptionError, setPrescriptionError] = useState<string | null>(null)
  const [serviceOrdersError, setServiceOrdersError] = useState<string | null>(null)

  // Patient methods
  const fetchPatientDetail = async (appointmentId: number): Promise<void> => {
    try {
      setIsLoadingPatient(true)
      setPatientError(null)
      const response = await api.get(`/appointments/${appointmentId}`)
      setPatientDetail(response.data)
    } catch (error) {
      setPatientError(error instanceof Error ? error.message : 'Lỗi khi tải thông tin bệnh nhân')
      console.error('Error fetching patient detail:', error)
    } finally {
      setIsLoadingPatient(false)
    }
  }

  // Prescription methods
  const fetchCurrentPrescription = async (appointmentId: number): Promise<void> => {
    try {
      setIsLoadingPrescription(true)
      setPrescriptionError(null)
      const response = await api.get(`/pharmacy/prescriptions/appointment/${appointmentId}`)
      setCurrentPrescription(response.data)
    } catch (error) {
      setPrescriptionError(error instanceof Error ? error.message : 'Lỗi khi tải toa thuốc')
      console.error('Error fetching prescription:', error)
    } finally {
      setIsLoadingPrescription(false)
    }
  }

  const createPrescription = async (): Promise<Prescription | null> => {
    try {
      setPrescriptionError(null)
      const response = await api.post(`/pharmacy/prescription`)
      setCurrentPrescription(response.data)
      return response.data
    } catch (error) {
      setPrescriptionError(error instanceof Error ? error.message : 'Lỗi khi tạo toa thuốc')
      console.error('Error creating prescription:', error)
      return null
    }
  }

  const updatePrescription = async (prescriptionId: number): Promise<any> => {
    try {
      setPrescriptionError(null)
      const response = await api.put(`/pharmacy/prescription/${prescriptionId}`)
      return response.data
    } catch (error) {
      setPrescriptionError(error instanceof Error ? error.message : 'Lỗi khi cập nhật toa thuốc')
      console.error('Error updating prescription:', error)
      throw error
    }
  }

  const deletePrescription = async (prescriptionId: number): Promise<any> => {
    try {
      setPrescriptionError(null)
      const response = await api.delete(`/pharmacy/prescription/${prescriptionId}`)
      setCurrentPrescription(null)
      return response.data
    } catch (error) {
      setPrescriptionError(error instanceof Error ? error.message : 'Lỗi khi xóa toa thuốc')
      console.error('Error deleting prescription:', error)
      throw error
    }
  }

  // Service Order methods
  const fetchServiceOrdersByAppointment = async (appointmentId: number): Promise<void> => {
    try {
      setIsLoadingServiceOrders(true)
      setServiceOrdersError(null)
      const response = await api.get(`/appointments/services/appointments/${appointmentId}/orders`)
      setServiceOrders(response.data)
    } catch (error) {
      setServiceOrdersError(error instanceof Error ? error.message : 'Lỗi khi tải đơn dịch vụ')
      console.error('Error fetching service orders:', error)
    } finally {
      setIsLoadingServiceOrders(false)
    }
  }

  const fetchAllServiceOrders = async (serviceId: number): Promise<ServiceOrder[]> => {
    try {
      setServiceOrdersError(null)
      const response = await api.get(`/appointments/services/${serviceId}/service-orders`)
      return response.data
    } catch (error) {
      setServiceOrdersError(error instanceof Error ? error.message : 'Lỗi khi tải danh sách đơn dịch vụ')
      console.error('Error fetching all service orders:', error)
      return []
    }
  }

  const fetchServiceOrderById = async (serviceId: number, orderId: number): Promise<ServiceOrder | null> => {
    try {
      setServiceOrdersError(null)
      const response = await api.get(`/appointments/services/${serviceId}/service-orders/${orderId}`)
      return response.data
    } catch (error) {
      setServiceOrdersError(error instanceof Error ? error.message : 'Lỗi khi tải đơn dịch vụ')
      console.error('Error fetching service order by id:', error)
      return null
    }
  }

  const createServiceOrder = async (serviceId: number, serviceOrder: ServiceOrder): Promise<ServiceOrder | null> => {
    try {
      setServiceOrdersError(null)
      const response = await api.post(`/appointments/services/${serviceId}/service-orders`, serviceOrder)
      return response.data
    } catch (error) {
      setServiceOrdersError(error instanceof Error ? error.message : 'Lỗi khi tạo đơn dịch vụ')
      console.error('Error creating service order:', error)
      return null
    }
  }

  const updateServiceOrder = async (serviceId: number, orderId: number, serviceOrder: ServiceOrder): Promise<ServiceOrder | null> => {
    try {
      setServiceOrdersError(null)
      const response = await api.put(`/appointments/services/${serviceId}/service-orders/${orderId}`, serviceOrder)
      return response.data
    } catch (error) {
      setServiceOrdersError(error instanceof Error ? error.message : 'Lỗi khi cập nhật đơn dịch vụ')
      console.error('Error updating service order:', error)
      return null
    }
  }

  const deleteServiceOrder = async (serviceId: number, orderId: number): Promise<boolean> => {
    try {
      setServiceOrdersError(null)
      await api.delete(`/appointments/services/${serviceId}/service-orders/${orderId}`)
      return true
    } catch (error) {
      setServiceOrdersError(error instanceof Error ? error.message : 'Lỗi khi xóa đơn dịch vụ')
      console.error('Error deleting service order:', error)
      return false
    }
  }

  // Auto fetch data when appointmentId changes
  useEffect(() => {
    if (appointmentId) {
      fetchPatientDetail(appointmentId)
      fetchCurrentPrescription(appointmentId)
      fetchServiceOrdersByAppointment(appointmentId)
    }
  }, [appointmentId])

  // Reset data when appointmentId is cleared
  useEffect(() => {
    if (!appointmentId) {
      setPatientDetail(null)
      setCurrentPrescription(null)
      setServiceOrders([])
      setPatientError(null)
      setPrescriptionError(null)
      setServiceOrdersError(null)
    }
  }, [appointmentId])

  return {
    // Data
    patientDetail,
    currentPrescription,
    serviceOrders,
    
    // Loading states
    isLoadingPatient,
    isLoadingPrescription,
    isLoadingServiceOrders,
    
    // Error states
    patientError,
    prescriptionError,
    serviceOrdersError,
    
    // Patient methods
    fetchPatientDetail,
    
    // Prescription methods
    fetchCurrentPrescription,
    createPrescription,
    updatePrescription,
    deletePrescription,
    
    // Service Order methods
    fetchServiceOrdersByAppointment,
    fetchAllServiceOrders,
    fetchServiceOrderById,
    createServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
  }
}