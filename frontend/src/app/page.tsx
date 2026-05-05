import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HomeFacts from "@/components/HomeFacts";
import HomeProductCarousel from "@/components/HomeProductCarousel";
import HomeReviewCarousel, {
  type HomeReview,
} from "@/components/HomeReviewCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import { shopifyClient } from "@/lib/shopify";

type Service = {
  title: string;
  price: string;
  description: string;
  icon: React.ReactNode;
};

function ScissorsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.serviceIcon}
      aria-hidden="true"
    >
      <circle cx="64" cy="64" r="28" />
      <circle cx="64" cy="192" r="28" />
      <path d="M84 84l76 76" />
      <path d="M224 32 84 172" />
      <path d="M148 148l76 76" />
    </svg>
  );
}

function RazorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.serviceIcon}
      aria-hidden="true"
    >
      <path d="M84 80c10-22 26-34 44-34s34 12 44 34" />
      <path d="M60 108c10-18 24-28 42-28h52c18 0 32 10 42 28" />
      <path d="M72 112v28c0 38 24 70 56 84 32-14 56-46 56-84v-28" />
      <path d="M96 148c8 10 18 15 32 15s24-5 32-15" />
      <path d="M128 164v44" />
      <path d="M92 196c12-2 24-8 36-20 12 12 24 18 36 20" />
    </svg>
  );
}

function ClippersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.serviceIcon}
      aria-hidden="true"
    >
      <path d="M96 24h64" />
      <path d="M96 56h64" />
      <rect x="80" y="56" width="96" height="152" rx="28" />
      <path d="M112 88h32" />
      <path d="M128 120v32" />
      <path d="M104 208v24" />
      <path d="M152 208v24" />
    </svg>
  );
}

function BeardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.serviceIcon}
      aria-hidden="true"
    >
      <path d="M80 88a48 48 0 0 1 96 0" />
      <path d="M64 112a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24" />
      <path d="M72 112v28a56 56 0 0 0 112 0v-28" />
      <path d="M104 184c0 16-12 32-24 40" />
      <path d="M152 184c0 16 12 32 24 40" />
    </svg>
  );
}

function CombIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.serviceIcon}
      aria-hidden="true"
    >
      <path d="M40 96h176" />
      <path d="M56 96V56" />
      <path d="M80 96V48" />
      <path d="M104 96V56" />
      <path d="M128 96V48" />
      <path d="M152 96V56" />
      <path d="M176 96V48" />
      <path d="M200 96V56" />
      <rect x="40" y="96" width="176" height="112" rx="20" />
    </svg>
  );
}

function ChildIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.serviceIcon}
      aria-hidden="true"
    >
      <circle cx="128" cy="76" r="36" />
      <path d="M72 220a56 56 0 0 1 112 0" />
      <path d="M84 132c16 12 72 12 88 0" />
    </svg>
  );
}

const services: Service[] = [
  {
    title: "Clipper and scissor cut",
    price: "$65+",
    description: "Classic shape with scissor detail and a clean finish.",
    icon: <ScissorsIcon />,
  },
  {
    title: "Beard trim",
    price: "$45+",
    description: "Precision trim for a clean, polished beard shape.",
    icon: <RazorIcon />,
  },
  {
    title: "Buzz cut",
    price: "$55+",
    description: "Low-maintenance, evenly dialed in, and built to stay crisp.",
    icon: <ClippersIcon />,
  },
  {
    title: "Hair and beard combo",
    price: "$100+",
    description: "A complete shape-up for both your cut and beard line.",
    icon: <BeardIcon />,
  },
  {
    title: "Scissor only cut",
    price: "$75+",
    description: "Tailored length and movement for a softer, longer silhouette.",
    icon: <CombIcon />,
  },
  {
    title: "Children's haircut",
    price: "$55+",
    description: "Comfortable, patient service designed for younger clients.",
    icon: <ChildIcon />,
  },
];

const faqItems = [
  {
    question: "Do you accept walk-ins?",
    answer:
      "We welcome everyone, but we require customers to book at least 45 minutes in advance or join our online waitlist for a same-day standby appointment. This policy helps us manage customer volume in the shop.",
  },
  {
    question: "How long should I expect a haircut to take?",
    answer:
      "Haircut duration details are coming soon.",
  },
  {
    question: "What happens if I arrive late to my appointment?",
    answer:
      "We allow a five to ten minute grace period depending on your service time length.",
  },
  {
    question: "Are there charges for late cancellations?",
    answer:
      "Yes. By clicking \"Reserve,\" you authorize the shop to charge for your appointment. However, you will not incur any charges if you cancel or reschedule at least 2 hours before your reservation. Booking an appointment signifies your agreement to our terms of service and privacy policy.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Payment method details are coming soon.",
  },
];

