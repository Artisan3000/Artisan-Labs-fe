import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type Product = {
  id: string;
  title: string;
  description: string;
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
        }
      }
    `,
    {
      variables: { handle: params.handle },
    }
  );

  const product = data?.product;

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <>
    <Navigation />
    <main className={styles.main}>
      <h1 className={styles.title}>{product.title}</h1>
      <div>
        ITEM INFO
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
      </div>
    </main>
    <Footer />
    </>
  );
}
