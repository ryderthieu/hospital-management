import MedicalRecord from "./MedicalRecord";
import AddMedicalRecordModal from "./AddMedicalRecordModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { format } from "date-fns";
import Badge from "../../ui/badge/Badge";
import React, { useState, useEffect } from "react";
import { patientService } from "../../../services/patientService";
import {
  Patient,
  EmergencyContact,
  PatientDto,
  EmergencyContactDto,
} from "../../../types/patient";
import { useParams, useNavigate } from "react-router-dom";
import { appointmentService } from "../../../services/appointmentService";
import {
  Appointment,
  AppointmentUpdateRequest,
} from "../../../types/appointment";
import { AppointmentModal, DeleteAppointmentModal } from "./AppointmentModal";
import { Bill } from "../../../types/payment";
import { paymentService } from "../../../services/paymentService";
import { BillModal, DeleteBillModal } from "./BillModal";
import { PrescriptionResponse } from "../../../types/pharmacy";
import { medicineService } from "../../../services/pharmacyService";
import { DeleteConfirmationModal } from "../../ui/modal/DeleteConfirmationModal";

export function MedicalRecordsContent() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const data = await medicineService.getPrescriptionsByPatientId(
          Number(patientId)
        );
        const mappedData = data.map((prescription: any) => ({
          ...prescription,
          prescriptionDetails:
            prescription.prescriptionDetails?.map((detail: any) => ({
              ...detail,
              prescriptionId:
                detail.prescriptionId ?? prescription.prescriptionId,
            })) ?? [],
        }));
        setPrescriptions(mappedData);
      } catch (error) {
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [patientId]);

  // Hàm xử lý khi submit modal
  const handleAddMedicalRecord = async (data: any) => {
    try {
      await medicineService.createPrescription(data);
      setIsAddModalOpen(false);
      // Reload list
      if (patientId) {
        const newData = await medicineService.getPrescriptionsByPatientId(
          Number(patientId)
        );
        setPrescriptions(newData);
      }
    } catch (error) {
      alert("Thêm bệnh án thất bại!");
    }
  };

  return (
    <div className=" font-outfit bg-white py-6 px-4 rounded-lg border border-gray-200">
      <div className="flex justify-between mb-4 ml-1">
        <h2 className="text-xl font-semibold">Bệnh án</h2>
        <button
          className="flex items-center justify-center bg-base-700 py-2.5 px-5 rounded-lg text-white text-sm hover:bg-base-700/70"
          onClick={() => setIsAddModalOpen(true)}
        >
          Thêm bệnh án
          <span className="ml-2 text-lg">+</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-8">Đang tải bệnh án...</div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có bệnh án nào.
          </div>
        ) : (
          prescriptions.map((pres) => (
            <MedicalRecord key={pres.prescriptionId} prescription={pres} />
          ))
        )}
      </div>
      <AddMedicalRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMedicalRecord}
        patientId={Number(patientId)}
      />
    </div>
  );
}

