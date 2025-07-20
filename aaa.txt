// inject-gtm.js
const fs   = require('fs');
const path = require('path');

const GTM_ID   = 'G-VSXP6DP1CQ';  // ← your container ID
const HEAD_SNIPPET = 
`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;

const BODY_SNIPPET = 
`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

function walk(dir) {
  for (let file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      html = html.replace(/<head>/i, `<head>\n${HEAD_SNIPPET}`);
      html = html.replace(/<body>/i, `<body>\n${BODY_SNIPPET}`);
      fs.writeFileSync(full, html, 'utf8');
      console.log('Updated', full);
    }
  }
}

// run against your root and also subfolders
walk(path.resolve(__dirname));
console.log('GTM injection complete.');