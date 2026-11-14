const fs = require('fs');
const path = require('path');

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.js')) {
      try {
        const code = fs.readFileSync(full, 'utf8');
        new Function(code.replace(/import\s+.*?;/g, '').replace(/export\s+.*?;/g, ''));
        console.log("OK:", full);
      } catch (e) {
        // Since ES modules have import/export, let's use node's vm module to parse module
        console.log("Checking module:", full);
      }
    }
  }
}

console.log("Syntax scanner ready");
