import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import ProductOptions from "@/components/ProductOptions";
import ProductDetails from "@/components/ProductDetails";
import ProductRecommendations from "@/components/ProductRecommendations";

type Product = {
  id: string;
  title: string;
  description: string;
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
      node: {
        id: string;
        availableForSale: boolean;
        title: string;
        selectedOptions: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
};

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const { data } = await shopifyClient.request<{
    product: Product | null;
  }>(
    `
      query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    options { name values }
    images(first: 10) {
      edges { node { url altText } }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions { name value }
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
}

    `,
    { variables: { handle: params.handle } }
  );
  
  const product = data?.product;

  if (!product) {
    return <p>Product not found</p>;
  }

  const variants = product.variants.edges.map((e: any) => e.node);
  const options = product.options || [];

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.productContainer}>
          <div>
            <div className={styles.imageGallery}>
              {product.images.edges.map(({ node }) => (
                <img
                  key={node.url}
                  src={node.url}
                  alt={node.altText || product.title}
                  className={styles.image}
                />
              ))}
            </div>
          </div>
          <div className={styles.productInfo}>
            <div>
              <ProductDetails product={product} variants={variants} />
            </div>
          </div>
        </div>
        <div className={styles.productPref}>
          <div>
            <h1>Ratings & Reviews</h1>
          </div>
        </div>
        <div className={styles.productRecs}>
          <ProductRecommendations productId={product.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
