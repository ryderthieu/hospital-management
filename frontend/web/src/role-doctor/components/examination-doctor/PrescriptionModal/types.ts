export type Medication = {
    id?: string; // Thêm id để gắn với API (DELETE/PUT)
    name: string;
    dosage: string;
    unit: string;
    frequency: string;
    instructions: string;
    quantity: string;
  };
  
  export type Prescription = {
    id?: string; // Thêm id để gắn với API (DELETE/PUT)
    patientName: string;
    patientCode: string;
    date: string;
    time: string;
    medications: Medication[];
    doctorNote?: string;
  };

  export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
  };

  