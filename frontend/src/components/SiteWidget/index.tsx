"use client";

import { useEffect } from "react";

export const SQUIRE_BRAND_ID = "91bdb09d-3ec5-4fc6-b8a1-012648984e77";
const SQUIRE_SCRIPT_ID = "squire-water-widget";
const SQUIRE_STYLE_ID = "artisan-squire-button-style";

type SquireSetup = {
  brand: string;
  shop?: string | null;
  barber?: string | null;
};

declare global {
  interface Window {
    SquireWidget?: {
      open: (setup?: SquireSetup) => void;
    };
  }
}

function shouldLoadSquire() {
  const userAgent = window.navigator.userAgent;

  return (
    !userAgent.includes("Chrome-Lighthouse") &&
    !userAgent.includes("X11") &&
    !userAgent.includes("GTmetrix")
  );
}

function styleSquireButton(showFloatingButton: boolean) {
  const root = document.getElementById("squire_booking_widget_root");
  const shadowRoot = root?.shadowRoot;

  if (!shadowRoot) return;

  const existingStyle = shadowRoot.getElementById(SQUIRE_STYLE_ID);
  const css = `
    button#squire-book-button {
      ${
        showFloatingButton
          ? ""
          : "display: none !important; visibility: hidden !important;"
      }
      bottom: 2.3rem !important;
      right: 2rem !important;
      width: auto !important;
      height: auto !important;
      min-width: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background-color: #e0c01d !important;
      color: #111 !important;
      padding: 0 !important;
      font-family: "Times New Roman", Times, serif !important;
      font-size: 1rem !important;
      font-weight: 500 !important;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
      transition:
        transform 0.3s ease,
        background-color 0.3s ease,
        color 0.3s ease,
        opacity 300ms linear !important;
    }

    button#squire-book-button:hover {
      transform: scale(1.1) !important;
      background-color: #111 !important;
      color: #e0c01d !important;
    }

    button#squire-book-button > span {
      position: static !important;
      display: block !important;
      width: auto !important;
      padding: 0.75rem 1.5rem !important;
      transform: none !important;
      color: inherit !important;
      font-family: inherit !important;
      font-size: inherit !important;
      line-height: 1.2 !important;
      white-space: nowrap !important;
      animation: none !important;
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
  useEffect(() => {
    if (!shouldLoadSquire()) return;

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      styleSquireButton(showFloatingButton);

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
  }, [showFloatingButton]);

  return null;
}
