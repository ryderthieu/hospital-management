import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";


interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    phone: string;
  };
  team: {
    images: string[];
  };
  status: string;
  time: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Trần Nhật Trường",
      phone: "0987654321",
    },
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    time: "14:00",
    status: "Hoàn thành",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Trịnh T.P.Quỳnh",
      phone: "0123456789",
    },
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    time: "14:30",
    status: "Đang chờ",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lê Thiện Nhi",
      phone: "0867676762",
    },
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    time: "15:00",
    status: "Hoàn thành",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Trần N.A.Thơ",
      phone: "0868386838",
    },
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    time: "15:20",
    status: "Hủy",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      phone: "0906020102",
    },
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    time: "15:40",
    status: "Active",
  },
];

export default function RecentPatientTable() {
  return (
    <div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
          Bệnh nhân sắp tới
        </h3>
      </div>
      <div className="overflow-hidden rounded-xl bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b hidden border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Bệnh nhân
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Thời gian khám
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-2 py-2 sm:px-2 text-start">
                    <div className="flex items-center gap-1">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={30}
                          height={30}
                          src={order.user.image}
                          alt={order.user.name}
                        />
                      </div>
                      <div>
                        <span className="block font-outfit text-gray-800 text-[12px] dark:text-white/90">
                          {order.user.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.user.phone}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
