"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./styles.module.css";

const facts = [
  {
    title: "Master Barbers",
    description: "Trained, experienced, precise.",
    icon: "/oval.svg",
  },
  {
    title: "Manhattan Born",
    description: "Rooted in the community since day one.",
    icon: "/diamond.svg",
  },
  {
    title: "5-Star Rated",
    description: "Hundreds of happy clients.",
    icon: "/combo.svg",
  },
];

export default function HomeFacts() {
  return (
    <motion.section
      className={styles.facts}
      aria-label="Artisan Barber highlights"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.14,
          },
        },
      }}
    >
      <div className={styles.inner}>
        {facts.map((fact) => (
          <motion.article
            key={fact.title}
            className={styles.fact}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: "easeOut" },
              },
            }}
          >
            <div className={styles.iconWrap} aria-hidden="true">
              <Image
                src={fact.icon}
                alt=""
                width={48}
                height={48}
                className={styles.icon}
              />
            </div>
            <div className={styles.copy}>
              <h2>{fact.title}</h2>
              <p>{fact.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
