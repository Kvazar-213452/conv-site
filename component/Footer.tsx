import "@/app/css/footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span className="footer-text">© 2024 DevTools — built with Next.js</span>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#">GitHub</a>
          <a href="#">Privacy</a>
          <a href="#">Docs</a>
        </nav>
      </div>
    </footer>
  );
}
