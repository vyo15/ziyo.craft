import React from "react";
import styles from "./input.module.scss";

type PropTypes = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
};

const Input: React.FC<PropTypes> = ({
  label,
  name,
  type,
  placeholder,
  defaultValue,
  disabled,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        className={styles.container__input}
      />
    </div>
  );
};

export default Input;
