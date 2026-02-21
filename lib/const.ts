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
city: Kyiv
hobbies:
  - reading
  - coding
address:
  street: Khreshchatyk
  zip: "01001"`;

export const EXAMPLE_CSV = `name,age,city
Alice,30,Kyiv
Bob,25,Lviv
Carol,28,Odesa`;

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
  <city>Kyiv</city>
  <hobbies>
    <item>reading</item>
    <item>coding</item>
  </hobbies>
  <address>
    <street>Khreshchatyk</street>
    <zip>01001</zip>
  </address>
</root>`;

// ===============     ===============
//                another
// ===============     ===============

export const EXAMPLE_SQL = `INSERT INTO "users" ("name", "age", "email", "city", "active", "created_at")
VALUES
  ('Alice', 30, 'alice@example.com', 'Kyiv', TRUE, '2024-01-15T10:30:00.000Z'),
  ('Bob', 25, 'bob@example.com', 'Lviv', TRUE, '2024-02-20T08:00:00.000Z');`;

// ===============     ===============
//                another
// ===============     ===============

