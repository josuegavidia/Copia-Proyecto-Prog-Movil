import { NBAPlayer, ClassicTeam } from '../types';
import { getLegendHeadshotUrl } from './legendHeadshots';

const createIconPlayer = (
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
  const finalOvr = Math.max(90, Math.min(99, ovr));
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
      offense: Math.max(80, offense),
      defense: Math.max(80, defense),
      threePoint,
      dunk,
      speed: Math.max(70, speed),
      playmaking: Math.max(70, playmaking),
      rebound,
    },
    imageUrl: getLegendHeadshotUrl(id, nbaPersonId),
  };
};

export const computeTeamOvr = (starters: NBAPlayer[]): number => {
  if (!starters || starters.length === 0) return 90;
  const sum = starters.reduce((acc, p) => acc + (p.stats?.ovr || 90), 0);
  return Math.round(sum / starters.length);
};

const createClassicTeam = (
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

// All-Time Mythical Quintetos from NBA 2K (Todos los Iconos con Media Mínima 90 OVR)
export const CLASSIC_TEAMS: ClassicTeam[] = [
  // 1. Chicago Bulls 1995-96 (72-10 Historic Champions) -> 94 OVR
  createClassicTeam(
    'bulls-1996',
    "'96 Chicago Bulls",
    '1995-96',
    'Chicago Bulls',
    'CHI',
    'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
    'El legendario equipo de Michael Jordan del 72-10 y anillo de campeonato.',
    [
      createIconPlayer('icon-jordan-893', 893, 'Michael Jordan', 'Chicago Bulls', 'CHI', 'Eastern', 'SG', 'SF', 23, 99, 99, 98, 85, 99, 97, 92, 85, "Bulls '96", 'Air Jordan / GOAT'),
      createIconPlayer('icon-pippen-937', 937, 'Scottie Pippen', 'Chicago Bulls', 'CHI', 'Eastern', 'SF', 'PG', 33, 96, 92, 98, 80, 89, 91, 93, 86, "Bulls '96", 'Pip / No Tippin'),
      createIconPlayer('icon-rodman-23', 23, 'Dennis Rodman', 'Chicago Bulls', 'CHI', 'Eastern', 'PF', 'C', 91, 93, 75, 99, 45, 78, 85, 78, 99, "Bulls '96", 'The Worm'),
      createIconPlayer('icon-harper-283', 283, 'Ron Harper', 'Chicago Bulls', 'CHI', 'Eastern', 'PG', 'SG', 9, 91, 88, 93, 80, 80, 88, 90, 80, "Bulls '96", 'Hollywood'),
      createIconPlayer('icon-longley-703', 703, 'Luc Longley', 'Chicago Bulls', 'CHI', 'Eastern', 'C', undefined, 13, 90, 86, 90, 45, 75, 68, 78, 90, "Bulls '96", 'Luc'),
    ]
  ),

  // 2. Los Angeles Lakers 2000-01 (Shaq & Kobe 15-1 Playoff Run) -> 93 OVR
  createClassicTeam(
    'lakers-2001',
    "'01 Los Angeles Lakers",
    '2000-01',
    'Los Angeles Lakers',
    'LAL',
    'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    'El dúo más dominante del siglo XXI con marca de 15-1 en postemporada.',
    [
      createIconPlayer('icon-shaq-406', 406, "Shaquille O'Neal", 'Los Angeles Lakers', 'LAL', 'Western', 'C', undefined, 34, 98, 99, 92, 35, 99, 84, 76, 98, "Lakers '01", 'Diesel / MDE'),
      createIconPlayer('icon-kobe-977', 977, 'Kobe Bryant', 'Los Angeles Lakers', 'LAL', 'Western', 'SG', 'SF', 8, 97, 98, 94, 86, 96, 95, 88, 80, "Lakers '01", 'Black Mamba'),
      createIconPlayer('icon-grant-270', 270, 'Horace Grant', 'Los Angeles Lakers', 'LAL', 'Western', 'PF', 'C', 54, 91, 86, 92, 45, 80, 78, 80, 92, "Lakers '01", 'The General'),
      createIconPlayer('icon-fisher-965', 965, 'Derek Fisher', 'Los Angeles Lakers', 'LAL', 'Western', 'PG', 'SG', 2, 90, 88, 88, 90, 65, 86, 88, 72, "Lakers '01", 'D-Fish'),
      createIconPlayer('icon-fox-299', 299, 'Rick Fox', 'Los Angeles Lakers', 'LAL', 'Western', 'SF', 'SG', 17, 90, 87, 89, 86, 75, 82, 85, 80, "Lakers '01"),
    ]
  ),

  // 3. Golden State Warriors 2016-17 (Durant & Curry Dynasty) -> 94 OVR
  createClassicTeam(
    'warriors-2017',
    "'17 Golden State Warriors",
    '2016-17',
    'Golden State Warriors',
    'GSW',
    'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
    'El quinteto de la muerte con Curry, Durant, Klay Thompson y Draymond Green.',
    [
      createIconPlayer('icon-durant-201142-17', 201142, 'Kevin Durant', 'Golden State Warriors', 'GSW', 'Western', 'SF', 'PF', 35, 98, 99, 88, 94, 90, 89, 86, 85, "Warriors '17", 'Easy Money Sniper / KD'),
      createIconPlayer('icon-curry-201939-16', 201939, 'Stephen Curry', 'Golden State Warriors', 'GSW', 'Western', 'PG', 'SG', 30, 97, 99, 79, 99, 70, 92, 95, 72, "Warriors '17", 'Chef Curry'),
      createIconPlayer('icon-klay-202691-17', 202691, 'Klay Thompson', 'Golden State Warriors', 'GSW', 'Western', 'SG', 'SF', 11, 93, 95, 92, 98, 75, 88, 80, 75, "Warriors '17", 'Game 6 Klay'),
      createIconPlayer('icon-draymond-203110-17', 203110, 'Draymond Green', 'Golden State Warriors', 'GSW', 'Western', 'PF', 'C', 23, 91, 82, 98, 80, 78, 84, 95, 90, "Warriors '17", 'Dancing Bear'),
      createIconPlayer('icon-iguodala-2738-17', 2738, 'Andre Iguodala', 'Golden State Warriors', 'GSW', 'Western', 'SF', 'SG', 9, 90, 86, 94, 82, 90, 90, 88, 82, "Warriors '17", 'Iggy'),
    ]
  ),

  // 4. Miami Heat 2012-13 (LeBron James Big Three 27-Game Streak) -> 93 OVR
  createClassicTeam(
    'heat-2013',
    "'13 Miami Heat",
    '2012-13',
    'Miami Heat',
    'MIA',
    'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
    'El pico físico de LeBron James (99 OVR MVP) junto a Wade y Bosh.',
    [
      createIconPlayer('icon-lebron-2544-13', 2544, 'LeBron James', 'Miami Heat', 'MIA', 'Eastern', 'SF', 'PF', 6, 99, 99, 98, 86, 98, 96, 96, 92, "Heat '13", 'King James / Chosen One'),
      createIconPlayer('icon-wade-2548', 2548, 'Dwyane Wade', 'Miami Heat', 'MIA', 'Eastern', 'SG', 'PG', 3, 94, 95, 90, 78, 95, 95, 92, 80, "Heat '13", 'Flash / D-Wade'),
      createIconPlayer('icon-bosh-2547', 2547, 'Chris Bosh', 'Miami Heat', 'MIA', 'Eastern', 'C', 'PF', 1, 91, 91, 88, 84, 82, 78, 80, 91, "Heat '13", 'CB4'),
      createIconPlayer('icon-rayallen-951', 951, 'Ray Allen', 'Miami Heat', 'MIA', 'Eastern', 'SG', 'SF', 34, 91, 93, 80, 99, 70, 85, 82, 72, "Heat '13", 'Jesus Shuttlesworth'),
      createIconPlayer('icon-chalmers-201596', 201596, 'Mario Chalmers', 'Miami Heat', 'MIA', 'Eastern', 'PG', 'SG', 15, 90, 88, 88, 88, 65, 88, 88, 70, "Heat '13", 'Rio'),
    ]
  ),

  // 5. Los Angeles Lakers 1986-87 (Magic & Kareem Showtime) -> 94 OVR
  createClassicTeam(
    'lakers-1987',
    "'87 Showtime Lakers",
    '1986-87',
    'Los Angeles Lakers',
    'LAL',
    'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    'La cúspide del Showtime con Magic Johnson de 2.06m asistiendo a Kareem.',
    [
      createIconPlayer('icon-magic-77142', 77142, 'Magic Johnson', 'Los Angeles Lakers', 'LAL', 'Western', 'PG', 'SG', 32, 98, 97, 88, 79, 82, 92, 99, 89, "Lakers '87", 'Magic'),
      createIconPlayer('icon-kareem-76003', 76003, 'Kareem Abdul-Jabbar', 'Los Angeles Lakers', 'LAL', 'Western', 'C', undefined, 33, 97, 99, 93, 35, 88, 70, 80, 97, "Lakers '87", 'Cap / Skyhook'),
      createIconPlayer('icon-worthy-78610', 78610, 'James Worthy', 'Los Angeles Lakers', 'LAL', 'Western', 'SF', 'PF', 42, 93, 95, 88, 68, 95, 93, 85, 85, "Lakers '87", 'Big Game James'),
      createIconPlayer('icon-scott-78096', 78096, 'Byron Scott', 'Los Angeles Lakers', 'LAL', 'Western', 'SG', 'PG', 4, 91, 91, 86, 91, 88, 90, 84, 75, "Lakers '87", 'Lord Byron'),
      createIconPlayer('icon-green-76870', 76870, 'A.C. Green', 'Los Angeles Lakers', 'LAL', 'Western', 'PF', 'C', 45, 90, 85, 90, 50, 82, 80, 76, 92, "Lakers '87", 'Iron Man'),
    ]
  ),

  // 6. Boston Celtics 1985-86 (Larry Bird & McHale Dynasty) -> 93 OVR
  createClassicTeam(
    'celtics-1986',
    "'86 Boston Celtics",
    '1985-86',
    'Boston Celtics',
    'BOS',
    'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
    'Larry Bird en su temporada de 3er MVP consecutivo con la mejor frontal de la historia.',
    [
      createIconPlayer('icon-bird-1449', 1449, 'Larry Bird', 'Boston Celtics', 'BOS', 'Eastern', 'SF', 'PF', 33, 98, 99, 90, 96, 75, 86, 96, 92, "Celtics '86", 'Larry Legend / The Hick from French Lick'),
      createIconPlayer('icon-mchale-77540', 77540, 'Kevin McHale', 'Boston Celtics', 'BOS', 'Eastern', 'PF', 'C', 32, 96, 98, 94, 45, 84, 74, 80, 95, "Celtics '86", 'Black Hole'),
      createIconPlayer('icon-parish-77799', 77799, 'Robert Parish', 'Boston Celtics', 'BOS', 'Eastern', 'C', undefined, 0, 92, 90, 91, 35, 82, 70, 74, 95, "Celtics '86", 'The Chief'),
      createIconPlayer('icon-dj-77114', 77114, 'Dennis Johnson', 'Boston Celtics', 'BOS', 'Eastern', 'PG', 'SG', 3, 91, 88, 96, 78, 78, 90, 92, 78, "Celtics '86", 'DJ'),
      createIconPlayer('icon-ainge-76016', 76016, 'Danny Ainge', 'Boston Celtics', 'BOS', 'Eastern', 'SG', 'PG', 44, 90, 89, 85, 90, 68, 88, 86, 72, "Celtics '86"),
    ]
  ),

  // 7. San Antonio Spurs 1998-99 (David Robinson & Tim Duncan Twin Towers) -> 93 OVR
  createClassicTeam(
    'spurs-1999',
    "'99 Spurs Twin Towers",
    '1998-99',
    'San Antonio Spurs',
    'SAS',
    'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
    'El Almirante David Robinson y Tim Duncan formando las míticas Torres Gemelas.',
    [
      createIconPlayer('icon-duncan-1495-99', 1495, 'Tim Duncan', 'San Antonio Spurs', 'SAS', 'Western', 'PF', 'C', 21, 97, 97, 99, 40, 88, 78, 84, 99, "Spurs '99", 'The Big Fundamental'),
      createIconPlayer('icon-robinson-764', 764, 'David Robinson', 'San Antonio Spurs', 'SAS', 'Western', 'C', undefined, 50, 96, 95, 99, 35, 94, 84, 78, 98, "Spurs '99", 'El Almirante / The Admiral'),
      createIconPlayer('icon-elliott-252', 252, 'Sean Elliott', 'San Antonio Spurs', 'SAS', 'Western', 'SF', 'SG', 32, 91, 91, 86, 90, 82, 85, 80, 78, "Spurs '99", 'Memorial Day Miracle'),
      createIconPlayer('icon-ajohnson-178', 178, 'Avery Johnson', 'San Antonio Spurs', 'SAS', 'Western', 'PG', undefined, 6, 90, 87, 88, 65, 60, 94, 94, 68, "Spurs '99", 'The Little General'),
      createIconPlayer('icon-elie-74', 74, 'Mario Elie', 'San Antonio Spurs', 'SAS', 'Western', 'SG', 'SF', 17, 90, 88, 90, 88, 75, 82, 80, 76, "Spurs '99", 'Super Mario'),
    ]
  ),

  // 8. San Antonio Spurs 2013-14 (The Beautiful Game Champions) -> 93 OVR
  createClassicTeam(
    'spurs-2014',
    "'14 San Antonio Spurs",
    '2013-14',
    'San Antonio Spurs',
    'SAS',
    'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
    'La máxima expresión del baloncesto colectivo con Duncan, Parker, Ginobili y Kawhi MVP.',
    [
      createIconPlayer('icon-duncan-1495-14', 1495, 'Tim Duncan', 'San Antonio Spurs', 'SAS', 'Western', 'PF', 'C', 21, 95, 92, 96, 30, 80, 70, 86, 97, "Spurs '14", 'Old Man Riverwalk'),
      createIconPlayer('icon-kawhi-202695-14', 202695, 'Kawhi Leonard', 'San Antonio Spurs', 'SAS', 'Western', 'SF', 'PF', 2, 94, 91, 99, 88, 92, 90, 82, 88, "Spurs '14", 'The Klaw / Finals MVP'),
      createIconPlayer('icon-parker-2225', 2225, 'Tony Parker', 'San Antonio Spurs', 'SAS', 'Western', 'PG', undefined, 9, 93, 94, 82, 82, 68, 96, 95, 66, "Spurs '14", 'TP9 / Paris Express'),
      createIconPlayer('icon-ginobili-1938', 1938, 'Manu Ginóbili', 'San Antonio Spurs', 'SAS', 'Western', 'SG', 'SF', 20, 92, 93, 87, 89, 82, 90, 94, 76, "Spurs '14", 'El Manudona / Eurostep'),
      createIconPlayer('icon-diaw-2564', 2564, 'Boris Diaw', 'San Antonio Spurs', 'SAS', 'Western', 'C', 'PF', 33, 90, 88, 86, 85, 68, 76, 92, 86, "Spurs '14", 'Tea Time'),
    ]
  ),

  // 9. Detroit Pistons 2003-04 (Goin' to Work Defense) -> 92 OVR
  createClassicTeam(
    'pistons-2004',
    "'04 Detroit Pistons",
    '2003-04',
    'Detroit Pistons',
    'DET',
    'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
    'La muralla defensiva de Ben Wallace, Chauncey Billups y Rasheed Wallace.',
    [
      createIconPlayer('icon-bwallace-1112', 1112, 'Ben Wallace', 'Detroit Pistons', 'DET', 'Eastern', 'C', 'PF', 3, 95, 65, 99, 25, 88, 80, 68, 99, "Pistons '04", 'Big Ben / DPOY'),
      createIconPlayer('icon-billups-1497', 1497, 'Chauncey Billups', 'Detroit Pistons', 'DET', 'Eastern', 'PG', 'SG', 1, 94, 94, 93, 92, 68, 90, 95, 75, "Pistons '04", 'Mr. Big Shot'),
      createIconPlayer('icon-rwallace-730', 730, 'Rasheed Wallace', 'Detroit Pistons', 'DET', 'Eastern', 'PF', 'C', 30, 92, 92, 94, 86, 86, 78, 80, 92, "Pistons '04", "Sheed / Ball Don't Lie"),
      createIconPlayer('icon-hamilton-1888', 1888, 'Richard Hamilton', 'Detroit Pistons', 'DET', 'Eastern', 'SG', 'SF', 32, 91, 93, 88, 88, 76, 95, 82, 72, "Pistons '04", 'Rip / Masked Man'),
      createIconPlayer('icon-prince-2419', 2419, 'Tayshaun Prince', 'Detroit Pistons', 'DET', 'Eastern', 'SF', 'PF', 22, 90, 86, 96, 84, 82, 86, 80, 80, "Pistons '04", 'The Block'),
    ]
  ),

  // 10. Houston Rockets 1993-94 (Hakeem Dream Shake Champions) -> 92 OVR
  createClassicTeam(
    'rockets-1994',
    "'94 Houston Rockets",
    '1993-94',
    'Houston Rockets',
    'HOU',
    'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
    'Hakeem Olajuwon liderando a Houston con el Dream Shake y 4 tiradores.',
    [
      createIconPlayer('icon-olajuwon-165', 165, 'Hakeem Olajuwon', 'Houston Rockets', 'HOU', 'Western', 'C', undefined, 34, 98, 98, 99, 35, 94, 84, 82, 98, "Rockets '94", 'The Dream'),
      createIconPlayer('icon-ksmith-18', 18, 'Kenny Smith', 'Houston Rockets', 'HOU', 'Western', 'PG', undefined, 30, 90, 90, 82, 92, 85, 90, 88, 66, "Rockets '94", 'The Jet'),
      createIconPlayer('icon-maxwell-259', 259, 'Vernon Maxwell', 'Houston Rockets', 'HOU', 'Western', 'SG', 'PG', 11, 90, 89, 88, 88, 80, 88, 82, 72, "Rockets '94", 'Mad Max'),
      createIconPlayer('icon-horry-109', 109, 'Robert Horry', 'Houston Rockets', 'HOU', 'Western', 'SF', 'PF', 25, 90, 87, 90, 89, 85, 84, 80, 82, "Rockets '94", 'Big Shot Bob'),
      createIconPlayer('icon-thorpe-148', 148, 'Otis Thorpe', 'Houston Rockets', 'HOU', 'Western', 'PF', 'C', 33, 90, 88, 88, 30, 86, 76, 74, 94, "Rockets '94"),
    ]
  ),

  // 11. Dallas Mavericks 2010-11 (Dirk Nowitzki Historic Playoff Run) -> 92 OVR
  createClassicTeam(
    'mavericks-2011',
    "'11 Dallas Mavericks",
    '2010-11',
    'Dallas Mavericks',
    'DAL',
    'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
    'Dirk Nowitzki con su imparable Fadeaway a una pierna derrotando al Heat.',
    [
      createIconPlayer('icon-dirk-1717', 1717, 'Dirk Nowitzki', 'Dallas Mavericks', 'DAL', 'Western', 'PF', 'C', 41, 97, 99, 84, 93, 76, 74, 80, 92, "Mavs '11", 'German Wunderkind'),
      createIconPlayer('icon-kidd-467-11', 467, 'Jason Kidd', 'Dallas Mavericks', 'DAL', 'Western', 'PG', 'SG', 2, 92, 86, 92, 89, 60, 86, 98, 82, "Mavs '11", 'J-Kidd / Triple Double'),
      createIconPlayer('icon-terry-1891', 1891, 'Jason Terry', 'Dallas Mavericks', 'DAL', 'Western', 'SG', 'PG', 31, 91, 92, 82, 94, 70, 90, 85, 68, "Mavs '11", 'The Jet'),
      createIconPlayer('icon-marion-1890', 1890, 'Shawn Marion', 'Dallas Mavericks', 'DAL', 'Western', 'SF', 'PF', 0, 91, 88, 94, 82, 89, 88, 80, 88, "Mavs '11", 'The Matrix'),
      createIconPlayer('icon-chandler-2199', 2199, 'Tyson Chandler', 'Dallas Mavericks', 'DAL', 'Western', 'C', undefined, 6, 90, 80, 96, 25, 90, 78, 68, 96, "Mavs '11", 'The Anchor'),
    ]
  ),

  // 12. Cleveland Cavaliers 2015-16 (The 3-1 Comeback Champions) -> 93 OVR
  createClassicTeam(
    'cavaliers-2016',
    "'16 Cleveland Cavaliers",
    '2015-16',
    'Cleveland Cavaliers',
    'CLE',
    'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
    'La remontada del 3-1 en las Finales con LeBron James y el tiro de Kyrie Irving.',
    [
      createIconPlayer('icon-lebron-2544-16', 2544, 'LeBron James', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'SF', 'PF', 23, 98, 99, 96, 82, 96, 94, 97, 92, "Cavs '16", 'The Block / King James'),
      createIconPlayer('icon-kyrie-202681-16', 202681, 'Kyrie Irving', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'PG', 'SG', 2, 95, 99, 82, 94, 80, 97, 92, 70, "Cavs '16", 'Uncle Drew / The Shot'),
      createIconPlayer('icon-love-201567-16', 201567, 'Kevin Love', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'PF', 'C', 0, 91, 92, 82, 91, 76, 75, 82, 96, "Cavs '16", 'The Stop'),
      createIconPlayer('icon-jrsmith-2747', 2747, 'J.R. Smith', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'SG', 'SF', 5, 90, 90, 84, 94, 88, 86, 78, 72, "Cavs '16", 'Swish'),
      createIconPlayer('icon-tt-202684', 202684, 'Tristan Thompson', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'C', 'PF', 13, 90, 82, 88, 25, 84, 76, 70, 96, "Cavs '16", 'Double Double'),
    ]
  ),

  // 13. Philadelphia 76ers 2000-01 (Allen Iverson Finals MVP run) -> 92 OVR
  createClassicTeam(
    'sixers-2001',
    "'01 Philadelphia 76ers",
    '2000-01',
    'Philadelphia 76ers',
    'PHI',
    'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
    'Allen Iverson MVP anotando 48 pts en el Juego 1 de las Finales ante los invictos Lakers.',
    [
      createIconPlayer('icon-iverson-947', 947, 'Allen Iverson', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SG', 'PG', 3, 97, 99, 86, 84, 85, 99, 89, 68, "Sixers '01", 'The Answer / A.I.'),
      createIconPlayer('icon-mutombo-87', 87, 'Dikembe Mutombo', 'Philadelphia 76ers', 'PHI', 'Eastern', 'C', undefined, 55, 93, 72, 99, 25, 82, 65, 65, 99, "Sixers '01", 'Mount Mutombo / Finger Wag'),
      createIconPlayer('icon-mckie-243', 243, 'Aaron McKie', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SF', 'SG', 8, 91, 88, 90, 86, 72, 85, 86, 78, "Sixers '01", '6th Man of the Year'),
      createIconPlayer('icon-snow-727', 727, 'Eric Snow', 'Philadelphia 76ers', 'PHI', 'Eastern', 'PG', undefined, 20, 90, 82, 94, 70, 60, 88, 90, 72, "Sixers '01"),
      createIconPlayer('icon-hill-248', 248, 'Tyrone Hill', 'Philadelphia 76ers', 'PHI', 'Eastern', 'PF', 'C', 40, 90, 82, 88, 25, 76, 72, 68, 95, "Sixers '01"),
    ]
  ),

  // 14. Toronto Raptors 2018-19 (Kawhi Leonard The Shot Championship) -> 92 OVR
  createClassicTeam(
    'raptors-2019',
    "'19 Toronto Raptors",
    '2018-19',
    'Toronto Raptors',
    'TOR',
    'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
    'El primer campeonato canadiense liderado por Kawhi Leonard y Kyle Lowry.',
    [
      createIconPlayer('icon-kawhi-202695-19', 202695, 'Kawhi Leonard', 'Toronto Raptors', 'TOR', 'Eastern', 'SF', 'PF', 2, 97, 98, 97, 89, 90, 89, 86, 88, "Raptors '19", 'The Klaw / Board Man'),
      createIconPlayer('icon-lowry-200768-19', 200768, 'Kyle Lowry', 'Toronto Raptors', 'TOR', 'Eastern', 'PG', undefined, 7, 93, 92, 92, 90, 66, 90, 95, 78, "Raptors '19", 'GROAT'),
      createIconPlayer('icon-siakam-1627783-19', 1627783, 'Pascal Siakam', 'Toronto Raptors', 'TOR', 'Eastern', 'PF', 'SF', 43, 91, 91, 88, 85, 90, 90, 84, 88, "Raptors '19", 'Spicy P'),
      createIconPlayer('icon-gasol-201188', 201188, 'Marc Gasol', 'Toronto Raptors', 'TOR', 'Eastern', 'C', undefined, 33, 91, 87, 94, 86, 66, 68, 92, 92, "Raptors '19", 'Big Spain'),
      createIconPlayer('icon-dgreen-201980', 201980, 'Danny Green', 'Toronto Raptors', 'TOR', 'Eastern', 'SG', 'SF', 14, 90, 88, 90, 94, 74, 84, 78, 72, "Raptors '19", 'Green Ranger'),
    ]
  ),

  // 15. Phoenix Suns 1992-93 (Charles Barkley MVP Season) -> 92 OVR
  createClassicTeam(
    'suns-1993',
    "'93 Phoenix Suns",
    '1992-93',
    'Phoenix Suns',
    'PHX',
    'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
    'Charles Barkley MVP y Kevin Johnson llevando a los Suns a las Finales NBA.',
    [
      createIconPlayer('icon-barkley-788', 788, 'Charles Barkley', 'Phoenix Suns', 'PHX', 'Western', 'PF', 'SF', 34, 97, 98, 88, 76, 94, 88, 86, 98, "Suns '93", 'Sir Charles / Round Mound of Rebound'),
      createIconPlayer('icon-kjohnson-77144', 77144, 'Kevin Johnson', 'Phoenix Suns', 'PHX', 'Western', 'PG', undefined, 7, 92, 94, 84, 82, 85, 97, 95, 70, "Suns '93", 'KJ'),
      createIconPlayer('icon-majerle-77449', 77449, 'Dan Majerle', 'Phoenix Suns', 'PHX', 'Western', 'SG', 'SF', 9, 91, 90, 92, 92, 88, 88, 82, 80, "Suns '93", 'Thunder Dan'),
      createIconPlayer('icon-ceballos-315', 315, 'Cedric Ceballos', 'Phoenix Suns', 'PHX', 'Western', 'SF', 'PF', 23, 91, 92, 85, 76, 96, 88, 80, 84, "Suns '93", 'Slam Dunk Champion'),
      createIconPlayer('icon-west-78508', 78508, 'Mark West', 'Phoenix Suns', 'PHX', 'Western', 'C', undefined, 41, 90, 82, 90, 25, 82, 68, 66, 93, "Suns '93"),
    ]
  ),

  // 16. Seattle SuperSonics 1995-96 (The Glove & Reign Man) -> 92 OVR
  createClassicTeam(
    'sonics-1996',
    "'96 Seattle SuperSonics",
    '1995-96',
    'Oklahoma City Thunder',
    'OKC',
    'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
    'Gary Payton (DPOY) y los mates demoledores de Shawn Kemp.',
    [
      createIconPlayer('icon-payton-56', 56, 'Gary Payton', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 20, 96, 95, 99, 85, 80, 95, 96, 78, "Sonics '96", 'The Glove'),
      createIconPlayer('icon-kemp-431', 431, 'Shawn Kemp', 'Oklahoma City Thunder', 'OKC', 'Western', 'PF', 'C', 40, 94, 94, 90, 65, 99, 90, 80, 96, "Sonics '96", 'Reign Man'),
      createIconPlayer('icon-schrempf-441', 441, 'Detlef Schrempf', 'Oklahoma City Thunder', 'OKC', 'Western', 'SF', 'PF', 11, 91, 92, 84, 92, 76, 84, 87, 86, "Sonics '96", 'Detlef'),
      createIconPlayer('icon-hawkins-353', 353, 'Hersey Hawkins', 'Oklahoma City Thunder', 'OKC', 'Western', 'SG', undefined, 33, 90, 89, 87, 91, 74, 87, 84, 72, "Sonics '96", 'Hawk'),
      createIconPlayer('icon-perkins-448', 448, 'Sam Perkins', 'Oklahoma City Thunder', 'OKC', 'Western', 'C', 'PF', 14, 90, 88, 86, 88, 72, 68, 80, 88, "Sonics '96", 'Big Smooth'),
    ]
  ),

  // 17. Boston Celtics 2007-08 (Garnett, Pierce & Ray Allen Big Three) -> 93 OVR
  createClassicTeam(
    'celtics-2008',
    "'08 Boston Celtics",
    '2007-08',
    'Boston Celtics',
    'BOS',
    'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
    'El regreso de la gloria a Boston con Kevin Garnett DPOY, Paul Pierce Finals MVP y Ray Allen.',
    [
      createIconPlayer('icon-garnett-708', 708, 'Kevin Garnett', 'Boston Celtics', 'BOS', 'Eastern', 'PF', 'C', 5, 97, 96, 99, 78, 94, 86, 90, 98, "Celtics '08", 'The Big Ticket / KG'),
      createIconPlayer('icon-pierce-1718', 1718, 'Paul Pierce', 'Boston Celtics', 'BOS', 'Eastern', 'SF', 'SG', 34, 95, 96, 89, 91, 80, 86, 90, 82, "Celtics '08", 'The Truth / Finals MVP'),
      createIconPlayer('icon-rayallen-951-08', 951, 'Ray Allen', 'Boston Celtics', 'BOS', 'Eastern', 'SG', undefined, 20, 93, 95, 84, 98, 75, 88, 85, 74, "Celtics '08", 'Sugar Ray'),
      createIconPlayer('icon-rondo-200765', 200765, 'Rajon Rondo', 'Boston Celtics', 'BOS', 'Eastern', 'PG', undefined, 9, 91, 84, 96, 72, 74, 95, 98, 80, "Celtics '08", 'Playoff Rondo'),
      createIconPlayer('icon-kperkins-2570', 2570, 'Kendrick Perkins', 'Boston Celtics', 'BOS', 'Eastern', 'C', undefined, 43, 90, 80, 92, 25, 78, 64, 68, 94, "Celtics '08", 'Perk'),
    ]
  ),

  // 18. Chicago Bulls 2010-11 (Derrick Rose Youngest MVP) -> 92 OVR
  createClassicTeam(
    'bulls-2011',
    "'11 Chicago Bulls",
    '2010-11',
    'Chicago Bulls',
    'CHI',
    'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
    'Derrick Rose como el MVP más joven de la historia de la NBA (22 años, 95 OVR).',
    [
      createIconPlayer('icon-rose-201565', 201565, 'Derrick Rose', 'Chicago Bulls', 'CHI', 'Eastern', 'PG', undefined, 1, 96, 99, 82, 85, 96, 99, 94, 70, "Bulls '11", 'Pooh / Youngest MVP'),
      createIconPlayer('icon-noah-201149', 201149, 'Joakim Noah', 'Chicago Bulls', 'CHI', 'Eastern', 'C', 'PF', 13, 92, 82, 98, 25, 82, 80, 90, 98, "Bulls '11", 'Jo-No / DPOY'),
      createIconPlayer('icon-deng-2736', 2736, 'Luol Deng', 'Chicago Bulls', 'CHI', 'Eastern', 'SF', 'PF', 9, 91, 90, 92, 87, 82, 88, 82, 86, "Bulls '11", 'Lieutenant Deng'),
      createIconPlayer('icon-boozer-2430', 2430, 'Carlos Boozer', 'Chicago Bulls', 'CHI', 'Eastern', 'PF', 'C', 5, 90, 91, 84, 30, 84, 76, 78, 94, "Bulls '11", 'Booz Cruise'),
      createIconPlayer('icon-bogans-2584', 2584, 'Keith Bogans', 'Chicago Bulls', 'CHI', 'Eastern', 'SG', 'SF', 6, 90, 86, 88, 90, 70, 84, 78, 72, "Bulls '11"),
    ]
  ),

  // 19. Orlando Magic 1994-95 (Shaq & Penny Finals Run) -> 93 OVR
  createClassicTeam(
    'magic-1995',
    "'95 Orlando Magic",
    '1994-95',
    'Orlando Magic',
    'ORL',
    'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
    'Shaquille O\'Neal y Penny Hardaway comandando a los jóvenes Magic a las Finales.',
    [
      createIconPlayer('icon-shaq-406-95', 406, "Shaquille O'Neal", 'Orlando Magic', 'ORL', 'Eastern', 'C', undefined, 32, 97, 99, 92, 35, 99, 84, 74, 99, "Magic '95", 'Superman'),
      createIconPlayer('icon-penny-348', 348, 'Penny Hardaway', 'Orlando Magic', 'ORL', 'Eastern', 'PG', 'SG', 1, 95, 96, 88, 86, 92, 95, 97, 76, "Magic '95", 'Penny'),
      createIconPlayer('icon-hgrant-270-95', 270, 'Horace Grant', 'Orlando Magic', 'ORL', 'Eastern', 'PF', 'C', 54, 91, 86, 90, 45, 84, 80, 80, 92, "Magic '95", 'The General'),
      createIconPlayer('icon-anderson-154', 154, 'Nick Anderson', 'Orlando Magic', 'ORL', 'Eastern', 'SG', 'SF', 25, 90, 90, 86, 90, 84, 87, 84, 76, "Magic '95"),
      createIconPlayer('icon-scott-78', 78, 'Dennis Scott', 'Orlando Magic', 'ORL', 'Eastern', 'SF', 'SG', 3, 90, 90, 82, 96, 68, 82, 78, 72, "Magic '95", '3-D'),
    ]
  ),

  // 20. Milwaukee Bucks 1970-71 (Kareem & Oscar Robertson Champions) -> 93 OVR
  createClassicTeam(
    'bucks-1971',
    "'71 Milwaukee Bucks",
    '1970-71',
    'Milwaukee Bucks',
    'MIL',
    'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
    'Kareem Abdul-Jabbar (Lew Alcindor) y Oscar Robertson (Sr. Triple-Doble) campeones.',
    [
      createIconPlayer('icon-kareem-76003-71', 76003, 'Kareem Abdul-Jabbar', 'Milwaukee Bucks', 'MIL', 'Eastern', 'C', undefined, 33, 98, 99, 95, 30, 90, 74, 82, 98, "Bucks '71", 'Lew Alcindor / Cap'),
      createIconPlayer('icon-oscar-600015', 600015, 'Oscar Robertson', 'Milwaukee Bucks', 'MIL', 'Eastern', 'PG', 'SG', 1, 97, 98, 90, 78, 78, 94, 99, 90, "Bucks '71", 'The Big O'),
      createIconPlayer('icon-dandridge-76504', 76504, 'Bob Dandridge', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SF', 'SG', 10, 91, 91, 88, 72, 80, 86, 82, 82, "Bucks '71", 'The Greyhound'),
      createIconPlayer('icon-mcglocklin-77526', 77526, 'Jon McGlocklin', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SG', 'SF', 14, 90, 90, 82, 90, 65, 84, 82, 70, "Bucks '71", 'Jonny Mac'),
      createIconPlayer('icon-smith-78184', 78184, 'Greg Smith', 'Milwaukee Bucks', 'MIL', 'Eastern', 'PF', 'SF', 4, 90, 84, 88, 50, 80, 82, 76, 88, "Bucks '71"),
    ]
  ),
];

// Flat export of all icon players to easily merge into master card pool
export const ALL_ICON_PLAYERS: NBAPlayer[] = CLASSIC_TEAMS.flatMap((team) => team.starters);

