import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductOptions from "@/components/ProductOptions";
import ProductDetails from "@/components/ProductDetails";
import ProductRecommendations from "@/components/ProductRecommendations";
import ProductReviews from "@/components/ProductReviews";

type Product = {
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

type Review = {
  name: string;
  rating: number;
  comment: string;
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
    vendor
    descriptionHtml
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

  const mockReviews: Review[] = [
    {
      name: "Camila",
      rating: 5,
      comment:
        "Amazing quality and color. The fit is perfect — definitely worth it!",
    },
    {
      name: "Jonas",
      rating: 4,
      comment:
        "Really nice material. Slightly oversized, but looks great overall.",
    },
    {
      name: "Zoe",
      rating: 5,
      comment: "Bought this at the concert — nostalgia overload!",
    },
  ];  

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
            <ProductReviews reviews={mockReviews} />
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
