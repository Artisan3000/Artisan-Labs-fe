"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type RevealKind = "image" | "record" | "caption";

type FoundationRevealProps = {
  as?: "article" | "div";
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  kind?: RevealKind;
  ready?: boolean;
  threshold?: number;
};

const editorialEase = [0.22, 1, 0.36, 1] as const;
const subscribeToHydration = () => () => {};

export default function FoundationReveal({
  as = "div",
  children,
  className,
  delay = 0,
  id,
  kind = "record",
  ready = true,
  threshold = 0.2,
}: FoundationRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const enhanced = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );
  const [failureSafe, setFailureSafe] = useState(false);
  const [hasCrossedTrigger, setHasCrossedTrigger] = useState(false);
  const isInView = useInView(ref, {
    amount: threshold,
    margin: "0px 0px -10% 0px",
    once: true,
  });

  const hasEntered = isInView || hasCrossedTrigger;
  const motionEnabled = enhanced && !prefersReducedMotion;
  const imageCanReveal = ready || failureSafe;
  const shouldConceal =
    motionEnabled && (!hasEntered || (kind === "image" && !imageCanReveal));
  const state = shouldConceal ? "concealed" : "visible";
  const duration = kind === "image" ? 0.9 : kind === "record" ? 0.68 : 0.48;

  useEffect(() => {
    if (!enhanced || hasCrossedTrigger) return;

    let frame = 0;
    const checkPosition = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const top = ref.current?.getBoundingClientRect().top;
        if (top !== undefined && top <= window.innerHeight * 0.9) {
          setHasCrossedTrigger(true);
        }
      });
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, [enhanced, hasCrossedTrigger]);

  useEffect(() => {
    if (
      kind !== "image" ||
      !enhanced ||
      prefersReducedMotion ||
      !hasEntered ||
      ready
    ) {
      return;
    }

    const timeout = window.setTimeout(() => setFailureSafe(true), 3000);
    return () => window.clearTimeout(timeout);
  }, [enhanced, hasEntered, kind, prefersReducedMotion, ready]);

  const outerVariants = {
    concealed:
      kind === "image"
        ? { clipPath: "inset(0 0 100% 0)", opacity: 1, y: 0 }
        : { clipPath: "inset(0 0 0% 0)", opacity: 0, y: 10 },
    visible: { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0 },
  };

  const innerVariants = {
    concealed: { y: kind === "image" ? 16 : 0 },
    visible: { y: 0 },
  };

  const MotionElement = as === "article" ? motion.article : motion.div;

  return (
    <MotionElement
      ref={ref}
      id={id}
      className={className}
      initial="visible"
      animate={state}
      variants={outerVariants}
      transition={{ duration, delay, ease: editorialEase }}
    >
      {kind === "record" ? (
        children
      ) : (
        <motion.div
          variants={innerVariants}
          transition={{ duration, delay, ease: editorialEase }}
        >
          {children}
        </motion.div>
      )}
    </MotionElement>
  );
}
