import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserMetaCard from "../../components/sections/profile/UserMetaCard";
import UserInfoCard from "../../components/sections/profile/UserInfoCard";
import UserAddressCard from "../../components/sections/profile/UserAddressCard";
import PageMeta from "../../components/common/PageMeta";

export default function Profile() {
  return (
    <>
      <PageMeta
        title="Profile | Admin Dashboard"
        description="This is Profile Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
