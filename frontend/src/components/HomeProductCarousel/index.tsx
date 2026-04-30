"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import homeStyles from "@/app/page.module.css";

type HomeProduct = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  price: {
    amount: string;
    currencyCode: string;
  } | null;
  variant: {
    id: string;
    availableForSale: boolean;
  } | null;
};

type Props = {
  products: HomeProduct[];
};

const brands = [
  {
    name: "Artisan Barber",
    src: "/brands/artisan-blk-short.svg",
    href: "/shop/artisan",
    width: 110,
    height: 42,
  },
  {
    name: "Blind Barber",
    src: "/brands/blind-barber@2x.png",
    href: "/shop/blind-barber",
    width: 124,
    height: 38,
  },
  {
    name: "Firsthand",
    src: "/brands/firsthand@2x.png",
    href: "/shop/firsthand",
    width: 122,
    height: 32,
  },
  {
    name: "Malin+Goetz",
    src: "/brands/malin-goetz@2x.png",
    href: "/shop/malin-goetz",
    width: 136,
    height: 30,
  },
];

const controlsStyle = {
  display: "flex",
  gap: "0.75rem",
  alignItems: "center",
  width: "100%",
  justifyContent: "space-between",
  marginTop: "2rem",
  marginBottom: "1rem",
  flexWrap: "wrap" as const,
};

const buttonsStyle = {
  display: "flex",
  gap: "0.75rem",
};

const buttonStyle = {
  border: "1px solid #111",
  background: "transparent",
  color: "var(--black)",
  width: "3rem",
  height: "3rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  font: "inherit",
  cursor: "pointer",
};

const brandsViewportStyle = {
  overflow: "hidden",
  width: "100%",
  marginTop: "1.5rem",
  marginBottom: "1.25rem",
  paddingBlock: "0.75rem",
  borderTop: "1px solid rgba(17, 17, 17, 0.14)",
  borderBottom: "1px solid rgba(17, 17, 17, 0.14)",
};

const brandsTrackStyle = {
  display: "flex",
  alignItems: "center",
  gap: "2.5rem",
  width: "max-content",
  willChange: "transform",
};

const brandItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 auto",
  minWidth: "120px",
  opacity: 0.72,
};

const brandLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const brandImageStyle = {
  width: "auto",
  height: "24px",
  maxWidth: "140px",
  objectFit: "contain" as const,
};

const viewportStyle = {
  overflow: "hidden",
  width: "100%",
  paddingBottom: "0.75rem",
};

const trackStyle = {
  display: "flex",
  gap: "1.25rem",
  width: "max-content",
  willChange: "transform",
};

const cardStyle = {
  flex: "0 0 min(76vw, 280px)",
  minHeight: "unset",
};

const imageWrapStyle = {
  position: "relative" as const,
  width: "100%",
  aspectRatio: "4 / 5",
  marginBottom: "1.25rem",
  overflow: "hidden",
  background: "#f3efe5",
};

const imageStyle = {
  objectFit: "cover" as const,
};

const vendorStyle = {
  marginTop: "0.5rem",
};

const addToCartStyle = {
  marginTop: "0.75rem",
};

const emptyImageStyle = {
  ...imageWrapStyle,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(17, 17, 17, 0.12)",
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  const isRight = direction === "right";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={isRight ? "M5 12h14" : "M19 12H5"} />
      <path d={isRight ? "m13 6 6 6-6 6" : "m11 6-6 6 6 6"} />
    </svg>
  );
}

