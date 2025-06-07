import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom"; // Import useLocation và Link từ react-router-dom
import { BarChart3, Calendar, Clock, User, Users, LogOut } from "lucide-react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string; // Chuyển `href` thành `to` cho `Link` trong React Router
}

export const SidebarItem = ({ icon, label, to }: SidebarItemProps) => {
  const location = useLocation(); // Lấy URL hiện tại từ React Router
  const active = location.pathname === to; // Kiểm tra nếu đường dẫn hiện tại là của item này

  return (
    <div className="flex gap-3">
      {/* Viền trái */}
      <div
        className={`w-[6px] rounded-r-sm ${active ? "bg-base-600" : "bg-white"}`}
      />
      
      {/* Nội dung */}
      <Link
        to={to} // Sử dụng `Link` thay vì `a` để điều hướng trong React Router
        className={`flex items-center px-5 py-3 text-sm font-medium rounded-md w-full ${
          active ? "bg-[#007B8A] text-white" : "text-[#007B8A] hover:bg-gray-100"
        }`}
      >
        <span className={`mr-3 text-xl ${active ? "text-white" : "text-base-600"}`}>{icon}</span>
        <span>{label}</span>
      </Link>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <div className="w-52 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200 text-center">
        <h1 className="text-xl font-bold text-base-600">We<span className="text-xl font-bold text-black">Care</span></h1>
      </div>
      <nav className="mt-2 pr-5">
        <SidebarItem icon={<BarChart3 size={20} />} label="Dashboard" to="/examination/" />
        <SidebarItem icon={<Calendar size={20} />} label="Lịch làm việc" to="/examination/schedule" />
        <SidebarItem icon={<Clock size={20} />} label="Lịch hẹn" to="/examination/appointment" />
        <SidebarItem icon={<Users size={20} />} label="Bệnh nhân" to="/examination/patients" />
        <SidebarItem icon={<User size={20} />} label="Tài khoản" to="/examination/account" />
        <SidebarItem icon={<LogOut size={20} />} label="Đăng xuất" to="/examination/logout" />
      </nav>
    </div>
  );
};
