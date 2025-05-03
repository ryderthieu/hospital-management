"use client"

import { Search, Calendar } from "lucide-react"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const SearchFilters = ({ searchTerm, setSearchTerm }: SearchFiltersProps) => {
  return (
    <div className="flex flex-row gap-5 mb-6">
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Tìm bệnh nhân"
          className="pl-10 py-2 pr-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-base-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      <input
        type="date"
        onFocus={(e) => e.target.showPicker()}
        className="flex items-center cursor-pointer  border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-base-500"
      />
    </div>
  )
}
