// Script to fetch every team's roster ratings from HoopsHype and generate complete rosters
const fs = require('fs');
const path = require('path');

const TEAMS_TO_FETCH = [
  'atlanta-hawks',
  'boston-celtics',
  'brooklyn-nets',
  'charlotte-hornets',
  'chicago-bulls',
  'cleveland-cavaliers',
  'dallas-mavericks',
  'denver-nuggets',
  'detroit-pistons',
  'golden-state-warriors',
  'houston-rockets',
  'indiana-pacers',
  'los-angeles-clippers',
  'los-angeles-lakers',
  'memphis-grizzlies',
  'miami-heat',
  'milwaukee-bucks',
  'minnesota-timberwolves',
  'new-orleans-pelicans',
  'new-york-knicks',
  'oklahoma-city-thunder',
  'orlando-magic',
  'philadelphia-76ers',
  'phoenix-suns',
  'portland-trail-blazers',
  'sacramento-kings',
  'san-antonio-spurs',
  'toronto-raptors',
  'utah-jazz',
  'washington-wizards'
];

const DIVISIONS = {
  atlantic: {
    conference: 'Eastern',
    teams: [
      { code: 'bos', name: 'Boston Celtics', abbr: 'BOS', slug: 'boston-celtics' },
      { code: 'bkn', name: 'Brooklyn Nets', abbr: 'BKN', slug: 'brooklyn-nets' },
      { code: 'ny', name: 'New York Knicks', abbr: 'NYK', slug: 'new-york-knicks' },
      { code: 'phi', name: 'Philadelphia 76ers', abbr: 'PHI', slug: 'philadelphia-76ers' },
      { code: 'tor', name: 'Toronto Raptors', abbr: 'TOR', slug: 'toronto-raptors' }
    ]
  },
  central: {
    conference: 'Eastern',
    teams: [
      { code: 'chi', name: 'Chicago Bulls', abbr: 'CHI', slug: 'chicago-bulls' },
      { code: 'cle', name: 'Cleveland Cavaliers', abbr: 'CLE', slug: 'cleveland-cavaliers' },
      { code: 'det', name: 'Detroit Pistons', abbr: 'DET', slug: 'detroit-pistons' },
      { code: 'ind', name: 'Indiana Pacers', abbr: 'IND', slug: 'indiana-pacers' },
      { code: 'mil', name: 'Milwaukee Bucks', abbr: 'MIL', slug: 'milwaukee-bucks' }
    ]
  },
  southeast: {
    conference: 'Eastern',
    teams: [
      { code: 'atl', name: 'Atlanta Hawks', abbr: 'ATL', slug: 'atlanta-hawks' },
      { code: 'cha', name: 'Charlotte Hornets', abbr: 'CHA', slug: 'charlotte-hornets' },
      { code: 'mia', name: 'Miami Heat', abbr: 'MIA', slug: 'miami-heat' },
      { code: 'orl', name: 'Orlando Magic', abbr: 'ORL', slug: 'orlando-magic' },
      { code: 'wsh', name: 'Washington Wizards', abbr: 'WAS', slug: 'washington-wizards' }
    ]
  },
  northwest: {
    conference: 'Western',
    teams: [
      { code: 'den', name: 'Denver Nuggets', abbr: 'DEN', slug: 'denver-nuggets' },
      { code: 'min', name: 'Minnesota Timberwolves', abbr: 'MIN', slug: 'minnesota-timberwolves' },
      { code: 'okc', name: 'Oklahoma City Thunder', abbr: 'OKC', slug: 'oklahoma-city-thunder' },
      { code: 'por', name: 'Portland Trail Blazers', abbr: 'POR', slug: 'portland-trail-blazers' },
      { code: 'utah', name: 'Utah Jazz', abbr: 'UTA', slug: 'utah-jazz' }
    ]
  },
  pacific: {
    conference: 'Western',
    teams: [
      { code: 'gs', name: 'Golden State Warriors', abbr: 'GSW', slug: 'golden-state-warriors' },
      { code: 'lac', name: 'LA Clippers', abbr: 'LAC', slug: 'los-angeles-clippers' },
      { code: 'lal', name: 'Los Angeles Lakers', abbr: 'LAL', slug: 'los-angeles-lakers' },
      { code: 'phx', name: 'Phoenix Suns', abbr: 'PHX', slug: 'phoenix-suns' },
      { code: 'sac', name: 'Sacramento Kings', abbr: 'SAC', slug: 'sacramento-kings' }
    ]
  },
  southwest: {
    conference: 'Western',
    teams: [
      { code: 'dal', name: 'Dallas Mavericks', abbr: 'DAL', slug: 'dallas-mavericks' },
      { code: 'hou', name: 'Houston Rockets', abbr: 'HOU', slug: 'houston-rockets' },
      { code: 'mem', name: 'Memphis Grizzlies', abbr: 'MEM', slug: 'memphis-grizzlies' },
      { code: 'no', name: 'New Orleans Pelicans', abbr: 'NOP', slug: 'new-orleans-pelicans' },
      { code: 'sa', name: 'San Antonio Spurs', abbr: 'SAS', slug: 'san-antonio-spurs' }
    ]
  }
};