const reviews: HomeReview[] = [
  {
    quote: "Always scary to switch barbers... found my new barber.",
    name: "valentina Villarraga Castañeda",
    detail:
      "Henry absolutely crushed it. Always scary to switch barbers and Bobby didn’t disappoint. Found my new barber.",
    source: "Google Maps Review",
  },
  {
    quote: "Best lineup I’ve had.",
    name: "toha tahmid",
    detail: "Kris got me right. Best lineup I’ve had.",
    source: "Google Maps Review",
  },
  {
    quote: "You will leave getting what you asked for.",
    name: "Enoch A.",
    detail:
      "Dionne consistently produces excellent work. You will leave getting exactly what you asked for.",
    source: "Google Maps Review",
  },
  {
    quote: "Master class in the cuts he gives.",
    name: "Justin Diner",
    detail:
      "Love this place. Been seeing Bobby for cuts for a while now. He is master class in the cuts he gives. His advice is spot on. Great atmosphere, friendly, and the cuts have been perfect every time.",
    source: "Google Maps Review",
  },
  {
    quote: "He just looks at my hair and cuts it to a fresh style every time.",
    name: "Adam Costello",
    detail:
      "Charlie has been cutting my hair since 2017 and I trust him with my hair because I don’t have to tell him a style I want. He just looks at my hair and cuts it to a fresh style every time.",
    source: "Google Maps Review",
  },
  {
    quote: "Nice clean skin fade.",
    name: "Bence Skultét-Nagy",
    detail:
      "Got my haircut by Charlie, did a great job. Nice clean skin fade.",
    source: "Google Maps Review",
  },
  {
    quote: "Attention to detail is worth every penny.",
    name: "Berrel",
    detail:
      "Dion was fantastic. First time cutting my hair and we figured out a unique style I wanted to try and it was executed perfectly. The attention to detail is worth every penny. Will be back soon.",
    source: "Google Maps Review",
  },
  {
    quote: "Been cutting my hair with Charlie for 7 years.",
    name: "Oscar McCormick",
    detail:
      "Been cutting my hair with Charlie for 7 years now. He is the best in the city. Thank you Charlie!",
    source: "Google Maps Review",
  },
  {
    quote: "Could not recommend Irma enough.",
    name: "Jake B",
    detail:
      "Had a great experience here today, could not recommend Irma enough. She really understood my hair goals and walked me through the haircut in a way that was so specific and lovely. All around a great human and an even better haircut. Thanks Irma!",
    source: "Google Maps Review",
  },
  {
    quote: "The best barber shop on the upper east side!",
    name: "Laurie Giamella",
    detail:
      "The best barber shop on the upper east side! The owner is so kind and Kathy is just amazing with kids!! My son never liked getting his haircut and now he actually looks forward to it and the haircut itself is just perfect. Couldn’t recommend them more!",
    source: "Google Maps Review",
  },
  {
    quote: "They took great care of me while visiting town.",
    name: "Dallin Knudson",
    detail:
      "Charlie was amazing. Was visiting town and they took great care of me and the result looked so good. Thanks for the great haircut!",
    source: "Google Maps Review",
  },
  {
    quote: "Gentle approach towards customers.",
    name: "abner merciadez",
    detail:
      "Really nice service and gentle approach towards customers. Good job Nina, keep it up.",
    source: "Google Maps Review",
  },
];

type HomeProduct = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  images: {
    nodes: {
      url: string;
      altText: string | null;
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
    }[];
  };
};

export default async function Home() {
  const { data } = await shopifyClient.request<{
    collection: {
      products: {
        nodes: HomeProduct[];
      };
    } | null;
  }>(
    `
      query HomeBestSellers {
        collection(handle: "best-sellers") {
          products(first: 8) {
            nodes {
              id
              title
              handle
              vendor
              images(first: 1) {
                nodes {
                  url
                  altText
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                nodes {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    `
  );

  const featuredProducts =
    data?.collection?.products.nodes.map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      image: product.images.nodes[0] ?? null,
      price: product.priceRange.minVariantPrice,
      variant: product.variants.nodes[0] ?? null,
    })) ?? [];

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <Hero />
        <HomeFacts />
        <section id="services" className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.heading}>What we do</h2>
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <article key={service.title} className={styles.serviceCard}>
                  {service.icon}
                  <div className={styles.serviceHeader}>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <span className={styles.servicePrice}>{service.price}</span>
                  </div>
                  <p className={styles.serviceDescription}>
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <h2 className={styles.heading}>From the shelves</h2>
            <HomeProductCarousel products={featuredProducts} />
          </div>
        </section>

        <section id="reviews" className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.heading}>What the block is saying</h2>
            <HomeReviewCarousel reviews={reviews} />
          </div>
        </section>

        <section id="faq" className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <h2 className={styles.heading}>Got questions</h2>
            <div className={styles.faqWrapper}>
              <Accordion>
                {faqItems.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className={styles.faqPlaceholder}>{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
