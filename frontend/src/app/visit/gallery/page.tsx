import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

type GalleryItem = {
  src: string;
  title: string;
};

const galleryItems: GalleryItem[] = [
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_C_3_-_Copy.jpg",
    title: "Zero Degree Skin Fade",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_C_1.jpg",
    title: "Textured Pompador",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_B_1.jpg",
    title: "Classic Taper Fade",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_B_4_-_Copy.jpg",
    title: "Strait Razor Shave",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_A_2_-_Copy.jpg",
    title: "Mid-Length Taper Fade",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_A_1.jpg",
    title: "Mid-Length Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_D_2.jpg?v=1719690198",
    title: "Signature Haircut Combo",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_D_3.jpg?v=1719690123",
    title: "Deluxe Beard Trim Combo",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_E_3_-_Copy.jpg",
    title: "Traditional Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_E_2.jpg",
    title: "Hot Towel Razor Shave",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_F_1.jpg",
    title: "All Scissor Haircut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Finished_Cuts_F_2.jpg",
    title: "All Scissor Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_35.jpg?v=1749140405",
    title: "Clipper & Scissor Haircut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_34.jpg?v=1749140405",
    title: "Taper Fade Haircut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_32.jpg?v=1749140191",
    title: "Long All Scissor Cut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_33.jpg?v=1749140191",
    title: "Long All Scissor Cut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_31.jpg?v=1749140016",
    title: "Short All Scissor Cut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_30.jpg?v=1749140016",
    title: "Classic Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_29.jpg?v=1749139768",
    title: "Skin Fade w/Side Part",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_28.jpg?v=1749139768",
    title: "Skin Faded Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_26.jpg?v=1749139497",
    title: "Skin Taper Fade",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_25.jpg?v=1749139497",
    title: "Textured Top",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_23.jpg?v=1749138747",
    title: "Low Skin Taper",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_24.jpg?v=1749138747",
    title: "FoHawk Back Taper",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_22.jpg?v=1749137452",
    title: "Front French Crop",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_21.jpg?v=1749137451",
    title: "Back Classic Mullet",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_18.jpg?v=1749137022",
    title: "Classic Haircut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_17.jpg?v=1749137022",
    title: "Beard Trim Combo",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_16.jpg?v=1749136876",
    title: "Classic Clipper Cut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_15.jpg?v=1749136876",
    title: "Textured Top",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_12.jpg?v=1749136585",
    title: "Textured Pompadour",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_13.jpg?v=1749136585",
    title: "Tapered Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_19.jpg?v=1749137227",
    title: "Medium Length Scissor Cut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_20.jpg?v=1749137226",
    title: "Textured Scissor Cut Sides",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_11.jpg?v=1749131595",
    title: "Clipper Blended Mullet",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_9.jpg?v=1749131593",
    title: "Skin Faded Mullet",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_10.jpg?v=1754518198",
    title: "Clipper & Scissor Haircut",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_3.jpg?v=1754518197",
    title: "Light Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_6.jpg?v=1754518198",
    title: "Mid Skin Fade",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_7.jpg?v=1754518198",
    title: "Scissors Textured Top",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_5.jpg?v=1754518197",
    title: "High Bald Fade",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_4.jpg?v=1754518197",
    title: "Skin Fade Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_8.jpg?v=1754518197",
    title: "Classic Taper",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/AB-Hair-Cut_1.jpg?v=1754518195",
    title: "Classic Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_8.jpg?v=1749131158",
    title: "High Skin Fade",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_6.jpg?v=1749131158",
    title: "Straight Razor Shave",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_4.jpg?v=1749127465",
    title: "Curly Cut Top",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_5.jpg?v=1749127465",
    title: "Skin Taper Beard Trim",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_2.jpg?v=1749127465",
    title: "Scissors and Clippers",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan-Barber-Gallery_1.jpg?v=1749127465",
    title: "Classic Beach Cut Top",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan_Barber_-_Gallery_37.png?v=1749124418",
    title: "All Scissor Top Blend",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0613/6292/9724/files/Artisan_Barber_-_Gallery_1.png?v=1749124418",
    title: "All Clipper Side Gradient",
  },
];

export default function GalleryPage() {
  return (
    <>
      <Navigation />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Work made in the chair</h1>

        </header>

        <section className={styles.grid}>
          {galleryItems.map((item, index) => (
            <article key={`${item.src}-${index}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className={styles.image}
                  priority={index < 4}
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
              <div className={styles.meta}>
                <h2>{item.title}</h2>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
