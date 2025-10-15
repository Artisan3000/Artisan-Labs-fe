import styles from "./styles.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      {/* ✅ Centered Logo */}
      <div className={styles.logoContainer}>
        <img
          src="/artisan-diag-blk.svg"
          alt="Artisan Logo"
          className={styles.logo}
        />
      </div>

      {/* ✅ Store Info */}
      <div className={styles.storeInfo}>
        <div>
          Monday - Friday
          <br />
          9:00 AM - 6:00 PM
        </div>
        <div>
          Saturday: Closed
          <br />
          Sunday: Appointment Only
        </div>
        <div>
          (917) 388-3554
          <br />
          Get In Touch
        </div>
        <div>
          331 East 81st Street
          <br />
          New York, NY 10028
        </div>
      </div>

      {/* ✅ Links & Social */}
      <div className={styles.links}>
        <div>
          <h3>About</h3>
          <ul>
            <li><Link href="/read">Read</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/visit">Visit</Link></li>
          </ul>
        </div>
        <div>
          <h3>Support</h3>
          <ul>
            <li><Link href="/foundation">Foundation</Link></li>
            <li><Link href="/policy">Policy</Link></li>
            <li><Link href="/jobs">Jobs</Link></li>
          </ul>
        </div>

        {/* ✅ Social with SVG icons */}
        <div>
          <h3>Follow</h3>
          <ul className={styles.socials}>
            <li>
              <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.7 2h2.1c.2 1.4 1.2 2.5 2.5 2.8v2.1c-.9 0-1.8-.2-2.6-.5v7.7c0 3-2.4 5.4-5.4 5.4S4 17.1 4 14.1s2.4-5.4 5.4-5.4c.3 0 .6 0 .9.1v2.2c-.3-.1-.6-.1-.9-.1-1.8 0-3.2 1.4-3.2 3.2S7.6 17.3 9.4 17.3s3.2-1.4 3.2-3.2V2z" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.4.6.6.3 1 .7 1.4 1.3.3.5.6 1.2.6 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.6 2.4-.3.6-.7 1-1.3 1.4-.5.3-1.2.6-2.4.6-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.4-.6-.6-.3-1-.7-1.4-1.3-.3-.5-.6-1.2-.6-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.9.6-2.4.3-.6.7-1 1.3-1.4.5-.3 1.2-.6 2.4-.6C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.4 0-4.7.1-.9.1-1.4.2-1.7.4-.4.2-.7.4-.9.8-.2.3-.3.8-.4 1.7-.1 1.3-.1 1.6-.1 4.7s0 3.4.1 4.7c.1.9.2 1.4.4 1.7.2.4.4.7.8.9.3.2.8.3 1.7.4 1.3.1 1.6.1 4.7.1s3.4 0 4.7-.1c.9-.1 1.4-.2 1.7-.4.4-.2.7-.4.9-.8.2-.3.3-.8.4-1.7.1-1.3.1-1.6.1-4.7s0-3.4-.1-4.7c-.1-.9-.2-1.4-.4-1.7-.2-.4-.4-.7-.8-.9-.3-.2-.8-.3-1.7-.4-1.3-.1-1.6-.1-4.7-.1zM12 5.8a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4zm0 10.3a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5.6-10.9a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z"/>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="https://google.com" target="_blank" rel="noopener noreferrer" aria-label="Google">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.35 11.1H12v2.9h5.35c-.25 1.5-1.6 4.4-5.35 4.4A6.2 6.2 0 0 1 5.8 12a6.2 6.2 0 0 1 6.2-6.3c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.1 14.7 2 12 2 6.9 2 2.7 6.2 2.7 12s4.2 10 9.3 10c5.4 0 8.9-3.8 8.9-9.1 0-.6 0-1-.1-1.4z"/>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.6 3.2H4.4A2.4 2.4 0 0 0 2 5.6v12.8A2.4 2.4 0 0 0 4.4 20h15.2a2.4 2.4 0 0 0 2.4-2.4V5.6a2.4 2.4 0 0 0-2.4-2.4zM10 15.5v-7l6 3.5-6 3.5z"/>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Artisan Barber</p>
        <p>Site updated 10/01/2025</p>
        <p>
          Handmade by{" "}
          <Link href="https://wearecobalt.net" target="_blank" rel="noopener noreferrer">
            Cobalt Co.
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
