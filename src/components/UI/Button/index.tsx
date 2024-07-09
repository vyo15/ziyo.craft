import React from "react";
import styles from "./button.module.scss";

type PropTypes = {
  type: "button" | "submit" | "reset" | undefined;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "google"; // tambahkan varian lain jika diperlukan
  className?: string;
};

const Button: React.FC<PropTypes> = ({
  type,
  onClick,
  children,
  variant = "primary",
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${
        className ? className : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;