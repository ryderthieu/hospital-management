import { ChevronDown, Edit } from "lucide-react"
import { StatusIndicator } from "./Status-indicator"

interface Patient {
    id: number
    name: string
    code: string
    appointment: string
    date: string
    gender: string
    age: number
    symptom: string
    status: string
  }
  

interface PatientTableProps {
  patients: Patient[]
}

export const PatientTable = ({ patients }: PatientTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500">
            <th className="px-6 py-3">
              STT <ChevronDown size={16} className="inline" />
            </th>
            <th className="px-6 py-3">Tên bệnh nhân</th>
            <th className="px-6 py-3">Dạng khám</th>
            <th className="px-6 py-3">
              Ngày khám <ChevronDown size={16} className="inline" />
            </th>
            <th className="px-6 py-3">Giới tính</th>
            <th className="px-6 py-3">
              Tuổi <ChevronDown size={16} className="inline" />
            </th>
            <th className="px-6 py-3">Triệu chứng</th>
            <th className="px-6 py-3">Trạng thái</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img src={`https://placehold.co/40x40`} alt={patient.name} className="w-8 h-8 rounded-full mr-3" />
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-gray-500">{patient.code}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.appointment}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.gender}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.age}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.symptom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusIndicator status={patient.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button className="text-gray-500 hover:text-gray-700">
                  <Edit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
