import Link from "next/link";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main style={{ minHeight: "60vh", padding: "10rem 2rem", textAlign: "center" }}>
        <p>404</p>
        <h1>We couldn&apos;t find that page.</h1>
        <p>The page may have moved, or the product may no longer be available.</p>
        <Link href="/">Return home</Link>
      </main>
      <Footer />
    </>
  );
}
