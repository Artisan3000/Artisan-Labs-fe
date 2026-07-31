import type { Metadata } from "next";
import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/siteConfig";
import {
  businessConfig,
  formatAddress,
  services,
} from "@/lib/businessConfig";
import styles from "./page.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Upper East Side Barber & Men's Haircuts NYC",
  description: `Book men's haircuts, scissor cuts, beard trims, and children's cuts at Artisan Barber, ${businessConfig.address.street} on Manhattan's Upper East Side.`,
  path: "/services",
});

const serviceFaq = [
  {
    question: "Do I need an appointment?",
    answer: businessConfig.policies.walkIns,
  },
  {
    question: "How long does a haircut take?",
    answer:
      "Most haircuts take approximately 30 to 45 minutes, depending on the service and the result you are working toward.",
  },
  {
    question: "Where is Artisan Barber located?",
    answer: `Artisan Barber is located at ${formatAddress()}, on Manhattan's Upper East Side.`,
  },
];

export default function ServicesPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Artisan Barber services",
    url: absoluteUrl("/services"),
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      name: service.name,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        minPrice: service.price.replace(/[^0-9.]/g, ""),
      },
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: { "@id": `${absoluteUrl("/")}#business` },
        areaServed: ["Upper East Side", "Yorkville", "Manhattan"],
      },
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: serviceFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navigation />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>
            {businessConfig.address.street} · {businessConfig.address.locality}
          </p>
          <h1>Upper East Side barber for precision cuts and grooming</h1>
          <p className={styles.intro}>
            Artisan Barber is an appointment-focused neighborhood barbershop
            serving the Upper East Side and Yorkville. Our team works across
            clipper cuts, scissor work, beard grooming, and children&apos;s
            haircuts, with every service shaped around the client in the chair.
          </p>
          <BookingLink className={styles.primaryCta}>
            Book an appointment
          </BookingLink>
        </header>

        <section className={styles.services} aria-labelledby="services-heading">
          <div className={styles.sectionHeading}>
            <p>Services and starting prices</p>
            <h2 id="services-heading">Find the right service</h2>
          </div>
          <div className={styles.grid}>
            {services.map((service) => (
              <article id={service.id} key={service.id} className={styles.card}>
                <div className={styles.cardHeading}>
                  <h3>{service.name}</h3>
                  <p>{service.price}</p>
                </div>
                <p>{service.description}</p>
                <BookingLink className={styles.textCta}>
                  Open booking
                </BookingLink>
              </article>
            ))}
          </div>
          <p className={styles.priceNote}>
            Prices shown are starting prices. Final pricing and availability
            are confirmed during booking.
          </p>
        </section>

        <section className={styles.visit} aria-labelledby="visit-heading">
          <div>
            <p className={styles.eyebrow}>Visit Artisan</p>
            <h2 id="visit-heading">In the heart of the Upper East Side</h2>
            <p>
              Find us at {formatAddress()}. We are open Monday through Friday
              from {businessConfig.hours.weekdays.display}, Saturday is{" "}
              {businessConfig.hours.saturday.toLowerCase()}, and Sunday is{" "}
              {businessConfig.hours.sunday.toLowerCase()}.
            </p>
          </div>
          <div className={styles.visitLinks}>
            <Link href="/team">Meet the team</Link>
            <Link href="/about/gallery">See our work</Link>
            <Link href="/about">Learn about Artisan</Link>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-heading">
          <p className={styles.eyebrow}>Before your visit</p>
          <h2 id="faq-heading">Frequently asked questions</h2>
          <div className={styles.faqGrid}>
            {serviceFaq.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
