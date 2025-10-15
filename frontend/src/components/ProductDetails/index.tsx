"use client";

import { useState, useMemo } from "react";
import ProductOptions from "@/components/ProductOptions";
import ProductAddToCart from "@/components/ProductAddToCart";
import styles from "./styles.module.css";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../Accordion";

export default function ProductDetails({
  product,
  variants,
}: {
  product: any;
  variants: any[];
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    variants[0]?.id || null
  );

  // compute selected variant details (price, availability)
  const activeVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariant),
    [selectedVariant, variants]
  );

  return (
    <div className={styles.productInfo}>
        <div className={styles.productInfoHeader}>
      <h1 className={styles.title}>{product.title}</h1>

      {/* Price */}
      {activeVariant?.price && (
        <p className={styles.price}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: activeVariant.price.currencyCode,
          }).format(activeVariant.price.amount)}
        </p>
      )}
      </div>

      {product.options && product.options.length > 0 && (
        <ProductOptions
          options={product.options}
          variants={variants}
          onVariantChange={setSelectedVariant}
        />
      )}

      <ProductAddToCart
        variantId={selectedVariant}
        disabled={!activeVariant?.availableForSale}
      />

      <div className={styles.itemInfo}>
      <Accordion>
      <AccordionItem value="item-info">
        <AccordionTrigger>Details</AccordionTrigger>
        <AccordionContent>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
      </div>

          
    </div>
  );
}
