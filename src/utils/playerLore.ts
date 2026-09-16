import { NBAPlayer } from '../types';

// Custom curated historical descriptions for prominent NBA icons & stars
const CURATED_LORE: Record<string, string> = {
  // Classic Legends
  'Michael Jordan':
    'Temporada 1995-96: MVP de la temporada, MVP de las Finales y campeón NBA con récord histórico de 72-10. Promedió 30.4 PTS, 6.6 REB, 4.3 AST y 2.2 ROB. Considerado el mayor competidor y anotador en la historia del baloncesto.',
  'Scottie Pippen':
    'Temporada 1995-96: 1er Equipo All-NBA y 1er Equipo Defensivo. Promedió 19.4 PTS, 6.4 REB, 5.9 AST y 1.7 ROB. El alero todoterreno definitivo y ancla defensiva de los Bulls del tricampeonato.',
  'Dennis Rodman':
    'Temporada 1995-96: Líder en rebotes de la NBA por 5º año consecutivo con 14.9 REB por partido (5.6 ofensivos) y 1er Equipo Defensivo. Su intensidad en la pintura y defensa individual aseguraron el dominio de Chicago.',
  'Ron Harper':
    'Temporada 1995-96: Base titular del quinteto histórico del 72-10. Promedió 7.4 PTS, 2.7 REB, 2.6 AST y 1.3 ROB con una defensa asfixiante sobre los mejores bases rivales de la liga.',
  'Luc Longley':
    'Temporada 1995-96: Pívot titular de los legendarios Bulls del 72-10. Promedió 9.1 PTS, 5.1 REB y 1.4 BLQ, aportando presencia física, pase desde el poste alto y protección del aro.',
  "Shaquille O'Neal":
    'Temporada 1999-00 / 2000-01: MVP unánime, MVP de Finales y campeón con marca de 15-1 en playoffs. Promedió 28.7 PTS, 12.7 REB y 2.8 BLQ con un 57.2% TC. La fuerza física más dominante en la historia de la pintura.',
  'Kobe Bryant':
    'Temporada 2000-01: Bicampeón NBA y All-Star. Promedió 28.5 PTS, 5.9 REB, 5.0 AST y 1.7 ROB en temporada y 29.4 PTS en playoffs. Exhibió una ética de trabajo implacable y tiros decisivos en los momentos cumbre.',
  'Magic Johnson':
    'Temporada 1986-87: MVP de la temporada regular, MVP de Finales y líder de asistencias (12.2 AST, 23.9 PTS, 6.3 REB). Director de la orquesta del "Showtime Lakers" con su mítico Junior Sky-Hook en el Garden.',
  'Kareem Abdul-Jabbar':
    'Temporada 1970-71 / 1986-87: Máximo anotador histórico con 6 MVPs y 6 anillos. En 1971 promedió 31.7 PTS y 16.0 REB con su indefendible e icónico gancho "Skyhook" llevando a Milwaukee a su primer campeonato.',
  'Larry Bird':
    'Temporada 1985-86: 3er MVP consecutivo de la NBA, MVP de Finales y campeón con los Celtics del 67-15. Promedió 25.8 PTS, 9.8 REB, 6.8 AST y 2.0 ROB ingresando al selecto club del 50-40-90.',
  'Tim Duncan':
    'Temporada 1998-99 / 2013-14: 2 veces MVP y 5 veces campeón con los Spurs. En el título de 1999 promedió 23.2 PTS, 11.5 REB y 2.6 BLQ siendo MVP de Finales; en 2014 comandó la orquesta del "Beautiful Game".',
  'Manu Ginóbili':
    'Temporada 2007-08: Mejor Sexto Hombre del Año (6MOTY) y 3er Equipo All-NBA. Promedió 19.5 PTS, 4.8 REB, 4.5 AST y 1.5 ROB con un 40.1% en triples. 4 veces campeón con los Spurs y pionero del Eurostep.',
  'Tony Parker':
    'Temporada 2006-07 / 2013-14: MVP de las Finales 2007 (primer europeo en lograrlo) y 4 veces campeón NBA. Promedió 18.6 PTS y 5.5 AST con su imparable bandeja en flotadora "teardrop".',
  'Kawhi Leonard':
    'Temporada 2013-14 / 2018-19: 2 veces MVP de Finales y 2 veces DPOY. En 2019 lideró a Toronto a su primer campeonato promediando 30.5 PTS, 9.1 REB y 1.7 ROB en playoffs con su histórico tiro sobre Philadelphia.',
  'Dirk Nowitzki':
    'Temporada 2010-11: MVP de las Finales tras una de las postemporadas individuales más memorables, promediando 27.7 PTS y 8.1 REB con 94.1% en libres y su legendario tiro fadeaway a una pierna.',
  'Derrick Rose':
    'Temporada 2010-11: El MVP más joven en la historia de la NBA (22 años). Lideró a los Bulls a 62 victorias promediando 25.0 PTS, 7.7 AST y 4.1 REB con una velocidad y explosividad atlética inigualable.',
  'Allen Iverson':
    'Temporada 2000-01: MVP de la temporada, líder anotador con 31.1 PTS y líder en robos (2.5 ROB). Llevó a Philadelphia a las Finales con su corazón inquebrantable y el crossover más temido.',
  'Hakeem Olajuwon':
    'Temporada 1993-94: Único jugador en ganar MVP, DPOY y Finals MVP en un mismo año. Promedió 27.3 PTS, 11.9 REB, 3.6 AST y 3.7 BLQ dominando la pintura con su mítico "Dream Shake".',
  'Kevin Garnett':
    'Temporada 2007-08: Jugador Defensivo del Año (DPOY) y campeón NBA con los Celtics. Promedió 18.8 PTS, 9.2 REB, 3.4 AST, 1.4 ROB y 1.3 BLQ transformando la cultura competitiva de Boston.',
  'Paul Pierce':
    'Temporada 2007-08: MVP de las Finales NBA promediando 21.8 PTS, 6.3 AST y 4.5 REB. El anotador clutch por excelencia conocido como "The Truth".',
  'Ray Allen':
    'Temporada 2007-08 / 2012-13: 2 veces campeón NBA y uno de los mejores tiradores puros de la historia. Clave en el título de 2008 en Boston y autor del triple más clutch de la historia en las Finales 2013 con Miami.',
  'Gary Payton':
    'Temporada 1995-96: Único base en ganar el premio a Jugador Defensivo del Año (DPOY). Promedió 19.3 PTS, 7.5 AST y 2.8 ROB liderando a Seattle a las Finales con su defensa implacable "The Glove".',
  'Shawn Kemp':
    'Temporada 1995-96: 3 veces All-NBA y estrella de Seattle. Promedió 19.6 PTS, 11.4 REB y 1.6 BLQ con mates volcánicos y dominio atlético en el poste.',
  'Ben Wallace':
    'Temporada 2003-04: 4 veces DPOY y ancla del campeonato de los Pistons. Promedió 9.5 PTS, 12.4 REB y 3.0 BLQ frenando a los Lakers más poderosos con su intimidación interior.',
  'Chauncey Billups':
    'Temporada 2003-04: MVP de las Finales con Detroit. Promedió 21.0 PTS y 5.2 AST con 47.1% en triples, ganándose el apodo de "Mr. Big Shot" por su frialdad en momentos decisivos.',
  'Penny Hardaway':
    'Temporada 1994-95: 1er Equipo All-NBA con solo 23 años. Promedió 20.9 PTS, 7.2 AST, 4.4 REB y 1.7 ROB guiando a Orlando a las Finales junto a Shaq.',
  'Charles Barkley':
    'Temporada 1992-93: MVP de la temporada regular promediando 25.6 PTS, 12.2 REB, 5.1 AST y 1.6 ROB llevando a los Phoenix Suns a 62 victorias y las Finales NBA.',

  // Active Superstars
  'Nikola Jokic':
    '3 veces MVP de la NBA y MVP de Finales 2023. Promedió 26.4 PTS, 12.4 REB y 9.0 AST con +60% TC. Máximo exponente del pase y visión de juego desde la posición de pívot.',
  'Luka Doncic':
    '5 veces 1er Equipo All-NBA y líder anotador de la NBA con 33.9 PTS, 9.2 REB y 9.8 AST. Dominador absoluto del pick and roll, triple con step-back y generación de juego.',
  'Giannis Antetokounmpo':
    '2 veces MVP, DPOY y MVP de Finales. Promedia 30.4 PTS, 11.5 REB y 6.5 AST con 61% TC. Fuerza imparable en transición y uno de los defensores de aro más imponentes de la era moderna.',
  'Stephen Curry':
    '2 veces MVP unánime, 4 veces campeón y líder histórico de triples. Revolucionó el baloncesto con su rango ilimitado de tiro, gravedad ofensiva y 91% en tiros libres.',
  'LeBron James':
    '4 veces MVP, 4 veces campeón, 4 veces Finals MVP y máximo anotador de todos los tiempos con +40,000 puntos. Una longevidad y coeficiente intelectual baloncestístico sin precedentes.',
  'Shai Gilgeous-Alexander':
    '1er Equipo All-NBA con 30.1 PTS, 6.2 AST, 5.5 REB y 2.0 ROB. Maestro de la media distancia, juego de pies en la pintura y robos de balón en defensa.',
  'Jayson Tatum':
    'Campeón NBA 2024 y 3 veces 1er Equipo All-NBA con Boston. Promedió 26.9 PTS, 8.1 REB y 4.9 AST siendo la referencia ofensiva y versatilidad defensiva de los Celtics.',
  'Anthony Edwards':
    'All-Star y estrella en ascenso de Minnesota. Promedió 25.9 PTS, 5.4 REB, 5.1 AST y 1.3 ROB con un salto vertical explosivo y determinación implacable en los cuartos finales.',
  'Devin Booker':
    'All-Star y anotador élite de Phoenix. Promedió 27.1 PTS, 6.9 AST y 4.5 REB con un tiro de media distancia letal y gran capacidad para resolver partidos en el clutch.',
  'Anthony Davis':
    'Campeón NBA y ancla defensiva de Lakers con 24.7 PTS, 12.6 REB y 2.3 BLQ por partido. Dominante en ambos costados de la cancha protegiendo la pintura.',
  'Victor Wembanyama':
    'Novato del Año unánime y líder de la NBA en bloqueos (3.6 BLQ, 21.4 PTS, 10.6 REB). Un talento generacional único de 2.24m con manejo de base y tiro perimetral.',
  'Jamal Murray':
    'Campeón NBA 2023 con Denver. Promedió 21.2 PTS, 6.5 AST y 4.1 REB elevando su nivel en postemporada a más de 26 PTS por noche con triples y tiros decisivos.',
  'Trae Young':
    'Líder en generación de puntos de Atlanta con 25.7 PTS y 10.8 AST por encuentro. Rango de tiro profundo desde el logo y flotadoras efectivas.',
  'Bam Adebayo':
    '3 veces All-Star y 1er Equipo Defensivo con Miami. Promedió 19.3 PTS, 10.4 REB y 3.9 AST con capacidad para defender las 5 posiciones en cancha.',
};

