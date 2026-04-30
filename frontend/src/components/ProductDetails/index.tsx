"use client";

import { useState, useMemo } from "react";
import ProductOptions from "@/components/ProductOptions";
import ProductAddToCart from "@/components/ProductAddToCart";
import styles from "./styles.module.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../Accordion";

type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price?: {
    amount: number;
    currencyCode: string;
  };
  selectedOptions?: { name: string; value: string }[];
};

type Product = {
  title: string;
  descriptionHtml: string;
  vendor: string;
  options: { name: string; values: string[] }[];
};

export default function ProductDetails({
  product,
  variants,
}: {
  product: Product;
  variants: ProductVariant[];
}) {
  // 🧩 Filter out Shopify's placeholder variant
  const displayVariants =
    variants.length === 1 && variants[0].title === "Default Title"
      ? []
      : variants;

  // 🧠 Determine default variant (handles both single and multi)
  const defaultVariant =
    variants.length === 1 ? variants[0] : displayVariants[0];

  const [selectedVariant, setSelectedVariant] = useState(
    defaultVariant?.id || null
  );

  // 🔍 Find currently active variant
  const activeVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariant),
    [selectedVariant, variants]
  );

  return (
    <div className={styles.productInfo}>
      <div className={styles.productInfoHeader}>
        <div className={styles.productInfoHeaderTitle}>
          <h1 className={styles.title}>{product.title}</h1>
          {product.vendor && <p className={styles.vendor}>{product.vendor}</p>}
        </div>

        {activeVariant?.price && (
          <p className={styles.price}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: activeVariant.price.currencyCode,
            }).format(activeVariant.price.amount)}
          </p>
        )}
      </div>

      {displayVariants.length > 0 && (
        <ProductOptions
          options={product.options}
          variants={displayVariants.map((v) => ({
            ...v,
            selectedOptions: v.selectedOptions ?? [],
          }))}
          onVariantChange={setSelectedVariant}
        />
      )}

      <ProductAddToCart
        variantId={selectedVariant}
        available={activeVariant?.availableForSale ?? true}
      />

      <div className={styles.itemInfo}>
        <Accordion>
          <AccordionItem value="item-info" defaultOpen>
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent>
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
