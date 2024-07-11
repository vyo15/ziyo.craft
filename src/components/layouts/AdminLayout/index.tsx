import Sidebar from "@/components/fragments/Sidebar";
import styles from "./AdminLayout.module.scss";
import { title } from "process";

type PropTypes = {
    children: React.ReactNode;
};

const listSidebarItem = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: "bxs-dashboard",
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: "bxs-box",
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: "bxs-group",
  },
];
const AdminLayout = (props: PropTypes) => {
    const { children } = props;
    return (
      <div className={styles.admin}>
        <Sidebar list={listSidebarItem} />
        <div className={styles.admin__main}>{children}</div>
      </div>
    );
};

export default AdminLayout;