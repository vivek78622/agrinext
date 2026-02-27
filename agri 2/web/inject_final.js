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

rightPanelContent = rightPanelContent.replace(/url\('https:\/\/lh3\.googleusercontent\.com.*?'\)/g, "url('/images/stitch_satellite.jpg')");


const mainRegex = /<main className="flex-1 flex overflow-hidden">[\s\S]*?<\/main>/;

const newMainContent = `
<main className="grid grid-cols-[1.3fr_0.9fr] h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-50">
  {/* LEFT PANEL */}
  <section className="overflow-y-auto p-10 bg-white border-r border-slate-200">
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

      {typeof TimelineNodes !== 'undefined' ? <TimelineNodes /> : null}
      
    </div>
  </section>

  {/* RIGHT PANEL */}
  <section className="overflow-y-auto p-8 bg-slate-50">
     <div className="max-w-md mx-auto space-y-6 pb-32">
        
        {/* Right Panel Extracted Content from Stitch */}
        ${rightPanelContent}
        
     </div>
  </section>
</main>
`;

if (!pageTsx.includes('import TimelineNodes')) {
    pageTsx = pageTsx.replace(/import .*? from .*?;\n/, match => match + "import TimelineNodes from '@/components/TimelineNodes';\\n");
}

let modifiedTsx = pageTsx.replace(mainRegex, newMainContent);

fs.writeFileSync('src/app/crop-advisor/full-analysis/page.tsx', modifiedTsx);
console.log('Successfully injected the new Right panel and TimelineNodes layout into page.tsx.');
