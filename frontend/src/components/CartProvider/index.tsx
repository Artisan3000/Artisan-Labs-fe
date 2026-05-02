"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  type Cart,
} from "@/lib/shopifyCart";

const CART_STORAGE_KEY = "shopify_cart_id";

type CartContextValue = {
  cart: Cart | null;
  totalQuantity: number;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearStoredCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCart(null);
  }, []);

  useEffect(() => {
    const storedCartId = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCartId) return;

    let cancelled = false;

    async function loadCart(cartId: string) {
      setIsLoading(true);
      setError(null);

      try {
        const loadedCart = await getCart(cartId);

        if (cancelled) return;

        setCart(loadedCart);
      } catch (loadError) {
        if (cancelled) return;

        console.error("Failed to load cart:", loadError);
        clearStoredCart();
        setError("We could not restore your cart.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCart(storedCartId);

    return () => {
      cancelled = true;
    };
  }, [clearStoredCart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const cartId = localStorage.getItem(CART_STORAGE_KEY);
        const nextCart = cartId
          ? await addToCart(cartId, variantId, quantity)
          : await createCart(variantId, quantity);

        localStorage.setItem(CART_STORAGE_KEY, nextCart.id);
        setCart(nextCart);
        setIsOpen(true);
      } catch (addError) {
        const cartId = localStorage.getItem(CART_STORAGE_KEY);

        if (!cartId) {
          console.error("Failed to add item:", addError);
          setError("We could not add that item to your cart.");
          throw addError;
        }

        try {
          clearStoredCart();
          const nextCart = await createCart(variantId, quantity);

          localStorage.setItem(CART_STORAGE_KEY, nextCart.id);
          setCart(nextCart);
          setIsOpen(true);
        } catch (retryError) {
          console.error("Failed to add item:", retryError);
          setError("We could not add that item to your cart.");
          throw retryError;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [clearStoredCart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      const cartId = cart?.id ?? localStorage.getItem(CART_STORAGE_KEY);

      if (!cartId) return;

      setIsLoading(true);
      setError(null);

      try {
        const nextCart = await removeFromCart(cartId, lineId);
        setCart(nextCart);
        localStorage.setItem(CART_STORAGE_KEY, nextCart.id);
      } catch (removeError) {
        console.error("Failed to remove item:", removeError);
        setError("We could not remove that item.");
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      totalQuantity: cart?.totalQuantity ?? 0,
      isOpen,
      isLoading,
      error,
      addItem,
      removeItem,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
    }),
    [addItem, cart, error, isLoading, isOpen, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

export function useOptionalCart() {
  return useContext(CartContext);
}
