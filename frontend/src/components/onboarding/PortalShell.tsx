import Link from "next/link";
import Navigation from "@/components/Navigation";
import type { PortalIdentity, PortalRole } from "./types";
import styles from "./portal.module.css";

const employeeLinks = [
  ["Home", "/careers/portal"],
  ["Checklist", "/careers/portal/checklist"],
  ["Meetings", "/careers/portal/meetings"],
  ["Resources", "/careers/portal/resources"],
] as const;

export default function PortalShell({
  identity,
  viewerRole,
  preview = false,
  previewProfileId,
  children,
}: {
  identity: PortalIdentity;
  viewerRole: PortalRole;
  preview?: boolean;
  previewProfileId?: string;
  children: React.ReactNode;
}) {
  const initials = identity.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("");

  return (
    <>
      <Navigation />
      <div className={styles.portal}>
        <header className={styles.portalHeader}>
          <div>
            <p className={styles.kicker}>Artisan Barber</p>
            <p className={styles.headerTitle}>Employee onboarding</p>
          </div>
          <div className={styles.identity}>
            <span className={styles.avatar} aria-hidden="true">{initials}</span>
            <span><strong>{identity.name}</strong><small>{identity.employmentType === "CONTRACTOR_1099" ? "Independent contractor" : identity.employmentType === "W2" ? "W-2 employee" : "Setup pending"}</small></span>
            <form action="/api/auth/logout" method="post"><button className={styles.textButton}>Log out</button></form>
          </div>
        </header>

        {preview && <aside className={styles.previewBanner} role="status"><span>Previewing {identity.name} — read only</span><Link href="/careers/portal/admin">Exit preview</Link></aside>}

        <div className={styles.portalGrid}>
          <nav className={styles.portalNav} aria-label="Onboarding">
            {employeeLinks.map(([label, href]) => <Link key={href} href={previewProfileId ? `${href}?preview=${encodeURIComponent(previewProfileId)}` : href}>{label}</Link>)}
            {viewerRole === "ADMIN" && <><Link className={styles.adminLink} href="/careers/portal/admin">Admin</Link><Link href="/careers/portal/admin/resources">Manage resources</Link></>}
          </nav>
          <main className={styles.content}>{children}</main>
        </div>
        <footer className={styles.portalFooter}>
          <span>Artisan Barber · New York City</span>
          <Link href="/policy">Privacy</Link>
        </footer>
      </div>
    </>
  );
}
