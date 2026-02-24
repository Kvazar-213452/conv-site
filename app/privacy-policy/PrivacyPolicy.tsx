"use client";

import Link from "next/link";
import { Shield, Lock, Code, ArrowRight } from "lucide-react";
import { MAIN_DOMEN, GMAIL } from "@/lib/config";

import "@/style/main.css";
import "@/style/home.css";

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero home-hero" aria-labelledby="privacy-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Last Updated: February 24, 2026
        </div>

        <h1 id="privacy-heading" className="home-title">
          Privacy<br />
          <em>Policy</em>
        </h1>

        <p className="home-subtitle">
          Your privacy matters. Learn how JSON Converter Toolkit protects your data 
          with 100% client-side processing, zero data collection, and complete transparency.
        </p>

        {/* Stats strip */}
        <div className="home-stats" aria-label="Privacy stats">
          <div className="home-stat">
            <span className="home-stat-value">0</span>
            <span className="home-stat-label">data collected</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">100%</span>
            <span className="home-stat-label">client-side</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">0</span>
            <span className="home-stat-label">servers</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">∞</span>
            <span className="home-stat-label">private</span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <section aria-labelledby="content-heading">
        <div className="home-section-header">
          <h2 id="content-heading" className="home-section-title">
            How We Protect Your Privacy
          </h2>
          <p className="home-section-sub">
            JSON Converter Toolkit is built with privacy-first principles. 
            All data processing happens in your browser—nothing is ever uploaded to our servers.
          </p>
        </div>

        {/* Key Privacy Features Grid */}
        <div className="converter-grid">
          <div className="converter-card" style={{ animationDelay: '0.1s', cursor: 'default' }}>
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Lock size={22} />
              </div>
              <span className="converter-card-badge">Guaranteed</span>
            </div>
            <h3 className="converter-card-title">Zero Data Collection</h3>
            <p className="converter-card-desc">
              We don't collect, store, or transmit any of your data. Your JSON, YAML, CSV, 
              XML files, and all conversions remain completely private on your device.
            </p>
          </div>

          <div className="converter-card" style={{ animationDelay: '0.15s', cursor: 'default' }}>
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Code size={22} />
              </div>
              <span className="converter-card-badge">Local Only</span>
            </div>
            <h3 className="converter-card-title">Client-Side Processing</h3>
            <p className="converter-card-desc">
              All conversions run entirely in your browser using JavaScript. 
              No server uploads, no API calls, no data transmission of any kind.
            </p>
          </div>

          <div className="converter-card" style={{ animationDelay: '0.2s', cursor: 'default' }}>
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Shield size={22} />
              </div>
              <span className="converter-card-badge">Secure</span>
            </div>
            <h3 className="converter-card-title">No User Accounts</h3>
            <p className="converter-card-desc">
              No sign-ups, no login required, no passwords to manage. 
              We don't collect names, emails, or any personal information.
            </p>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="home-converters-seo">
          <h3 className="home-converters-seo-title">Information We Don't Collect</h3>
          <p>
            <strong>Personal Data:</strong> We do not collect, process, or store any personally 
            identifiable information (PII) including names, email addresses, phone numbers, 
            physical addresses, IP addresses, or any other personal identifiers.
          </p>
          <p>
            <strong>Conversion Data:</strong> Your JSON files, YAML configurations, CSV spreadsheets, 
            XML documents, database schemas, TypeScript interfaces, and all other data you convert 
            never leave your browser. We have no access to your data because it's never transmitted 
            to our servers.
          </p>
          <p>
            <strong>Usage Analytics:</strong> We do not use Google Analytics, Facebook Pixel, 
            or any third-party tracking scripts. We don't monitor how you use our tools, 
            which converters you prefer, or how often you visit.
          </p>
          <p>
            <strong>Cookies and Local Storage:</strong> Our toolkit does not set cookies or 
            use local storage to track you. Any browser storage used is solely for temporary 
            processing of your conversions and is automatically cleared when you close the page.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="home-features-grid">
          <h3 className="home-features-title">
            How Our Privacy-First Architecture Works
          </h3>
          <div className="home-features-container">
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Browser-Only Execution</h4>
              <p className="home-feature-item-desc">
                All conversion logic runs as pure JavaScript in your browser. 
                When you paste data or upload a file, it's processed locally without 
                any network requests to external servers.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">No Server Infrastructure</h4>
              <p className="home-feature-item-desc">
                We serve static HTML, CSS, and JavaScript files. There's no backend 
                database, no API endpoints for data processing, and no server logs 
                containing your information.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Open Source Transparency</h4>
              <p className="home-feature-item-desc">
                Our code is transparent and auditable. You can inspect the source code 
                in your browser's developer tools to verify that no data is being sent 
                to external servers.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Offline Functionality</h4>
              <p className="home-feature-item-desc">
                Once our toolkit is loaded, it works completely offline. This proves that 
                no data transmission occurs during conversions—your data stays on your device.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">No Third-Party Scripts</h4>
              <p className="home-feature-item-desc">
                We don't load external tracking libraries, analytics frameworks, 
                advertising networks, or social media widgets that could collect your data.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Memory-Only Processing</h4>
              <p className="home-feature-item-desc">
                Your data is processed in browser memory and discarded when you navigate away. 
                Nothing is written to disk, cached on servers, or retained after your session.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Technical Privacy Safeguards</h3>
          <p>
            <strong>HTTPS Encryption:</strong> Our website uses HTTPS encryption to secure the 
            connection between your browser and our servers when loading the initial page. 
            However, once loaded, all conversions happen locally without any server communication.
          </p>
          <p>
            <strong>Content Security Policy:</strong> We implement strict Content Security Policy 
            (CSP) headers to prevent unauthorized scripts from executing and to block potential 
            data exfiltration attempts.
          </p>
          <p>
            <strong>No CDN Tracking:</strong> While we use content delivery networks (CDNs) to 
            serve our static files quickly, these CDNs don't have access to your conversion data 
            since all processing happens after the page loads in your browser.
          </p>
          <p>
            <strong>Browser Privacy Features:</strong> Our toolkit respects Do Not Track (DNT) 
            signals, works in private/incognito browsing modes, and doesn't attempt to fingerprint 
            your browser or device.
          </p>
        </div>

        {/* Data Security Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Data Security Best Practices</h3>
          <p>
            <strong>Sensitive Data Handling:</strong> Because all conversions happen in your browser, 
            you can safely process sensitive data including API keys, database credentials, 
            configuration files with secrets, and proprietary business data without risk of exposure.
          </p>
          <p>
            <strong>No Data Retention:</strong> We don't store any data because we never receive it. 
            There are no databases to breach, no logs to leak, and no backups containing your information.
          </p>
          <p>
            <strong>Recommended Practices:</strong> While our toolkit is private by design, we recommend 
            that you avoid pasting extremely sensitive data in public or shared computer environments. 
            Always ensure you're on the legitimate {MAIN_DOMEN} domain to avoid phishing attempts.
          </p>
        </div>

        {/* Third-Party Services Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Third-Party Services</h3>
          <p>
            <strong>Hosting Provider:</strong> Our website is hosted on secure cloud infrastructure. 
            The hosting provider may collect standard server logs (IP addresses, timestamps, requested URLs) 
            for infrastructure monitoring and security purposes. However, these logs cannot access your 
            conversion data since it never reaches the server.
          </p>
          <p>
            <strong>Domain Registrar:</strong> Our domain registration information is publicly available 
            through WHOIS records as required by ICANN regulations. This information relates to our 
            business entity only and contains no user data.
          </p>
          <p>
            <strong>Payment Processors:</strong> We don't charge for our services, so no payment 
            processing or financial data collection occurs. Our toolkit is 100% free forever.
          </p>
        </div>

        {/* Your Rights Section */}
        <div className="home-features-grid" style={{ marginTop: '48px' }}>
          <h3 className="home-features-title">
            Your Privacy Rights
          </h3>
          <div className="home-features-container">
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Right to Privacy</h4>
              <p className="home-feature-item-desc">
                You have complete privacy by default. We don't collect your data, 
                so there's nothing to request, delete, or opt out of.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">GDPR Compliance</h4>
              <p className="home-feature-item-desc">
                Our no-data-collection model automatically complies with GDPR, CCPA, 
                and other privacy regulations worldwide.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Data Portability</h4>
              <p className="home-feature-item-desc">
                Since your data stays in your browser, you have complete control. 
                You can copy, download, or save your conversions locally.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Right to Transparency</h4>
              <p className="home-feature-item-desc">
                You can inspect our code, verify our privacy claims, and confirm 
                that no data leaves your browser.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">No Consent Required</h4>
              <p className="home-feature-item-desc">
                We don't show cookie banners or request consent because we don't 
                track, collect, or process any personal data.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Age Restrictions</h4>
              <p className="home-feature-item-desc">
                Our toolkit is suitable for all ages. We don't collect data from 
                children or adults, so COPPA and similar laws don't apply.
              </p>
            </div>
          </div>
        </div>

        {/* International Privacy Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">International Privacy Standards</h3>
          <p>
            <strong>European Union (GDPR):</strong> The General Data Protection Regulation requires 
            websites to protect EU citizens' personal data. Since we don't collect any personal data, 
            GDPR requirements don't apply to our data processing. Your conversion data never crosses 
            borders because it never leaves your device.
          </p>
          <p>
            <strong>California (CCPA/CPRA):</strong> The California Consumer Privacy Act gives 
            residents rights over their personal information. We don't sell, share, or collect 
            personal information, so CCPA disclosure requirements don't apply.
          </p>
          <p>
            <strong>Other Jurisdictions:</strong> Our privacy-first architecture inherently complies 
            with privacy laws in Canada (PIPEDA), Australia (Privacy Act), Brazil (LGPD), 
            South Korea (PIPA), Japan (APPI), and other countries worldwide.
          </p>
        </div>

        {/* Changes to Privacy Policy Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy occasionally to reflect changes in our practices, 
            technologies, or legal requirements. Any changes will be posted on this page with 
            an updated "Last Updated" date at the top.
          </p>
          <p>
            However, our core privacy principle will never change: we don't collect, store, 
            or transmit your data. All conversions happen in your browser, and your privacy 
            is guaranteed by our architecture.
          </p>
          <p>
            We encourage you to review this Privacy Policy periodically to stay informed about 
            how we protect your privacy. Your continued use of JSON Converter Toolkit after any 
            changes indicates your acceptance of the updated policy.
          </p>
        </div>

        {/* Contact Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy, our privacy practices, or how we 
            protect your data, you can contact us at:
          </p>
          <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: '13px' }}>
            <strong>Email:</strong> {GMAIL}<br />
            <strong>Website:</strong> {MAIN_DOMEN}
          </p>
          <p>
            We're committed to transparency and will respond to privacy inquiries promptly. 
            However, please note that since we don't collect or store your data, we cannot 
            provide data access, deletion, or correction services—your data simply doesn't 
            exist in our systems.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="home-faq">
          <h3 className="home-faq-title">
            Privacy Policy FAQ
          </h3>
          
          <div className="home-faq-item">
            <h4 className="home-faq-question">Can you see my JSON, YAML, or CSV data?</h4>
            <p className="home-faq-answer">
              No. All conversions happen entirely in your browser. Your data never reaches our 
              servers, so we have no way to view, access, or store it.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Do you use cookies or tracking?</h4>
            <p className="home-faq-answer">
              No. We don't use cookies, analytics, or any tracking technologies. Your browsing 
              activity on our site is completely private.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Is it safe to convert sensitive data?</h4>
            <p className="home-faq-answer">
              Yes. Since all processing happens locally in your browser, you can safely convert 
              sensitive files including configuration files with API keys, database dumps, and 
              proprietary business data.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">How can I verify your privacy claims?</h4>
            <p className="home-faq-answer">
              Open your browser's developer tools (F12) and check the Network tab. You'll see 
              that no network requests are made during conversions. You can also test offline 
              mode—the toolkit continues working without internet.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Do you comply with GDPR and CCPA?</h4>
            <p className="home-faq-answer">
              Yes. Our no-data-collection model automatically complies with GDPR, CCPA, and other 
              privacy regulations worldwide. We don't process personal data, so most data protection 
              requirements don't apply.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Will you ever start collecting data?</h4>
            <p className="home-faq-answer">
              Our privacy-first architecture is fundamental to our toolkit. We have no plans to 
              collect user data. If this ever changes, we'll update this policy with prominent 
              notice and give users the choice to opt out.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Do you share data with third parties?</h4>
            <p className="home-faq-answer">
              No. We don't collect data, so there's nothing to share. We don't work with 
              advertising networks, data brokers, or analytics providers.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">What happens to my data when I close the browser?</h4>
            <p className="home-faq-answer">
              Your conversion data is processed in browser memory and automatically discarded when 
              you close the tab or navigate away. Nothing persists after your session.
            </p>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Why Privacy Matters for Developer Tools</h3>
          <p>
            <strong>Developer tool privacy is critical.</strong> When you use JSON converters, 
            YAML formatters, CSV parsers, or database schema generators, you're often working with 
            sensitive data: production API responses, database exports with real user data, 
            configuration files containing secrets, or proprietary business logic.
          </p>
          <p>
            <strong>Traditional online converters pose risks.</strong> Many web-based data 
            transformation tools upload your files to their servers for processing. This creates 
            security vulnerabilities: your sensitive data could be logged, cached, analyzed for 
            machine learning, exposed in data breaches, or sold to third parties.
          </p>
          <p>
            <strong>Client-side processing solves this.</strong> JSON Converter Toolkit processes 
            all data locally in your browser using JavaScript. This architectural choice guarantees 
            privacy: no uploads mean no data breaches, no compliance issues, and no trust required. 
            You maintain complete control over your sensitive information.
          </p>
          <p>
            <strong>Privacy for developers, by developers.</strong> We built this toolkit because 
            we needed privacy-respecting developer tools ourselves. Every converter—from JSON to 
            TypeScript interface generation to PostgreSQL INSERT statement creation—works completely 
            offline once loaded. This isn't just a privacy policy promise; it's enforced by our 
            technical architecture.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="home-final-cta">
        <h2 className="home-final-cta-title">
          Convert with Confidence
        </h2>
        <p className="home-final-cta-subtitle">
          Your data stays private. No uploads, no tracking, no accounts. 
          Start converting your JSON, YAML, CSV, and XML files securely in your browser.
        </p>
        <Link href="/tools/json-to-yaml" className="btn-convert home-cta">
          Start Converting Privately
          <ArrowRight size={18} aria-hidden="true" style={{ marginLeft: '8px' }} />
        </Link>
      </section>
    </>
  );
}