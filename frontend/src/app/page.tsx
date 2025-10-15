import Image from "next/image";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SiteWidget from "@/components/SiteWidget";

export default function Home() {
  return (
    <>
    <Navigation />
      <main className={styles.main}>
        <Hero />
        <SiteWidget />
      </main>
    <Footer />
    </>
    
  );
}
