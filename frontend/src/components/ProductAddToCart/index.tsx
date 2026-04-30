"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import styles from "./styles.module.css";

type Props = {
  variantId: string | null;
  available: boolean;
};

export default function ProductAddToCart({ variantId, available }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const { addItem } = useCart();

  const handleClick = async () => {
    if (!available || !variantId) return;

    setStatus("loading");

    try {
      await addItem(variantId, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Cart error:", error);
      setStatus("idle");
    }
  };

  const label = !variantId
    ? "---"
    : status === "loading"
    ? "Adding..."
    : status === "added"
    ? "Added"
    : available
    ? "Add to Cart"
    : "Sold Out";

  return (
    <button
      onClick={handleClick}
      className={available ? styles.button : styles.buttonDisabled}
      disabled={!available || !variantId || status === "loading"}
    >
      {label}
    </button>
  );
}
