import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { isAcademySsoEnabled } from "@/lib/academy-sso/config";
import { getEmployeeSession } from "@/lib/academy-sso/session";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Employee Portal",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function EmployeePortalPage() {
  if (!isAcademySsoEnabled()) redirect("/careers");
  const session = await getEmployeeSession();
  if (!session) redirect("/api/auth/academy/start");

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Employee portal</p>
          <h1>Welcome, {session.name}</h1>
          <p className={styles.intro}>
            Your Artisan employee account is connected. The first onboarding
            experience will be added here next.
          </p>
        </section>

        <section className={styles.sessionCard} aria-labelledby="account-heading">
          <div>
            <h2 id="account-heading">Connected account</h2>
            <p className={styles.sessionMeta}>{session.email}</p>
            <p className={styles.sessionMeta}>Academy role: {session.role}</p>
          </div>
          <form action="/api/auth/logout" method="post" className={styles.logoutForm}>
            <button type="submit" className={styles.actionButton}>
              Log out
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const dynamic = "force-dynamic";
