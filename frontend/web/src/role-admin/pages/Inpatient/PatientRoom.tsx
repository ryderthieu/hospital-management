import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";
import Pagination from "../../components/common/Pagination";
import { useState } from "react";
import SearchInput from "../../components/common/SearchInput";
import { Building, Users } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface PatientsRoom {
    room_id: number;
    name: number;
    max_capacity: number;
    building: string;
    floor: number;
    current_patients: number;
    status: "Còn trống" | "Đầy"; 
    department: string;
}

const tableData: PatientsRoom[] = [
    {
        room_id: 101,
        name: 101,
        max_capacity: 4,
        building: "A",
        floor: 1,
        current_patients: 2,
        status: "Còn trống",
        department: "Khoa Nội"
    },
    {
        room_id: 102,
        name: 102,
        max_capacity: 4,
        building: "A",
        floor: 1,
        current_patients: 4,
        status: "Đầy",
        department: "Khoa Nội"
    },
    {
        room_id: 201,
        name: 201,
        max_capacity: 2,
        building: "A",
        floor: 2,
        current_patients: 1,
        status: "Còn trống",
        department: "Khoa Ngoại"
    },
    {
        room_id: 301,
        name: 301,
        max_capacity: 6,
        building: "B",
        floor: 3,
        current_patients: 0,
        status: "Còn trống", 
        department: "Khoa Nhi"
    },
    {
        room_id: 302,
        name: 302,
        max_capacity: 4,
        building: "B",
        floor: 3,
        current_patients: 3,
        status: "Còn trống",
        department: "Khoa Nhi"
    },
    {
        room_id: 401,
        name: 401,
        max_capacity: 2,
        building: "B",
        floor: 4,
        current_patients: 2,
        status: "Đầy",
        department: "Khoa Thần kinh"
    },
    {
        room_id: 402,
        name: 402,
        max_capacity: 4,
        building: "B",
        floor: 4,
        current_patients: 2,
        status: "Còn trống",
        department: "Khoa Thần kinh"
    },
    {
        room_id: 403,
        name: 403,
        max_capacity: 1,
        building: "B",
        floor: 4,
        current_patients: 0,
        status: "Còn trống",
        department: "Khoa Thần kinh"
    },
    {
        room_id: 404,
        name: 404,
        max_capacity: 8,
        building: "B",
        floor: 4,
        current_patients: 8,
        status: "Đầy",
        department: "Khoa Thần kinh"
    },
    {
        room_id: 501,
        name: 501,
        max_capacity: 4,
        building: "C",
        floor: 5,
        current_patients: 2,
        status: "Còn trống",
        department: "Khoa Tim mạch"
    },
];

const PAGE_SIZE = 10;

export default function PatientsRoom() {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const handleViewDetails = () => {
        navigate('/admin/inpatients-rooms/room-details');
    };

    const totalItems = tableData.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const paginatedData = tableData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex justify-start items-center pt-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách phòng bệnh</h2>
                    <span className="ml-5 text-sm bg-teal-600/20 text-teal-600 py-1 px-4 rounded-full font-bold">{totalItems} phòng</span>
                </div>

                <div className="flex items-center gap-3">
                    <SearchInput placeholder="Tìm kiếm phòng..." />
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                        <svg
                            className="stroke-current fill-white dark:fill-gray-800"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.29004 5.90393H17.7067"
                                stroke=""
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M17.7075 14.0961H2.29085"
                                stroke=""
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                                fill=""
                                stroke=""
                                strokeWidth="1.5"
                            />
                            <path
                                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                                fill=""
                                stroke=""
                                strokeWidth="1.5"
                            />
                        </svg>
                        Lọc
                    </button>

                </div>
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Mã phòng
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Tên phòng
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 px-4 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Tòa nhà
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 px-4 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Tầng
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 px-4 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Khoa
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 px-5 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Sức chứa
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 px-5 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Bệnh nhân hiện tại
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 px-5 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Tình trạng
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {paginatedData.map((room) => (
                            <TableRow key={room.room_id} className="">
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="my-1">
                                        {room.room_id}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3 my-1">
                                        <div className="h-[40px] w-[40px] overflow-hidden rounded-md bg-teal-100 flex items-center justify-center">
                                            <Building className="h-5 w-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                Phòng {room.name}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="my-1 px-2">
                                        Tòa nhà {room.building}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="my-1 px-2">
                                        Tầng {room.floor}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 px-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="my-1 px-2">
                                        {room.department}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 px-5 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center my-1">
                                        <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                                        {room.max_capacity}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 px-5 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="flex items-center my-1">
                                        <div className={`w-[80px] h-1.5 rounded-full mr-3 ${
                                            room.current_patients === room.max_capacity
                                                ? "bg-red-500"
                                                : "bg-green-500"
                                        }`}></div>
                                        {room.current_patients}/{room.max_capacity}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 px-5 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="my-1">
                                        <Badge
                                            size="sm"
                                            color={room.status === "Đầy" ? "error" : "success"}
                                        >
                                            {room.status}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-blue-600 text-theme-sm hover:text-blue-800 cursor-pointer">
                                    <div className="my-1" onClick ={handleViewDetails}>
                                        Xem chi tiết
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={PAGE_SIZE}
                        totalItems={totalItems}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}