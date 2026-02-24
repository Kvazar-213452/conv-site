"use client";

import Link from "next/link";
import { Mail, MessageSquare, Github, ArrowRight, Globe, Bug, Lightbulb, Shield } from "lucide-react";
import { GMAIL } from "@/lib/config";

import "@/app/css/main.css";
import "@/app/css/home.css";

export default function ContactPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero home-hero" aria-labelledby="contact-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          We're here to help
        </div>

        <h1 id="contact-heading" className="home-title">
          Get in<br />
          <em>Touch</em>
        </h1>

        <p className="home-subtitle">
          Have questions about JSON Converter Toolkit? Need help with conversions? 
          Want to report a bug or suggest a feature? We'd love to hear from you.
        </p>

        {/* Stats strip */}
        <div className="home-stats" aria-label="Response stats">
          <div className="home-stat">
            <span className="home-stat-value">&lt;24h</span>
            <span className="home-stat-label">response time</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">100%</span>
            <span className="home-stat-label">read emails</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">0</span>
            <span className="home-stat-label">spam</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">∞</span>
            <span className="home-stat-label">support</span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <section aria-labelledby="content-heading">
        <div className="home-section-header">
          <h2 id="content-heading" className="home-section-title">
            How Can We Help?
          </h2>
          <p className="home-section-sub">
            Choose the best way to reach us based on your needs. 
            We're committed to responding quickly and helping you get the most out of our tools.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="converter-grid">
          <a 
            href={`mailto:${GMAIL}`}
            className="converter-card" 
            style={{ animationDelay: '0.1s' }}
            aria-label="Email support"
          >
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Mail size={22} />
              </div>
              <span className="converter-card-badge">Primary</span>
            </div>
            <h3 className="converter-card-title">General Support</h3>
            <p className="converter-card-desc">
              For general questions, help with conversions, or usage assistance.
              <br /><strong>{GMAIL}</strong>
            </p>
            <div className="converter-card-arrow" aria-hidden="true">
              <Mail size={15} />
            </div>
          </a>

          <a 
            href={`mailto:${GMAIL}`} 
            className="converter-card" 
            style={{ animationDelay: '0.15s' }}
            aria-label="Report bug"
          >
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Bug size={22} />
              </div>
              <span className="converter-card-badge">Important</span>
            </div>
            <h3 className="converter-card-title">Bug Reports</h3>
            <p className="converter-card-desc">
              Found a conversion error or technical issue? Report it here.
              <br /><strong>{GMAIL}</strong>
            </p>
            <div className="converter-card-arrow" aria-hidden="true">
              <Bug size={15} />
            </div>
          </a>

          <a 
            href={`mailto:${GMAIL}`}
            className="converter-card" 
            style={{ animationDelay: '0.2s' }}
            aria-label="Send feedback"
          >
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Lightbulb size={22} />
              </div>
              <span className="converter-card-badge">Welcome</span>
            </div>
            <h3 className="converter-card-title">Feature Requests</h3>
            <p className="converter-card-desc">
              Have an idea for a new converter or feature? Share your suggestions.
              <br /><strong>{GMAIL}</strong>
            </p>
            <div className="converter-card-arrow" aria-hidden="true">
              <Lightbulb size={15} />
            </div>
          </a>

          <a 
            href={`mailto:${GMAIL}`}
            className="converter-card" 
            style={{ animationDelay: '0.25s' }}
            aria-label="Privacy inquiries"
          >
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Shield size={22} />
              </div>
              <span className="converter-card-badge">Secure</span>
            </div>
            <h3 className="converter-card-title">Privacy & Security</h3>
            <p className="converter-card-desc">
              Questions about data privacy, security, or our client-side architecture.
              <br /><strong>{GMAIL}</strong>
            </p>
            <div className="converter-card-arrow" aria-hidden="true">
              <Shield size={15} />
            </div>
          </a>

          <a 
            href={`mailto:${GMAIL}`}
            className="converter-card" 
            style={{ animationDelay: '0.3s' }}
            aria-label="Legal inquiries"
          >
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <MessageSquare size={22} />
              </div>
              <span className="converter-card-badge">Formal</span>
            </div>
            <h3 className="converter-card-title">Legal & Business</h3>
            <p className="converter-card-desc">
              Legal matters, licensing questions, or business partnerships.
              <br /><strong>{GMAIL}</strong>
            </p>
            <div className="converter-card-arrow" aria-hidden="true">
              <MessageSquare size={15} />
            </div>
          </a>

          <a 
            href={`mailto:${GMAIL}`}
            className="converter-card" 
            style={{ animationDelay: '0.35s' }}
            aria-label="General contact"
          >
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Globe size={22} />
              </div>
              <span className="converter-card-badge">Friendly</span>
            </div>
            <h3 className="converter-card-title">Say Hello</h3>
            <p className="converter-card-desc">
              Just want to say hi or share your experience with our toolkit?
              <br /><strong>{GMAIL}</strong>
            </p>
            <div className="converter-card-arrow" aria-hidden="true">
              <Globe size={15} />
            </div>
          </a>
        </div>

        {/* What to Include Section */}
        <div className="home-converters-seo">
          <h3 className="home-converters-seo-title">What to Include in Your Message</h3>
          <p>
            <strong>For Bug Reports:</strong> Please include the converter you were using (e.g., JSON to YAML), 
            a description of the issue, steps to reproduce the bug, sample input data (if not sensitive), 
            expected vs actual output, your browser and version, and any error messages you received.
          </p>
          <p>
            <strong>For Feature Requests:</strong> Describe the converter or feature you'd like to see, 
            explain your use case and why it would be valuable, provide examples if possible, and let us 
            know if you've found workarounds or alternative solutions.
          </p>
          <p>
            <strong>For General Support:</strong> Explain what you're trying to accomplish, what converter 
            or tool you're using, describe any issues or questions you have, and let us know if you're 
            working on a deadline so we can prioritize accordingly.
          </p>
          <p>
            <strong>For Privacy/Security Questions:</strong> Reference our <Link href="/privacy-policy" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>Privacy Policy</Link> first, 
            then ask specific questions about data handling, client-side processing, or security architecture. 
            We're happy to provide technical details about how our privacy-first system works.
          </p>
        </div>

        {/* Response Time Section */}
        <div className="home-features-grid" style={{ marginTop: '48px' }}>
          <h3 className="home-features-title">
            What to Expect
          </h3>
          <div className="home-features-container">
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Fast Response Times</h4>
              <p className="home-feature-item-desc">
                We typically respond to all emails within 24 hours during business days. 
                Bug reports and critical issues receive priority attention.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Human Support</h4>
              <p className="home-feature-item-desc">
                Real developers read and respond to your messages. No automated chatbots, 
                no ticket systems, just genuine human assistance.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Technical Expertise</h4>
              <p className="home-feature-item-desc">
                Our team understands JSON, YAML, CSV, XML, database schemas, and data formats. 
                We can provide detailed technical guidance.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Privacy Respected</h4>
              <p className="home-feature-item-desc">
                We'll never ask you to send sensitive data. If you need to share examples, 
                please sanitize or use dummy data.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Feature Consideration</h4>
              <p className="home-feature-item-desc">
                We seriously consider all feature requests. Popular requests are prioritized 
                for development in future updates.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Bug Fixes</h4>
              <p className="home-feature-item-desc">
                Verified bugs are typically fixed quickly. We'll update you on the status 
                and notify you when the fix is deployed.
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Response Times and Availability</h3>
          <p>
            <strong>Business Hours:</strong> We monitor email Monday through Friday, 9:00 AM to 6:00 PM 
            (your local timezone may vary). Messages received outside business hours will be answered 
            on the next business day.
          </p>
          <p>
            <strong>Weekend and Holiday Response:</strong> We typically don't monitor email on weekends 
            or major holidays, but critical bug reports may receive attention. Expect responses to 
            weekend emails by the following Monday.
          </p>
          <p>
            <strong>Priority Handling:</strong> Bug reports affecting core functionality receive highest 
            priority. Security issues are addressed immediately. Feature requests and general inquiries 
            are handled in the order received.
          </p>
          <p>
            <strong>Follow-up:</strong> If you haven't received a response within 48 hours, please check 
            your spam folder and feel free to send a follow-up message. We read all emails and never 
            intentionally ignore messages.
          </p>
        </div>

        {/* Before You Contact Section */}
        <div className="home-features-grid" style={{ marginTop: '48px' }}>
          <h3 className="home-features-title">
            Before You Contact Us
          </h3>
          <div className="home-features-container">
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Check the FAQ</h4>
              <p className="home-feature-item-desc">
                Many common questions are answered in the FAQ sections on our 
                <Link href="/privacy-policy" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}> Privacy Policy</Link> and 
                <Link href="/terms-of-service" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}> Terms of Service</Link> pages.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Try the Tool Again</h4>
              <p className="home-feature-item-desc">
                Sometimes clearing your browser cache or trying a different browser can resolve 
                technical issues with converters.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Check Browser Console</h4>
              <p className="home-feature-item-desc">
                Press F12 to open developer tools and check the Console tab for error messages. 
                Including these in your bug report helps us diagnose issues faster.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Verify Input Format</h4>
              <p className="home-feature-item-desc">
                Ensure your input data is valid JSON, YAML, CSV, or XML. Many conversion errors 
                are caused by malformed input data.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Test with Sample Data</h4>
              <p className="home-feature-item-desc">
                If you're having issues with your specific data, try using simple sample data 
                to determine if it's a data-specific problem.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Document the Issue</h4>
              <p className="home-feature-item-desc">
                Take screenshots, note the exact steps to reproduce the problem, and prepare 
                a clear description before contacting us.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="home-faq">
          <h3 className="home-faq-title">
            Contact FAQ
          </h3>
          
          <div className="home-faq-item">
            <h4 className="home-faq-question">How quickly will I get a response?</h4>
            <p className="home-faq-answer">
              We typically respond within 24 hours during business days. Bug reports and urgent 
              issues receive priority attention and often get faster responses.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I send you my actual data for testing?</h4>
            <p className="home-faq-answer">
              Please don't send sensitive, confidential, or personal data. Instead, create sanitized 
              sample data that demonstrates the issue while protecting your privacy.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Do you offer phone support?</h4>
            <p className="home-faq-answer">
              No, we only provide email support. Email allows us to give more thorough, documented 
              responses and helps us track issues more effectively.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I request a custom converter?</h4>
            <p className="home-faq-answer">
              Yes! Send feature requests to {GMAIL}. We evaluate all requests 
              and prioritize those that benefit the broader community.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Do you provide paid support or consulting?</h4>
            <p className="home-faq-answer">
              Currently, we only provide free community support via email. For complex integration 
              needs or custom development, contact us at {GMAIL} to discuss options.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I report security vulnerabilities?</h4>
            <p className="home-faq-answer">
              Yes, please report security issues to {GMAIL}. We take security 
              seriously and will respond promptly to verified vulnerabilities.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">How do I delete my data from your systems?</h4>
            <p className="home-faq-answer">
              We don't collect or store your conversion data. All processing happens in your browser, 
              so there's no data to delete from our systems. See our 
              <Link href="/privacy-policy" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}> Privacy Policy</Link> for details.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I contribute to the project?</h4>
            <p className="home-faq-answer">
              We appreciate your interest! Contact us at {GMAIL} to discuss 
              contribution opportunities, feature development, or collaboration.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Do you respond to all messages?</h4>
            <p className="home-faq-answer">
              Yes, we read and respond to every legitimate message. If you haven't received a 
              response within 48 hours, check your spam folder and send a follow-up.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I use your email for commercial inquiries?</h4>
            <p className="home-faq-answer">
              Yes, send business partnership proposals, commercial licensing questions, and 
              enterprise inquiries to {GMAIL}.
            </p>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Dedicated Support for Developers</h3>
          <p>
            <strong>Developer-focused support.</strong> We understand that when you're working with 
            JSON converters, YAML formatters, CSV parsers, or database schema generators, you need 
            quick, technical, and accurate help. Our support team consists of actual developers who 
            understand data formats, conversion challenges, and the complexities of modern software development.
          </p>
          <p>
            <strong>No automated responses.</strong> Unlike many online tools that rely on chatbots 
            or templated responses, every email you send is read and answered by a real person with 
            technical expertise. We can provide detailed explanations about conversion algorithms, 
            discuss edge cases, and offer solutions to complex data transformation challenges.
          </p>
          <p>
            <strong>Community-driven improvements.</strong> Your feedback directly influences our 
            development roadmap. When you request a new converter (like JSON to GraphQL schema or 
            YAML to Terraform), report a bug in CSV parsing, or suggest UI improvements, we listen. 
            Many of our most popular features came from user suggestions.
          </p>
          <p>
            <strong>Open communication.</strong> We believe in transparency. If we can't implement 
            a requested feature, we'll explain why. If a bug fix will take time, we'll keep you updated. 
            If you have concerns about privacy or security, we'll provide detailed technical explanations 
            about our client-side architecture and zero-data-collection model.
          </p>
          <p>
            <strong>Global accessibility.</strong> JSON Converter Toolkit serves developers worldwide. 
            While our primary support language is English, we welcome messages in other languages and 
            will do our best to provide helpful responses. Our tools work in any language and support 
            Unicode characters in all converters.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="home-final-cta">
        <h2 className="home-final-cta-title">
          Ready to Get Started?
        </h2>
        <p className="home-final-cta-subtitle">
          Don't wait for support—start using our free converters now. 
          If you need help later, we're just an email away.
        </p>
        <Link href="/json-to-yaml" className="btn-convert home-cta">
          Start Converting Now
          <ArrowRight size={18} aria-hidden="true" style={{ marginLeft: '8px' }} />
        </Link>
      </section>
    </>
  );
}



// .com