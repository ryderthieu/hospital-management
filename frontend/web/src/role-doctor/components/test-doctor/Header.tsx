import { ChevronDown, Bell } from "lucide-react"

export const Header = () => {
  return (
    <header className="bg-white p-4 h-[77px] border-b border-gray-200 flex justify-end">
      <div className="flex items-center">
        <div className="relative mr-4">
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <Bell size={20} />
          </div>
        </div>
        <div className="flex items-center ml-6">
          <img src="https://placehold.co/40x40" alt="Doctor Profile" className="w-10 h-10 rounded-full mr-2" />
          <div>
            <div className="font-medium">Dr. Nguyễn Thiên Tài</div>
            <div className="text-xs text-gray-500">Ths.BS</div>
          </div>
          <ChevronDown size={16} className="ml-2" />
        </div>
      </div>
    </header>
  )
}
