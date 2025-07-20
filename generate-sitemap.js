// generate-sitemap.js
const fs = require('fs');
const Papa = require('papaparse');

const CSV_PATH    = 'crashes.csv';
const OUTPUT_PATH = 'sitemap.xml';
const HOSTNAME    = 'https://www.aircrasharchive.com';

const csvText = fs.readFileSync(CSV_PATH, 'utf8');
const { data: entries } = Papa.parse(csvText, { header: true });

let urls = [{
  loc: `${HOSTNAME}/`,
  changefreq: 'daily',
  priority: 1.0
}];

entries.forEach(row => {
  if (row.timeline) {
    urls.push({ loc: `${HOSTNAME}/${row.timeline}`, changefreq: 'monthly', priority: 0.8 });
  }
  if (row.cvr && row.cvr.endsWith('.html')) {
    urls.push({ loc: `${HOSTNAME}/${row.cvr}`,     changefreq: 'monthly', priority: 0.5 });
  }
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n`;
urls.forEach(u => {
  xml += `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n\n`;
});
xml += `</urlset>\n`;

fs.writeFileSync(OUTPUT_PATH, xml);
console.log(`✅ Generated sitemap.xml with ${urls.length} entries.`);