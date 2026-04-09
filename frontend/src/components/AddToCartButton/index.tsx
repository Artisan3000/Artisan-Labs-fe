"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createCart, addToCart } from "@/lib/shopifyCart";
import styles from "./styles.module.css";

type Props = {
  variantId: string;
  disabled?: boolean;
};

export default function AddToCartButton({ variantId, disabled = false }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  const handleClick = async () => {
    if (disabled || status === "loading") return;
    setStatus("loading");

    try {
      // Get or create a cart ID
      let cartId = localStorage.getItem("shopify_cart_id");
      if (!cartId) {
        const cart = await createCart(variantId, 1);
        cartId = cart.id;
        localStorage.setItem("shopify_cart_id", cart.id);
      } else {
        await addToCart(cartId, variantId, 1);
      }

      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Cart error:", error);
      alert("Failed to add item to cart. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || status === "loading"}
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
