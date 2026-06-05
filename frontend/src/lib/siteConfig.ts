export const siteConfig = {
  siteName: "Artisan Barber",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.artisanbarber.com",
  defaultTitle: "Artisan Barber",
  titleTemplate: "%s | Artisan Barber",
  defaultDescription:
    "Artisan Barber is an Upper East Side barbershop offering precision cuts, grooming services, and curated shop goods in New York City.",
  defaultOgImage: "/hero-placeholder.png",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.siteUrl).toString();
}
