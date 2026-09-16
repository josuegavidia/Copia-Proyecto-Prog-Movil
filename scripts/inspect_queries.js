const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Soporte/Desktop/Proyecto NBA Squad Builder/scripts/hoopshype_sample.json', 'utf8'));

const queries = data.dehydratedState?.queries || [];
console.log('Number of queries:', queries.length);
for (const q of queries) {
  console.log('Query key:', q.queryKey);
  if (q.state?.data) {
    console.log('Data preview:', JSON.stringify(q.state.data).slice(0, 500));
  }
}
