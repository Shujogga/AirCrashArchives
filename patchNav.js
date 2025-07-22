const fs = require('fs');
const path = require('path');

function findHTML(dir, out = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findHTML(fullPath, out);
    } else if (file.endsWith('.html')) {
      out.push(fullPath);
    }
  });
  return out;
}

function patchHeadings(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Match the comment and following h1 tag
  content = content.replace(
    /(<!-- End Google Tag Manager \(noscript\) -->\s*\n\s*)<h1>([^<]+)<\/h1>/i,
    (_, comment, titleText) => `${comment}<h2>${titleText}</h2>`
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated heading: ${filePath}`);
  }
}

console.log('🔧 Changing <h1> to <h2> under GTM comment…');
const htmlFiles = findHTML(__dirname);
htmlFiles.forEach(patchHeadings);
console.log('🎉 Done!');