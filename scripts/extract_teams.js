const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/Soporte/Desktop/Proyecto NBA Squad Builder/scripts/hoopshype_sample.json', 'utf8'));

const queries = data.dehydratedState?.queries || [];
const teamQuery = queries.find(q => q.queryKey && q.queryKey.includes('teamsOnNba2kPlayerTab'));
if (teamQuery && teamQuery.state?.data?.teams?.teams) {
  const teams = teamQuery.state.data.teams.teams.map(t => ({
    id: t.id,
    name: t.teamName,
    slug: t.teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));
  console.log(JSON.stringify(teams, null, 2));
  fs.writeFileSync('C:/Users/Soporte/Desktop/Proyecto NBA Squad Builder/scripts/hoopshype_teams.json', JSON.stringify(teams, null, 2));
}
