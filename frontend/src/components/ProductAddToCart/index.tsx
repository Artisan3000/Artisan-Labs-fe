"use client";

import styles from "./styles.module.css";

type Props = {
  variantId: string | null;
  available: boolean;
};

export default function ProductAddToCart({ variantId, available }: Props) {
  const handleClick = () => {
    if (!available || !variantId) return;
    console.log("Adding to cart:", variantId);
    alert("Added to cart! (check console)");
  };

  const label = !variantId
    ? "---"
    : available
    ? "Add to Cart"
    : "Sold Out";

  return (
    <button
      onClick={handleClick}
      className={available ? styles.button : styles.buttonDisabled}
      disabled={!available || !variantId}
    >
      {label}
    </button>
  );
}
