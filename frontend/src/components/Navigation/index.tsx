"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOptionalCart } from "@/components/CartProvider";
import type { CartMoney } from "@/lib/shopifyCart";
import styles from "./styles.module.css";

const homeNavItems = [
  { name: "Services", href: "#services" },
  { name: "Products", href: "#products" },
  { name: "Reviews", href: "#reviews" },
  { name: "FAQ", href: "#faq" }
];

const siteNavItems = [
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Read", href: "/read" },
];

const collections = [
  { name: "Latest", href: "/shop/new" },
  { name: "Best Sellers", href: "/shop/best-sellers" },
  { name: "Artisan Barber", href: "/shop/artisan-barber" },
  { name: "Blind Barber", href: "/shop/blind-barber" },
  { name: "Firsthand", href: "/shop/firsthand" },
  { name: "Malin + Goetz", href: "/shop/malin-goetz" },
  // { name: "Duke and Hyde", href: "/shop/duke-hyde" },
  { name: "All", href: "/shop" },
];

const aboutLinks = [
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/about/gallery" },
];

const readLinks = [
  { name: "Read", href: "/read" },
  { name: "Team", href: "/team" },
];

const mobileSiteLinks = [
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/about/gallery" },
  { name: "Read", href: "/read" },
  { name: "Team", href: "/team" },
];

