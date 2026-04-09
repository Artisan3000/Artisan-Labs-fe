import { shopifyClient } from "@/lib/shopify";
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from "./mutations/createCartMutations";

type ShopifyUserError = { field?: string[]; message: string };

// 🧩 Create a new cart with a line item
export async function createCart(variantId: string, quantity = 1) {
  const response = await shopifyClient.request<{
    cartCreate?: {
      cart?: { id: string };
      userErrors?: ShopifyUserError[];
    };
  }>(
    CREATE_CART_MUTATION,
    {
      variables: {
        input: {
          lines: [{ merchandiseId: variantId, quantity }],
        },
      },
    }
  );

  const data = response.data;

  if (!data?.cartCreate) throw new Error("Invalid Shopify response");

  const { cart, userErrors } = data.cartCreate;

  if (userErrors && userErrors.length > 0) {
    console.error("Shopify cartCreate error:", userErrors);
    throw new Error(userErrors[0].message);
  }

  if (!cart) throw new Error("Cart not returned from Shopify");

  console.log("🛒 Cart created:", cart.id);
  return cart;
}

// ➕ Add an item to an existing cart
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
) {
  const response = await shopifyClient.request<{
    cartLinesAdd?: {
      cart?: { id: string };
      userErrors?: ShopifyUserError[];
    };
  }>(
    ADD_TO_CART_MUTATION,
    {
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      },
    }
  );

  const data = response.data;

  if (!data?.cartLinesAdd) throw new Error("Invalid Shopify response");

  const { cart, userErrors } = data.cartLinesAdd;

  if (userErrors && userErrors.length > 0) {
    console.error("Shopify cartLinesAdd error:", userErrors);
    throw new Error(userErrors[0].message);
  }

  if (!cart) throw new Error("Cart not returned from Shopify");

  console.log("✅ Added to cart:", cart.id);
  return cart;
}

// ❌ Remove an item from the cart
export async function removeFromCart(cartId: string, lineId: string) {
  const response = await shopifyClient.request<{
    cartLinesRemove?: {
      cart?: { id: string };
      userErrors?: ShopifyUserError[];
    };
  }>(
    REMOVE_FROM_CART_MUTATION,
    {
      variables: {
        cartId,
        lineIds: [lineId],
      },
    }
  );

  const data = response.data;

  if (!data?.cartLinesRemove) throw new Error("Invalid Shopify response");

  const { cart, userErrors } = data.cartLinesRemove;

  if (userErrors && userErrors.length > 0) {
    console.error("Shopify cartLinesRemove error:", userErrors);
    throw new Error(userErrors[0].message);
  }

  if (!cart) throw new Error("Cart not returned from Shopify");

  console.log("🗑️ Removed from cart:", lineId);
  return cart;
}