import React from "react";
import styles from "./Select.module.scss";

type OptionType = {
  label: string;
  value: string;
};

type PropTypes = {
  label: string;
  name: string;
  defaultValue?: string;
  options: OptionType[];
  className?: string;
};

const Select: React.FC<PropTypes> = ({
  label,
  name,
  defaultValue,
  options,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        id={name}
        defaultValue={defaultValue}
        className={styles.container__select}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
