export const SQUIRE_BRAND_ID = "91bdb09d-3ec5-4fc6-b8a1-012648984e77";
export const SQUIRE_BOOKING_URL =
  "https://getsquire.com/booking/book/manhattan/barber/services";

export type SquireSetup = {
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

export function openSquireBooking(setup: SquireSetup = { brand: SQUIRE_BRAND_ID }) {
  if (typeof window === "undefined") return;

  trackEvent("booking_started", {
    booking_provider: "squire",
    shop_id: setup.shop,
    barber_id: setup.barber,
  });

  let attempts = 0;

  const tryOpen = () => {
    attempts += 1;

    if (window.SquireWidget) {
      window.SquireWidget.open(setup);
      return;
    }

    if (attempts < 30) {
      window.setTimeout(tryOpen, 100);
      return;
    }

    window.location.href = SQUIRE_BOOKING_URL;
  };

  tryOpen();
}
import { trackEvent } from "@/lib/analytics";
