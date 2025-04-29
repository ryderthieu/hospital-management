"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
}

export const Pagination = ({ currentPage, setCurrentPage }: PaginationProps) => {
  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
      <button
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      >
        <ChevronLeft size={16} className="mr-1" />
        Trang trước
      </button>

      <div className="flex space-x-2">
        {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${
              page === currentPage ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
            } ${page === "..." ? "cursor-default" : ""}`}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
      >
        Trang sau
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  )
}
