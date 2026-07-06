import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { SHOPIFY_STOREFRONT_API_VERSION } from "@/lib/shopifyApiVersion";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN!,
  apiVersion: SHOPIFY_STOREFRONT_API_VERSION,
});
