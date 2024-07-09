import Link from "next/link";
import styles from "./AuthLayout.module.scss";

type PropTypes = {
  error?: string;
  title?: string;
  children: React.ReactNode;
  link: string;
  linkText?: string;
};

const AuthLayout = (props: PropTypes) => {
  const { error, title, children, link, linkText } = props;
  const isLoading = false; // Definisikan isLoading jika tidak didefinisikan di tempat lain

  return (
    <div className={styles.auth}>
      <h1 className={styles.auth__title}>{title}</h1>
      <div className={styles.auth__form}>
        {isLoading && <div className={styles.spinner}>Loading...</div>}
        {error && <div className={styles.auth__error}>{error}</div>}
        <div>{children}</div>
        <p className={styles.auth__link}>
          {linkText} <Link href={link}>Disini</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
