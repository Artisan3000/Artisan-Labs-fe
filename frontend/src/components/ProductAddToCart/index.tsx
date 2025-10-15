"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";

type Props = {
  variantId: string;
};

export default function ProductAddToCart({ variantId }: Props) {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch("/api/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAvailable(data.available);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setAvailable(false);
      }
    }

    fetchAvailability();
  }, [variantId]);

  const handleClick = () => {
    if (!available) return;
    console.log("Adding to cart:", variantId);
    alert("Added to cart! (check console)");
  };

  const label =
    available === null
      ? "Loading..."
      : available
      ? "Add to Cart"
      : "Sold Out";

  return (
    <button
      onClick={handleClick}
      className={available ? styles.button : styles.buttonDisabled}
      disabled={!available || available === null}
    >
      {label}
    </button>
  );
}
