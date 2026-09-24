import { NBAPlayer, ClassicTeam } from '../types';
import { getLegendHeadshotUrl } from './legendHeadshots';
import { getPlayerBio } from './playerBioData';

export const createIconPlayer = (
  id: string,
  nbaPersonId: number,
  name: string,
  team: string,
  teamAbbr: string,
  conference: 'Eastern' | 'Western',
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C',
  secondaryPosition: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | undefined,
  number: number,
  ovr: number,
  offense: number,
  defense: number,
  threePoint: number,
  dunk: number,
  speed: number,
  playmaking: number,
  rebound: number,
  classicTeamYear: string,
  nickname?: string
): NBAPlayer => {
  const finalOvr = Math.max(93, Math.min(99, ovr));
  const bio = getPlayerBio(name, position);
  return {
    id,
    nbaPersonId,
    name,
    nickname,
    team,
    teamAbbr,
    conference,
    position,
    secondaryPosition,
    number,
    rarity: 'ICON',
    isLegend: true,
    classicTeamYear,
    unitType: 'LEGEND',
    stats: {
      ovr: finalOvr,
      offense: Math.max(85, offense),
      defense: Math.max(85, defense),
      threePoint,
      dunk,
      speed: Math.max(75, speed),
      playmaking: Math.max(75, playmaking),
      rebound,
    },
    imageUrl: getLegendHeadshotUrl(id, nbaPersonId),
    height: bio.height,
    country: bio.country,
    countryFlag: bio.countryFlag,
  };
};

export const computeTeamOvr = (starters: NBAPlayer[]): number => {
  if (!starters || starters.length === 0) return 95;
  const sum = starters.reduce((acc, p) => acc + (p.stats?.ovr || 95), 0);
  return Math.round(sum / starters.length);
};

export const createClassicTeam = (
  id: string,
  name: string,
  year: string,
  franchise: string,
  teamAbbr: string,
  logoUrl: string,
  description: string,
  starters: NBAPlayer[]
): ClassicTeam => ({
  id,
  name,
  year,
  franchise,
  teamAbbr,
  logoUrl,
  ovr: computeTeamOvr(starters),
  description,
  starters,
});

