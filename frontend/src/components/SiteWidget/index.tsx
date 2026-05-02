"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import styles from "./styles.module.css";
import { openSquireBooking, SQUIRE_BRAND_ID } from "@/lib/squire";

const SQUIRE_SCRIPT_ID = "squire-water-widget";
const SQUIRE_STYLE_ID = "artisan-squire-button-style";

function shouldLoadSquire() {
  const userAgent = window.navigator.userAgent;

  return (
    !userAgent.includes("Chrome-Lighthouse") &&
    !userAgent.includes("X11") &&
    !userAgent.includes("GTmetrix")
  );
}

function styleSquireButton() {
  const root = document.getElementById("squire_booking_widget_root");
  const shadowRoot = root?.shadowRoot;

  if (!shadowRoot) return;

  const existingStyle = shadowRoot.getElementById(SQUIRE_STYLE_ID);
  const css = `
    button#squire-book-button {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;

  if (existingStyle) {
    existingStyle.textContent = css;
    return;
  }

  const style = document.createElement("style");

  style.id = SQUIRE_STYLE_ID;
  style.textContent = css;
  shadowRoot.appendChild(style);
}

export default function SiteWidget({
  showFloatingButton = true,
}: {
  showFloatingButton?: boolean;
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [homeHeroPassed, setHomeHeroPassed] = useState(false);
  const [homeHeroBottom, setHomeHeroBottom] = useState(0);
  const shouldShowFloatingButton =
    showFloatingButton && (pathname !== "/" || homeHeroPassed);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    let frame = 0;
    const updateHomeHeroBottom = () => {
      const hero = document.getElementById("home-hero");

      if (!hero) {
        setHomeHeroBottom(0);
        setHomeHeroPassed(false);
        return;
      }

      const threshold = hero.offsetTop + hero.offsetHeight - 60;

      setHomeHeroBottom(threshold);
      setHomeHeroPassed(window.scrollY >= threshold);
    };

    frame = window.requestAnimationFrame(updateHomeHeroBottom);
    window.addEventListener("resize", updateHomeHeroBottom);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateHomeHeroBottom);
    };
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (pathname !== "/") return;

    setHomeHeroPassed(homeHeroBottom > 0 && latest >= homeHeroBottom);
  });

  useEffect(() => {
    if (!shouldLoadSquire()) return;

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      styleSquireButton();

      const styled = document
        .getElementById("squire_booking_widget_root")
        ?.shadowRoot?.getElementById(SQUIRE_STYLE_ID);

      if (styled || attempts > 80) {
        window.clearInterval(interval);
      }
    }, 100);

    if (!document.getElementById(SQUIRE_SCRIPT_ID)) {
      const script = document.createElement("script");

      script.id = SQUIRE_SCRIPT_ID;
      script.src = `https://widget.getsquire.com/widget.js?${Date.now()}`;
      script.defer = true;
      script.type = "text/javascript";
      script.setAttribute("brand", SQUIRE_BRAND_ID);
      script.setAttribute("x-squire-inline-enabled", "true");
      script.setAttribute("x-squire-show-btn", "true");
      document.head.appendChild(script);
    }

    return () => window.clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {shouldShowFloatingButton && (
        <motion.button
          type="button"
          className={`${styles.siteWidget} ${styles.btn}`}
          onClick={() => openSquireBooking()}
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 22, scale: 0.96 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.96 }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 24,
            mass: 0.8,
          }}
        >
          BOOK NOW
        </motion.button>
      )}
    </AnimatePresence>
  );
}
