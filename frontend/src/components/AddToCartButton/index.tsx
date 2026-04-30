"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import styles from "./styles.module.css";

type Props = {
  variantId: string;
  disabled?: boolean;
  tabIndex?: number;
};

export default function AddToCartButton({
  variantId,
  disabled = false,
  tabIndex,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const { addItem } = useCart();

  const handleClick = async () => {
    if (disabled || status === "loading") return;
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

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || status === "loading"}
      tabIndex={tabIndex}
      className={disabled ? styles.buttonDisabled : styles.button}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Adding…
          </motion.span>
        )}
        {status === "added" && (
          <motion.span key="added" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}>
            ✓ Added
          </motion.span>
        )}
        {status === "idle" && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            + Cart
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