export default function HomeProductCarousel({ products }: Props) {
  const brandsTrackRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const brandsAutoScrollRef = useRef<number | null>(null);
  const autoScrollRef = useRef<number | null>(null);
  const brandsOffsetRef = useRef(0);
  const offsetRef = useRef(0);

  const carouselBrands = [...brands, ...brands];
  const carouselProducts =
    products.length > 1 ? [...products, ...products] : products;

  useEffect(() => {
    const track = brandsTrackRef.current;

    if (!track || brands.length <= 1) return;

    const applyOffset = () => {
      if (!brandsTrackRef.current) return;
      brandsTrackRef.current.style.transform = `translate3d(-${brandsOffsetRef.current}px, 0, 0)`;
    };

    const step = () => {
      const activeTrack = brandsTrackRef.current;

      if (!activeTrack) return;

      const resetPoint = activeTrack.scrollWidth / 2;

      if (!isPausedRef.current) {
        brandsOffsetRef.current += 0.35;

        if (brandsOffsetRef.current >= resetPoint) {
          brandsOffsetRef.current = 0;
        }

        applyOffset();
      }

      brandsAutoScrollRef.current = window.requestAnimationFrame(step);
    };

    brandsOffsetRef.current = 0;
    applyOffset();
    brandsAutoScrollRef.current = window.requestAnimationFrame(step);

    return () => {
      if (brandsAutoScrollRef.current !== null) {
        window.cancelAnimationFrame(brandsAutoScrollRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track || products.length <= 1) return;

    const applyOffset = () => {
      if (!trackRef.current) return;
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    };

    const step = () => {
      const activeTrack = trackRef.current;

      if (!activeTrack) return;

      const resetPoint = activeTrack.scrollWidth / 2;

      if (!isPausedRef.current) {
        offsetRef.current += 0.45;

        if (offsetRef.current >= resetPoint) {
          offsetRef.current = 0;
        }

        applyOffset();
      }

      autoScrollRef.current = window.requestAnimationFrame(step);
    };

    offsetRef.current = 0;
    applyOffset();
    autoScrollRef.current = window.requestAnimationFrame(step);

    return () => {
      if (brandsAutoScrollRef.current !== null) {
        window.cancelAnimationFrame(brandsAutoScrollRef.current);
      }
      if (autoScrollRef.current !== null) {
        window.cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [products]);

  if (!products.length) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;

    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>("[data-product-card]");
    const cardWidth = firstCard?.offsetWidth ?? 280;
    const gap = 20;
    const resetPoint = track.scrollWidth / 2;

    offsetRef.current += direction * (cardWidth + gap);

    if (offsetRef.current < 0) {
      offsetRef.current = Math.max(resetPoint + offsetRef.current, 0);
    }

    if (offsetRef.current >= resetPoint) {
      offsetRef.current -= resetPoint;
    }

    track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
  };

  return (
    <>
      <div style={brandsViewportStyle} aria-label="Brands carried in shop">
        <div ref={brandsTrackRef} style={brandsTrackStyle}>
          {carouselBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              style={brandItemStyle}
              aria-hidden={index >= brands.length}
            >
              <Link
                href={brand.href}
                style={brandLinkStyle}
                tabIndex={index >= brands.length ? -1 : 0}
                aria-label={`Shop ${brand.name}`}
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={brand.width}
                  height={brand.height}
                  style={brandImageStyle}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={controlsStyle}>
        {products.length > 1 && (
          <div style={buttonsStyle}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll products backward"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => scrollByCard(1)}
              aria-label="Scroll products forward"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        )}
      </div>

      <div
        style={viewportStyle}
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
        onFocus={() => {
          isPausedRef.current = true;
        }}
        onBlur={() => {
          isPausedRef.current = false;
        }}
        onTouchStart={() => {
          isPausedRef.current = true;
        }}
        onTouchEnd={() => {
          isPausedRef.current = false;
        }}
      >
        <div ref={trackRef} style={trackStyle} aria-label="Featured products">
          {carouselProducts.map((product, index) => {
            const isDuplicate = products.length > 1 && index >= products.length;
            const formattedPrice = product.price
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: product.price.currencyCode,
                }).format(parseFloat(product.price.amount))
              : null;

            return (
              <article
                key={`${product.id}-${index}`}
                className={homeStyles.productCard}
                style={cardStyle}
                data-product-card
                aria-hidden={isDuplicate}
              >
                <Link
                  href={`/products/${product.handle}`}
                  tabIndex={isDuplicate ? -1 : 0}
                >
                  {product.image ? (
                    <div style={imageWrapStyle}>
                      <Image
                        src={product.image.url}
                        alt={product.image.altText || product.title}
                        fill
                        sizes="(max-width: 768px) 76vw, 280px"
                        style={imageStyle}
                      />
                    </div>
                  ) : (
                    <div style={emptyImageStyle}>
                      <p className={homeStyles.serviceDescription}>
                        Product image coming soon.
                      </p>
                    </div>
                  )}

                  <div className={homeStyles.productHeader}>
                    <p className={homeStyles.productDescription} style={vendorStyle}>
                      {product.vendor || "Artisan Barber"}
                    </p>
                    <h3 className={homeStyles.productTitle}>{product.title}</h3>
                  </div>

                  <div>
                    {formattedPrice && (
                      <p className={homeStyles.productPrice}>{formattedPrice}</p>
                    )}
                  </div>
                </Link>

                {product.variant && (
                  <div style={addToCartStyle}>
                    <AddToCartButton
                      variantId={product.variant.id}
                      disabled={!product.variant.availableForSale}
                      tabIndex={isDuplicate ? -1 : 0}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