// =========================================================================
// GRANDES LEYENDAS INMORTALES DE LA HISTORIA DE LA NBA (ORDENADAS POR OVR)
// =========================================================================
export const NBA_LEGENDS_LIST: NBAPlayer[] = [
  // --- 99 OVR ---
  createIconPlayer('icon-jordan-893', 893, 'Michael Jordan', 'Chicago Bulls', 'CHI', 'Eastern', 'SG', 'SF', 23, 99, 99, 98, 85, 99, 97, 92, 85, "Bulls '96", 'Air Jordan / GOAT'),
  createIconPlayer('icon-lebron-2544', 2544, 'LeBron James', 'Miami Heat', 'MIA', 'Eastern', 'SF', 'PF', 6, 99, 99, 98, 88, 98, 96, 96, 92, "Heat '13", 'King James / The Chosen One'),
  createIconPlayer('icon-wilt-76375', 76375, 'Wilt Chamberlain', 'Los Angeles Lakers', 'LAL', 'Western', 'C', undefined, 13, 99, 99, 99, 30, 99, 92, 85, 99, "Lakers '72", 'The Big Dipper / 100 Points'),
  createIconPlayer('icon-russell-78049', 78049, 'Bill Russell', 'Boston Celtics', 'BOS', 'Eastern', 'C', 'PF', 6, 99, 92, 99, 30, 90, 88, 88, 99, "Celtics '65", 'The Ultimate Winner / 11 Rings'),

  // --- 98 OVR ---
  createIconPlayer('icon-kobe-977', 977, 'Kobe Bryant', 'Los Angeles Lakers', 'LAL', 'Western', 'SG', 'SF', 8, 98, 98, 96, 88, 96, 95, 90, 82, "Lakers '01", 'Black Mamba / 8 & 24'),
  createIconPlayer('icon-magic-77142', 77142, 'Magic Johnson', 'Los Angeles Lakers', 'LAL', 'Western', 'PG', 'SG', 32, 98, 97, 90, 80, 84, 94, 99, 90, "Lakers '87", 'Magic / Showtime'),
  createIconPlayer('icon-bird-1449', 1449, 'Larry Bird', 'Boston Celtics', 'BOS', 'Eastern', 'SF', 'PF', 33, 98, 99, 92, 96, 76, 88, 97, 94, "Celtics '86", 'Larry Legend / 33'),
  createIconPlayer('icon-kareem-76003', 76003, 'Kareem Abdul-Jabbar', 'Los Angeles Lakers', 'LAL', 'Western', 'C', undefined, 33, 98, 99, 95, 35, 88, 76, 82, 98, "Lakers '87", 'Cap / The Skyhook'),
  createIconPlayer('icon-shaq-406', 406, "Shaquille O'Neal", 'Los Angeles Lakers', 'LAL', 'Western', 'C', undefined, 34, 98, 99, 94, 35, 99, 86, 78, 99, "Lakers '01", 'Diesel / Most Dominant Ever'),
  createIconPlayer('icon-curry-201939', 201939, 'Stephen Curry', 'Golden State Warriors', 'GSW', 'Western', 'PG', 'SG', 30, 98, 99, 82, 99, 72, 94, 96, 74, "Warriors '16", 'Chef Curry / Greatest Shooter'),
  createIconPlayer('icon-durant-201142', 201142, 'Kevin Durant', 'Golden State Warriors', 'GSW', 'Western', 'SF', 'PF', 35, 98, 99, 90, 95, 92, 90, 88, 86, "Warriors '17", 'Easy Money Sniper / KD'),
  createIconPlayer('icon-duncan-1495', 1495, 'Tim Duncan', 'San Antonio Spurs', 'SAS', 'Western', 'PF', 'C', 21, 98, 97, 99, 40, 88, 80, 86, 99, "Spurs '03", 'The Big Fundamental'),
  createIconPlayer('icon-olajuwon-165', 165, 'Hakeem Olajuwon', 'Houston Rockets', 'HOU', 'Western', 'C', undefined, 34, 98, 98, 99, 35, 94, 85, 84, 98, "Rockets '94", 'The Dream / Dream Shake'),
  createIconPlayer('icon-westbrook-201566', 201566, 'Russell Westbrook', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 0, 98, 99, 90, 86, 98, 99, 98, 96, "Thunder '17", 'Brodie / Mr. Triple-Double / MVP'),

  // --- 97 OVR ---
  createIconPlayer('icon-iverson-947', 947, 'Allen Iverson', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SG', 'PG', 3, 97, 99, 88, 85, 86, 99, 90, 68, "Sixers '01", 'The Answer / A.I.'),
  createIconPlayer('icon-garnett-708', 708, 'Kevin Garnett', 'Boston Celtics', 'BOS', 'Eastern', 'PF', 'C', 5, 97, 96, 99, 78, 94, 88, 90, 98, "Celtics '08", 'The Big Ticket / KG'),
  createIconPlayer('icon-dirk-1717', 1717, 'Dirk Nowitzki', 'Dallas Mavericks', 'DAL', 'Western', 'PF', 'C', 41, 97, 99, 86, 94, 76, 76, 82, 94, "Mavs '11", 'German Wunderkind / 41'),
  createIconPlayer('icon-barkley-788', 788, 'Charles Barkley', 'Phoenix Suns', 'PHX', 'Western', 'PF', 'SF', 34, 97, 98, 90, 76, 94, 88, 88, 98, "Suns '93", 'Sir Charles / Round Mound'),
  createIconPlayer('icon-oscar-600015', 600015, 'Oscar Robertson', 'Milwaukee Bucks', 'MIL', 'Eastern', 'PG', 'SG', 1, 97, 98, 92, 78, 78, 94, 99, 90, "Bucks '71", 'The Big O / Mr. Triple-Double'),
  createIconPlayer('icon-kawhi-202695', 202695, 'Kawhi Leonard', 'San Antonio Spurs', 'SAS', 'Western', 'SF', 'PF', 2, 97, 98, 99, 90, 92, 90, 86, 88, "Spurs '14", 'The Klaw / 2x Finals MVP'),
  createIconPlayer('icon-drj-76681', 76681, 'Julius Erving', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SF', 'SG', 6, 97, 98, 90, 78, 99, 96, 88, 88, "Sixers '83", 'Dr. J / The High Flyer'),
  createIconPlayer('icon-malone-252', 252, 'Karl Malone', 'Utah Jazz', 'UTA', 'Western', 'PF', 'C', 32, 97, 98, 92, 40, 94, 85, 84, 98, "Jazz '98", 'The Mailman / 2x MVP'),
  createIconPlayer('icon-stockton-304', 304, 'John Stockton', 'Utah Jazz', 'UTA', 'Western', 'PG', undefined, 12, 97, 94, 96, 90, 50, 92, 99, 75, "Jazz '98", 'All-Time Assist Leader'),

  // --- 96 OVR ---
  createIconPlayer('icon-wade-2548', 2548, 'Dwyane Wade', 'Miami Heat', 'MIA', 'Eastern', 'SG', 'PG', 3, 96, 97, 92, 80, 96, 96, 93, 82, "Heat '06", 'Flash / D-Wade'),
  createIconPlayer('icon-pippen-937', 937, 'Scottie Pippen', 'Chicago Bulls', 'CHI', 'Eastern', 'SF', 'PG', 33, 96, 93, 98, 80, 90, 92, 94, 86, "Bulls '96", 'Pip / Defensive Mastermind'),
  createIconPlayer('icon-robinson-764', 764, 'David Robinson', 'San Antonio Spurs', 'SAS', 'Western', 'C', undefined, 50, 96, 95, 99, 35, 94, 85, 80, 98, "Spurs '95", 'El Almirante / The Admiral'),
  createIconPlayer('icon-payton-56', 56, 'Gary Payton', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 20, 96, 95, 99, 85, 80, 95, 96, 78, "Sonics '96", 'The Glove / DPOY'),
  createIconPlayer('icon-rose-201565', 201565, 'Derrick Rose', 'Chicago Bulls', 'CHI', 'Eastern', 'PG', undefined, 1, 96, 99, 84, 86, 96, 99, 95, 72, "Bulls '11", 'Pooh / Youngest MVP'),
  createIconPlayer('icon-kyrie-202681', 202681, 'Kyrie Irving', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'PG', 'SG', 2, 96, 99, 84, 95, 82, 97, 94, 70, "Cavs '16", 'Uncle Drew / The Shot'),
  createIconPlayer('icon-ewing-121', 121, 'Patrick Ewing', 'New York Knicks', 'NYK', 'Eastern', 'C', undefined, 33, 96, 97, 97, 30, 92, 78, 80, 97, "Knicks '94", 'Big Pat / King of New York'),
  createIconPlayer('icon-tmacy-1503', 1503, 'Tracy McGrady', 'Houston Rockets', 'HOU', 'Western', 'SG', 'SF', 1, 96, 99, 88, 92, 96, 94, 92, 82, "Rockets '05", 'T-Mac / 13 in 35'),
  createIconPlayer('icon-nash-959', 959, 'Steve Nash', 'Phoenix Suns', 'PHX', 'Western', 'PG', undefined, 13, 96, 96, 78, 96, 50, 92, 99, 68, "Suns '05", '2x MVP / 7 Seconds or Less'),

  // --- 95 OVR ---
  createIconPlayer('icon-rayallen-951', 951, 'Ray Allen', 'Boston Celtics', 'BOS', 'Eastern', 'SG', 'SF', 20, 95, 96, 86, 99, 78, 88, 86, 74, "Celtics '08", 'Sugar Ray / Jesus Shuttlesworth'),
  createIconPlayer('icon-pierce-1718', 1718, 'Paul Pierce', 'Boston Celtics', 'BOS', 'Eastern', 'SF', 'SG', 34, 95, 96, 90, 91, 82, 86, 90, 82, "Celtics '08", 'The Truth / Finals MVP'),
  createIconPlayer('icon-penny-348', 348, 'Penny Hardaway', 'Orlando Magic', 'ORL', 'Eastern', 'PG', 'SG', 1, 95, 96, 90, 86, 92, 95, 97, 76, "Magic '95", 'Penny / Showtime'),
  createIconPlayer('icon-bwallace-1112', 1112, 'Ben Wallace', 'Detroit Pistons', 'DET', 'Eastern', 'C', 'PF', 3, 95, 68, 99, 25, 88, 82, 70, 99, "Pistons '04", 'Big Ben / 4x DPOY'),
  createIconPlayer('icon-kidd-467', 467, 'Jason Kidd', 'Dallas Mavericks', 'DAL', 'Western', 'PG', 'SG', 2, 95, 88, 94, 90, 65, 88, 99, 84, "Mavs '11", 'J-Kidd / Triple-Double Master'),
  createIconPlayer('icon-wilkins-1122', 1122, 'Dominique Wilkins', 'Atlanta Hawks', 'ATL', 'Eastern', 'SF', 'SG', 21, 95, 98, 84, 82, 99, 94, 80, 84, "Hawks '88", 'The Human Highlight Film'),
  createIconPlayer('icon-carter-1713', 1713, 'Vince Carter', 'Toronto Raptors', 'TOR', 'Eastern', 'SG', 'SF', 15, 95, 97, 85, 90, 99, 95, 84, 78, "Raptors '00", 'Vinsanity / Half-Man Half-Amazing'),
  createIconPlayer('icon-melo-2546', 2546, 'Carmelo Anthony', 'New York Knicks', 'NYK', 'Eastern', 'SF', 'PF', 7, 95, 98, 82, 91, 88, 88, 80, 86, "Knicks '13", 'Melo / Pure Scorer'),

  // --- 94 OVR ---
  createIconPlayer('icon-rodman-23', 23, 'Dennis Rodman', 'Chicago Bulls', 'CHI', 'Eastern', 'PF', 'C', 91, 94, 76, 99, 45, 80, 86, 80, 99, "Bulls '96", 'The Worm / Rebound King'),
  createIconPlayer('icon-kemp-431', 431, 'Shawn Kemp', 'Oklahoma City Thunder', 'OKC', 'Western', 'PF', 'C', 40, 94, 94, 90, 65, 99, 90, 80, 96, "Sonics '96", 'Reign Man / High Flyer'),
  createIconPlayer('icon-billups-1497', 1497, 'Chauncey Billups', 'Detroit Pistons', 'DET', 'Eastern', 'PG', 'SG', 1, 94, 94, 93, 92, 70, 90, 95, 76, "Pistons '04", 'Mr. Big Shot / Finals MVP'),
  createIconPlayer('icon-ginobili-1938', 1938, 'Manu Ginóbili', 'San Antonio Spurs', 'SAS', 'Western', 'SG', 'SF', 20, 94, 95, 88, 90, 84, 90, 95, 78, "Spurs '05", 'El Manudona / Eurostep Master'),
  createIconPlayer('icon-parker-2225', 2225, 'Tony Parker', 'San Antonio Spurs', 'SAS', 'Western', 'PG', undefined, 9, 94, 95, 84, 84, 70, 97, 96, 68, "Spurs '07", 'TP9 / Paris Express'),
  createIconPlayer('icon-klay-202691', 202691, 'Klay Thompson', 'Golden State Warriors', 'GSW', 'Western', 'SG', 'SF', 11, 94, 96, 93, 99, 78, 88, 82, 76, "Warriors '16", 'Game 6 Klay / Splash Bro'),
  createIconPlayer('icon-mutombo-87', 87, 'Dikembe Mutombo', 'Philadelphia 76ers', 'PHI', 'Eastern', 'C', undefined, 55, 94, 74, 99, 25, 84, 68, 66, 99, "Sixers '01", 'Mount Mutombo / Finger Wag'),
  createIconPlayer('icon-webber-185', 185, 'Chris Webber', 'Sacramento Kings', 'SAC', 'Western', 'PF', 'C', 4, 94, 95, 88, 75, 92, 84, 92, 94, "Kings '02", 'C-Webb / Greatest Passing Big'),

  // --- 93 OVR ---
  createIconPlayer('icon-draymond-203110', 203110, 'Draymond Green', 'Golden State Warriors', 'GSW', 'Western', 'PF', 'C', 23, 93, 84, 99, 82, 80, 85, 96, 92, "Warriors '17", 'DPOY / Point Forward'),
];

// Helper to look up legends safely by ID
const getLegend = (id: string): NBAPlayer => {
  const found = NBA_LEGENDS_LIST.find((p) => p.id === id);
  if (!found) {
    return NBA_LEGENDS_LIST[0];
  }
  return found;
};

// =========================================================================
// EQUIPOS DE LEYENDAS (ALL-TIME LEGEND SQUADS) PARA PARTIDOS Y DESAFÍOS
// =========================================================================
export const CLASSIC_TEAMS: ClassicTeam[] = [
  createClassicTeam(
    'legends-90s',
    'Leyendas de los 90s',
    '1990s',
    'NBA All-Time 90s',
    '90S',
    'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
    'El quinteto más temido de la década dorada con Jordan, Pippen, Hakeem, Barkley y Gary Payton.',
    [
      getLegend('icon-payton-56'),
      getLegend('icon-jordan-893'),
      getLegend('icon-pippen-937'),
      getLegend('icon-barkley-788'),
      getLegend('icon-olajuwon-165'),
    ]
  ),
  createClassicTeam(
    'legends-2000s',
    'Leyendas de los 2000s',
    '2000s',
    'NBA All-Time 2000s',
    '00S',
    'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    'La era más física y anotadora: Kobe, Shaq, Iverson, Duncan y Garnett.',
    [
      getLegend('icon-iverson-947'),
      getLegend('icon-kobe-977'),
      getLegend('icon-wade-2548'),
      getLegend('icon-duncan-1495'),
      getLegend('icon-shaq-406'),
    ]
  ),
  createClassicTeam(
    'legends-showtime-celtics',
    'Showtime & Celtics Clásicos',
    '1980s',
    'NBA All-Time 80s',
    '80S',
    'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
    'La rivalidad que salvó a la NBA: Magic Johnson, Larry Bird, Kareem Abdul-Jabbar, Dr. J y Kevin Garnett.',
    [
      getLegend('icon-magic-77142'),
      getLegend('icon-drj-76681'),
      getLegend('icon-bird-1449'),
      getLegend('icon-garnett-708'),
      getLegend('icon-kareem-76003'),
    ]
  ),
  createClassicTeam(
    'legends-modern-dynasties',
    'Dinastías Modernas',
    '2010s',
    'NBA Modern Legends',
    '10S',
    'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
    'Los reyes del baloncesto moderno: LeBron James, Stephen Curry, Kevin Durant, Kawhi Leonard y Dirk Nowitzki.',
    [
      getLegend('icon-curry-201939'),
      getLegend('icon-klay-202691'),
      getLegend('icon-lebron-2544'),
      getLegend('icon-durant-201142'),
      getLegend('icon-dirk-1717'),
    ]
  ),
  createClassicTeam(
    'legends-all-time-goats',
    'Los Mejores de la Historia',
    'All-Time',
    'NBA GOATs',
    'GOAT',
    'https://cdn.nba.com/logos/leagues/L/logo-nba.svg',
    'El quinteto definitivo de todos los tiempos: Jordan, LeBron, Kobe, Kareem y Bill Russell.',
    [
      getLegend('icon-magic-77142'),
      getLegend('icon-jordan-893'),
      getLegend('icon-kobe-977'),
      getLegend('icon-lebron-2544'),
      getLegend('icon-russell-78049'),
    ]
  ),
];

// Flat export of all icon players to merge seamlessly into master database
export const ALL_ICON_PLAYERS: NBAPlayer[] = NBA_LEGENDS_LIST;

