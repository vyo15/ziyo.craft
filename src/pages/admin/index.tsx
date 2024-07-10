import { GetServerSideProps } from "next";
import { requireAdmin } from "@/lib/utils/auth/auth";
import DashboardAdminView from "@/components/views/admin/Dashboard";

const AdminPage = () => {
  return (
    <div>
      <DashboardAdminView />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = requireAdmin;

export default AdminPage;
