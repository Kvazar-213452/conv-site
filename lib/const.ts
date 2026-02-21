export const THEMES = {
  dark: { label: "Dark" },
  light: { label: "Light" },
  nord: { label: "Nord" },
  rose: { label: "Rose" },
  matrix: { label: "Matrix" },
} as const;

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