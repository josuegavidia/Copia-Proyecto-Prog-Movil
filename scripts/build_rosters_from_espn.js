// Script to fetch live official rosters from ESPN for all 30 teams and apply official 2K Top 100 ratings
const fs = require('fs');
const path = require('path');

const TOP_100_RATINGS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'top100_ratings.json'), 'utf8'));

// Fix any HTML entity encoding in keys
const CLEAN_TOP_100 = {};
for (const [k, v] of Object.entries(TOP_100_RATINGS)) {
  let cleanKey = k
    .replace(/&amp;#39;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/cDarius/g, "Darius")
    .replace(/\./g, '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  CLEAN_TOP_100[cleanKey] = v;
}

// Additional notable players beyond top 100
const EXTRA_RATINGS = {
  'kristaps porzingis': 84,
  'sam hauser': 79,
  'al horford': 79,
  'neemias queta': 76,
  'mitchell robinson': 81,
  'mike conley': 79,
  'kentavious caldwell-pope': 79,
  'dorian finney-smith': 78,
  'nic claxton': 82,
  'cameron johnson': 80,
  'dennis schroder': 80,
  'ben simmons': 77,
  'kelly oubre jr': 80,
  'andre drummond': 79,
  'caleb martin': 78,
  'kyle lowry': 77,
  'eric gordon': 76,
  'guerschon yabusele': 78,
  'terance mann': 78,
  'keon ellis': 78,
  'tre jones': 78,
  'keldon johnson': 80,
  'jeremy sochan': 80,
  'zach collins': 77,
  'harrison barnes': 78,
  'chris paul': 81,
  'dangelo russell': 82,
  'dalton knecht': 80,
  'reed sheppard': 80,
  'zaccharie risacher': 80,
  'zach edey': 80,
  'jared mccain': 80,
  'ron holland ii': 78,
  'tidjane salaun': 77,
  'aj dybantsa': 84,
  'bronny james': 72
};

const DIVISIONS = {
  atlantic: {
    conference: 'Eastern',
    teams: [
      { code: 'bos', name: 'Boston Celtics', abbr: 'BOS' },
      { code: 'bkn', name: 'Brooklyn Nets', abbr: 'BKN' },
      { code: 'ny', name: 'New York Knicks', abbr: 'NYK' },
      { code: 'phi', name: 'Philadelphia 76ers', abbr: 'PHI' },
      { code: 'tor', name: 'Toronto Raptors', abbr: 'TOR' }
    ]
  },
  central: {
    conference: 'Eastern',
    teams: [
      { code: 'chi', name: 'Chicago Bulls', abbr: 'CHI' },
      { code: 'cle', name: 'Cleveland Cavaliers', abbr: 'CLE' },
      { code: 'det', name: 'Detroit Pistons', abbr: 'DET' },
      { code: 'ind', name: 'Indiana Pacers', abbr: 'IND' },
      { code: 'mil', name: 'Milwaukee Bucks', abbr: 'MIL' }
    ]
  },
  southeast: {
    conference: 'Eastern',
    teams: [
      { code: 'atl', name: 'Atlanta Hawks', abbr: 'ATL' },
      { code: 'cha', name: 'Charlotte Hornets', abbr: 'CHA' },
      { code: 'mia', name: 'Miami Heat', abbr: 'MIA' },
      { code: 'orl', name: 'Orlando Magic', abbr: 'ORL' },
      { code: 'wsh', name: 'Washington Wizards', abbr: 'WAS' }
    ]
  },
  northwest: {
    conference: 'Western',
    teams: [
      { code: 'den', name: 'Denver Nuggets', abbr: 'DEN' },
      { code: 'min', name: 'Minnesota Timberwolves', abbr: 'MIN' },
      { code: 'okc', name: 'Oklahoma City Thunder', abbr: 'OKC' },
      { code: 'por', name: 'Portland Trail Blazers', abbr: 'POR' },
      { code: 'utah', name: 'Utah Jazz', abbr: 'UTA' }
    ]
  },
  pacific: {
    conference: 'Western',
    teams: [
      { code: 'gs', name: 'Golden State Warriors', abbr: 'GSW' },
      { code: 'lac', name: 'LA Clippers', abbr: 'LAC' },
      { code: 'lal', name: 'Los Angeles Lakers', abbr: 'LAL' },
      { code: 'phx', name: 'Phoenix Suns', abbr: 'PHX' },
      { code: 'sac', name: 'Sacramento Kings', abbr: 'SAC' }
    ]
  },
  southwest: {
    conference: 'Western',
    teams: [
      { code: 'dal', name: 'Dallas Mavericks', abbr: 'DAL' },
      { code: 'hou', name: 'Houston Rockets', abbr: 'HOU' },
      { code: 'mem', name: 'Memphis Grizzlies', abbr: 'MEM' },
      { code: 'no', name: 'New Orleans Pelicans', abbr: 'NOP' },
      { code: 'sa', name: 'San Antonio Spurs', abbr: 'SAS' }
    ]
  }
};

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

function getRating(name, index) {
  const clean = name
    .replace(/\./g, '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const [k, v] of Object.entries(CLEAN_TOP_100)) {
    if (clean === k || clean.includes(k) || k.includes(clean)) {
      return v;
    }
  }

  for (const [k, v] of Object.entries(EXTRA_RATINGS)) {
    if (clean === k || clean.includes(k) || k.includes(clean)) {
      return v;
    }
  }

  if (index === 0) return 82;
  if (index === 1) return 80;
  if (index === 2) return 79;
  if (index === 3) return 78;
  if (index === 4) return 77;
  if (index < 10) return Math.max(74, 77 - (index - 4));
  return Math.max(70, 73 - (index - 9));
}

async function run() {
  for (const [divKey, divData] of Object.entries(DIVISIONS)) {
    console.log(`Processing ${divKey}...`);
    const playerLines = [];

    for (const team of divData.teams) {
      console.log(`  Fetching ${team.name}...`);
      const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${team.code}/roster`;
      const res = await fetch(url);
      const json = await res.json();
      const athletes = json.athletes || [];

      // Sort athletes by rating descending
      athletes.sort((a, b) => {
        const ovrA = getRating(a.fullName, 99);
        const ovrB = getRating(b.fullName, 99);
        return ovrB - ovrA;
      });

      playerLines.push(`  // ==========================================`);
      playerLines.push(`  // ${team.name.toUpperCase()} (${team.abbr})`);
      playerLines.push(`  // ==========================================`);

      athletes.forEach((ath, idx) => {
        const id = `${team.abbr.toLowerCase()}-${ath.id}`;
        const nbaPersonId = parseInt(ath.id, 10) || 100000 + idx;
        const name = ath.fullName.replace(/'/g, "\\'");
        const jersey = parseInt(ath.jersey, 10) || (idx + 1);
        const { pos, sec } = normalizePos(ath.position?.abbreviation);
        const ovr = getRating(ath.fullName, idx);
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
