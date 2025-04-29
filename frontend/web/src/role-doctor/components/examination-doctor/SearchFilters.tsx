"use client"

import { Search, Calendar } from "lucide-react"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const SearchFilters = ({ searchTerm, setSearchTerm }: SearchFiltersProps) => {
  return (
    <div className="flex justify-between mb-6">
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Tìm bệnh nhân"
          className="pl-10 py-2 pr-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      <div className="flex items-center">
        <button className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
          <span>Hôm nay</span>
          <Calendar className="ml-2" size={18} />
        </button>
      </div>
    </div>
  )
}
