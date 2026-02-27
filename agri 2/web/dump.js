const fs = require('fs');
const tsx = fs.readFileSync('src/app/crop-advisor/full-analysis/page.tsx', 'utf8');

const regex = /<div className="model-node relative[\s\S]*?(?=(<div className="model-node relative|<\/div>\s*<\/section>))/g;
let matches;
let extracted = [];
while ((matches = regex.exec(tsx)) !== null) {
    extracted.push(matches[0]);
}

fs.writeFileSync('extracted.txt', extracted.join('\n\n===========\n\n'));
console.log("Wrote " + extracted.length + " nodes to extracted.txt");