// AppointmentsContent
export function AppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { patientId } = useParams();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [deleteModal, setDeleteModal] = useState<Appointment | null>(null);
  const [editModal, setEditModal] = useState<AppointmentUpdateRequest | null>(
    null
  );

  const formatHHmm = (timeStr: string) => {
    if (!timeStr) return "N/A";
    const parts = timeStr.split(":");
    if (parts.length < 2) return "N/A";
    return `${parts[0]}:${parts[1]}`;
  };

  const reloadAppointments = async () => {
    if (!patientId) return;
    try {
      const data = await appointmentService.getAppointmentsByPatientId(
        Number(patientId)
      );
      setAppointments(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const handleEdit = async (appointmentId: number) => {
    try {
      const data = await appointmentService.getAppointmentById(appointmentId);
      setEditModal({
        appointmentId: data.appointmentId,
        doctorId: data.doctorId,
        patientId: data.patientInfo?.patientId ?? data.patientId ?? 0,
        scheduleId: data.schedule?.scheduleId ?? data.scheduleId ?? 0,
        symptoms: data.symptoms || "",
        number:
          typeof data.number === "number"
            ? data.number
            : parseInt(data.number, 10) || 0,
        appointmentStatus: data.appointmentStatus,
        slotStart: data.slotStart,
        slotEnd: data.slotEnd,
      });
    } catch (error) {
      alert("Không thể tải thông tin cuộc hẹn!");
    }
  };

  useEffect(() => {
    reloadAppointments();
  }, [patientId]);

  return (
    <div className="bg-white py-6 px-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 ml-1">Lịch khám</h2>
      <Table>
        {/* Table Header */}
        <TableHeader className="border-b border-gray-100 bg-slate-600/10 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
            >
              Mã đặt lịch
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-800 text-theme-sm dark:text-gray-400"
            >
              Tên bác sĩ
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-800 text-theme-sm dark:text-gray-400"
            >
              Tình trạng
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 font-medium text-gray-800 text-theme-sm dark:text-gray-400"
            >
              Thời gian khám
            </TableCell>
            <TableCell
              isHeader
              className="px-3 py-3 font-medium text-gray-800 text-theme-sm dark:text-gray-400"
            >
              Hành động
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <TableRow key={appt.appointmentId}>
                <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  CH{appt.appointmentId.toString().padStart(4, "0")}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  {appt.doctorInfo?.fullName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      appt.appointmentStatus === "PENDING"
                        ? "pending"
                        : appt.appointmentStatus === "COMPLETED"
                        ? "completed"
                        : appt.appointmentStatus === "CANCELLED"
                        ? "cancelled"
                        : appt.appointmentStatus === "CONFIRMED"
                        ? "confirmed"
                        : "light"
                    }
                  >
                    {appt.appointmentStatus === "PENDING"
                      ? "Chờ xác nhận"
                      : appt.appointmentStatus === "COMPLETED"
                      ? "Đã khám"
                      : appt.appointmentStatus === "CANCELLED"
                      ? "Đã hủy"
                      : appt.appointmentStatus === "CONFIRMED"
                      ? "Đã xác nhận"
                      : "Chưa xác định"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  {formatHHmm(appt.slotStart)} - {formatHHmm(appt.slotEnd)}
                </TableCell>
                <TableCell className="px-4 py-3 flex items-center text-gray-500 text-theme-md dark:text-gray-400">
                  <div className="flex gap-2">
                    {/* Xem */}
                    <button
                      onClick={() => setSelectedAppointment(appt)}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {/* Sửa */}
                    <button
                      onClick={() => handleEdit(appt.appointmentId)}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    {/* Xóa */}
                    <button
                      onClick={() => setDeleteModal(appt)}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center text-gray-500">
                <span className="block col-span-5">
                  Không có lịch khám nào.
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Hiển thị modal xem chi tiết */}
      {selectedAppointment && (
        <AppointmentModal
          {...selectedAppointment}
          isOpen={true}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
      {/* Hiển thị modal chỉnh sửa */}
      {editModal && (
        <AppointmentEditModal
          appointment={{
            ...editModal,
          }}
          isOpen={true}
          onClose={() => setEditModal(null)}
          onSubmit={async (updatedData) => {
            try {
              await appointmentService.updateAppointment(
                editModal.appointmentId,
                {
                  doctorId: updatedData.doctorId,
                  patientId: updatedData.patientId,
                  scheduleId: updatedData.scheduleId,
                  symptoms: updatedData.symptoms,
                  number: updatedData.number,
                  appointmentStatus: updatedData.appointmentStatus,
                  slotStart: updatedData.slotStart,
                  slotEnd: updatedData.slotEnd,
                }
              );
              setEditModal(null);
              reloadAppointments();
            } catch (error) {
              throw error;
            }
          }}
        />
      )}
      {/* Hiển thị modal xóa */}
      {deleteModal && (
        <DeleteAppointmentModal
          isOpen={true}
          onClose={() => setDeleteModal(null)}
          appointmentId={deleteModal.appointmentId}
          onDelete={async () => {
            await appointmentService.deleteAppointment(
              deleteModal.appointmentId
            );
            setDeleteModal(null);
            reloadAppointments();
          }}
        />
      )}
    </div>
  );
}

// InvoicesContent
export function InvoicesContent() {
  const [bills, setBills] = useState<Bill[]>([]);
  const { patientId } = useParams();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadBills = async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await paymentService.getBillsByPatientId(Number(patientId));
      setBills(data);
    } catch (error: any) {
      setError(error.message || "Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadBills();
  }, [patientId]);

  const handlePayment = async (bill: Bill, method: 'online' | 'cash') => {
    try {
      if (method === 'online') {
        const paymentUrl = await paymentService.createPayment(bill.billId);
        window.open(paymentUrl, '_blank');
        
        const checkPaymentStatus = setInterval(async () => {
          try {
            const updatedBills = await paymentService.getBillsByPatientId(Number(patientId));
            const currentBill = updatedBills.find(b => b.billId === bill.billId);
            
            if (currentBill?.status === "PAID") {
              clearInterval(checkPaymentStatus);
              setBills(updatedBills);
            }
          } catch (error) {
            console.error('Lỗi kiểm tra trạng thái thanh toán:', error);
          }
        }, 2000);

        setTimeout(() => {
          clearInterval(checkPaymentStatus);
        }, 5 * 60 * 1000);
      } else {
        await paymentService.processCashPayment(bill.billId);
        reloadBills();
      }
    } catch (error: any) {
      alert(error.message || 'Không thể thực hiện thanh toán');
    }
  };

  return (
    <div className="bg-white py-6 px-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 ml-1">Hóa đơn</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-slate-600/10 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Mã hóa đơn
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Ngày tạo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Tình trạng
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Trị giá
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="text-center py-4" colSpan={5}>
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell className="text-center text-red-500 py-4" colSpan={5}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : bills.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center text-gray-500 py-4" colSpan={5}>
                    Không có hóa đơn nào
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((bill) => (
                  <TableRow key={bill.billId}>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      #{bill.billId.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      {format(new Date(bill.createdAt), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          bill.status === "PAID"
                            ? "success"
                            : bill.status === "UNPAID"
                            ? "warning"
                            : "error"
                        }
                      >
                        {bill.status === "PAID"
                          ? "Đã thanh toán"
                          : bill.status === "UNPAID"
                          ? "Chưa thanh toán"
                          : "Đã hủy"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      {bill.amount.toLocaleString("vi-VN")} VNĐ
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-md dark:text-gray-400">
                      <div className="flex gap-2">
                        {bill.status === "UNPAID" ? (
                          <>
                            {/* Nút thanh toán online */}
                            <button
                              onClick={() => handlePayment(bill, 'online')}
                              className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Online
                            </button>

                            {/* Nút thanh toán tiền mặt */}
                            <button
                              onClick={() => handlePayment(bill, 'cash')}
                              className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Tiền mặt
                            </button>
                          </>
                        ) : (
                          /* Nút xem chi tiết cho hóa đơn đã thanh toán */
                          <button
                            onClick={() => setSelectedBill(bill)}
                            className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Xem chi tiết
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal xem chi tiết */}
      {selectedBill && (
        <BillModal
          {...selectedBill}
          isOpen={true}
          onClose={() => {
            setSelectedBill(null);
            reloadBills();
          }}
        />
      )}
    </div>
  );
}

interface Payment {
  id: string;
  transactionDate: string;
  status: "Thành công" | "Lỗi" | "Đang chờ";
  amount: string;
  method: "Tiền mặt" | "Chuyển khoản" | "Thẻ";
}

const paymentData: Payment[] = [
  {
    id: "P2025-0045",
    transactionDate: "2025-02-15 12:50",
    status: "Đang chờ",
    amount: "2.250.000 VNĐ",
    method: "Thẻ",
  },
  {
    id: "P2025-0023",
    transactionDate: "2025-01-14 12:50",
    status: "Thành công",
    amount: "150.000 VNĐ",
    method: "Chuyển khoản",
  },
  {
    id: "P2025-0018",
    transactionDate: "2025-01-13 12:50",
    status: "Lỗi",
    amount: "150.000 VNĐ",
    method: "Chuyển khoản",
  },
  {
    id: "P2025-0011",
    transactionDate: "2025-01-12 12:50",
    status: "Thành công",
    amount: "500.000 VNĐ",
    method: "Tiền mặt",
  },
  {
    id: "P2025-0023",
    transactionDate: "2025-01-11 12:50",
    status: "Thành công",
    amount: "150.000 VNĐ",
    method: "Chuyển khoản",
  },
  {
    id: "P2025-0018",
    transactionDate: "2025-01-10 12:50",
    status: "Lỗi",
    amount: "150.000 VNĐ",
    method: "Chuyển khoản",
  },
  {
    id: "P2025-0011",
    transactionDate: "2025-01-08 12:50",
    status: "Đang chờ",
    amount: "500.000 VNĐ",
    method: "Tiền mặt",
  },
];

// PaymentsContent
export function PaymentsContent() {
  return (
    <div className="bg-white py-6 px-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-slate-600/10 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Mã giao dịch
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Thời gian thanh toán
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Tình trạng
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Số tiền
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Phương thức
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paymentData.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm font-bold dark:text-gray-400">
                    GD{transaction.id.toString().padStart(4, "0")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                    {transaction.transactionDate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        transaction.status === "Thành công"
                          ? "success"
                          : transaction.status === "Đang chờ"
                          ? "warning"
                          : "error"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-green-700 font-semibold text-theme-sm dark:text-gray-400">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                    {transaction.method}
                  </TableCell>
                  <TableCell className="px-4 py-3 flex items-center text-gray-500 text-theme-md dark:text-gray-400">
                    <button className="flex items-center gap-2 px-5 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                      <svg
                        className="stroke-current fill-white dark:fill-gray-800"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.29004 5.90393H17.7067"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.7075 14.0961H2.29085"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// PatientInfoContent
export function PatientInfoContent() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { patientId } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<PatientDto>({} as PatientDto);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      try {
        const data = await patientService.getPatientById(Number(patientId));
        setPatient(data);
        setEditData({
          userId: data.patientId,
          height: data.height,
          weight: data.weight,
          bloodType: data.bloodType,
          avatar: data.avatar,
          allergies: data.allergies,
          fullName: data.fullName,
          birthday: data.birthday,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          address: data.address,
          insuranceNumber: data.insuranceNumber,
          identityNumber: data.identityNumber,
        });
      } catch (error) {
        setErrorModal("Không thể tải thông tin bệnh nhân!");
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    try {
      setLoading(true);
      await patientService.updatePatient(Number(patientId), {
        userId: editData.userId ?? patient?.patientId ?? 0,
        identityNumber: editData.identityNumber || "",
        insuranceNumber: editData.insuranceNumber || "",
        fullName: editData.fullName || "",
        birthday: editData.birthday || "",
        phone: editData.phone || "",
        email: editData.email || "",
        avatar: editData.avatar || "",
        gender: editData.gender as "MALE" | "FEMALE" | "OTHER",
        address: editData.address || "",
        allergies: patient?.allergies || "",
        height: patient?.height ?? 0,
        weight: patient?.weight ?? 0,
        bloodType: patient?.bloodType || "O+",
      });
      setShowEditModal(false);
      const data = await patientService.getPatientById(Number(patientId));
      setPatient(data);
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      let message = "Cập nhật thông tin thất bại!";
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      setErrorModal(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-6 px-5 rounded-lg border border-gray-200">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Thông tin bệnh nhân</h2>
        <button
          className="flex items-center justify-center bg-base-700 py-2.5 px-5 rounded-lg text-white text-sm hover:bg-base-700/70"
          onClick={() => setShowEditModal(true)}
        >
          Sửa
        </button>
      </div>
      <div className="space-y-4 ml-1">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Họ và tên</p>
            <p className="font-medium">{patient?.fullName}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Mã bệnh nhân</p>
            <p className="font-medium">
              BN{patient?.patientId.toString().padStart(4, "0")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ngày sinh</p>
            <p className="font-medium">{patient?.birthday}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Giới tính</p>
            <p className="font-medium">
              {patient?.gender === "MALE"
                ? "Nam"
                : patient?.gender === "FEMALE"
                ? "Nữ"
                : "Khác"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Điện thoại</p>
            <p className="font-medium">{patient?.phone || ""}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">{patient?.email || ""}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Địa chỉ</p>
            <p className="font-medium">{patient?.address}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Bảo hiểm y tế</p>
            <p className="font-medium">{patient?.insuranceNumber}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Căn cước công dân</p>
            <p className="font-medium">{patient?.identityNumber}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ngày tạo tài khoản</p>
            <p className="font-medium">
              {patient?.createdAt
                ? format(new Date(patient?.createdAt), "dd-MM-yyyy")
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa thông tin bệnh nhân */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Chỉnh sửa thông tin bệnh nhân
            </h2>
            <form
              onSubmit={handleEditSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Họ và tên</label>
                  <input
                    name="fullName"
                    value={editData.fullName || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Ngày sinh</label>
                  <input
                    name="birthday"
                    type="date"
                    value={editData.birthday || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Giới tính</label>
                  <select
                    name="gender"
                    value={editData.gender || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Điện thoại</label>
                  <input
                    name="phone"
                    value={editData.phone || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={editData.email || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="">
                  <label className="block font-medium mb-1">Avatar (URL)</label>
                  <input
                    name="avatar"
                    value={editData.avatar || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Nhập đường dẫn ảnh đại diện"
                  />
                  {editData.avatar && (
                    <img
                      src={editData.avatar}
                      alt="Avatar"
                      className="mt-2 w-20 h-20 object-cover rounded-full border"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Địa chỉ</label>
                  <input
                    name="address"
                    value={editData.address || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Bảo hiểm y tế
                  </label>
                  <input
                    name="insuranceNumber"
                    value={editData.insuranceNumber || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Căn cước công dân
                  </label>
                  <input
                    name="identityNumber"
                    value={editData.identityNumber || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thông báo lỗi */}
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Lỗi</h2>
            <p>{errorModal}</p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setErrorModal(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// HealthInfoContent
export function HealthInfoContent() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { patientId } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<PatientDto>({} as PatientDto);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      try {
        const data = await patientService.getPatientById(Number(patientId));
        setPatient(data);
        setEditData({
          userId: data.patientId,
          fullName: data.fullName,
          birthday: data.birthday,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          avatar: data.avatar,
          address: data.address,
          insuranceNumber: data.insuranceNumber,
          identityNumber: data.identityNumber,
          allergies: data.allergies,
          height: data.height,
          weight: data.weight,
          bloodType: data.bloodType,
        });
      } catch (error) {
        setErrorModal("Không thể tải thông tin bệnh nhân!");
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === "height" || name === "weight" ? Number(value) : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    try {
      setLoading(true);
      await patientService.updatePatient(Number(patientId), {
        ...editData,
        userId: editData.userId ?? patient?.patientId ?? Number(patientId),
        height: editData.height ?? 0,
        weight: editData.weight ?? 0,
        bloodType: editData.bloodType || "O+",
        allergies: editData.allergies || "",
      });
      setShowEditModal(false);
      const data = await patientService.getPatientById(Number(patientId));
      setPatient(data);
    } catch (error: any) {
      setErrorModal("Cập nhật thông tin sức khỏe thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-6 px-5 rounded-lg border border-gray-200">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Thông tin sức khỏe</h2>
        <button
          className="flex items-center justify-center bg-base-700 py-2.5 px-5 rounded-lg text-white text-sm hover:bg-base-700/70"
          onClick={() => setShowEditModal(true)}
        >
          Sửa
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Dị ứng</h3>
          <ul className="list-disc pl-5 space-y-1">
            {patient?.allergies?.split("\n").map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-2">Các chỉ số sức khỏe</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Chiều cao</p>
              <p className="font-medium">{patient?.height} cm</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Cân nặng</p>
              <p className="font-medium">{patient?.weight} kg</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Nhóm máu</p>
              <p className="font-medium">
                {patient?.bloodType || "Chưa xác định"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa thông tin sức khỏe */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Chỉnh sửa thông tin sức khỏe
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Dị ứng</label>
                <textarea
                  name="allergies"
                  value={editData.allergies || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Nhập dị ứng (mỗi dòng 1 dị ứng)"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Chiều cao (cm)</label>
                <input
                  name="height"
                  type="number"
                  value={editData.height ?? ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Cân nặng (kg)</label>
                <input
                  name="weight"
                  type="number"
                  value={editData.weight ?? ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Nhóm máu</label>
                <select
                  name="bloodType"
                  value={editData.bloodType || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Chọn nhóm máu</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-600"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thông báo lỗi */}
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Lỗi</h2>
            <p>{errorModal}</p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setErrorModal(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppointmentEditModal({
  appointment,
  isOpen,
  onClose,
  onSubmit,
}: {
  appointment: AppointmentUpdateRequest;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentUpdateRequest) => Promise<void>;
}) {
  const [formData, setFormData] = useState<AppointmentUpdateRequest>({
    ...appointment,
    number: appointment.number,
  });
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number" || name === "doctorId" ? Number(value) : value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      appointmentStatus: e.target
        .value as AppointmentUpdateRequest["appointmentStatus"],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setErrorModal(null);
    } catch (error: any) {
      // In chi tiết lỗi ra console
      console.error("Lỗi cập nhật lịch khám:", error);

      // Lấy thông tin chi tiết lỗi từ backend nếu có
      let message = "Cập nhật lịch khám thất bại!";
      if (error?.response?.data) {
        // Nếu backend trả về mảng lỗi hoặc object lỗi chi tiết
        if (Array.isArray(error.response.data)) {
          message = error.response.data
            .map((err: any) => err.message || JSON.stringify(err))
            .join("\n");
        } else if (typeof error.response.data === "object") {
          // Nếu là object, lấy từng trường lỗi
          message = Object.values(error.response.data)
            .map((msg) => (Array.isArray(msg) ? msg.join(", ") : msg))
            .join("\n");
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data);
        }
      } else if (error?.message) {
        message = error.message;
      }
      alert(message);
      setErrorModal(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Chỉnh sửa lịch khám</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Bác sĩ (ID)</label>
                <input
                  name="doctorId"
                  type="number"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  disabled
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Triệu chứng</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  Thời gian bắt đầu
                </label>
                <input
                  name="slotStart"
                  type="time"
                  value={formData.slotStart}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Thời gian kết thúc
                </label>
                <input
                  name="slotEnd"
                  type="time"
                  value={formData.slotEnd}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Số thứ tự</label>
                <input
                  name="number"
                  type="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Tình trạng</label>
                <select
                  name="appointmentStatus"
                  value={formData.appointmentStatus || ""}
                  onChange={handleStatusChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="COMPLETED">Đã khám</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Modal lỗi */}
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Lỗi</h2>
            <p>{errorModal}</p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setErrorModal(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ContactInfoContent() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const { patientId } = useParams();
  const [selectedContact, setSelectedContact] =
    useState<EmergencyContact | null>(null);
  const [editContact, setEditContact] = useState<EmergencyContact | null>(null);
  const [deleteContact, setDeleteContact] = useState<EmergencyContact | null>(
    null
  );
  const [editData, setEditData] = useState<EmergencyContactDto>({
    contactName: "",
    contactPhone: "",
    relationship: "FAMILY",
  });
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const reloadContacts = async () => {
    if (!patientId) return;
    try {
      const data = await patientService.getEmergencyContacts(Number(patientId));
      setContacts(data);
    } catch (error) {
      setErrorModal("Không thể tải danh sách liên hệ!");
    }
  };

  useEffect(() => {
    reloadContacts();
    // eslint-disable-next-line
  }, [patientId]);

  // Xem chi tiết
  const handleView = (contact: EmergencyContact) => {
    setSelectedContact(contact);
  };

  // Sửa
  const handleEdit = (contact: EmergencyContact) => {
    setEditContact(contact);
    setEditData({
      contactName: contact.contactName,
      contactPhone: contact.contactPhone,
      relationship: contact.relationship as "FAMILY" | "FRIEND" | "OTHERS",
    });
  };

  // Lưu chỉnh sửa
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContact || !patientId) return;
    if (
      !editData.contactName ||
      !editData.contactPhone ||
      !editData.relationship ||
      !["FAMILY", "FRIEND", "OTHERS"].includes(editData.relationship)
    ) {
      setErrorModal("Vui lòng nhập đầy đủ và đúng thông tin liên hệ!");
      return;
    }
    setLoading(true);
    try {
      await patientService.updateEmergencyContact(
        editContact.contactId,
        Number(patientId),
        editData
      );
      setEditContact(null);
      setEditData({
        contactName: "",
        contactPhone: "",
        relationship: "FAMILY",
      });
      reloadContacts();
    } catch (error: any) {
      // In chi tiết lỗi ra console
      console.error("Lỗi cập nhật liên hệ:", error);

      // Lấy thông tin chi tiết lỗi từ backend nếu có
      let message = "Cập nhật liên hệ thất bại!";
      if (error?.response?.data) {
        if (Array.isArray(error.response.data)) {
          message = error.response.data
            .map((err: any) => err.message || JSON.stringify(err))
            .join("\n");
        } else if (typeof error.response.data === "object") {
          message = Object.values(error.response.data)
            .map((msg) => (Array.isArray(msg) ? msg.join(", ") : msg))
            .join("\n");
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data);
        }
      } else if (error?.message) {
        message = error.message;
      }
      setErrorModal(message);
    } finally {
      setLoading(false);
    }
  };

  // Xóa
  const handleDelete = async () => {
    if (!deleteContact || !patientId) return;
    setLoading(true);
    try {
      await patientService.deleteEmergencyContact(
        deleteContact.contactId,
        Number(patientId)
      );
      setDeleteContact(null);
      reloadContacts();
    } catch (error: any) {
      setErrorModal("Xóa liên hệ thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-6 px-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 ml-1">
        Thông tin liên lạc khẩn cấp
      </h2>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-slate-600/10 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Tên người liên lạc
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Số điện thoại
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Mối quan hệ
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            {contacts && contacts.length > 0 ? (
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {contacts.map((contact) => (
                  <TableRow key={contact.contactId}>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      {contact.contactName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                      {contact.contactPhone}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                      {contact.relationship === "FAMILY"
                        ? "Gia đình"
                        : contact.relationship === "FRIEND"
                        ? "Bạn bè"
                        : contact.relationship === "OTHERS"
                        ? "Khác"
                        : "Chưa xác định"}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-theme-sm">
                      <div className="flex gap-2">
                        {/* Xem */}
                        <button
                          onClick={() => handleView(contact)}
                          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Xem
                        </button>
                        {/* Sửa */}
                        <button
                          onClick={() => handleEdit(contact)}
                          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-yellow-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Sửa
                        </button>
                        {/* Xóa */}
                        <button
                          onClick={() => setDeleteContact(contact)}
                          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell className="pl-4 py-2 text-gray-500 text-theme-sm dark:text-gray-400">
                    Không có liên hệ khẩn cấp
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      {/* Modal xem chi tiết */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Chi tiết liên hệ</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Tên:</span>{" "}
                {selectedContact.contactName}
              </div>
              <div>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {selectedContact.contactPhone}
              </div>
              <div>
                <span className="font-medium">Mối quan hệ:</span>{" "}
                {selectedContact.relationship === "FAMILY"
                  ? "Gia đình"
                  : selectedContact.relationship === "FRIEND"
                  ? "Bạn bè"
                  : selectedContact.relationship === "OTHERS"
                  ? "Khác"
                  : "Chưa xác định"}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {editContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Chỉnh sửa liên hệ</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  Tên người liên lạc
                </label>
                <input
                  name="contactName"
                  value={editData.contactName || ""}
                  onChange={(e) =>
                    setEditData((d) => ({ ...d, contactName: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Số điện thoại</label>
                <input
                  name="contactPhone"
                  value={editData.contactPhone || ""}
                  onChange={(e) =>
                    setEditData((d) => ({ ...d, contactPhone: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Mối quan hệ</label>
                <select
                  name="relationship"
                  value={editData.relationship || ""}
                  onChange={(e) =>
                    setEditData((d) => ({
                      ...d,
                      relationship: e.target
                        .value as EmergencyContact["relationship"],
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Chọn mối quan hệ</option>
                  <option value="FAMILY">Gia đình</option>
                  <option value="FRIEND">Bạn bè</option>
                  <option value="OTHERS">Khác</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditContact(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <DeleteConfirmationModal
        isOpen={!!deleteContact}
        onClose={() => setDeleteContact(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa liên hệ"
        message={
          deleteContact
            ? `Bạn có chắc chắn muốn xóa liên hệ ${deleteContact.contactName} không? Thao tác này sẽ không thể hoàn tác.`
            : ""
        }
      />

      {/* Modal lỗi */}
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Lỗi</h2>
            <p>{errorModal}</p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setErrorModal(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
