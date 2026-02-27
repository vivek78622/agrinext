const fs = require('fs');
const content = fs.readFileSync('extracted.txt', 'utf8');
const nodes = content.split('===========');

let componentCode = `import React from 'react';\nimport ModelCard from './ModelCard';\n\nexport default function TimelineNodes() {\n  return (\n    <div className="space-y-4">\n`;

nodes.forEach((node, index) => {
    if (!node.trim()) return;

    // Extract metadata
    let numberMatch = node.match(/<span className="font-mono font-bold[^>]*>(\d+)<\/span>/);
    let titleMatch = node.match(/<h4.*?>(.*?)<\/h4>/s);
    let titleText = titleMatch ? titleMatch[1].replace(/<[^>]*>?/gm, '').trim() : "Analysis";
    titleText = titleText.replace(/^[a-z_]+/, '').trim(); // clean icons

    let scoreMatch = node.match(/Score<\/span>\s*<span[^>]*>(\d+)\/100<\/span>/) || node.match(/Score<\/span>\\n\\s*<span[^>]*>(\d+)\/100<\/span>/);
    let score = scoreMatch ? scoreMatch[1] : "85";
    if (!scoreMatch) {
        // Handle node 9 specifically which has different HTML structure
        scoreMatch = node.match(/<span className="text-4xl text-emerald-700 font-extrabold drop-shadow-sm">\s*(\d+)%\s*<\/span>/);
        if (scoreMatch) score = scoreMatch[1];
    }

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
    else if (titleText.includes("Decision Engine") || titleText.includes("Final")) {
        titleText = "Final Decision Engine";
        subtitle = "Final output matrix";
        status = "Complete";
    }

    // Extract the inner content
    let startInner = node.indexOf('<div className="space-y-4">');
    if (startInner === -1) startInner = node.indexOf('<div className="space-y-8">'); // Node 9 uses 8

    let innerContent = "";
    if (startInner !== -1) {
        innerContent = node.substring(startInner);

        let openDivs = 0;
        let endIdx = -1;

        // Find matching closing div for the inner content
        let searchContent = innerContent;
        // Simplified matching: we just find the last </div> before the end of the node string
        let contentWithoutEnd = innerContent.substring(innerContent.indexOf('>') + 1);
        let lastDiv = contentWithoutEnd.lastIndexOf('</div>');
        let lastDiv2 = contentWithoutEnd.lastIndexOf('</div>', lastDiv - 1);

        if (titleText.includes("Decision Engine")) {
            // For node 9, the structure is slightly different
            innerContent = contentWithoutEnd.substring(0, contentWithoutEnd.lastIndexOf('</div>'));
        } else {
            innerContent = contentWithoutEnd.substring(0, lastDiv2);
        }
    }

    componentCode += `
      <ModelCard 
        number="${numberMatch ? numberMatch[1] : ('0' + (index + 1)).slice(-2)}" 
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
});

componentCode += `    </div>\n  );\n}\n`;
fs.writeFileSync('src/components/TimelineNodes.tsx', componentCode);
console.log("Created TimelineNodes.tsx successfully.");
