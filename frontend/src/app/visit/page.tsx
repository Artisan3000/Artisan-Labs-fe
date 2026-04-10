"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Accordion } from "@/components/Accordion";

export default function VisitPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <h1 className={styles.header}>Where we've been</h1>
        <div className={styles.stats}>
          <div>
            <h3>2017</h3>
            <p>Established</p>
          </div>
          <div>
            <h3>5000+</h3>
            <p>Clients</p>
          </div>
          <div>
            <h3>3</h3>
            <p>Locations</p>
          </div>
        </div>

        <section className={styles.section}>
          <div>
            <h2>Current Location</h2>
            <p className={styles.location}>
              331 E 81st. Street, New York, NY 10028
            </p>
            <p>
              Today’s location is a refined evolution: a fully operational
              Apothecary, Haberdashery, and Gentleman’s Salon nestled in a
              sophisticated stretch of the Upper East Side. This space blends
              old-world elegance with modern edge - offering signature cuts,
              straight razor shaves, exclusive grooming products, and curated
              men’s accessories. The music is smooth, the barbers are seasoned,
              and the atmosphere is immersive - making this more than just a
              barbershop. It’s a lifestyle destination for the modern gentleman.
            </p>
          </div>

            <div>
              <h2>Second Location</h2>
              <p className={styles.location}>
                254 Broome Street, New York, NY 10003
              </p>
              <p>
                In the heart of the Lower East Side, Artisan Barber’s second
                location took things to the next level - literally. Set in a
                duplex-style space, it doubled as an art gallery and culture
                lounge, hosting events, photo shoots, and brand collaborations.
                The shop also sold vintage apparel alongside grooming
                essentials, giving clients a unique blend of style, substance,
                and self-expression. With an ever-rotating playlist and a team
                of versatile, creative barbers, this location became a staple
                for downtown tastemakers.
              </p>
            </div>
    
          <div>
            <h2>First Location</h2>
            <p className={styles.location}>
              1728 2nd Avenue, New York, NY 10128
            </p>
            <p>
              Artisan Barber’s first home was a sleek, intimate 3-chair shop on
              Manhattan’s Upper East Side. Designed with a signature Slide-Away
              Glass façade, it invited the energy of the city right into the
              shop. Inside, clients were met with classic barber chairs, clean
              modern lines, and a curated soundtrack that kept the vibe sharp.
              This was where the vision was born - combining craft barbering,
              great music, and elite grooming products in one cool neighborhood
              hub.
            </p>
          </div>
        </section>
        <br />
        <br />
        <section className={styles.section}>
          <h2>Hours</h2>
          <div className={styles.hours}>
            <p className={styles.day}>
              Monday: <span>11am - 7pm</span>
            </p>
            <p className={styles.day}>
              Tuesday: <span>11am - 7pm</span>
            </p>
            <p className={styles.day}>
              Wednesday: <span>11am - 7pm</span>
            </p>
            <p className={styles.day}>
              Thursday: <span>11am - 7pm</span>
            </p>
            <p className={styles.day}>
              Friday: <span>11am - 7pm</span>
            </p>
            <p className={styles.day}>Closed on Saturdays</p>
            <p className={styles.day}>
              Sunday: <span>Appointment only</span>
            </p>
          </div>
          <h2>Find us on the map</h2>
        </section>
      </main>
      <Footer />
    </>
  );
}
