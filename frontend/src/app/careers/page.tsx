import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { isAcademySsoEnabled } from "@/lib/academy-sso/config";
import { getEmployeeSession } from "@/lib/academy-sso/session";
import styles from "./page.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description:
    "Explore career opportunities with Artisan Barber in New York City.",
  path: "/careers",
});

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const ssoEnabled = isAcademySsoEnabled();
  const session = await getEmployeeSession();
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Work with Artisan</p>
          <h1>Careers</h1>
          <p className={styles.intro}>
            We are building a team grounded in craft, hospitality, and
            community. Career opportunities will be posted here soon.
          </p>
        </section>

        <section className={styles.notice} aria-labelledby="openings-heading">
          <h2 id="openings-heading">Open positions</h2>
          <p>There are no current openings listed. Please check back soon.</p>
        </section>

        <section className={styles.actions} aria-label="Career resources">
          {session ? (
            <a href="/careers/portal" className={styles.actionButton}>
              Employee portal
            </a>
          ) : ssoEnabled ? (
            <a href="/api/auth/academy/start" className={styles.actionButton}>
              Log in
            </a>
          ) : (
            <button type="button" className={styles.actionButton} disabled>
              Log in
            </button>
          )}
          <button
            type="button"
            className={styles.actionButton}
            disabled
          >
            Create an account
          </button>
          <a
            href="https://academy.artisanbarber.com"
            className={styles.actionButton}
          >
            Higher education
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
