import { NextResponse } from "next/server";
import { shopifyClient } from "@/lib/shopify";

export async function POST(req: Request) {
  try {
    const { variantId } = await req.json();

    const { data } = await shopifyClient.request<{
      productVariant: { availableForSale: boolean | null };
    }>(
      `
        query getVariantAvailability($id: ID!) {
          productVariant(id: $id) {
            availableForSale
          }
        }
      `,
      { variables: { id: variantId } }
    );

    return NextResponse.json({
      available: data?.productVariant?.availableForSale ?? false,
    });
  } catch (error) {
    console.error("Error in check-availability API:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
