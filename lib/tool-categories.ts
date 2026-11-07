export const toolCategories = [
  { id: 'files', name: 'PDF, photos & media', symbol: '▧', description: 'Convert documents, trim WAV audio, prepare photos and work with PDFs.' },
  { id: 'numbers', name: 'Calculators & everyday', symbol: '24', description: 'Calculate money, age, grades, recipes, units and time.' },
  { id: 'data', name: 'JSON & data', symbol: '{}', description: 'Format, validate and transform structured data.' },
  { id: 'code', name: 'Code & databases', symbol: '</>', description: 'Generate models, schemas and database snippets.' },
  { id: 'text', name: 'Text & lists', symbol: 'Aa', description: 'Write, compare and clean up everyday text.' },
  { id: 'encoding', name: 'Encoding', symbol: '01', description: 'Move between text, binary and encoded formats.' },
  { id: 'security', name: 'Security & IDs', symbol: '#', description: 'Inspect tokens, generate identifiers and hash text.' },
  { id: 'web', name: 'Web & SEO', symbol: '↗', description: 'Work with URLs, requests, markup and crawl rules.' },
  { id: 'css', name: 'CSS & design', symbol: '◒', description: 'Create colors, layouts and ready-to-use CSS.' },
] as const;
export type ToolCategory = (typeof toolCategories)[number]['id'];
