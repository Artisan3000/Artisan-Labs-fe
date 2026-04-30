import { shopifyClient } from "@/lib/shopify";
import {
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from "./mutations/createCartMutations";

type ShopifyUserError = { field?: string[]; message: string };

export type CartMoney = {
  amount: string;
  currencyCode: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  totalAmount: CartMoney;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: CartMoney;
  lines: CartLine[];
};

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: CartMoney;
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: {
          totalAmount: CartMoney;
        };
        merchandise: {
          id: string;
          title: string;
          image?: {
            url: string;
            altText: string | null;
          } | null;
          product: {
            title: string;
            handle: string;
            featuredImage?: {
              url: string;
              altText: string | null;
            } | null;
          };
        };
      };
    }[];
  };
};

function normalizeCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    lines: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      merchandiseId: node.merchandise.id,
      variantTitle: node.merchandise.title,
      productTitle: node.merchandise.product.title,
      productHandle: node.merchandise.product.handle,
      image: node.merchandise.image ?? node.merchandise.product.featuredImage ?? null,
      totalAmount: node.cost.totalAmount,
    })),
  };
}

function assertNoUserErrors(
  userErrors: ShopifyUserError[] | undefined,
  action: string
) {
  if (userErrors && userErrors.length > 0) {
    console.error(`Shopify ${action} error:`, userErrors);
    throw new Error(userErrors[0].message);
  }
}

export async function getCart(cartId: string) {
  const response = await shopifyClient.request<{
    cart?: ShopifyCart | null;
  }>(GET_CART_QUERY, {
    variables: {
      cartId,
    },
  });

  const cart = response.data?.cart;

  if (!cart) throw new Error("Cart not found");

  return normalizeCart(cart);
}

export async function createCart(variantId: string, quantity = 1) {
  const response = await shopifyClient.request<{
    cartCreate?: {
      cart?: ShopifyCart | null;
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

  assertNoUserErrors(userErrors, "cartCreate");

  if (!cart) throw new Error("Cart not returned from Shopify");

  return normalizeCart(cart);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
) {
  const response = await shopifyClient.request<{
    cartLinesAdd?: {
      cart?: ShopifyCart | null;
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

  assertNoUserErrors(userErrors, "cartLinesAdd");

  if (!cart) throw new Error("Cart not returned from Shopify");

  return normalizeCart(cart);
}

export async function removeFromCart(cartId: string, lineId: string) {
  const response = await shopifyClient.request<{
    cartLinesRemove?: {
      cart?: ShopifyCart | null;
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

  assertNoUserErrors(userErrors, "cartLinesRemove");

  if (!cart) throw new Error("Cart not returned from Shopify");

  return normalizeCart(cart);
}
