"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const imageReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const locations = [
  {
    title: "Current Location",
    address: "331 E 81st. Street, New York, NY 10028",
    image: "/ues-space.jpg",
    imageAlt: "Artisan Barber Upper East Side shop interior",
    imagePosition: "center",
    body: "Today’s location is a refined evolution: a fully operational Apothecary, Haberdashery, and Gentleman’s Salon nestled in a sophisticated stretch of the Upper East Side. This space blends old-world elegance with modern edge - offering signature cuts, straight razor shaves, exclusive grooming products, and curated men’s accessories. The music is smooth, the barbers are seasoned, and the atmosphere is immersive - making this more than just a barbershop. It’s a lifestyle destination for the modern gentleman.",
  },
  {
    title: "Second Location",
    address: "254 Broome Street, New York, NY 10003",
    image: "/les-space.jpg",
    imageAlt: "Barber working with a client inside the Lower East Side shop",
    imagePosition: "center",
    body: "In the heart of the Lower East Side, Artisan Barber’s second location took things to the next level - literally. Set in a duplex-style space, it doubled as an art gallery and culture lounge, hosting events, photo shoots, and brand collaborations. The shop also sold vintage apparel alongside grooming essentials, giving clients a unique blend of style, substance, and self-expression. With an ever-rotating playlist and a team of versatile, creative barbers, this location became a staple for downtown tastemakers.",
  },
  {
    title: "First Location",
    address: "1728 2nd Avenue, New York, NY 10128",
    image: "/les-space-02.jpg",
    imageAlt: "Black and white photograph of a barber cutting hair",
    imagePosition: "center",
    body: "Artisan Barber’s first home was a sleek, intimate 3-chair shop on Manhattan’s Upper East Side. Designed with a signature Slide-Away Glass façade, it invited the energy of the city right into the shop. Inside, clients were met with classic barber chairs, clean modern lines, and a curated soundtrack that kept the vibe sharp. This was where the vision was born - combining craft barbering, great music, and elite grooming products in one cool neighborhood hub.",
  },
];

type FormStatus = "idle" | "sending" | "success" | "error";

function VisitImage({
  src,
  alt,
  priority = false,
  imagePosition = "center",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  imagePosition?: string;
}) {
  return (
    <motion.figure
      className={styles.imageFrame}
      variants={imageReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={styles.imageInner}
        whileHover={{ scale: 1.018 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 900px) 100vw, 46vw"
          className={styles.locationImage}
          style={{ objectPosition: imagePosition }}
        />
      </motion.div>
    </motion.figure>
  );
}

export default function VisitPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormStatus("sending");
    setFormMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Message failed to send.");
      }

      form.reset();
      setFormStatus("success");
      setFormMessage("Thanks. Your message has been sent.");
    } catch (error) {
      setFormStatus("error");
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Message failed to send. Please try again."
      );
    }
  }

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <motion.h1
          className={styles.header}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          Where we&apos;ve been
        </motion.h1>
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

        <section className={styles.locations}>
          {locations.map((location, index) => (
            <article key={location.title} className={styles.locationStory}>
              <motion.div
                className={styles.locationCopy}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.65,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h2>{location.title}</h2>
                <p className={styles.location}>{location.address}</p>
                <p>{location.body}</p>
              </motion.div>

              <VisitImage
                src={location.image}
                alt={location.imageAlt}
                priority={index === 0}
                imagePosition={location.imagePosition}
              />
            </article>
          ))}
        </section>

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
        </section>

        <section className={styles.contactSection}>
          <div className={styles.contactCopy}>
            <h2>Get in touch</h2>
            <p>
              Questions about appointments, products, events, or the shop?
              Send a note and the Artisan Barber team will follow up.
            </p>
          </div>

          <form className={styles.contactForm} onSubmit={handleContactSubmit}>
            <label className={styles.hiddenField}>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>

            <div className={styles.formRow}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </label>
            </div>

            <div className={styles.formRow}>
              <label>
                Phone
                <input type="tel" name="phone" autoComplete="tel" />
              </label>
              <label>
                Subject
                <select name="subject" defaultValue="General inquiry">
                  <option>General inquiry</option>
                  <option>Appointment question</option>
                  <option>Product question</option>
                  <option>Events and partnerships</option>
                </select>
              </label>
            </div>

            <label>
              Message
              <textarea name="message" rows={7} required />
            </label>

            <div className={styles.formActions}>
              <button type="submit" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Sending..." : "Send message"}
              </button>
              {formMessage && (
                <p
                  className={
                    formStatus === "success"
                      ? styles.formSuccess
                      : styles.formError
                  }
                  role="status"
                >
                  {formMessage}
                </p>
              )}
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
