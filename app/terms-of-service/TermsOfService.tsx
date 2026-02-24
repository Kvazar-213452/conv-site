"use client";

import Link from "next/link";
import { ArrowRight, Shield, CheckCircle, XCircle } from "lucide-react";
import { MAIN_DOMEN, GMAIL } from "@/lib/config";

import "@/style/main.css";
import "@/style/home.css";

export default function TermsOfServicePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero home-hero" aria-labelledby="terms-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Last Updated: February 24, 2026
        </div>

        <h1 id="terms-heading" className="home-title">
          Terms of<br />
          <em>Service</em>
        </h1>

        <p className="home-subtitle">
          Simple, fair terms for using JSON Converter Toolkit. Free forever, 
          no hidden fees, no data collection. Read our straightforward policies below.
        </p>

        {/* Stats strip */}
        <div className="home-stats" aria-label="Terms stats">
          <div className="home-stat">
            <span className="home-stat-value">100%</span>
            <span className="home-stat-label">free</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">0</span>
            <span className="home-stat-label">hidden fees</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">0</span>
            <span className="home-stat-label">accounts</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-value">∞</span>
            <span className="home-stat-label">conversions</span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <section aria-labelledby="content-heading">
        <div className="home-section-header">
          <h2 id="content-heading" className="home-section-title">
            Agreement Overview
          </h2>
          <p className="home-section-sub">
            By using JSON Converter Toolkit, you agree to these terms. 
            We keep it simple: use our tools responsibly, respect intellectual property, and enjoy unlimited free conversions.
          </p>
        </div>

        {/* Key Terms Grid */}
        <div className="converter-grid">
          <div className="converter-card" style={{ animationDelay: '0.1s', cursor: 'default' }}>
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <CheckCircle size={22} />
              </div>
              <span className="converter-card-badge">Allowed</span>
            </div>
            <h3 className="converter-card-title">What You Can Do</h3>
            <p className="converter-card-desc">
              Use all converters unlimited times, convert any data format, work with sensitive files privately, 
              use offline, and integrate into your workflows—all completely free.
            </p>
          </div>

          <div className="converter-card" style={{ animationDelay: '0.15s', cursor: 'default' }}>
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <XCircle size={22} />
              </div>
              <span className="converter-card-badge">Prohibited</span>
            </div>
            <h3 className="converter-card-title">What You Can't Do</h3>
            <p className="converter-card-desc">
              Don't attempt to reverse engineer, create derivative works, abuse the service, 
              or use for illegal purposes. No automated scraping or excessive traffic.
            </p>
          </div>

          <div className="converter-card" style={{ animationDelay: '0.2s', cursor: 'default' }}>
            <div className="converter-card-top">
              <div className="converter-card-icon" aria-hidden="true">
                <Shield size={22} />
              </div>
              <span className="converter-card-badge">Protected</span>
            </div>
            <h3 className="converter-card-title">Your Protections</h3>
            <p className="converter-card-desc">
              Your data stays private, no tracking or surveillance, free forever guarantee, 
              and transparent terms with no surprises or hidden clauses.
            </p>
          </div>
        </div>

        {/* Introduction and Acceptance */}
        <div className="home-converters-seo">
          <h3 className="home-converters-seo-title">1. Acceptance of Terms</h3>
          <p>
            <strong>Agreement to Terms:</strong> By accessing or using JSON Converter Toolkit 
            (the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you do not agree to these Terms, you may not use the Service.
          </p>
          <p>
            <strong>Service Description:</strong> JSON Converter Toolkit is a free, browser-based 
            collection of data conversion tools including JSON to YAML, CSV, XML, Prisma schemas, 
            TypeScript interfaces, PostgreSQL INSERT statements, and various text manipulation 
            utilities. All conversions run client-side in your browser.
          </p>
          <p>
            <strong>Changes to Terms:</strong> We reserve the right to modify these Terms at any time. 
            Changes will be effective immediately upon posting with an updated "Last Updated" date. 
            Your continued use of the Service after changes constitutes acceptance of the modified Terms.
          </p>
          <p>
            <strong>Eligibility:</strong> The Service is available to users of all ages worldwide. 
            By using the Service, you represent that you have the legal capacity to enter into these Terms. 
            If you are using the Service on behalf of an organization, you represent that you have authority 
            to bind that organization to these Terms.
          </p>
        </div>

        {/* License and Usage Rights */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">2. License and Usage Rights</h3>
          <p>
            <strong>License Grant:</strong> Subject to your compliance with these Terms, we grant you 
            a limited, non-exclusive, non-transferable, revocable license to access and use the Service 
            for personal or commercial purposes.
          </p>
          <p>
            <strong>Unlimited Usage:</strong> You may use our conversion tools as many times as you need 
            with no usage limits, rate restrictions, or conversion quotas. Convert JSON, YAML, CSV, XML, 
            and other formats without restrictions.
          </p>
          <p>
            <strong>Commercial Use:</strong> You are explicitly permitted to use our tools for commercial 
            purposes, including but not limited to: business data processing, API development, database 
            migrations, software development, consulting work, and client projects—all without fees or licensing costs.
          </p>
          <p>
            <strong>Integration:</strong> You may integrate our Service into your workflows, development 
            processes, or business operations. However, you may not frame, mirror, or embed our Service 
            in a way that suggests endorsement or affiliation without our written permission.
          </p>
        </div>

        {/* Usage Guidelines */}
        <div className="home-features-grid" style={{ marginTop: '48px' }}>
          <h3 className="home-features-title">
            Acceptable Use Guidelines
          </h3>
          <div className="home-features-container">
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">✓ Personal Projects</h4>
              <p className="home-feature-item-desc">
                Use for learning, hobby projects, personal data management, file organization, 
                and any non-commercial personal purposes.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">✓ Professional Work</h4>
              <p className="home-feature-item-desc">
                Use for business operations, client work, enterprise projects, team collaboration, 
                and professional development workflows.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">✓ Education</h4>
              <p className="home-feature-item-desc">
                Use for teaching, learning programming, classroom demonstrations, student assignments, 
                and academic research projects.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">✓ Development</h4>
              <p className="home-feature-item-desc">
                Use for API testing, database migrations, schema generation, code development, 
                and software engineering tasks.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">✗ Automated Abuse</h4>
              <p className="home-feature-item-desc">
                Don't use bots, scrapers, or automated systems to overload our servers or 
                create excessive traffic that degrades service for others.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">✗ Malicious Use</h4>
              <p className="home-feature-item-desc">
                Don't use for illegal activities, malware distribution, hacking attempts, 
                security vulnerabilities, or any harmful purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">3. Prohibited Activities</h3>
          <p>
            You agree not to engage in any of the following prohibited activities:
          </p>
          <p>
            <strong>Reverse Engineering:</strong> You may not reverse engineer, decompile, disassemble, 
            or attempt to derive the source code of the Service, except to the extent such restriction 
            is expressly prohibited by applicable law.
          </p>
          <p>
            <strong>Abuse and Overload:</strong> You may not use automated systems, bots, or scripts 
            to send excessive requests to our servers that could impair or overburden the Service 
            for other users. Reasonable automated use for legitimate purposes is permitted.
          </p>
          <p>
            <strong>Illegal Content:</strong> You may not use the Service to process, convert, or 
            transmit any content that is illegal, infringes on intellectual property rights, contains 
            malware or viruses, or violates any applicable laws or regulations.
          </p>
          <p>
            <strong>Security Violations:</strong> You may not attempt to gain unauthorized access to 
            the Service, other users' data (not that we store any), our servers, or any systems or 
            networks connected to the Service through hacking, password mining, or any other means.
          </p>
          <p>
            <strong>Impersonation:</strong> You may not impersonate any person or entity, or falsely 
            state or misrepresent your affiliation with a person or entity in connection with the Service.
          </p>
          <p>
            <strong>Service Disruption:</strong> You may not interfere with or disrupt the Service 
            or servers or networks connected to the Service, or disobey any requirements, procedures, 
            policies, or regulations of networks connected to the Service.
          </p>
        </div>

        {/* Intellectual Property */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">4. Intellectual Property Rights</h3>
          <p>
            <strong>Our Ownership:</strong> The Service, including all software, code, algorithms, 
            user interface design, graphics, logos, and documentation, is owned by JSON Converter Toolkit 
            and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            <strong>Your Data Ownership:</strong> You retain all rights, title, and interest in any 
            data you input into the Service for conversion. We make no claim to your JSON files, 
            YAML configurations, CSV data, XML documents, or any other content you process.
          </p>
          <p>
            <strong>Output Ownership:</strong> The converted output generated by the Service belongs 
            to you. You may use, modify, distribute, or commercialize the converted data without 
            restriction or attribution requirements.
          </p>
          <p>
            <strong>Trademark Usage:</strong> "JSON Converter Toolkit" and any associated logos or 
            branding are our trademarks. You may not use these trademarks without our prior written 
            consent, except as necessary to describe your use of the Service.
          </p>
          <p>
            <strong>Third-Party Content:</strong> Any third-party libraries, frameworks, or tools 
            incorporated into the Service remain subject to their respective licenses and ownership rights.
          </p>
        </div>

        {/* Privacy and Data */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">5. Privacy and Data Handling</h3>
          <p>
            <strong>No Data Collection:</strong> The Service operates entirely in your browser with 
            zero server-side data collection. Your conversion data is never uploaded, transmitted, 
            stored, or processed on our servers.
          </p>
          <p>
            <strong>Client-Side Processing:</strong> All conversions—JSON to YAML, CSV parsing, 
            XML transformation, schema generation, and text manipulation—occur locally in your browser 
            using JavaScript. No network requests are made during conversion operations.
          </p>
          <p>
            <strong>Privacy Policy:</strong> Our privacy practices are detailed in our 
            <Link href="/privacy-policy" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}> Privacy Policy</Link>. 
            By using the Service, you also agree to our Privacy Policy.
          </p>
          <p>
            <strong>Data Security:</strong> While we don't collect or store your data, we recommend 
            following best practices: use HTTPS connections, avoid using the Service on public or 
            shared computers when handling extremely sensitive data, and verify you're on the legitimate 
            {MAIN_DOMEN} domain.
          </p>
        </div>

        {/* Service Availability */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">6. Service Availability and Modifications</h3>
          <p>
            <strong>Service Availability:</strong> We strive to maintain the Service with maximum uptime, 
            but we do not guarantee that the Service will be available 100% of the time. The Service may 
            be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
          </p>
          <p>
            <strong>No Warranty of Uninterrupted Access:</strong> We make no warranty that the Service 
            will be uninterrupted, timely, secure, or error-free. You acknowledge that internet 
            connectivity issues, browser compatibility problems, or technical failures may affect access.
          </p>
          <p>
            <strong>Service Modifications:</strong> We reserve the right to modify, update, add, or 
            remove features of the Service at any time without notice. This includes adding new converters, 
            updating conversion algorithms, changing the user interface, or discontinuing certain features.
          </p>
          <p>
            <strong>Maintenance Windows:</strong> We may perform scheduled or emergency maintenance that 
            temporarily makes the Service unavailable. We will attempt to minimize disruption but are 
            not liable for any downtime.
          </p>
          <p>
            <strong>Browser Compatibility:</strong> The Service is designed to work with modern web 
            browsers. We support the latest versions of Chrome, Firefox, Safari, and Edge. Older or 
            unsupported browsers may not function correctly.
          </p>
        </div>

        {/* Disclaimers */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">7. Disclaimers and Warranties</h3>
          <p>
            <strong>AS-IS Service:</strong> THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT 
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED 
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.
          </p>
          <p>
            <strong>No Guarantee of Accuracy:</strong> While we strive for accurate conversions, we do 
            not warrant that the conversion results will be error-free, complete, or suitable for your 
            specific purposes. You are responsible for verifying conversion accuracy for your use case.
          </p>
          <p>
            <strong>Data Validation:</strong> We strongly recommend that you validate all converted data 
            before using it in production environments, critical systems, or important business operations. 
            Always test conversions with sample data first.
          </p>
          <p>
            <strong>Third-Party Dependencies:</strong> The Service may rely on third-party libraries, 
            browser APIs, or web standards. We are not responsible for changes, bugs, or issues in 
            third-party dependencies that affect the Service.
          </p>
          <p>
            <strong>No Professional Advice:</strong> The Service provides technical tools, not professional 
            advice. It is not a substitute for consulting with qualified professionals regarding database 
            design, software architecture, data security, or legal compliance matters.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">8. Limitation of Liability</h3>
          <p>
            <strong>Maximum Liability:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, JSON CONVERTER 
            TOOLKIT AND ITS OPERATORS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, 
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, 
            DATA, OR USE, ARISING FROM YOUR USE OF THE SERVICE.
          </p>
          <p>
            <strong>Data Loss:</strong> We are not liable for any data loss, corruption, or errors 
            resulting from your use of the Service. Since all processing happens in your browser, 
            you are responsible for maintaining backups of your original data before conversion.
          </p>
          <p>
            <strong>Business Interruption:</strong> We are not liable for any business interruption, 
            lost opportunities, or damages resulting from Service downtime, conversion errors, or 
            unavailability.
          </p>
          <p>
            <strong>Third-Party Claims:</strong> We are not liable for any third-party claims arising 
            from your use of the Service, including but not limited to copyright infringement, data 
            privacy violations, or contract disputes.
          </p>
          <p>
            <strong>Cap on Liability:</strong> IN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR 
            LIMITATION OF LIABILITY, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW. 
            SINCE THE SERVICE IS FREE, ANY LIABILITY IS LIMITED TO ZERO DOLLARS ($0).
          </p>
        </div>

        {/* Indemnification */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">9. Indemnification</h3>
          <p>
            You agree to indemnify, defend, and hold harmless JSON Converter Toolkit, its operators, 
            employees, affiliates, and partners from and against any claims, liabilities, damages, 
            losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
          </p>
          <p>
            <strong>Your Use:</strong> Your use or misuse of the Service, including any converted data 
            you generate and subsequently use in your projects, applications, or business operations.
          </p>
          <p>
            <strong>Terms Violation:</strong> Your violation of these Terms of Service, including 
            prohibited activities, intellectual property infringement, or unauthorized access attempts.
          </p>
          <p>
            <strong>Third-Party Rights:</strong> Your violation of any rights of any third party, 
            including intellectual property rights, privacy rights, or contractual obligations.
          </p>
          <p>
            <strong>Illegal Activity:</strong> Any illegal, fraudulent, or harmful activity conducted 
            through or facilitated by your use of the Service.
          </p>
        </div>

        {/* Governing Law */}
        <div className="home-features-grid" style={{ marginTop: '48px' }}>
          <h3 className="home-features-title">
            Legal Framework
          </h3>
          <div className="home-features-container">
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Governing Law</h4>
              <p className="home-feature-item-desc">
                These Terms are governed by the laws of the jurisdiction in which JSON Converter 
                Toolkit operates, without regard to conflict of law principles.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Dispute Resolution</h4>
              <p className="home-feature-item-desc">
                Any disputes arising from these Terms will be resolved through binding arbitration 
                or in courts of competent jurisdiction as specified by applicable law.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Class Action Waiver</h4>
              <p className="home-feature-item-desc">
                You agree to resolve disputes individually and waive any right to bring claims 
                as a class action, consolidated action, or representative action.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Severability</h4>
              <p className="home-feature-item-desc">
                If any provision of these Terms is found unenforceable, the remaining provisions 
                will continue in full force and effect.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">Entire Agreement</h4>
              <p className="home-feature-item-desc">
                These Terms and our Privacy Policy constitute the entire agreement between you 
                and JSON Converter Toolkit regarding the Service.
              </p>
            </div>
            <div className="home-feature-item">
              <h4 className="home-feature-item-title">No Waiver</h4>
              <p className="home-feature-item-desc">
                Our failure to enforce any provision of these Terms does not constitute a waiver 
                of that provision or any other provision.
              </p>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">10. Termination</h3>
          <p>
            <strong>Your Right to Terminate:</strong> You may stop using the Service at any time. 
            Since we don't require accounts, simply closing your browser or navigating away constitutes 
            termination of your use.
          </p>
          <p>
            <strong>Our Right to Terminate:</strong> We reserve the right to suspend or terminate 
            your access to the Service at any time, with or without cause or notice, including but 
            not limited to violations of these Terms, abusive behavior, or illegal activity.
          </p>
          <p>
            <strong>Effect of Termination:</strong> Upon termination, your right to use the Service 
            immediately ceases. Sections of these Terms that by their nature should survive termination 
            (including disclaimers, limitations of liability, and indemnification) will remain in effect.
          </p>
          <p>
            <strong>No Refunds:</strong> Since the Service is free, no refunds are applicable. 
            Termination does not entitle you to any compensation or damages.
          </p>
        </div>

        {/* Updates and Changes */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">11. Updates and Notifications</h3>
          <p>
            <strong>Terms Updates:</strong> We may update these Terms periodically to reflect changes 
            in our practices, legal requirements, or Service features. The "Last Updated" date at the 
            top of this page indicates the most recent revision.
          </p>
          <p>
            <strong>Notification Method:</strong> Since we don't collect email addresses or require 
            accounts, we cannot notify you directly of changes. We encourage you to review these Terms 
            periodically to stay informed.
          </p>
          <p>
            <strong>Acceptance of Changes:</strong> Your continued use of the Service after Terms 
            updates constitutes your acceptance of the revised Terms. If you do not agree with the 
            changes, you must discontinue using the Service.
          </p>
          <p>
            <strong>Material Changes:</strong> For significant changes that materially affect your 
            rights or obligations, we will provide prominent notice on the Service or update the 
            "Last Updated" date and provide a summary of changes.
          </p>
        </div>

        {/* Contact Information */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">12. Contact Information</h3>
          <p>
            If you have questions about these Terms of Service, our Service policies, or your use 
            of the Service, you can contact us at:
          </p>
          <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: '13px' }}>
            <strong>Support:</strong> {GMAIL}<br />
            <strong>Website:</strong> {MAIN_DOMEN}
          </p>
          <p>
            We will respond to inquiries within a reasonable timeframe. For legal matters, please 
            allow additional time for thorough review and response.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="home-faq">
          <h3 className="home-faq-title">
            Terms of Service FAQ
          </h3>
          
          <div className="home-faq-item">
            <h4 className="home-faq-question">Is JSON Converter Toolkit really free to use?</h4>
            <p className="home-faq-answer">
              Yes, absolutely. All converters are 100% free with no usage limits, no subscription fees, 
              no premium tiers, and no hidden costs. Free forever.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I use this for commercial projects?</h4>
            <p className="home-faq-answer">
              Yes. You are explicitly permitted to use our tools for commercial purposes, including 
              business operations, client work, and revenue-generating projects without fees or licensing costs.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Do I need to create an account?</h4>
            <p className="home-faq-answer">
              No. Our Service requires no accounts, no sign-ups, and no registration. Simply visit 
              the website and start converting immediately.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Who owns the converted data?</h4>
            <p className="home-faq-answer">
              You do. You retain all rights to your input data and converted output. We make no 
              claims to your data and don't require attribution for using our tools.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">What if the conversion has an error?</h4>
            <p className="home-faq-answer">
              We strive for accuracy but cannot guarantee error-free conversions. Always validate 
              converted data before using it in production. We're not liable for conversion errors.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I embed your tools on my website?</h4>
            <p className="home-faq-answer">
              Please contact us for permission before embedding or framing our tools on external 
              websites. We evaluate such requests on a case-by-case basis.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Are there any usage limits or rate limits?</h4>
            <p className="home-faq-answer">
              No usage limits for normal use. However, automated systems or bots that create excessive 
              traffic may be restricted to ensure service availability for all users.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">What happens if I violate the Terms?</h4>
            <p className="home-faq-answer">
              Violations may result in temporary or permanent suspension of access to the Service. 
              Serious violations may also result in legal action.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can these Terms change?</h4>
            <p className="home-faq-answer">
              Yes. We may update these Terms periodically. Continued use after changes constitutes 
              acceptance. Check the "Last Updated" date and review periodically.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">What law governs these Terms?</h4>
            <p className="home-faq-answer">
              These Terms are governed by the laws of the jurisdiction where JSON Converter Toolkit 
              operates. Specific jurisdiction information is available in Section 9 above.
            </p>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="home-converters-seo" style={{ marginTop: '48px' }}>
          <h3 className="home-converters-seo-title">Understanding Your Rights with Developer Tools</h3>
          <p>
            <strong>Transparency in terms matters.</strong> Many online services hide restrictive 
            clauses in lengthy legal documents. We believe in straightforward, fair terms that 
            respect developers' needs and use cases.
          </p>
          <p>
            <strong>Commercial use is explicitly allowed.</strong> Unlike some free tools that prohibit 
            commercial use, JSON Converter Toolkit is designed for professional developers. Use our 
            JSON to YAML converter, CSV parser, Prisma schema generator, and all other tools in your 
            business projects, client work, and commercial applications without restrictions.
          </p>
          <p>
            <strong>Your data, your ownership.</strong> You retain complete ownership of all input data 
            and converted output. Whether you're converting proprietary database schemas, confidential 
            API responses, or business-critical configuration files, the converted data belongs entirely to you.
          </p>
          <p>
            <strong>No lock-in or dependency.</strong> Our tools work entirely in your browser with no 
            accounts or vendor lock-in. You can use JSON Converter Toolkit today and switch to any 
            alternative tomorrow with no migration issues, data export needs, or contract obligations.
          </p>
          <p>
            <strong>Fair use for everyone.</strong> We support unlimited conversions for individuals, 
            startups, enterprises, and educational institutions. The only restriction is against abusive 
            automated traffic that would degrade service for others—a reasonable protection that ensures 
            availability for all legitimate users.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="home-final-cta">
        <h2 className="home-final-cta-title">
          Start Converting Today
        </h2>
        <p className="home-final-cta-subtitle">
          Simple terms, unlimited usage, zero cost. Convert your JSON, YAML, CSV, 
          and XML data with complete freedom and peace of mind.
        </p>
        <Link href="/json-to-yaml" className="btn-convert home-cta">
          Start Converting Now
          <ArrowRight size={18} aria-hidden="true" style={{ marginLeft: '8px' }} />
        </Link>
      </section>
    </>
  );
}