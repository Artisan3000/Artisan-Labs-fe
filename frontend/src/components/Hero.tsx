"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";
import { openSquireBooking } from "@/lib/squire";

export default function HomeHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVideoLoaded(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="home-hero" className={styles.hero}>
      <div className={styles.heroContainer}>
        {/* Placeholder Image */}
        <img
          src="/hero-placeholder.png"
          alt="Artisan Barber"
          className={`${styles.placeholderImage} ${
            videoLoaded ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Video Layer */}
        <video
          key="hero-video"
          className={`${styles.videoLayer} ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-placeholder.png"
          onCanPlay={() => setVideoLoaded(true)}
          onError={(e) => console.error("Video load error:", e)}
        />

        {/* Overlay Text */}
        <div className={styles.overlayText}>
          <h1 className={styles.fadeUp}>Your signature look begins at Artisan.</h1>
          <p className={styles.float}>
            Manhattan&apos;s go-to barbershop for scissor cuts, clean fades, and precision styling.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/visit/gallery" className={styles.secondaryButton}>
              See our work
            </Link>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => openSquireBooking()}
            >
              Make Your Appointment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
