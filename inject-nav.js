const fs   = require('fs');
const path = require('path');

// Load the nav snippet
const nav = fs.readFileSync(path.join(__dirname, 'navigation', 'nav.html'), 'utf8');

// Glob all .html files under root and navigation folder
function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full, filelist);
    } else if (full.endsWith('.html')) {
      filelist.push(full);
    }
  });
  return filelist;
}

walk(__dirname).forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<!-- NAV-INJECT -->')) {
    content = content.replace('<!-- NAV-INJECT -->', nav);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Injected nav into ${file}`);
  }
});