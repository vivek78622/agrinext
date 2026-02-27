const fs = require('fs');
let tsx = fs.readFileSync('src/app/crop-advisor/full-analysis/page.tsx', 'utf8');
tsx = tsx.replace(/className="model-node/g, 'className="model-node relative');
fs.writeFileSync('src/app/crop-advisor/full-analysis/page.tsx', tsx);
console.log("Updated model-node classes to be relative.");
