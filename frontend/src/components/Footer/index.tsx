import styles from "./styles.module.css";

const Footer = () => {
  return (
    <>
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
      <div className={styles.links}>
        <div>
          <h3>About</h3>
          <ul>
            <li>Read</li>
            <li>Shop</li>
            <li>Visit</li>
          </ul>
        </div>
        <div>
          <h3>Support</h3>
          <ul>
            <li>Foundation</li>
            <li>Policy</li>
            <li>Jobs</li>
          </ul>
        </div>
        <div>
          <h3>Follow</h3>
          <ul>
            <li>TikTok</li>
            <li>Instagram</li>
            <li>Google</li>
            <li>Youtube</li>
          </ul>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Artisan Barber.</p>
        <p>
          Site updated 10/01/2025
        </p>
        <p>
          Handmade by <a href="https://wearecobalt.net">Cobalt Co.</a>
        </p>
      </footer>
    </>
  );
};

export default Footer;
