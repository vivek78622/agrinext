const fs = require('fs');

let pageTsx = fs.readFileSync('src/app/crop-advisor/full-analysis/page.tsx', 'utf8');
let stitchHtml = fs.readFileSync('stitch_dashboard.html', 'utf8');

const rightPanelMatch = stitchHtml.match(/<section class="px-4 mt-8 space-y-4">([\s\S]*?)<\/section>/);
let rightPanelContent = rightPanelMatch ? rightPanelMatch[1] : '';

// Convert HTML to JSX
rightPanelContent = rightPanelContent
    .replace(/class=/g, 'className=')
    .replace(/<!--.*?-->/gs, '')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-dasharray=/g, 'strokeDasharray=')
    .replace(/viewbox=/g, 'viewBox=')
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

// Replace custom styles with relative paths
rightPanelContent = rightPanelContent.replace(/url\('https:\/\/lh3\.googleusercontent\.com.*?'\)/g, "url('/images/stitch_satellite.jpg')");

// Create Left Panel Models using regex
let leftPanelModels = [];
const modelNodesRegex = /<div className="model-node relative[\s\S]*?(?=(<div className="model-node relative|<\/div>\s*<\/section>))/g;

let matches;
while ((matches = modelNodesRegex.exec(pageTsx)) !== null) {
    let nodeContent = matches[0];

    // Extractor Logic
    let numberMatch = nodeContent.match(/<span className="font-mono font-bold[^>]*>(\d+)<\/span>/);
    let titleMatch = nodeContent.match(/<h4.*?>(.*?)<\/h4>/s);
    let titleText = titleMatch ? titleMatch[1].replace(/<[^>]*>?/gm, '').trim() : "Analysis";
    // clean up generic prefix/suffix like <span material.. span>
    titleText = titleText.replace(/^[a-z_]+/, '').trim();

    let scoreMatch = nodeContent.match(/Score<\/span>\s*<span[^>]*>(\d+)\/100<\/span>/);
    let score = scoreMatch ? scoreMatch[1] : "85";

    let status = parseInt(score) >= 80 ? "Optimal" : "Moderate";

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

    let innerContentMatch = nodeContent.match(/<div className="space-y-4">([\s\S]*)/);
    let innerContent = innerContentMatch ? innerContentMatch[1] : "";

    // clean up trailing div that didn't match perfectly
    const countDivsOpen = (innerContent.match(/<div/g) || []).length;
    const countDivsClose = (innerContent.match(/<\/div>/g) || []).length;

    let cleanedInnerContent = innerContent;
    if (countDivsClose > countDivsOpen) {
        for (let i = 0; i < (countDivsClose - countDivsOpen); i++) {
            let lastDiv = cleanedInnerContent.lastIndexOf('</div>');
            if (lastDiv !== -1) {
                cleanedInnerContent = cleanedInnerContent.substring(0, lastDiv) + cleanedInnerContent.substring(lastDiv + 6);
            }
        }
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
        ${cleanedInnerContent}
        </div>
    </ModelCard>`;
    leftPanelModels.push(cardJsx);
}

// Ensure at least models are found
if (leftPanelModels.length === 0) {
    console.log("No models found. Exiting to avoid destroying file.");
    process.exit(1);
}

// Reconstruct page.tsx
const mainRegex = /<main className="flex-1 flex overflow-hidden">[\s\S]*?<\/main>/;

// Build the new main layout based on the user's ratio and design
const newMainContent = `
<main className="grid grid-cols-[1.3fr_0.9fr] h-[calc(100vh-3.5rem)] overflow-hidden">
  {/* LEFT PANEL */}
  <section className="overflow-y-auto p-10 bg-white border-r">
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
        ${leftPanelModels.join('\\n')}
      </div>
    </div>
  </section>

  {/* RIGHT PANEL */}
  <section className="overflow-y-auto p-6 bg-slate-50 border-l border-slate-200">
     <div className="max-w-md mx-auto space-y-6 pb-32">
        
        {/* Right Panel Extracted Content from Stitch */}
        ${rightPanelContent}
        
     </div>
  </section>
</main>
`;

if (!pageTsx.includes('import ModelCard')) {
    pageTsx = pageTsx.replace(/import .*? from .*?;\n/, match => match + "import ModelCard from '@/components/ModelCard';\\n");
}

let modifiedTsx = pageTsx.replace(mainRegex, newMainContent);

fs.writeFileSync('src/app/crop-advisor/full-analysis/page.tsx', modifiedTsx);
console.log('Successfully injected the new ExpandableCard layout and Right panel data.');
