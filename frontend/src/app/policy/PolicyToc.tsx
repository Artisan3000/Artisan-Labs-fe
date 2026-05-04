"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type TocItem = {
  href: string;
  label: string;
};

type TocPosition = {
  active: boolean;
  left: number;
  width: number;
  height: number;
};

const STICKY_TOP = 84;

export default function PolicyToc({ items }: { items: TocItem[] }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<TocPosition>({
    active: false,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function updatePosition() {
      const slot = slotRef.current;

      if (!slot || window.innerWidth <= 800) {
        setPosition((current) => ({ ...current, active: false }));
        return;
      }

      const rect = slot.getBoundingClientRect();
      const pageTop = rect.top + window.scrollY;
      const shouldStick = window.scrollY >= pageTop - STICKY_TOP;

      setPosition({
        active: shouldStick,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }

    updatePosition();

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <div
      ref={slotRef}
      className={styles.tocSlot}
      style={position.active ? { minHeight: position.height } : undefined}
    >
      <nav
        className={`${styles.toc} ${position.active ? styles.tocFixed : ""}`}
        style={
          position.active
            ? {
                left: position.left,
                top: STICKY_TOP,
                width: position.width,
              }
            : undefined
        }
        aria-label="Policy table of contents"
      >
        <h2>Table of Contents</h2>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
