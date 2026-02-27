const fs = require('fs');

let tsx = fs.readFileSync('src/app/crop-advisor/full-analysis/page.tsx', 'utf8');
let html = fs.readFileSync('stitch_lab.html', 'utf8');

const headerMatch = html.match(/<header.*?<\/header>/s);
const mainMatch = html.match(/<main.*?<\/main>/s);

if (!headerMatch || !mainMatch) {
    console.error("Could not find <header> or <main> in the HTML");
    process.exit(1);
}

// Convert HTML to JSX
function htmlToJsx(str) {
    let jsx = str.replace(/class=/g, 'className=')
        .replace(/<!--.*?-->/gs, ''); // Remove HTML comments

    // Handle style="key: value; key: value;"
    jsx = jsx.replace(/style="([^"]+)"/g, (match, styles) => {
        const parts = styles.split(';');
        const styleObj = {};
        for (let part of parts) {
            const splitIndex = part.indexOf(':');
            if (splitIndex > -1) {
                const k = part.substring(0, splitIndex).trim();
                const v = part.substring(splitIndex + 1).trim();
                if (k && v) {
                    const camelKey = k.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    styleObj[camelKey] = v;
                }
            }
        }
        return `style={${JSON.stringify(styleObj)}}`;
    });

    // Handle self-closing tags
    jsx = jsx.replace(/<br>/g, '<br/>')
        .replace(/<polygon points="([^"]+)"\s*><\/polygon>/g, '<polygon points="$1" />')
        .replace(/<path d="([^"]+)" stroke="([^"]+)" stroke-width="([^"]+)"\s*><\/path>/g, '<path d="$1" stroke="$2" strokeWidth="$3" />')
        .replace(/stroke-width=/g, 'strokeWidth=');

    // Handle Background Images specific fix
    jsx = jsx.replace(/backgroundImage:\s*"url\\('([^']+)'\\)"/g, "backgroundImage: `url('$1')`");

    // Custom fix for the image
    jsx = jsx.replace(
        /style=\{\{"backgroundImage":"url\\('https:\/\/lh3\.googleusercontent\.com.*?\\)'"\}\}/g,
        "style={{ backgroundImage: `url('/images/stitch_satellite.jpg')` }}"
    );

    return jsx;
}

let newHeader = htmlToJsx(headerMatch[0]);
let newMain = htmlToJsx(mainMatch[0]);

// Special React style handling for percentages that got stringified into objects, but let's just do a specific replacement
newMain = newMain.replace(/style=\{\{"width":"98%"\}\}/g, "style={{ width: '98%' }}");
newMain = newMain.replace(/style=\{\{"width":"88%"\}\}/g, "style={{ width: '88%' }}");
newMain = newMain.replace(/style=\{\{"width":"92%"\}\}/g, "style={{ width: '92%' }}");


// Replace in TSX
// We need to match the existing header and main inside viewMode === "full"
const replaceRegexHeader = /<header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50">.*?<\/header>/s;
const replaceRegexMain = /<main className="flex-1 flex overflow-hidden">.*?<\/main>/s;

tsx = tsx.replace(replaceRegexHeader, newHeader);
tsx = tsx.replace(replaceRegexMain, newMain);

fs.writeFileSync('src/app/crop-advisor/full-analysis/page.tsx', tsx);
console.log("Successfully replaced layout.");
