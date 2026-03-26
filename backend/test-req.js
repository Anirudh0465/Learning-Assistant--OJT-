import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
  const pdfParse = require('pdf-parse');
  console.log("Success! Type:", typeof pdfParse);
} catch(e) {
  console.error("Require failed:", e);
}
