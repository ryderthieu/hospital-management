export type Indication = {
    id?: string; // Thêm id để gắn với API (DELETE/PUT)
    indicationType: string;
    room: string;
    expectedTime: string;
  };
  
  export type MedicalOrder = {
    id?: string; // Thêm id để gắn với API (DELETE/PUT)
    patientName: string;
    patientCode: string;
    date: string;
    time: string;
    indications: Indication[];
    doctorNote?: string;
  };

  export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
  };

  