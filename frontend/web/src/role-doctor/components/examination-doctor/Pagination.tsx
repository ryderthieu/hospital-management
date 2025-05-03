"use client"

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  handleItemsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  handlePrev: () => void
  handleNext: () => void
}

export const Pagination = ({currentPage, totalPages, itemsPerPage, handlePrev, handleNext, handleItemsPerPageChange, setCurrentPage} : PaginationProps) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Hiện tối đa 5 nút

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center text-sm text-gray-600">
        <span>Hiển thị</span>
        <div className="mx-2 relative">
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="appearance-none bg-gray-100 border border-gray-300 rounded-md pl-2 pr-8 py-1 outline-none focus:ring focus: ring-base-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
        <span>bệnh nhân mỗi trang</span>
      </div>

      <div className="flex items-center">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer border border-gray-300 mr-2 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Nút số trang */}
        {pageNumbers.map((page, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md mx-1 cursor-pointer ${
              currentPage === page ? 'bg-base-500 text-white' : 'border border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Dấu ... nếu cần */}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <span className="mx-1">...</span>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer border border-gray-300 ml-2 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
