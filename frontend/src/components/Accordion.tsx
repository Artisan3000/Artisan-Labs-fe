"use client";
import {
  useState,
  ReactNode,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { motion } from "framer-motion";
import styles from "./Accordion.module.css";

/* ------------------ ROOT ------------------ */

export function Accordion({ children }: { children: ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}

/* ------------------ ITEM ------------------ */

type AccordionItemProps = {
  value: string;
  children: ReactNode;
  defaultOpen?: boolean; // 👈 new
};

export function AccordionItem({
  value,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const childArray = Children.toArray(children);

  return (
    <div className={styles.item} data-value={value}>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        if (index === 0) {
          return cloneElement(
            child as React.ReactElement<AccordionTriggerProps>,
            {
              open,
              onToggle: () => setOpen((prev) => !prev),
            },
          );
        }

        if (index === 1) {
          return cloneElement(
            child as React.ReactElement<AccordionContentProps>,
            { open },
          );
        }

        return child;
      })}
    </div>
  );
}

/* ------------------ TRIGGER ------------------ */

type AccordionTriggerProps = {
  children: ReactNode;
  open?: boolean;
  onToggle?: () => void;
};

export function AccordionTrigger({
  children,
  open,
  onToggle,
}: AccordionTriggerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={styles.trigger}
      aria-expanded={open}
    >
      {children}
      <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}>
        ▼
      </span>
    </button>
  );
}

/* ------------------ CONTENT ------------------ */

type AccordionContentProps = {
  children: ReactNode;
  open?: boolean;
};

export function AccordionContent({ children, open }: AccordionContentProps) {
  return (
    <motion.div
      className={styles.content}
      initial={false}
      animate={{
        height: open ? "auto" : 0,
        opacity: open ? 1 : 0,
      }}
      transition={{
        height: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: open ? 0.22 : 0.16, ease: "easeOut" },
      }}
      aria-hidden={!open}
    >
      <div className={styles.contentInner}>{children}</div>
    </motion.div>
  );
}
