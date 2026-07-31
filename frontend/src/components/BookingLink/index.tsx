"use client";

import { openSquireBooking } from "@/lib/squire";

export default function BookingLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openSquireBooking()}
    >
      {children}
    </button>
  );
}
