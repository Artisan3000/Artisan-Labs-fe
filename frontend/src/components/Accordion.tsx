"use client";
import {
  useState,
  ReactNode,
  Children,
  isValidElement,
  cloneElement,
} from "react";
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
    <button type="button" onClick={onToggle} className={styles.trigger}>
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
    <div className={`${styles.content} ${open ? styles.contentOpen : ""}`}>
      {children}
    </div>
  );
}
