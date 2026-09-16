const fs = require('fs');
const content = fs.readFileSync('C:/Users/Soporte/.gemini/antigravity-ide/brain/e67755d8-7a4e-4f38-9d34-60fa1f8e44be/.system_generated/steps/283/content.md', 'utf8');

// Replace &quot; with "
const clean = content.replace(/&quot;/g, '"');

const regex = /"text":\[0,"(\d+)"\]\}.*?"text":\[0,"([^"]+)"\]\}.*?"text":\[0,"(\d+)\s+OVR"\]/gs;
const rows = [];
let match;
while ((match = regex.exec(clean)) !== null) {
  rows.push({ rank: parseInt(match[1]), name: match[2], ovr: parseInt(match[3]) });
}
console.log('Total extracted:', rows.length);
console.log(JSON.stringify(rows.slice(0, 30), null, 2));

const ratingsMap = {};
for (const r of rows) {
  ratingsMap[r.name] = r.ovr;
}
fs.writeFileSync('C:/Users/Soporte/Desktop/Proyecto NBA Squad Builder/scripts/top100_ratings.json', JSON.stringify(ratingsMap, null, 2));
console.log('Saved top100_ratings.json successfully with', Object.keys(ratingsMap).length, 'players');
