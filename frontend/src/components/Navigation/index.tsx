"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

const Navigation = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const collections = [
    { name: "Latest", href: "/shop/products/all" },
    { name: "Best Sellers", href: "/shop/products/beard-care" },
    { name: "Grooming", href: "/shop/products/grooming" },
    { name: "Collaborations", href: "/shop/products/collaborations" },
    { name: "Haberdashery", href: "/shop/products/haberdashery" },
    { name: "Apothecary", href: "/shop/products/apothecary" },
    { name: "Wardrobe", href: "/shop/products/wardrobe" },
    { name: "All", href: "/shop/products/all" },
  ];

  const about = [
    { name: "Team", href: "/team" },
    { name: "Manifesto", href: "/manifesto" },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">Artisan Barber</Link>
      </div>
      <div className={styles.links}>
        <div
          className={styles.menuItem}
          onMouseEnter={() => setOpenMenu('shop')}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <Link href="/shop">Shop</Link>
          {openMenu === 'shop' && (
            <div className={styles.dropdownMenu}>
              {collections.map((collection) => (
                <Link
                  key={collection.href}
                  href={collection.href}
                  className={styles.dropdownLink}
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div
          className={styles.menuItem}
          onMouseEnter={() => setOpenMenu('about')}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <Link href="/about">Info</Link>
          {openMenu === 'about' && (
            <div className={styles.dropdownMenu}>
              {about.map((about) => (
                <Link
                  key={about.href}
                  href={about.href}
                  className={styles.dropdownLink}
                >
                  {about.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className={styles.menuItem}>
          <Link href="/contact">Visit</Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/contact">Learn</Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/contact">Academy</Link>
        </div>
      </div>
      <div className={styles.cart}>
        <Link href="/shop/bag">Bag</Link>
      </div>
    </nav>
  );
};

export default Navigation;
