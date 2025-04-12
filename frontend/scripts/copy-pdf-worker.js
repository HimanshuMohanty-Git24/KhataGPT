const fs = require('fs');
const path = require('path');

console.log('Searching for PDF.js worker file...');

// Possible locations for the PDF worker file in different pdfjs-dist versions
const possibleWorkerPaths = [
  'node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js',
  'node_modules/pdfjs-dist/legacy/build/pdf.worker.js',
  'node_modules/pdfjs-dist/build/pdf.worker.min.js',
  'node_modules/pdfjs-dist/build/pdf.worker.js',
  'node_modules/pdfjs-dist/build/pdf.worker.mjs'
];

// Destination path in the public folder
const destPath = 'public/pdf.worker.js';

// Ensure destination directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// Try each possible path until we find one that exists
let found = false;
for (const workerPath of possibleWorkerPaths) {
  const fullPath = path.join(__dirname, '..', workerPath);
  if (fs.existsSync(fullPath)) {
    console.log(`Found PDF worker at: ${workerPath}`);
    fs.copyFileSync(fullPath, path.join(__dirname, '..', destPath));
    found = true;
    console.log(`Successfully copied PDF worker to: ${destPath}`);
    break;
  }
}

if (!found) {
  console.warn('Warning: PDF worker file not found in any expected location.');
  console.warn('Your PDF viewer may need to use the bundled worker or CDN approach instead.');
} else {
  // Try to get version info from package.json instead
  try {
    const packageJsonPath = path.join(__dirname, '..', 'node_modules/pdfjs-dist/package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      console.log(`Using PDF.js version: ${packageJson.version}`);
    }
  } catch (e) {
    // Do nothing if we can't read the version
  }
}