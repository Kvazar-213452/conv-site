"use client";

import { useState } from "react";
import { FileJson, FileCode, ArrowRight, Code2 } from "lucide-react";
import "@/style/main.css";

interface CodeExample {
  title: string;
  json: string;
  xml: string;
}

const CODE_EXAMPLES: CodeExample[] = [
  {
    title: "Simple User Data",
    json: `{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "active": true
  }
}`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>John Doe</name>
  <email>john@example.com</email>
  <active>true</active>
</user>`
  },
  {
    title: "Product Catalog",
    json: `{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "inStock": true,
      "category": "Electronics"
    },
    {
      "id": 2,
      "name": "Mouse",
      "price": 29.99,
      "inStock": false,
      "category": "Accessories"
    }
  ]
}`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <id>1</id>
    <name>Laptop</name>
    <price>999.99</price>
    <inStock>true</inStock>
    <category>Electronics</category>
  </product>
  <product>
    <id>2</id>
    <name>Mouse</name>
    <price>29.99</price>
    <inStock>false</inStock>
    <category>Accessories</category>
  </product>
</products>`
  },
  {
    title: "API Response",
    json: `{
  "status": "success",
  "data": {
    "articles": [
      {
        "id": "001",
        "title": "Getting Started",
        "author": "Jane Smith",
        "date": "2024-04-20"
      }
    ]
  },
  "timestamp": 1713607200
}`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <status>success</status>
  <data>
    <articles>
      <article>
        <id>001</id>
        <title>Getting Started</title>
        <author>Jane Smith</author>
        <date>2024-04-20</date>
      </article>
    </articles>
  </data>
  <timestamp>1713607200</timestamp>
</response>`
  }
];

const COMPARISON_TABLE = [
  {
    aspect: "File Size",
    json: "Compact & lightweight",
    xml: "Verbose with tags & formatting",
    winner: "JSON"
  },
  {
    aspect: "Readability",
    json: "Clean, intuitive structure",
    xml: "Self-describing with tags",
    winner: "Tie"
  },
  {
    aspect: "Parsing Speed",
    json: "Extremely fast native parsing",
    xml: "Requires more processing",
    winner: "JSON"
  },
  {
    aspect: "Data Types",
    json: "Native support (string, number, boolean, null, array, object)",
    xml: "All values treated as text strings",
    winner: "JSON"
  },
  {
    aspect: "Attributes",
    json: "No attributes, flat key-value pairs",
    xml: "Full attribute support",
    winner: "XML"
  },
  {
    aspect: "Comments",
    json: "No comments allowed in standard JSON",
    xml: "Full comment support",
    winner: "XML"
  },
  {
    aspect: "Browser Support",
    json: "Native JavaScript parsing",
    xml: "DOM parsing, more complex",
    winner: "JSON"
  },
  {
    aspect: "Learning Curve",
    json: "Very easy to learn",
    xml: "Moderate learning curve",
    winner: "JSON"
  },
  {
    aspect: "APIs & REST",
    json: "Industry standard for modern APIs",
    xml: "Used in some legacy SOAP services",
    winner: "JSON"
  },
  {
    aspect: "Legacy Systems",
    json: "Newer standard",
    xml: "Established in enterprise systems",
    winner: "XML"
  }
];

export default function JsonVsXml() {
  const [activeExample, setActiveExample] = useState(0);
  const [viewMode, setViewMode] = useState<"split" | "json" | "xml">("split");
  const [copied, setCopied] = useState<string | null>(null);

  const currentExample = CODE_EXAMPLES[activeExample];

  const copyToClipboard = (text: string, type: "json" | "xml") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Data Format Comparison · Learn · Compare
        </div>
        <h1 id="hero-heading">
          JSON <em>vs</em><br />XML
        </h1>
        <p>
          Understand the key differences between JSON and XML formats. Learn when to use each format, compare performance, readability, and use cases. Make informed decisions for your projects.
        </p>
      </section>

      <section aria-label="Interactive Comparison">
        <div className="converter" style={{ gridTemplateColumns: viewMode === "split" ? "1fr 1fr" : "1fr", marginBottom: "20px" }}>
          {(viewMode === "split" || viewMode === "json") && (
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="dot json" aria-hidden="true" />
                  JSON Format
                </div>
                <div className="panel-actions">
                  <button
                    className="btn-ghost"
                    onClick={() => copyToClipboard(currentExample.json, "json")}
                    title="Copy JSON to clipboard"
                  >
                    {copied === "json" ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <pre className="output-pre">
                {currentExample.json}
              </pre>
            </div>
          )}

          {(viewMode === "split" || viewMode === "xml") && (
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="dot xml" aria-hidden="true" />
                  XML Format
                </div>
                <div className="panel-actions">
                  <button
                    className="btn-ghost"
                    onClick={() => copyToClipboard(currentExample.xml, "xml")}
                    title="Copy XML to clipboard"
                  >
                    {copied === "xml" ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <pre className="output-pre">
                {currentExample.xml}
              </pre>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            onClick={() => setViewMode("split")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: `1px solid ${viewMode === "split" ? "var(--accent)" : "var(--border-2)"}`,
              background: viewMode === "split" ? "var(--accent-dim)" : "transparent",
              color: viewMode === "split" ? "var(--accent)" : "var(--text-2)",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              transition: "all .15s",
            }}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode("json")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: `1px solid ${viewMode === "json" ? "var(--accent)" : "var(--border-2)"}`,
              background: viewMode === "json" ? "var(--accent-dim)" : "transparent",
              color: viewMode === "json" ? "var(--accent)" : "var(--text-2)",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              transition: "all .15s",
            }}
          >
            JSON Only
          </button>
          <button
            onClick={() => setViewMode("xml")}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: `1px solid ${viewMode === "xml" ? "var(--accent)" : "var(--border-2)"}`,
              background: viewMode === "xml" ? "var(--accent-dim)" : "transparent",
              color: viewMode === "xml" ? "var(--accent)" : "var(--text-2)",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              transition: "all .15s",
            }}
          >
            XML Only
          </button>
        </div>

        {/* Example Selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {CODE_EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveExample(index)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: `1px solid ${activeExample === index ? "var(--accent)" : "var(--border-2)"}`,
                background: activeExample === index ? "var(--accent)" : "transparent",
                color: activeExample === index ? "var(--text-inverse)" : "var(--text)",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                transition: "all .15s",
                fontWeight: activeExample === index ? "600" : "400",
              }}
            >
              {example.title}
            </button>
          ))}
        </div>
      </section>

      <section className="seo-content" aria-labelledby="comparison-heading">
        <h2 id="comparison-heading">JSON vs XML: Complete Comparison Guide</h2>
        <p>
          JSON (JavaScript Object Notation) and XML (eXtensible Markup Language) are two of the most popular data serialization formats used in modern web development. Both serve the purpose of structuring and transmitting data, but they take different approaches. Understanding the differences, strengths, and weaknesses of each format is essential for developers, architects, and anyone working with APIs, configuration files, or data interchange. This comprehensive guide covers everything you need to know to choose the right format for your project.
        </p>

        <h3>What is JSON?</h3>
        <p>
          JSON is a lightweight, text-based data format that is easy for both humans to read and machines to parse. It was designed by Douglas Crockford in the early 2000s and has become the de facto standard for APIs and web services. JSON is built on two fundamental structures: objects (curly braces containing key-value pairs) and arrays (square brackets containing ordered values). The format supports multiple data types natively: strings, numbers, booleans, null values, arrays, and objects. This native type support eliminates the need for type conversion or parsing, making JSON ideal for JavaScript and web applications. JSON files are typically more compact than their XML equivalents, resulting in smaller file sizes and faster transmission over networks. The format is language-independent and supported by virtually every modern programming language, from Python and Java to C# and Ruby.
        </p>

        <h3>What is XML?</h3>
        <p>
          XML is a markup language designed in 1996 for structuring, storing, and transporting data. Unlike JSON, XML uses a tag-based approach with opening and closing tags that describe the data they contain. This self-describing nature was one of XML's primary design goals—by reading XML, you immediately understand what each piece of data represents without additional documentation. XML supports attributes, which provide metadata about elements, comments for documentation, and namespaces for organizing elements. The format is highly extensible, allowing you to define custom tags tailored to your specific domain. XML is human-readable and can be validated against schemas (XSD, DTD) to ensure data integrity. However, this flexibility and richness come at a cost: XML files are typically much larger than equivalent JSON files due to repeated opening and closing tags. XML also requires more complex parsing logic, particularly in strongly-typed languages.
        </p>

        <h3>JSON vs XML: Detailed Comparison</h3>
        <p>
          The choice between JSON and XML depends on your specific use case, performance requirements, and ecosystem preferences. Here's a detailed breakdown of how they compare across key dimensions:
        </p>

        <h3>File Size and Performance</h3>
        <p>
          JSON consistently produces smaller files than XML for the same data content. Because JSON lacks redundant closing tags and doesn't require verbose formatting, it typically consumes 50-80% less space than equivalent XML. For example, a simple user record in JSON might be 150 bytes, while the same data in XML could be 300+ bytes. This size difference becomes significant when transmitting large amounts of data over networks or storing data in databases. Smaller file sizes mean faster download times, reduced bandwidth usage, and improved application responsiveness. JSON also parses faster in JavaScript and most modern languages because it maps directly to native data structures. XML parsing requires constructing a Document Object Model (DOM) tree, which is more memory-intensive and slower. For high-performance APIs serving millions of requests, this performance difference can translate into substantial cost savings and improved user experience.
        </p>

        <h3>Readability and Human-Friendliness</h3>
        <p>
          Both JSON and XML are human-readable, but in different ways. JSON's key-value pair structure feels natural and familiar to most programmers, especially those with JavaScript experience. The lack of verbose tags makes JSON easier to scan visually, and the structure is self-evident without additional explanation. XML's tag-based approach is also intuitive but requires reading opening and closing tags, which some find more verbose. However, XML's self-describing tags can provide context without documentation. For business users and non-technical stakeholders, XML's natural language-like tags (e.g., &lt;customerName&gt;) might be more immediately understandable than JSON's key-value pairs. The winner here largely depends on audience and context. For developers and modern APIs, JSON's simplicity typically wins. For enterprise systems and business documents, XML's explicitness can be advantageous.
        </p>

        <h3>Data Types</h3>
        <p>
          JSON has a significant advantage regarding native data type support. It natively supports strings, numbers (integers and floating-point), booleans (true/false), null values, arrays, and objects. This type richness means that when parsing JSON, you immediately know that "123" is a number and "true" is a boolean, not a string. In contrast, XML treats all data as text/strings by default. To use numeric or boolean values in XML, you must either implement type inference or explicitly define types using schema attributes. This difference has practical implications: JSON data requires less post-processing after parsing, while XML often needs additional type conversion logic. For APIs and systems where type accuracy matters, JSON's native type support reduces errors and simplifies code.
        </p>

        <h3>Flexibility and Extensibility</h3>
        <p>
          XML excels in flexibility and extensibility. The ability to define custom tags, attributes, namespaces, and schemas (XSD, DTD) makes XML ideal for domain-specific languages and complex hierarchical structures. Companies can create XML variants tailored to their industries (e.g., XHTML for web content, SOAP for web services, SVG for graphics). Attributes provide a way to attach metadata to elements without adding child elements. This flexibility makes XML suitable for configuration files, document formats, and systems where structure needs to accommodate diverse requirements. JSON, while flexible in principle, has less formal structure. To impose structure and validation on JSON, you need separate schema definitions (JSON Schema), which are less mature than XML's XSD. For systems requiring strict validation and complex hierarchies, XML's built-in capabilities can be advantageous.
        </p>

        <h3>Comment Support</h3>
        <p>
          XML natively supports comments using the syntax &lt;!-- comment text --&gt;, allowing developers to document data directly within files. This is valuable for configuration files where explaining settings and decisions is important. JSON officially has no comment syntax, which is a deliberate design choice to keep JSON simple and unambiguous. Many implementations add comment support as a non-standard extension, but this violates JSON specification compliance. For situations requiring inline documentation, XML is the clear winner. For data interchange where comments are unnecessary, JSON's simplicity is preferable.
        </p>

        <h3>Browser and Language Support</h3>
        <p>
          JSON has superior support in modern environments. JavaScript natively parses JSON using JSON.parse() and JSON.stringify(), requiring zero setup. Most modern programming languages include JSON libraries in their standard library or popular packages. JSON's simplicity means implementations are consistent and performant across all platforms. XML is also widely supported, but implementation complexity varies significantly. Browsers provide XML parsing through the XMLHttpRequest object and DOM APIs, which are more complex than JSON parsing. XML parsing libraries in various languages range from basic to sophisticated, with varying performance characteristics. For modern web APIs and REST services, JSON's universal support and simplicity make it the default choice.
        </p>

        <h3>Use Cases: When to Use JSON</h3>
        <p>
          JSON is ideal for REST APIs, which dominate modern web services. Its lightweight nature and fast parsing make it perfect for mobile applications and bandwidth-constrained scenarios. JSON works exceptionally well for microservices architectures, real-time data streaming, and systems requiring rapid data interchange. Configuration files in JSON (like package.json, tsconfig.json) are common in JavaScript ecosystems. Databases like MongoDB use JSON-like documents as their primary storage format. Single Page Applications (SPAs) heavily rely on JSON for data exchange with servers. Any situation where you prioritize simplicity, performance, and rapid development favors JSON. If your team is primarily composed of JavaScript developers or working in JavaScript-centric ecosystems, JSON is almost always the better choice.
        </p>

        <h3>Use Cases: When to Use XML</h3>
        <p>
          XML remains essential in enterprise systems, particularly legacy applications and banking/finance sectors where it has been standardized for decades. SOAP-based web services still use XML as their message format. Complex document-oriented systems benefit from XML's tag-based structure (e.g., office documents, medical records, legal documents). Configuration files in enterprise applications often use XML (e.g., Spring, Maven, Hibernate). XML's schema validation capabilities are superior, making it suitable for regulated industries requiring strict compliance verification. Systems needing rich metadata through attributes often choose XML. Any situation requiring formal validation against a schema, explicit type definition, or comments in data files may benefit from XML. Integration with legacy systems that expect XML format is another common reason to use XML.
        </p>

        <h3>Converting Between JSON and XML</h3>
        <p>
          When working with systems using different formats, conversion becomes necessary. JSON to XML conversion can be straightforward for simple structures, but challenges arise with data types (JSON numbers must become XML text), attributes (JSON lacks native attribute support), and namespace handling. Numerous libraries exist for conversion: in JavaScript, libraries like "xml2js" and "fast-xml-parser" handle bidirectional conversion. Python offers the "xmltodict" library. The conversion process is generally lossless if both formats support the necessary structures, but some information may be lost or require metadata. For example, distinguishing between JSON keys that should become XML elements versus attributes requires extra logic. Many developers maintain both formats when integrating heterogeneous systems, using conversion where necessary rather than standardizing on one format.
        </p>

        <h3>Performance Benchmarks</h3>
        <p>
          Real-world performance testing shows consistent advantages for JSON. For a 1MB dataset: JSON typically parses in 10-20ms in JavaScript browsers, while XML DOM parsing takes 50-150ms. Serialization (object to string) follows similar patterns. File transmission benefits from JSON's smaller size—transmitting JSON over a 4G connection is 40-60% faster than XML due to reduced payload. Memory usage during parsing is also lower with JSON, making it suitable for memory-constrained environments like mobile devices or embedded systems. However, these benchmarks assume standard implementations. Optimized XML parsers using streaming or SAX parsing can significantly reduce overhead, though at the cost of increased code complexity. For real-time systems, financial trading platforms, and IoT applications, JSON's performance advantages are decisive.
        </p>

        <h3>Learning and Development Speed</h3>
        <p>
          JSON has a considerably lower learning curve. Most developers grasp JSON in minutes—it mirrors common programming structures like dictionaries, maps, and lists. Creating JSON parsers or handlers requires minimal code. Development speed improves because less ceremony is involved: developers spend time on business logic rather than format complexity. XML requires more explanation and boilerplate. Understanding namespaces, schema languages, XSLT for transformations, and XPath for querying adds complexity. For teams prioritizing rapid development and quick feature deployment, JSON significantly reduces time-to-market. For long-term enterprise projects where upfront investment in proper structure pays dividends, XML's learning cost becomes less significant.
        </p>

        <h3>Integration with Modern Tools and Frameworks</h3>
        <p>
          Modern development ecosystems heavily favor JSON. REST frameworks default to JSON responses. GraphQL uses JSON for queries and responses. Firebase, MongoDB, and document databases operate natively with JSON. Popular frameworks like React, Vue, and Angular work seamlessly with JSON. API documentation tools like OpenAPI/Swagger use JSON/YAML formats. Testing frameworks generate JSON reports. Almost every modern development tool expects JSON somewhere in its workflow. Conversely, XML support in modern tools is often legacy: many frameworks include XML support mainly for backwards compatibility. This ecosystem advantage means JSON developers have more tools, libraries, and community knowledge available. For greenfield projects or teams adopting modern practices, JSON alignment with existing tools provides clear productivity benefits.
        </p>

        <h3>Real-World Examples</h3>
        <p>
          <strong>Google APIs:</strong> Google switched from XML to JSON for most of its APIs, including Google Maps, YouTube, and Drive APIs. This change improved performance and developer satisfaction. <strong>Twitter API:</strong> Supports both JSON (primary) and XML, but most developers use JSON due to its simplicity. <strong>Facebook Graph API:</strong> Uses JSON exclusively. <strong>AWS Services:</strong> Primarily use JSON, though some legacy services maintain XML support. <strong>Azure APIs:</strong> Default to JSON for new services. <strong>Enterprise Systems:</strong> Legacy banking systems, healthcare records, and government systems often continue using XML due to regulatory requirements and existing infrastructure. <strong>Configuration Files:</strong> Most modern tools use JSON (Node/npm), YAML, or TOML, with XML relegated to legacy systems.
        </p>

        <h3>Security Considerations</h3>
        <p>
          Both formats can be vulnerable to injection attacks if not properly validated and sanitized. JSON injection and XML injection are real security concerns. XML has additional vulnerabilities like XML External Entity (XXE) attacks, which can expose system files or cause denial-of-service through billion laughs attacks. JSON libraries are often simpler, reducing attack surface, though this isn't guaranteed. When receiving data from untrusted sources, validate and sanitize both JSON and XML. Use libraries that disable external entity processing for XML. Implement strict schema validation for both formats. Neither format provides inherent security—security depends on proper implementation and validation practices.
        </p>

        <h3>Conclusion: Which Format Should You Choose?</h3>
        <p>
          For new projects, modern APIs, and web services, choose JSON. It's faster, smaller, simpler to parse, and aligns with contemporary development practices. The ecosystem support is overwhelming, and developer familiarity is highest. For enterprise systems requiring formal validation, complex hierarchies, or integration with existing XML infrastructure, XML remains valid. For systems serving both communities, supporting both formats with careful API design is sometimes the pragmatic choice. Ultimately, the best format is the one that fits your specific requirements, user expectations, and ecosystem constraints.
        </p>
      </section>

      <section className="features" aria-label="Key Differences">
        {[
          {
            icon: <FileJson size={24} />,
            title: "JSON Advantages",
            desc: "Lightweight, fast parsing, native type support, simpler syntax, perfect for modern APIs and web applications.",
          },
          {
            icon: <FileCode size={24} />,
            title: "XML Advantages",
            desc: "Self-describing tags, rich metadata support, schema validation, comments, ideal for enterprise and complex documents.",
          },
          {
            icon: <Code2 size={24} />,
            title: "Choose Wisely",
            desc: "Consider file size, parsing speed, validation needs, legacy system integration, and team expertise.",
          },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            <div className="feature-icon" aria-hidden="true">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}