/**
 * Generates an extensive, rich historical/contextual biography for any player
 */
export function getPlayerDescription(player: NBAPlayer): string {
  // 1. Return curated lore if exact name matches
  if (CURATED_LORE[player.name]) {
    return CURATED_LORE[player.name];
  }

  const { stats, position, team, classicTeamYear, rarity, unitType, isLegend } = player;
  const ovr = stats.ovr;

  // 2. Icon / Legend fallback
  if (isLegend || rarity === 'ICON' || classicTeamYear) {
    const yearText = classicTeamYear ? ` de la temporada ${classicTeamYear}` : '';
    const pointsEst = Math.round(stats.offense * 0.24 + ovr * 0.08);
    const rebEst = Math.max(3, Math.round(stats.rebound * 0.12));
    const astEst = Math.max(2, Math.round(stats.playmaking * 0.1));
    const defEst = (stats.defense * 0.02).toFixed(1);

    return `Carta Histórica${yearText} con ${team}. Valoración estelar de ${ovr} OVR destacando con promedios aproximados de ${pointsEst} PTS, ${rebEst} REB, ${astEst} AST y ${defEst} recuperaciones por partido. Su desempeño e impacto en la cancha fueron fundamentales en la rotación del equipo y su trayectoria en la NBA.`;
  }

  // 3. Diamond Superstars (90 - 93 OVR in market)
  if (rarity === 'DIAMOND' || ovr >= 90) {
    const pts = Math.round(stats.offense * 0.25 + 2);
    const ast = Math.round(stats.playmaking * 0.09);
    const reb = Math.round(stats.rebound * 0.1);
    return `Estrella de la franquicia ${team} con ${ovr} OVR. Promedió un rendimiento de nivel All-NBA con ${pts} PTS, ${reb} REB y ${ast} AST por noche. Pieza angular del esquema táctico gracias a su desequilibrio ofensivo (OFF ${stats.offense}) y solidez en los momentos clave.`;
  }

  // 4. Gold Key Starters (84 - 89 OVR)
  if (rarity === 'GOLD' || ovr >= 84) {
    const pts = Math.round(stats.offense * 0.22);
    const ast = Math.round(stats.playmaking * 0.07);
    const reb = Math.round(stats.rebound * 0.08);
    return `Titular indiscutible en ${team} (${position}, ${ovr} OVR). Promedió ${pts} PTS, ${reb} REB y ${ast} AST con una gran aportación en tiro triple (${stats.threePoint} 3PT) y disciplina defensiva (${stats.defense} DEF), siendo vital para las aspiraciones del equipo en la conferencia.`;
  }

  // 5. Silver Specialists (79 - 83 OVR)
  if (rarity === 'SILVER' || ovr >= 79) {
    return `Especialista de rol para ${team} (${position}, ${ovr} OVR). Destaca por su versatilidad, aportando energía saliendo desde el banquillo o en el quinteto titular con ${stats.speed} SPD y ${stats.defense} DEF, cumpliendo a la perfección las asignaciones defensivas y tiros abiertos.`;
  }

  // 6. Bronze Prospects (70 - 78 OVR)
  return `Joven prospecto y jugador de rotación en ${team} (${position}, ${ovr} OVR). Brinda minutos valiosos de intensidad, rebote y defensa con margen de desarrollo para potenciar el fondo de armario de la plantilla.`;
}
