import { useEffect, useState } from "react";
import { Indication } from "./types";
import { fetchMedicalOrder, updateMedicalOrder, deleteIndication } from "../../../services/medicalOrderApi";

export function useMedicalOrderModal() {
  const [indications, setIndications] = useState<Indication[]>([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchMedicalOrder().then(setIndications);     //ở đây thực tế chỉ đang truyền ngững dòng data chỉ đinh trong phiếu chỉ định
  }, []);

  const updateField = (index: number, field: keyof Indication, value: string) => {
    const updated = [...indications];
    updated[index][field] = value;
    setIndications(updated);
  };

  const deleteInd = async (index: number) => {
    const ind = indications[index];
    if (ind.id) await deleteIndication(ind.id);
    const updated = indications.filter((_, i) => i !== index);
    setIndications(updated);
  };

  const save = async () => {
    await updateMedicalOrder(indications);
  };

  return {
    indications,
    searchInput,
    setSearchInput,
    updateField,
    deleteInd,
    save
  };
}
