/* ------------------ RAW (Shopify) TYPES ------------------ */

export type ShopifyVariant = {
  id: string;
  availableForSale: boolean;
  title: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: {
    amount: string;
    currencyCode: string;
  };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  descriptionHtml: string;
  vendor: string;
  options: {
    name: string;
    values: string[];
  }[];
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: ShopifyVariant;
    }[];
  };
};

/* ------------------ APP TYPES ------------------ */

export type ProductVariant = {
  id: string;
  availableForSale: boolean;
  title: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: {
    amount: number;
    currencyCode: string;
  };
};

export type Product = {
  id: string;
  title: string;
  descriptionHtml: string;
  vendor: string;
  options: {
    name: string;
    values: string[];
  }[];
  images: {
    url: string;
    altText: string | null;
  }[];
  variants: ProductVariant[];
};

/* ------------------ TRANSFORMERS ------------------ */

export function normalizeVariant(v: ShopifyVariant): ProductVariant {
  return {
    ...v,
    price: {
      ...v.price,
      amount: parseFloat(v.price.amount),
    },
  };
}

export function normalizeProduct(p: ShopifyProduct): Product {
  return {
    id: p.id,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    vendor: p.vendor,
    options: p.options,

    images: p.images.edges.map((e) => ({
      url: e.node.url,
      altText: e.node.altText,
    })),

    variants: p.variants.edges.map((e) => normalizeVariant(e.node)),
  };
}