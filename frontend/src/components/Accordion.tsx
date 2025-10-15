"use client";
import { useState } from "react";
import styles from "./Accordion.module.css";

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}

export function AccordionItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.item}>
      {Array.isArray(children)
        ? children.map((child: any) => {
            if (child.type.displayName === "AccordionTrigger") {
              return {
                ...child,
                props: { ...child.props, open, onToggle: () => setOpen(!open) },
              };
            }
            if (child.type.displayName === "AccordionContent") {
              return {
                ...child,
                props: { ...child.props, open },
              };
            }
            return child;
          })
        : children}
    </div>
  );
}

export function AccordionTrigger({
  children,
  open,
  onToggle,
}: {
  children: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button onClick={onToggle} className={styles.trigger}>
      {children}
      <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}>▼</span>
    </button>
  );
}
AccordionTrigger.displayName = "AccordionTrigger";

export function AccordionContent({
  children,
  open,
}: {
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <div className={`${styles.content} ${open ? styles.contentOpen : ""}`}>
      {children}
    </div>
  );
}
AccordionContent.displayName = "AccordionContent";
