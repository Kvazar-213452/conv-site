export const THEMES = {
  dark: { label: "Dark" },
  light: { label: "Light" },
  nord: { label: "Nord" },
  rose: { label: "Rose" },
  matrix: { label: "Matrix" },
} as const;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_JSON = `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample application",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "features": ["ssr", "api-routes", "typescript"],
  "config": {
    "port": 3000,
    "debug": false,
    "database": null
  }
}`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_YAML = `name: Alice
age: 30
city: Austin
hobbies:
  - reading
  - coding
address:
  street: Elm Street
  zip: "78701"`;

export const EXAMPLE_CSV = `name,age,city
Alice,30,Austin
Bob,25,Denver
Carol,28,Portland`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_PRISMA = `model User {
  id        Int      @id @default(autoincrement())
  name      String
  age       Int
  email     String   @unique
  city      String?
  createdAt DateTime @default(now())
  hobbies   String[]
  address   Address?
}

model Address {
  id     Int    @id @default(autoincrement())
  street String
  zip    String
}`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>Alice</name>
  <age>30</age>
  <city>Austin</city>
  <hobbies>
    <item>reading</item>
    <item>coding</item>
  </hobbies>
  <address>
    <street>Elm Street</street>
    <zip>78701</zip>
  </address>
</root>`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_SQL = `INSERT INTO "users" ("name", "age", "email", "city", "active", "created_at")
VALUES
  ('Alice', 30, 'alice@example.com', 'Austin', TRUE, '2024-01-15T10:30:00.000Z'),
  ('Bob', 25, 'bob@example.com', 'Denver', TRUE, '2024-02-20T08:00:00.000Z');`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_TS = `interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface User {
  userId: number;
  fullName: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  address: Address;
  tags: string[];
}`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_DATES = `2024-01-15
2024-01-15T08:00:00Z
2024-01-15T10:00:00+02:00
Jan 15 2024
December 31, 2024 23:59:59`;

export const EXAMPLE_TIMESTAMPS = `1705305600
1705305600000
0
-62135596800`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_ENV = `# Application
APP_NAME="My App"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://example.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_db
DB_USER=postgres
DB_PASSWORD="p@ssw0rd#secret" # keep this safe!

# Auth
JWT_SECRET=super_long_secret_key_here
JWT_EXPIRES_IN=3600

# Feature flags
FEATURE_DARK_MODE=true
FEATURE_BETA=false`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_MD = `# Hello, Markdown!

This is a **Markdown → HTML** converter with *live preview* and syntax highlighting.

## Features

- **Bold**, *italic*, ~~strikethrough~~
- \`inline code\` and fenced code blocks
- Links, images, tables, and more

## Code example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Name     | Type   | Description       |
|----------|--------|-------------------|
| input    | string | Markdown source   |
| output   | string | HTML result       |

> Blockquotes work too. Try editing this!

---

Visit [Anthropic](https://anthropic.com) for more.
`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_STRING = `Hello, World!
Good morning, Universe!
{"token":"abc123","expires":3600}`;

export const EXAMPLE_BASE64 = `SGVsbG8sIFdvcmxkIQ==
R29vZCBtb3JuaW5nLCBVbml2ZXJzZSE=
eyJ0b2tlbiI6ImFiYzEyMyIsImV4cGlyZXMiOjM2MDB9`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_PLAIN = `https://example.com/search?q=hello world&lang=en&tag=greeting
user@example.com
price=100$&discount=20%`;

export const EXAMPLE_ENCODED = `https://example.com/search?q=hello%20world&lang=en&tag=greeting
user%40example.com
price%3D100%24%26discount%3D20%25`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_UUID = `550e8400-e29b-41d4-a716-446655440000
6ba7b810-9dad-11d1-80b4-00c04fd430c8
6ba7b811-9dad-11d1-80b4-00c04fd430c8`;

export const EXAMPLE_BASE641 = `VQ6EAOKbQdSnFkRmVUQAAA==
a6e4EMna0R2AtEAAwE/UMIg=
a6e4EZ3a0R2AtEAAwE/UMIg=`;
