// inject-favicon.js
// Usage: node inject-favicon.js

const fs         = require('fs');
const { globSync } = require('glob');

const ICON_TAG = '<link rel="icon" href="/flight.ico" type="image/x-icon" />';
const FOLDERS  = ['pages', 'navigation', 'timeline', 'transcript'];

FOLDERS.forEach(folder => {
  const files = globSync(`${folder}/**/*.html`);

  files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');

    if (!/rel=["']icon["']/.test(html)) {
      html = html.replace(
        /<head([^>]*)>/i,
        `<head$1>\n  ${ICON_TAG}`
      );
      fs.writeFileSync(file, html, 'utf8');
      console.log(`✅ Injected favicon into ${file}`);
    }
  });
});