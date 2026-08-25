"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FoundationReveal from "./FoundationReveal";

type FoundationImageRevealProps = {
  alt: string;
  caption?: string;
  className: string;
  delay?: number;
  height: number;
  priority?: boolean;
  sizes: string;
  src: string;
  threshold?: number;
  width: number;
};

export default function FoundationImageReveal({
  alt,
  caption,
  className,
  delay,
  height,
  priority = false,
  sizes,
  src,
  threshold = 0.08,
  width,
}: FoundationImageRevealProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (imageRef.current?.complete) setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const image = (
    <Image
      ref={imageRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      onLoad={() => setReady(true)}
      onError={() => setReady(true)}
    />
  );

  return (
    <FoundationReveal
      className={className}
      kind="image"
      delay={delay}
      ready={ready}
      threshold={threshold}
    >
      {caption ? (
        <figure>
          {image}
          <figcaption>{caption}</figcaption>
        </figure>
      ) : (
        image
      )}
    </FoundationReveal>
  );
}