function formatMoney(money?: CartMoney) {
  if (!money) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

const Navigation = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const navItems = isHomePage ? homeNavItems : siteNavItems;
  const cartContext = useOptionalCart();
  const {
    cart,
    totalQuantity,
    isOpen,
    isLoading,
    error,
    removeItem,
    toggleCart,
    closeCart,
  } = cartContext ?? {
    cart: null,
    totalQuantity: 0,
    isOpen: false,
    isLoading: false,
    error: null,
    removeItem: async () => {},
    toggleCart: () => {},
    closeCart: () => {},
  };

  const mobileLinks = isHomePage
    ? [...homeNavItems, ...mobileSiteLinks]
    : mobileSiteLinks;

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <svg
              id="b"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 701.99 332.2"
            >
              <g id="c">
                <path d="m88.4,311.6l12.4,7.6-21.2,13-21.2-13,1-214.2-13.6,8.6-14.8-9-1,207,12.4,7.6-21.2,13-21.2-13L1,20.8,45.8,0l43.6,26.6-1,285ZM59.4,34.2L31,13.8v82.6l14.8-9,13.6,8.6v-61.8Z" />
                <path d="m164.8,319.2l1-218.6-28.4-11.6-1,222.6,12.4,7.6-21.2,13-21.2-13,1-285.4-12.4-7.6,21.2-13.2,6.8,4.2L151.8,0l44,20.4v35.2l-28.8,16.4,28.8,11-1,228.6,12.4,7.6-21.2,13-21.2-13Zm1-252.4V12.8l-28.4,13.6v56.8l28.4-16.4Z" />
                <path d="m248,31l16-11.4-61.4,10.4L215.6,0h108l-12.8,30-32.8-7.4-1,289,12.6,7.6-21.2,13-21.4-13,1-288.2Z" />
                <path d="m323.79,13l21.2-13,21.2,12.8-1,298.8,12.4,7.6-21.2,13-21.2-13,1-298.6-12.4-7.6Z" />
                <path d="m384.99,310.8l1-218.8h30l-1,197.6,35.6,25.8,1-218-65.6-40.4V24L437.39,0l38.8,13.6v39.4h-30v-22.8l-30.2-14.2v48.2l65.6,39.8-1,204.2-51.4,24-44.2-21.4Z" />
                <path d="m582.99,311.6l12.4,7.6-21.2,13-21.2-13,1-214.2-13.6,8.6-14.8-9-1,207,12.4,7.6-21.2,13-21.2-13,1-298.4L540.39,0l43.6,26.6-1,285Zm-29-277.4l-28.4-20.4v82.6l14.8-9,13.6,8.6v-61.8Z" />
                <path d="m589.79,26l21.2-13,6.4,3.8,28.4-16.8,44.8,20.8-1,290.8,12.4,7.6-21.2,13-21.2-13,1-306.8-28.4,13.6-1,285.6,12.4,7.6-21.2,13-21.2-13,1-285.6-12.4-7.6Z" />
                <polygon points="45.61 113.35 24.61 100.35 45.64 86.92 66.61 100.35 45.61 113.35" />
              </g>
            </svg>
          </Link>
        </div>
      </div>

      <div className={styles.links}>
        {isHomePage ? (
          navItems.map((item) => (
            <div key={item.href} className={styles.menuItem}>
              <Link href={item.href}>{item.name}</Link>
            </div>
          ))
        ) : (
          <>
            <div
              className={styles.menuItem}
              onMouseEnter={() => setOpenMenu("shop")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link href="/shop">Shop</Link>
              {openMenu === "shop" && (
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
              onMouseEnter={() => setOpenMenu("about")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link href="/about">About</Link>
              {openMenu === "about" && (
                <div className={styles.dropdownMenu}>
                  {aboutLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.dropdownLink}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className={styles.menuItem}
              onMouseEnter={() => setOpenMenu("read")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link href="/read">Read</Link>
              {openMenu === "read" && (
                <div className={styles.dropdownMenu}>
                  {readLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.dropdownLink}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {/* <div className={styles.marqueeWrapper}>
          <Marquee />
        </div> */}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.mobileMenuButton}`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className={styles.hamburgerIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <div className={styles.cartAction}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Shopping cart, ${totalQuantity} item${
              totalQuantity === 1 ? "" : "s"
            }`}
            aria-expanded={isOpen}
            onClick={toggleCart}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 1-.8L21 7H7" />
            </svg>
            <AnimatePresence>
              {totalQuantity > 0 && (
                <motion.span
                  key={totalQuantity}
                  className={styles.cartBadge}
                  initial={{ scale: 0.65, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.65, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 520, damping: 22 }}
                >
                  {totalQuantity}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={styles.cartDropdown}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className={styles.cartHeader}>
                  <h2>Cart</h2>
                  <button
                    type="button"
                    className={styles.cartClose}
                    onClick={closeCart}
                    aria-label="Close cart"
                  >
                    &times;
                  </button>
                </div>

                {error && <p className={styles.cartError}>{error}</p>}
                {isLoading && <p className={styles.cartLoading}>Updating cart...</p>}

                {cart && cart.lines.length > 0 ? (
                  <>
                    <ul className={styles.cartLines}>
                      {cart.lines.map((line) => (
                        <li key={line.id} className={styles.cartLine}>
                          <Link
                            href={`/products/${line.productHandle}`}
                            className={styles.cartLineImage}
                            onClick={closeCart}
                          >
                            {line.image ? (
                              <Image
                                src={line.image.url}
                                alt={line.image.altText || line.productTitle}
                                fill
                                sizes="64px"
                                className={styles.cartImage}
                              />
                            ) : (
                              <span>No image</span>
                            )}
                          </Link>

                          <div className={styles.cartLineInfo}>
                            <Link
                              href={`/products/${line.productHandle}`}
                              onClick={closeCart}
                              className={styles.cartLineTitle}
                            >
                              {line.productTitle}
                            </Link>
                            {line.variantTitle !== "Default Title" && (
                              <p className={styles.cartLineVariant}>
                                {line.variantTitle}
                              </p>
                            )}
                            <p className={styles.cartLineMeta}>
                              Qty {line.quantity} / {formatMoney(line.totalAmount)}
                            </p>
                            <button
                              type="button"
                              className={styles.cartRemove}
                              onClick={() => removeItem(line.id)}
                              disabled={isLoading}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.cartFooter}>
                      <div className={styles.cartSubtotal}>
                        <span>Subtotal</span>
                        <strong>{formatMoney(cart.subtotal)}</strong>
                      </div>
                      <Link
                        href={cart.checkoutUrl}
                        className={styles.checkoutButton}
                        onClick={closeCart}
                      >
                        Checkout
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className={styles.cartEmpty}>
                    <p>Your cart is empty.</p>
                    <Link href="/shop" onClick={closeCart}>
                      Shop products
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileMenuLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
