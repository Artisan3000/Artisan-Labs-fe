"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Hero.module.css";

export default function HomeHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVideoLoaded(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className={styles.hero}>
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
          <h1 className={styles.fadeUp}>150+ Years of Combined Craft</h1>
          <p className={styles.float}>
            Our barbers bring generations of skill and tradition to every cut.
            Book your appointment or shop our curated goods.
          </p>
        </div>
      </div>
    </section>
  );
}