function normalizeName(str) {
  return str
    .replace(/\./g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function normalizePos(pos) {
  if (!pos) return { pos: 'SF', sec: undefined };
  pos = pos.toUpperCase().trim();
  if (pos === 'PG') return { pos: 'PG', sec: 'SG' };
  if (pos === 'SG') return { pos: 'SG', sec: 'PG' };
  if (pos === 'SF') return { pos: 'SF', sec: 'PF' };
  if (pos === 'PF') return { pos: 'PF', sec: 'C' };
  if (pos === 'C') return { pos: 'C', sec: 'PF' };
  if (pos === 'G') return { pos: 'PG', sec: 'SG' };
  if (pos === 'F') return { pos: 'SF', sec: 'PF' };
  return { pos: 'SF', sec: undefined };
}

function calculateStats(ovr, pos) {
  const baseOff = Math.min(99, Math.max(65, Math.round(ovr + 1)));
  const baseDef = Math.min(99, Math.max(65, Math.round(ovr - 1)));
  let three = Math.min(99, Math.max(50, Math.round(ovr - 2)));
  let dunk = Math.min(99, Math.max(45, Math.round(ovr - 4)));
  let speed = Math.min(99, Math.max(60, Math.round(ovr - 1)));
  let play = Math.min(99, Math.max(55, Math.round(ovr - 3)));
  let reb = Math.min(99, Math.max(50, Math.round(ovr - 4)));

  if (pos === 'PG' || pos === 'SG') {
    speed = Math.min(98, speed + 5);
    play = Math.min(98, play + 6);
    three = Math.min(98, three + 4);
    reb = Math.max(50, reb - 10);
  } else if (pos === 'C' || pos === 'PF') {
    reb = Math.min(98, reb + 10);
    dunk = Math.min(98, dunk + 5);
    three = pos === 'C' ? Math.max(30, three - 15) : three;
    speed = Math.max(55, speed - 6);
  }
  return { off: baseOff, def: baseDef, three, dunk, speed, play, reb };
}

async function scrapeAllHoopsHypeRatings() {
  const ratings = {};
  console.log('Fetching HoopsHype ratings for all 30 teams...');

  for (const slug of TEAMS_TO_FETCH) {
    try {
      console.log(`  Fetching HoopsHype: ${slug}...`);
      const url = `https://www.hoopshype.com/nba-2k/players/?team=${slug}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const html = await res.text();
      const m = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (m) {
        const nextData = JSON.parse(m[1]);
        const queries = nextData.props?.pageProps?.dehydratedState?.queries || [];
        for (const q of queries) {
          const rosters = q.state?.data?.rosters?.rosters || [];
          for (const roster of rosters) {
            const players = roster.players || [];
            for (const p of players) {
              const full = p.fullPlayer;
              if (full && full.firstName && full.lastName && full.videoGameRatings?.rating) {
                const fullName = `${full.firstName} ${full.lastName}`.trim();
                const key = normalizeName(fullName);
                ratings[key] = full.videoGameRatings.rating;
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(`Error fetching ${slug}:`, e.message);
    }
  }

  console.log(`Total HoopsHype player ratings extracted: ${Object.keys(ratings).length}`);
  fs.writeFileSync(path.resolve(__dirname, 'hoopshype_all_ratings.json'), JSON.stringify(ratings, null, 2));
  return ratings;
}

async function run() {
  const hhRatings = await scrapeAllHoopsHypeRatings();

  for (const [divKey, divData] of Object.entries(DIVISIONS)) {
    console.log(`\nGenerating roster file for ${divKey}...`);
    const playerLines = [];

    for (const team of divData.teams) {
      console.log(`  ESPN Roster for ${team.name}...`);
      const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${team.code}/roster`;
      const res = await fetch(espnUrl);
      const json = await res.json();
      const athletes = json.athletes || [];

      // Find HoopsHype rating for each athlete
      athletes.forEach(ath => {
        const norm = normalizeName(ath.fullName);
        let ovr = hhRatings[norm];
        if (!ovr) {
          // fuzzy check
          for (const [k, v] of Object.entries(hhRatings)) {
            if (norm.includes(k) || k.includes(norm)) {
              ovr = v;
              break;
            }
          }
        }
        ath._ovr = ovr;
      });

      // Sort athletes by rating descending
      athletes.sort((a, b) => {
        const ovrA = a._ovr || 72;
        const ovrB = b._ovr || 72;
        return ovrB - ovrA;
      });

      playerLines.push(`  // ==========================================`);
      playerLines.push(`  // ${team.name.toUpperCase()} (${team.abbr})`);
      playerLines.push(`  // ==========================================`);

      athletes.forEach((ath, idx) => {
        let ovr = ath._ovr;
        if (!ovr) {
          if (idx === 0) ovr = 82;
          else if (idx === 1) ovr = 80;
          else if (idx === 2) ovr = 78;
          else if (idx === 3) ovr = 77;
          else if (idx === 4) ovr = 76;
          else if (idx < 10) ovr = Math.max(73, 76 - (idx - 4));
          else ovr = Math.max(70, 72 - (idx - 9));
        }

        const id = `${team.abbr.toLowerCase()}-${ath.id}`;
        const nbaPersonId = parseInt(ath.id, 10) || 100000 + idx;
        const name = ath.fullName.replace(/'/g, "\\'");
        const jersey = parseInt(ath.jersey, 10) || (idx + 1);
        const { pos, sec } = normalizePos(ath.position?.abbreviation);
        const stats = calculateStats(ovr, pos);
        let unit = 'RESERVE';
        if (idx < 5) unit = 'STARTER';
        else if (idx < 10) unit = 'BENCH';

        const secStr = sec ? `'${sec}'` : 'undefined';
        const nickname = ath.displayName && ath.displayName !== ath.fullName ? `, '${ath.displayName.replace(/'/g, "\\'")}'` : '';

        playerLines.push(`  createPlayer('${id}', ${nbaPersonId}, '${name}', '${team.name}', '${team.abbr}', '${divData.conference}', '${pos}', ${secStr}, ${jersey}, ${ovr}, ${stats.off}, ${stats.def}, ${stats.three}, ${stats.dunk}, ${stats.speed}, ${stats.play}, ${stats.reb}, '${unit}'${nickname}),`);
      });
    }

    const varName = `${divKey.toUpperCase()}_PLAYERS`;
    const content = `import { NBAPlayer } from '../../types';\nimport { createPlayer } from './helper';\n\nexport const ${varName}: NBAPlayer[] = [\n${playerLines.join('\n')}\n];\n`;

    const targetPath = path.resolve(__dirname, `../src/data/rosters/${divKey}.ts`);
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`Saved ${targetPath}`);
  }
}

run().catch(console.error);
