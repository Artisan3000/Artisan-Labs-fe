"use client";

import styles from "./styles.module.css";

type Props = {
  variantId: string;
  disabled?: boolean;
};

export default function AddToCartButton({ variantId, disabled = false }: Props) {
  const handleClick = () => {
    if (disabled) return; // Don’t do anything if sold out
    console.log("Adding to cart:", variantId);
    alert("Added to cart! (check console)");
  };

  return (
    <button
      onClick={handleClick}
      className={disabled ? styles.buttonDisabled : styles.button}
      disabled={disabled}
    >
      + Cart
    </button>
  );
}
