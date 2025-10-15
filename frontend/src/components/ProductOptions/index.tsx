"use client";
import { useState } from "react";
import styles from "./styles.module.css";

type Option = {
  name: string;
  values: string[];
};

type Variant = {
  id: string;
  availableForSale: boolean;
  title: string;
  selectedOptions: { name: string; value: string }[];
};

export default function ProductOptions({
  options,
  variants,
  onVariantChange,
}: {
  options: Option[];
  variants: Variant[];
  onVariantChange: (variantId: string) => void;
}) {
  const initialSelections = Object.fromEntries(
    options.map((opt) => [opt.name, opt.values[0]])
  );

  const [selectedOptions, setSelectedOptions] = useState(initialSelections);

  const handleChange = (optionName: string, value: string) => {
    const updated = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(updated);

    const matchingVariant = variants.find((v) =>
      v.selectedOptions.every(
        (sel) => updated[sel.name] === sel.value
      )
    );

    if (matchingVariant) {
      onVariantChange(matchingVariant.id);
    }
  };

  return (
    <div className={styles.wrapper}>
      {options.map((opt) => (
        <div key={opt.name} className={styles.optionGroup}>
          <label className={styles.label}>{opt.name}</label>
          <div className={styles.optionValues}>
            {opt.values.map((value) => (
              <button
                key={value}
                onClick={() => handleChange(opt.name, value)}
                className={`${styles.optionButton} ${
                  selectedOptions[opt.name] === value ? styles.active : ""
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
