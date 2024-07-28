import React from "react";
import styles from "./Button.module.scss";

type PropTypes = {
  type: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "google";
  className?: string;
  disabled?: boolean;
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
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
