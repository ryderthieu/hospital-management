import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserMetaCard from "../../components/sections/profile/UserMetaCard";
import UserInfoCard from "../../components/sections/profile/UserInfoCard";
import UserAddressCard from "../../components/sections/profile/UserAddressCard";
import PageMeta from "../../components/common/PageMeta";

export default function Profile() {
  return (
    <>
      <PageMeta
        title="Profile | Wecare Admin"
        description="Đây là trang thông tin cá nhân của quản trị viên"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
