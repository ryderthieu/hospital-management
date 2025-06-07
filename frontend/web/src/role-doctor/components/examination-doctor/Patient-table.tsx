import { SkipForward, Edit } from "lucide-react";
import { StatusIndicator } from "./Status-indicator";

interface Patient {
  id: number;
  name: string;
  code: string;
  appointment: string;
  date: string;
  gender: string;
  age: number;
  symptom: string;
  status: string;
}

interface PatientTableProps {
  patients: Patient[];
  currentPage: number;
  itemsPerPage: number;
}

export const PatientTable = ({
  patients,
  currentPage,
  itemsPerPage,
}: PatientTableProps) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = patients.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500">
            <th className="px-6 py-3 w-[50px] ">STT</th>
            <th className="px-6 py-3 min-w-[300px] max-w-[350px] ">
              Tên bệnh nhân
            </th>
            <th className="px-6 py-3 w-[150px]">
              Dạng khám
            </th>
            <th className="px-6 py-3 w-[100px] ">
              Ngày khám
            </th>
            <th className="px-6 py-3 w-[110px] ">
              Giới tính
            </th>
            <th className="px-6 py-3 w-[110px] ">Tuổi</th>
            <th className="px-6 py-3 w-min-[150px] w-max-[250] ">
              Triệu chứng
            </th>
            <th className="px-6 py- w-[150px]">
              Trạng thái
            </th>
            <th className="px-6 py-3 "></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {currentPatients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-md text-center ">
                {patient.id}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap min-w-[300px] max-w-[350px] truncate  "
                title={patient.name}
              >
                <div className="flex items-center truncate">
                  <img
                    src={`https://placehold.co/48x48`}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium ">{patient.name}</div>
                    <div className="text-xs text-gray-500">{patient.code}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {patient.appointment}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {patient.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {patient.gender}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {patient.age}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm w-min-[150px] w-max-[250] truncate"
                title={patient.symptom}
              >
                {patient.symptom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusIndicator status={patient.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-row justify-between items-center h-full">
                  <button
                    title="Bỏ qua"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <SkipForward size={18} />
                  </button>
                  <button
                    title="Xem hồ sơ"
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
