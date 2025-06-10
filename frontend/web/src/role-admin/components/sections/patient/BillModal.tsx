import { Modal } from "../../ui/modal";
import InfoField from "../../form/InfoField";
import { Bill } from "../../../types/payment";
import { format } from "date-fns";
import { useState } from "react";

interface BillModalProps extends Bill {
  isOpen: boolean;
  onClose: () => void;
}

// Chỉ dùng BillModalProps cho BillModal
export function BillModal({
  billId,
  totalCost,
  insuranceDiscount,
  amount,
  status,
  createdAt,
  isOpen,
  onClose,
}: BillModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] min-w-[300px] p-6 lg:p-10 mt-40 mb-10"
    >
      <div className="space-y-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-800">
          Hóa đơn #{billId}
        </h3>
        <InfoField
          label="Tổng tiền"
          value={`${totalCost.toLocaleString("vi-VN")} VNĐ`}
        />
        <InfoField
          label="Giảm bảo hiểm"
          value={`${insuranceDiscount.toLocaleString("vi-VN")} VNĐ`}
        />
        <InfoField
          label="Cần thanh toán"
          value={`${amount.toLocaleString("vi-VN")} VNĐ`}
        />
        <InfoField
          label="Trạng thái"
          value={
            status === "PAID"
              ? "Đã thanh toán"
              : status === "UNPAID"
              ? "Chưa thanh toán"
              : "Đã hủy"
          }
        />
        <InfoField
          label="Ngày tạo"
          value={
            createdAt && !isNaN(new Date(createdAt).getTime())
              ? format(new Date(createdAt), "dd-MM-yyyy")
              : ""
          }
        />
      </div>
    </Modal>
  );
}

// DeleteBillModal chỉ nhận các prop cần thiết
interface DeleteBillModalProps {
  billId: number;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => Promise<void>;
}

export function DeleteBillModal({
  billId,
  isOpen,
  onClose,
  onDelete,
}: DeleteBillModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) await onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting bill:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[400px] min-w-[300px] p-6"
    >
      <div className="space-y-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-800">
          Xác nhận xóa hóa đơn #{billId}
        </h3>
        <p>Bạn có chắc chắn muốn xóa hóa đơn này không?</p>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isDeleting}
        >
          Đóng
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Đang xóa..." : "Xóa hóa đơn"}
        </button>
      </div>
    </Modal>
  );
}
