import PageMeta from "../../components/common/PageMeta.tsx";
import AddButton from "../../components/ui/button/AddButton.tsx";
import UserRoleTable from "./UserRoleTable.tsx";
import RolePermissionTable from "./RolePermissionTable.tsx";
import { useState } from "react";

export default function Authorization() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  return (
    <>
      <PageMeta
        title="Phân quyền | Bệnh viện Đa khoa Wecare"
        description="This is Authorization Dashboard"
      />
      <div className="">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Quản lý phân quyền
          </h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-base-500 text-base-600 dark:text-base-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Quản lý người dùng
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "roles"
                    ? "border-base-500 text-base-600 dark:text-base-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Vai trò & Quyền hạn
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-12 xl:col-span-7">
            {activeTab === "users" ? <UserRoleTable /> : <RolePermissionTable />}
          </div>
        </div>

        <div className="fixed right-5 bottom-5">
          <AddButton />
        </div>
      </div>
    </>
  );
}
