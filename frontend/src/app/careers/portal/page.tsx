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

const portalPreviewEnabled =
  process.env.NODE_ENV !== "production" &&
  process.env.CAREERS_PORTAL_PREVIEW === "true";

const previewSession = {
  name: "Preview Employee",
  email: "preview@artisanbarber.test",
  role: "EMPLOYEE" as const,
};

export default async function EmployeePortalPage() {
  if (!portalPreviewEnabled && !isAcademySsoEnabled()) redirect("/careers");

  const session = portalPreviewEnabled
    ? previewSession
    : await getEmployeeSession();

  if (!session) redirect("/api/auth/academy/start");

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.portalMenu} aria-label="Employee account">
          <div>
            <p className={styles.sessionMeta}>{session.email}</p>
            <p className={styles.sessionMeta}>{session.role}</p>
          </div>
          <form action="/api/auth/logout" method="post" className={styles.logoutForm}>
            <button type="submit">
              Log out
            </button>
          </form>
        </section>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>{session.name}</p>
          <h1>Welcome</h1>
          <p className={styles.intro}>
            Your Artisan employee account is connected. The first onboarding
            experience will be added here next.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const dynamic = "force-dynamic";
