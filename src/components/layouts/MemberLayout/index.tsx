import Sidebar from "@/components/fragments/Sidebar";
import styles from "./MemberLayout.module.scss";
import { title } from "process";

type PropTypes = {
  children: React.ReactNode;
};

const listSidebarItem = [
  {
    title: "Dashboard",
    url: "/member",
    icon: "bxs-dashboard",
  },
  {
    title: "Products",
    url: "/member/products",
    icon: "bxs-box",
  },
  {
    title: "Orders",
    url: "/member/orders",
    icon: "bxs-cart",
  },

  {
    title: "Profile",
    url: "/member/profile",
    icon: "bxs-user",
  },
];
const MemberLayout = (props: PropTypes) => {
  const { children } = props;
  return (
    <div className={styles.member}>
      <Sidebar list={listSidebarItem} />
      <div className={styles.member__main}>{children}</div>
    </div>
  );
};

export default MemberLayout;
