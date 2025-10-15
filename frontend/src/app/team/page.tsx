"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const team = [
  {
    name: "Charlie McCoy",
    title: "Master Barber",
    exp: "Cutting since '96",
    bio: "Charlie is the founder of Artisan Barber, a NYC barbershop known for its creative energy, community focus, and precise grooming. From humble beginnings in Oklahoma to serving high-end clientele and launching a product line, Charlie's journey reflects resilience, reinvention, and a deep passion for his craft.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/3X2A0220.jpg?v=1758309940",
    link: "https://getsquire.com/booking/book/manhattan/barber/-85245/services",
  },
  {
    name: "Bobby Boas",
    title: "Master Hair Stylist",
    exp: "Cutting since '05",
    bio: "Bobby, a master stylist and manager at Artisan Barber, blends nearly two decades of precision scissor work with a love for bold, classic styles, especially skilled in cuts for curly and wavy hair. Raised in New Jersey and trained in California, he brings a unique fusion of East Coast edge and West Coast cool to every cut, crafting timeless looks with a modern twist.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/bobby.png?v=1757629513",
    link: "https://getsquire.com/booking/book/manhattan/barber/-85240/services",
  },
  {
    name: "Irma Cadiz",
    title: "Master Hair Stylist / Colorist",
    exp: "Cutting since '03",
    bio: "With over 20 years of experience, Irma is a precision stylist at Artisan Barber known for her sharp scissor work, warm personality, and passion for helping clients walk out with confidence. Originally from Rochester, NY, she brings creativity, charm, and even homemade coquito to her chair—making every appointment feel personal and unforgettable.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/irma.png?v=1757629513",
    link: "https://getsquire.com/booking/book/manhattan/barber/-85231/services",
  },
  {
    name: "Satesh C.",
    title: "Master Barber / Stylist",
    exp: "Cutting since '14",
    bio: "Satesh, a master barber from Trinidad and Tobago, is known at Artisan Barber for his expert classic cuts and flawless skin fades, blending timeless techniques with a modern touch. With a passion for clean, polished styles and a flair for communication, he ensures every client leaves feeling confident and sharp.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/satesh_fe3d5e06-3644-4efa-a0d6-95e0133419d1.png?v=1757629514",
    link: "https://getsquire.com/booking/book/manhattan/barber/-85228/services",
  },
  {
    name: "Cathy",
    title: "Kids Barber",
    exp: "Cutting since '89",
    bio: "Cathy, a Bronx native with 40 years of experience, is the heart of Artisan Barber’s kids’ cuts, known for her gentle touch and deep connection with families—many of whom she’s served for generations. Specializing in children and special needs clients, her warm presence and expert skill turn every haircut into a moment of trust, care, and lasting memory.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/cathy_78bce9b6-ac93-46be-ae9d-1ff07e5a5970.png?v=1757629513",
    link: "https://getsquire.com/booking/book/manhattan/barber/-85244/services",
  },
  {
    name: "Kris",
    title: "Barber Stylist",
    exp: "Cutting since '03",
    bio: "Kris, born in Brooklyn and raised in Queens, brings over two decades of experience and a true New Yorker’s spirit to Artisan Barber. A licensed cosmetologist who fell in love with barbering six years ago, she’s known for her scissor work and intuitive approach to curly hair. With every cut, Kris pairs technical skill with genuine care, making sure clients leave feeling confident and seen.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/kris.jpg?v=1757629512",
    link: "https://getsquire.com/booking/book/manhattan/barber/-114137/services",
  },
  {
    name: "Quentin",
    title: "Atelier",
    bio: "Quentin, born and raised in Houston and now based in New York, brings a unique blend of fashion, business, and psychology to Artisan Barber. With a background in Fashion Merchandising from Texas Southern University, he connects with clients through conversation, hospitality, and insight—whether guiding bookings, welcoming guests, or sharing the best of New York. His goal is simple: to make every client feel at home while representing the style and culture that define Artisan.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/27490007.jpg?v=1758309939",
  },
  {
    name: "Oomi",
    title: "Chief of Staff",
    bio: "Oomi, Artisan Barber’s Chief of Staff, brings a people-first approach to the shop. With roots in tech and wellness, she focuses on building a workplace where the team thrives and clients feel at home. From supporting growth to shaping a welcoming vibe, Oomi makes every visit more than just a haircut—it’s a moment of connection and care.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/oomi_9cc6f3d7-4e6e-4903-bc3c-4cef15aaa112.png?v=1757629513",
  },
  {
    name: "Brian Felix",
    title: "Creative Director",
    bio: "Brian, Artisan Barber’s Creative Director, is the visionary behind the brand’s visual identity—from product packaging to shop design and seasonal rollouts. With a background in design and a love for storytelling, his creativity brings each detail of the Artisan experience to life.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/brian.png?v=1757629513",
  },
  {
    name: "Jada",
    title: "PR Coordinator",
    bio: "Jada is the creative force behind Artisan Barber’s outreach, blending her background in PR, journalism, and social media to craft compelling stories, partnerships, and community connections. A model, DJ, and NYC transplant with a passion for culture and connection, she brings energy and vision to every part of the brand.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/jada_f9041511-9945-476c-90ed-89909a86cb5e.png?v=1757629513",
  },
  {
    name: "Walesca",
    title: "Apothecary",
    bio: "Walesca is Artisan Barber’s product innovator and resident vibe curator, known for crafting multifunctional grooming products like her candle-to-hair-oil creations and spinning infectious DJ sets every Friday. A Brooklyn native with a flair for creativity and nightlife, she brings fresh energy, elevated self-care, and unforgettable vibes to the shop each week.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/waleska_896863dd-27c2-4e1c-880f-589055bb6dc9.png?v=1757629513",
  },
  {
    name: "Lauren",
    title: "Social Media",
    bio: "Lauren, the creative force behind Artisan Barber’s social media, uses her eye for photography and love for storytelling to bring the shop’s personality to life across TikTok and Instagram. Whether capturing transformations, creating behind-the-scenes content, or snapping team portraits, her work keeps our community connected, inspired, and always in the loop.",
    img: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/lauren_32d58d66-b35d-460a-a349-db4ed4cc1cb9.png?v=1757629513",
  },
];

export default function TeamPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <header className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our team has over a century of combined hair industry experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A Sanctuary Awaits: At Artisan Barber, each visit is a renewal, each
            cut a commitment to excellence. Reserve your time with our artisans
            today.
          </motion.p>
        </header>

        <section className={styles.grid}>
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className={`${styles.card} ${member.link ? styles.withButton : ""}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                transition: { type: "spring", stiffness: 200, damping: 12 },
              }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.image}>
                <Image
                  src={member.img}
                  alt={member.name}
                  width={500}
                  height={500}
                  priority
                />
              </div>
              <div className={styles.meta}>
                <h2>{member.name}</h2>
                <p className={styles.title}>{member.title}</p>
                {member.exp && <p className={styles.exp}>{member.exp}</p>}
                <p className={styles.sub}>{member.bio}</p>
              </div>
              {member.link && (
                <div className={styles.buttonContainer}>
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.button}
                  >
                    Book Now
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
