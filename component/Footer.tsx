import Link from "next/link";

import "@/style/footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span className="footer-text">
          © 2026 converterdevtools. All rights reserved.
        </span>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/privacy-policy">
            Privacy
          </Link>

          <Link href="/terms-of-service">
            Terms of service
          </Link>

          <Link href="/contacts">
            Contacts
          </Link>
        </nav>
      </div>
    </footer>
  );
}