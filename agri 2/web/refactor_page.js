const fs = require('fs');

let pageTsx = fs.readFileSync('src/app/crop-advisor/full-analysis/page.tsx', 'utf8');

// The new Right Panel HTML from Stitch (downloaded to stitch_dashboard.html)
let stitchHtml = fs.readFileSync('stitch_dashboard.html', 'utf8');

// 1. Extract the Right panel from stitchHtml
const rightPanelMatch = stitchHtml.match(/<section class="px-4 mt-8 space-y-4">([\s\S]*?)<\/section>/);
let rightPanelContent = rightPanelMatch ? rightPanelMatch[1] : '';

// Convert HTML to JSX for the right panel
rightPanelContent = rightPanelContent
    .replace(/class=/g, 'className=')
    .replace(/<!--.*?-->/gs, '')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-dasharray=/g, 'strokeDasharray=')
    .replace(/viewbox=/g, 'viewBox=')
    .replace(/-rotate-18/g, '-rotate-12') // or keep 18
    .replace(/background-image: url\('(.*?)'\)/g, "backgroundImage: `url('$1')`")
    .replace(/style="([^"]+)"/g, (match, styles) => {
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

// 2. Wrap existing timeline in ModelCard from page.tsx
// Find all model-nodes in page.tsx
let leftPanelModels = [];
let currentIndex = 0;
while (true) {
    const nodeStart = pageTsx.indexOf('<div className="model-node', currentIndex);
    if (nodeStart === -1) break;

    // Find where the node ends. We assume the next node starts at `<div className="model-node` or we hit the right panel `<section className="w-[35%]`
    let nextNodeStart = pageTsx.indexOf('<div className="model-node', nodeStart + 10);
    const endSectionStart = pageTsx.indexOf('<section className="w-[35%]', nodeStart);

    let nodeEnd = -1;
    if (nextNodeStart !== -1 && nextNodeStart < endSectionStart) {
        nodeEnd = nextNodeStart;
    } else {
        nodeEnd = endSectionStart;
    }

    let nodeContent = pageTsx.substring(nodeStart, nodeEnd).trim();
    // Remove the trailing </div> from the previous element if any

    // Extract metadata from this chunk
    let numberMatch = nodeContent.match(/<span className="font-mono font-bold[^>]*>(\d+)<\/span>/);
    let titleMatch = nodeContent.match(/<h4.*?>(.*?)<\/h4>/s);
    let titleText = titleMatch ? titleMatch[1].replace(/<[^>]*>?/gm, '').trim() : "Analysis";
    let scoreMatch = nodeContent.match(/Score<\/span>\s*<span[^>]*>(\d+)\/100<\/span>/);
    let score = scoreMatch ? scoreMatch[1] : "85";

    // Status can be derived or static
    let status = "Optimal";
    if (score < 80) status = "Moderate";

    let subtitle = "Detailed environmental evaluation";
    if (titleText.includes("Rainfall")) subtitle = "Precipitation and water stress evaluation";
    else if (titleText.includes("Soil")) subtitle = "Nutrient density and pH evaluation";
    else if (titleText.includes("Water Balance")) subtitle = "Cycle deficit and irrigation needs";
    else if (titleText.includes("Climate")) subtitle = "Thermal regime and GDD suitability";
    else if (titleText.includes("Yield")) subtitle = "Production output estimation";
    else if (titleText.includes("Market")) subtitle = "Logistics and mandi distance";
    else if (titleText.includes("Demand")) subtitle = "Market supply and sentiment";
    else if (titleText.includes("Economic")) subtitle = "Cost sensitivity and profit projection";
    else if (titleText.includes("Risk")) subtitle = "Composite risk distribution";
    else if (titleText.includes("Decision Engine")) subtitle = "Final output matrix";

    // Extract the inner content (space-y-4)
    let innerContentMatch = nodeContent.match(/<div className="space-y-4">([\s\S]*)/);
    let innerContent = innerContentMatch ? innerContentMatch[1] : "";
    // Trim the last </div> that originally closed .model-node
    let lastDiv = innerContent.lastIndexOf('</div>');
    if (lastDiv !== -1) {
        innerContent = innerContent.substring(0, lastDiv) + innerContent.substring(lastDiv + 6);
    }
    let lastDiv2 = innerContent.lastIndexOf('</div>');
    if (lastDiv2 !== -1) {
        innerContent = innerContent.substring(0, lastDiv2) + innerContent.substring(lastDiv2 + 6);
    }

    let cardJsx = `
    <ModelCard 
        number="${numberMatch ? numberMatch[1] : '00'}" 
        title="${titleText}" 
        subtitle="${subtitle}" 
        score="${score}"
        status="${status}"
    >
        <div className="space-y-4">
        ${innerContent}
        </div>
    </ModelCard>
    `;
    leftPanelModels.push(cardJsx);
    currentIndex = nodeEnd;
}

// 3. Reconstruct page.tsx
// Find the <main> block
const mainRegex = /<main className="flex-1 flex overflow-hidden">[\s\S]*?<\/main>/;

// Build the new main layout
const newMainContent = `
<main className="grid grid-cols-[1.3fr_0.9fr] h-[calc(100vh-3.5rem)] overflow-hidden">
  {/* LEFT PANEL */}
  <section className="overflow-y-auto p-10 bg-white shadow-sm border-r border-slate-200">
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100 uppercase tracking-widest">
            Primary Recommendation Target
            </span>
            <span className="text-slate-400 text-xs font-mono">Run: 1.42s</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            {bestCrop}{" "}
            <span className="text-slate-300 font-light italic text-2xl">
            {bestCrop === 'Soybean' ? 'Glycine max' : ''}
            </span>
        </h1>
        <p className="text-slate-500 max-w-lg mt-4 text-sm leading-relaxed">
            The AI Decision Engine has completed the 9-stage analysis trace. Review the detailed telemetry below. Click any node to expand insights.
        </p>
      </div>

      <div className="space-y-4">
        ${leftPanelModels.join('\n')}
      </div>
    </div>
  </section>

  {/* RIGHT PANEL */}
  <section className="overflow-y-auto p-6 bg-slate-50 border-l border-slate-200">
     <div className="max-w-md mx-auto space-y-6 pb-32">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 mt-4">
            Live Intelligence
        </h3>
        
        {/* Right Panel Extracted Content from Stitch */}
        ${rightPanelContent}
        
     </div>
  </section>
</main>
`;

// Insert the Import for ModelCard at the top
if (!pageTsx.includes('import ModelCard')) {
    pageTsx = pageTsx.replace(/import .*? from .*?\n/, match => match + "import ModelCard from '@/components/ModelCard';\n");
}

let modifiedTsx = pageTsx.replace(mainRegex, newMainContent);

fs.writeFileSync('src/app/crop-advisor/full-analysis/page.tsx', modifiedTsx);
console.log('Successfully injected the new ExpandableCard layout and Right panel data.');
