import React from "react";
import styles from "./button.module.scss";

type PropTypes = {
  type: "button" | "submit" | "reset" | undefined;
  onClick?: () => void; // onClick should be optional
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "google"; // tambahkan varian lain jika diperlukan
  className?: string;
  disabled?: boolean; // add disabled prop
};

const Button: React.FC<PropTypes> = ({
  type,
  onClick,
  children,
  variant = "primary",
  className,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${
        className ? className : ""
      }`}
      disabled={disabled} // handle disabled prop
    >
      {children}
    </button>
  );
};

export default Button;
