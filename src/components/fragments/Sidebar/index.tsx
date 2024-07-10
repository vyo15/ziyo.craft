import { useRouter } from "next/router";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import Button from "@/components/UI/Button";
import { signOut } from "next-auth/react"; // Tambahkan import untuk signOut

type PropTypes = {
  list: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
};

const Sidebar = (props: PropTypes) => {
  const { list } = props;
  const { pathname } = useRouter();
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__top}>
        <h1 className={styles.sidebar__top__title}>Admin Panel</h1>
        <div className={styles.sidebar__top__list}>
          {list.map((item) => (
            <Link
              href={item.url}
              key={item.title}
              className={`${styles.sidebar__top__list__item} ${
                pathname === item.url
                  ? styles.sidebar__top__list__item__active
                  : ""
              }`}
            >
              <i
                className={`bx ${item.icon} ${styles.sidebar__top__list__item__icon}`}
              ></i>
              <h4 className={styles.sidebar__top__list__item__title}>
                {item.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.sidebar__bottom}>
        <Button className={styles.sidebar__bottom__button} type="button" variant="secondary" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
