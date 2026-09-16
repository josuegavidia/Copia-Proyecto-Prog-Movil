const fs = require('fs');
const content = fs.readFileSync('C:/Users/Soporte/.gemini/antigravity-ide/brain/e67755d8-7a4e-4f38-9d34-60fa1f8e44be/.system_generated/steps/283/content.md', 'utf8');

const tableIndex = content.indexOf('bodyRows');
if (tableIndex !== -1) {
  const snippet = content.slice(tableIndex, tableIndex + 4000);
  console.log(snippet);
} else {
  console.log('bodyRows not found');
}
