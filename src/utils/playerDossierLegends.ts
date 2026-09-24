import { PlayerDossier } from './playerDossier';

export const LEGENDS_DOSSIER_DATABASE: Record<string, Partial<PlayerDossier>> = {
  'Michael Jordan': {
    tacticalRole: 'El Mejor de la Historia (GOAT) & Escolta Anotador Indefendible',
    specialty: 'Fadeaway letal, suspensión en el aire, robos decisivos y tiros ganadores',
    playStyle: 'Competitividad inhumana, 6 campeonatos invicto en Finales y 6 MVPs de Finales',
    draftInfo: {
      year: 1984,
      round: 1,
      pick: 3,
      teamName: 'Chicago Bulls',
      teamAbbr: 'CHI',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
      origin: 'North Carolina Tar Heels'
    },
    draft: '1984 · Pick #3 (1ª Ronda por Chicago Bulls)',
    experience: '15 Temporadas (Chicago Bulls / Washington Wizards)',
    transfers: [
      {
        season: '84/85',
        date: '19/06/1984',
        fromTeam: 'UNC Tar Heels',
        toTeam: 'Chicago Bulls',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '2,50 mill. $',
        feeOrType: 'Draft NBA (#3)'
      },
      {
        season: '93/94',
        date: '06/10/1993',
        fromTeam: 'Chicago Bulls',
        fromTeamAbbr: 'CHI',
        toTeam: 'Birmingham Barons (Béisbol)',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '0,00 $',
        feeOrType: '1er Retiro'
      },
      {
        season: '94/95',
        date: '18/03/1995',
        fromTeam: 'Agente Libre',
        toTeam: 'Chicago Bulls',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '30,00 mill. $',
        feeOrType: '"I\'m Back" (Regreso)'
      },
      {
        season: '01/02',
        date: '25/09/2001',
        fromTeam: 'Retiro',
        toTeam: 'Washington Wizards',
        toTeamAbbr: 'WAS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/was.png',
        marketValue: '1,00 mill. $',
        feeOrType: 'Regreso como Jugador/Presidente'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 6, details: '1991, 1992, 1993, 1996, 1997, 1998 (Bulls)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 6, details: '1991, 1992, 1993, 1996, 1997, 1998 (Récord absoluto)' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 5, details: '1988, 1991, 1992, 1996, 1998' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY)', count: 1, details: '1988' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 10, details: '1987-1993, 1996-1998 (Récord histórico)' },
      { icon: 'star', name: 'NBA All-Star', count: 14, details: '1985-1993, 1996-1998, 2002-2003' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 10, details: '1987-1993, 1996-1998' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Los Ángeles 1984, Barcelona 1992 (Dream Team)' }
    ],
    seasonAverages: {
      pts: '30.4',
      reb: '6.6',
      ast: '4.3',
      stl: '2.2',
      blk: '0.5',
      fgPct: '49.5%',
      threePct: '42.7%',
      ftPct: '83.4%'
    }
  },

  'LeBron James': {
    tacticalRole: 'El Rey de la NBA (King James) & Generador Total',
    specialty: 'Pase teledirigido, transición arrolladora, IQ supremo y longevidad histórica',
    playStyle: 'Máximo anotador de todos los tiempos (+40.000 pts), 4 anillos con 3 franquicias distintas',
    draftInfo: {
      year: 2003,
      round: 1,
      pick: 1,
      teamName: 'Cleveland Cavaliers',
      teamAbbr: 'CLE',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
      origin: 'St. Vincent-St. Mary HS'
    },
    draft: '2003 · Pick #1 (1ª Ronda por Cleveland Cavaliers)',
    experience: '22+ Temporadas (Cavs / Heat / Lakers)',
    transfers: [
      {
        season: '03/04',
        date: '26/06/2003',
        fromTeam: 'St. Vincent-St. Mary',
        toTeam: 'Cleveland Cavaliers',
        toTeamAbbr: 'CLE',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
        marketValue: '18,80 mill. $',
        feeOrType: 'Draft NBA (#1)'
      },
      {
        season: '10/11',
        date: '10/07/2010',
        fromTeam: 'Cleveland Cavaliers',
        fromTeamAbbr: 'CLE',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
        toTeam: 'Miami Heat',
        toTeamAbbr: 'MIA',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        marketValue: '110,00 mill. $',
        feeOrType: 'Sign-and-Trade ("The Decision")'
      },
      {
        season: '14/15',
        date: '12/07/2014',
        fromTeam: 'Miami Heat',
        fromTeamAbbr: 'MIA',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        toTeam: 'Cleveland Cavaliers',
        toTeamAbbr: 'CLE',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
        marketValue: '42,10 mill. $',
        feeOrType: 'Agente Libre ("I\'m Coming Home")'
      },
      {
        season: '18/19',
        date: '09/07/2018',
        fromTeam: 'Cleveland Cavaliers',
        fromTeamAbbr: 'CLE',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
        toTeam: 'Los Angeles Lakers',
        toTeamAbbr: 'LAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        marketValue: '153,30 mill. $',
        feeOrType: 'Agente Libre (4 años)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 4, details: '2012, 2013 (MIA), 2016 (CLE), 2020 (LAL)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 4, details: '2012, 2013, 2016, 2020 (Con 3 equipos diferentes)' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 4, details: '2009, 2010, 2012, 2013' },
      { icon: 'flame', name: 'Máximo Anotador Histórico de la NBA', count: 1, details: '+40.000 puntos en carrera' },
      { icon: 'star', name: 'NBA All-Star', count: 20, details: '2005-2024 (Récord de selecciones)' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 13, details: 'Récord absoluto de la NBA' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 3, details: 'Pekín 2008, Londres 2012, París 2024' }
    ],
    seasonAverages: {
      pts: '26.8',
      reb: '8.0',
      ast: '7.3',
      stl: '1.7',
      blk: '0.9',
      fgPct: '56.5%',
      threePct: '40.6%',
      ftPct: '75.3%'
    }
  },

  'Wilt Chamberlain': {
    tacticalRole: 'El Gigante Mitológico de los Récords (The Big Dipper)',
    specialty: 'Fuerza descomunal, juego por encima del aro, 100 puntos en un partido y 55 rebotes',
    playStyle: 'El hombre que obligó a cambiar las reglas del juego por su aplastante superioridad física',
    draftInfo: {
      year: 1959,
      round: 1,
      pick: 3,
      teamName: 'Philadelphia Warriors',
      teamAbbr: 'GSW',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
      origin: 'Kansas Jayhawks'
    },
    draft: '1959 · Selección Territorial por Philadelphia Warriors',
    experience: '14 Temporadas (Warriors / 76ers / Lakers)',
    transfers: [
      {
        season: '59/60',
        date: '15/05/1959',
        fromTeam: 'Kansas / Harlem Globetrotters',
        toTeam: 'Philadelphia Warriors',
        toTeamAbbr: 'GSW',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
        marketValue: '65.000 $',
        feeOrType: 'Pick Territorial'
      },
      {
        season: '64/65',
        date: '15/01/1965',
        fromTeam: 'San Francisco Warriors',
        fromTeamAbbr: 'GSW',
        toTeam: 'Philadelphia 76ers',
        toTeamAbbr: 'PHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
        marketValue: '150.000 $',
        feeOrType: 'Traspaso histórico'
      },
      {
        season: '68/69',
        date: '09/07/1968',
        fromTeam: 'Philadelphia 76ers',
        fromTeamAbbr: 'PHI',
        toTeam: 'Los Angeles Lakers',
        toTeamAbbr: 'LAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        marketValue: '250.000 $',
        feeOrType: 'Traspaso estelar'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 2, details: '1967 (76ers), 1972 (Lakers)' },
      { icon: 'ribbon', name: 'MVP de las Finales', count: 1, details: '1972' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 4, details: '1960, 1966, 1967, 1968' },
      { icon: 'flame', name: 'Partido de 100 Puntos', count: 1, details: '02/03/1962 vs Knicks' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 7, details: '1960-1966 (Promedió 50.4 pts en 1962)' },
      { icon: 'shield', name: 'Máximo Reboteador de la Historia', count: 11, details: '23.9 REB de media en carrera' },
      { icon: 'star', name: 'NBA All-Star', count: 13, details: '1960-1969, 1971-1973' }
    ],
    seasonAverages: {
      pts: '50.4',
      reb: '25.7',
      ast: '2.4',
      stl: '2.5',
      blk: '5.8',
      fgPct: '50.6%',
      threePct: '0.0%',
      ftPct: '61.3%'
    }
  },

  'Bill Russell': {
    tacticalRole: 'El Mayor Ganador de la Historia & Bastión Defensivo Supremo',
    specialty: 'Tapón dirigido, defensa posicional impenetrable, liderazgo y rebotes ganadores',
    playStyle: '11 anillos de campeón en 13 temporadas; el trofeo de MVP de Finales lleva su nombre',
    draftInfo: {
      year: 1956,
      round: 1,
      pick: 2,
      teamName: 'St. Louis Hawks (Traspasado a Celtics)',
      teamAbbr: 'BOS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      origin: 'San Francisco Dons'
    },
    draft: '1956 · Pick #2 (1ª Ronda traspasado a Boston Celtics)',
    experience: '13 Temporadas (Boston Celtics)',
    transfers: [
      {
        season: '56/57',
        date: '30/04/1956',
        fromTeam: 'San Francisco Dons',
        toTeam: 'Boston Celtics',
        toTeamAbbr: 'BOS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        marketValue: '24.000 $',
        feeOrType: 'Traspaso noche del Draft (Red Auerbach)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA (Récord Imbatible)', count: 11, details: '1957, 1959-1966, 1968, 1969 (Celtics)' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 5, details: '1958, 1961, 1962, 1963, 1965' },
      { icon: 'star', name: 'NBA All-Star', count: 12, details: '1958-1969' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 3, details: '1959, 1963, 1965' },
      { icon: 'shield', name: '1er Equipo All-Defensive', count: 1, details: '1969' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Melbourne 1956' }
    ],
    seasonAverages: {
      pts: '15.1',
      reb: '24.7',
      ast: '5.3',
      stl: '2.1',
      blk: '6.4',
      fgPct: '43.8%',
      threePct: '0.0%',
      ftPct: '57.3%'
    }
  },

  'Kobe Bryant': {
    tacticalRole: 'La Mamba Negra (Black Mamba) & Anotador Letal',
    specialty: 'Juego de pies exquisito, tiros imposibles punteados y mentalidad ganadora feroz',
    playStyle: '5 anillos con Lakers, 81 puntos en un partido y una de las éticas de trabajo más legendarias',
    draftInfo: {
      year: 1996,
      round: 1,
      pick: 13,
      teamName: 'Charlotte Hornets (Traspasado a Lakers)',
      teamAbbr: 'LAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      origin: 'Lower Merion HS'
    },
    draft: '1996 · Pick #13 (1ª Ronda traspasado a LA Lakers)',
    experience: '20 Temporadas (Los Angeles Lakers)',
    transfers: [
      {
        season: '96/97',
        date: '26/06/1996',
        fromTeam: 'Lower Merion HS',
        toTeam: 'Los Angeles Lakers',
        toTeamAbbr: 'LAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        marketValue: '3,50 mill. $',
        feeOrType: 'Traspaso por Vlade Divac'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 5, details: '2000, 2001, 2002, 2009, 2010 (Lakers)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 2, details: '2009, 2010' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '2008' },
      { icon: 'flame', name: 'Partido de 81 Puntos', count: 1, details: '22/01/2006 vs Toronto Raptors' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 2, details: '2006 (35.4 pts), 2007 (31.6 pts)' },
      { icon: 'star', name: 'NBA All-Star', count: 18, details: '1998, 2000-2016 (4x MVP All-Star)' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 11, details: '2002-2004, 2006-2013' },
      { icon: 'shield', name: '1er Equipo All-Defensive', count: 9, details: '2000, 2003-2004, 2006-2011' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Pekín 2008, Londres 2012' }
    ],
    seasonAverages: {
      pts: '28.5',
      reb: '5.9',
      ast: '5.0',
      stl: '1.7',
      blk: '0.6',
      fgPct: '46.4%',
      threePct: '38.3%',
      ftPct: '85.3%'
    }
  },

  'Magic Johnson': {
    tacticalRole: 'El Mago del Showtime & Mayor Base Pasador de la Historia',
    specialty: 'Pases sin mirar, contraataque vertiginoso, carisma y versatilidad de 2.06m',
    playStyle: '5 anillos con Showtime Lakers, 3 MVPs y líder de asistencias en playoffs',
    draftInfo: {
      year: 1979,
      round: 1,
      pick: 1,
      teamName: 'Los Angeles Lakers',
      teamAbbr: 'LAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      origin: 'Michigan State Spartans'
    },
    draft: '1979 · Pick #1 (1ª Ronda por Los Angeles Lakers)',
    experience: '13 Temporadas (Los Angeles Lakers)',
    transfers: [
      {
        season: '79/80',
        date: '25/06/1979',
        fromTeam: 'Michigan State',
        toTeam: 'Los Angeles Lakers',
        toTeamAbbr: 'LAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        marketValue: '5,00 mill. $',
        feeOrType: 'Draft NBA (#1)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 5, details: '1980, 1982, 1985, 1987, 1988 (Lakers)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 3, details: '1980 (Rookie), 1982, 1987' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 3, details: '1987, 1989, 1990' },
      { icon: 'flame', name: 'Líder en Asistencias de la NBA', count: 4, details: '1983, 1984, 1986, 1987 (11.2 AST carrera)' },
      { icon: 'star', name: 'NBA All-Star', count: 12, details: '1980, 1982-1992' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 9, details: '1983-1991' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Barcelona 1992 (Dream Team)' }
    ],
    seasonAverages: {
      pts: '23.9',
      reb: '6.3',
      ast: '12.2',
      stl: '1.7',
      blk: '0.5',
      fgPct: '52.2%',
      threePct: '84.8%',
      ftPct: '84.8%'
    }
  },

  'Larry Bird': {
    tacticalRole: 'Larry Legend & El Alero Más Inteligente y Competidor',
    specialty: 'Tiro infalible en clutch, pase milimétrico, club 50-40-90 y trash talk legendario',
    playStyle: '3 MVPs consecutivos, 3 anillos con los Boston Celtics y líder de la era dorada de los 80s',
    draftInfo: {
      year: 1978,
      round: 1,
      pick: 6,
      teamName: 'Boston Celtics',
      teamAbbr: 'BOS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      origin: 'Indiana State Sycamores'
    },
    draft: '1978 · Pick #6 (1ª Ronda por Boston Celtics)',
    experience: '13 Temporadas (Boston Celtics)',
    transfers: [
      {
        season: '79/80',
        date: '08/06/1979',
        fromTeam: 'Indiana State',
        toTeam: 'Boston Celtics',
        toTeamAbbr: 'BOS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        marketValue: '3,25 mill. $',
        feeOrType: 'Firma de Contrato Récord'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 3, details: '1981, 1984, 1986 (Celtics)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 2, details: '1984, 1986' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 3, details: '1984, 1985, 1986 (3 consecutivos)' },
      { icon: 'flame', name: 'Club 50-40-90', count: 2, details: '1987, 1988' },
      { icon: 'star', name: 'NBA All-Star', count: 12, details: '1980-1988, 1990-1992' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 9, details: '1980-1988' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Barcelona 1992 (Dream Team)' }
    ],
    seasonAverages: {
      pts: '25.8',
      reb: '9.8',
      ast: '6.8',
      stl: '2.0',
      blk: '0.6',
      fgPct: '49.6%',
      threePct: '42.3%',
      ftPct: '89.6%'
    }
  },

  'Kareem Abdul-Jabbar': {
    tacticalRole: 'El Maestro del Skyhook & Máximo Campeón Interior',
    specialty: 'El tiro más indefendible de la historia (Skyhook), 6 MVPs de la NBA y 6 anillos',
    playStyle: '20 temporadas de excelencia dominando con Milwaukee Bucks y Los Angeles Lakers',
    draftInfo: {
      year: 1969,
      round: 1,
      pick: 1,
      teamName: 'Milwaukee Bucks',
      teamAbbr: 'MIL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
      origin: 'UCLA Bruins'
    },
    draft: '1969 · Pick #1 (1ª Ronda por Milwaukee Bucks)',
    experience: '20 Temporadas (Milwaukee Bucks / Los Angeles Lakers)',
    transfers: [
      {
        season: '69/70',
        date: '07/04/1969',
        fromTeam: 'UCLA Bruins',
        toTeam: 'Milwaukee Bucks',
        toTeamAbbr: 'MIL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
        marketValue: '1,40 mill. $',
        feeOrType: 'Draft NBA (#1)'
      },
      {
        season: '75/76',
        date: '16/06/1975',
        fromTeam: 'Milwaukee Bucks',
        fromTeamAbbr: 'MIL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
        toTeam: 'Los Angeles Lakers',
        toTeamAbbr: 'LAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        marketValue: '3,00 mill. $',
        feeOrType: 'Mega-Traspaso por 4 jugadores'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 6, details: '1971 (MIL), 1980, 1982, 1985, 1987, 1988 (LAL)' },
      { icon: 'ribbon', name: 'MVP de las Finales', count: 2, details: '1971, 1985' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA (Récord)', count: 6, details: '1971, 1972, 1974, 1976, 1977, 1980' },
      { icon: 'star', name: 'NBA All-Star', count: 19, details: '1970-1989' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 10, details: '1971-1974, 1976-1977, 1980-1981, 1984, 1986' },
      { icon: 'shield', name: '1er Equipo All-Defensive', count: 5, details: '1974-1975, 1979-1981' }
    ],
    seasonAverages: {
      pts: '31.7',
      reb: '16.0',
      ast: '3.3',
      stl: '1.2',
      blk: '3.5',
      fgPct: '57.7%',
      threePct: '0.0%',
      ftPct: '69.0%'
    }
  },

  'Shaquille O\'Neal': {
    tacticalRole: 'Diesel & La Fuerza Más Destructiva en la Pintura',
    specialty: 'Potencia imparable en el poste bajo, mates rompe-tableros y presencia intimidatoria',
    playStyle: '4 anillos, 3 MVPs de Finales consecutivos con los Lakers del tricampeonato',
    draftInfo: {
      year: 1992,
      round: 1,
      pick: 1,
      teamName: 'Orlando Magic',
      teamAbbr: 'ORL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
      origin: 'LSU Tigers'
    },
    draft: '1992 · Pick #1 (1ª Ronda por Orlando Magic)',
    experience: '19 Temporadas (Magic / Lakers / Heat / Suns / Cavs / Celtics)',
    transfers: [
      {
        season: '92/93',
        date: '24/06/1992',
        fromTeam: 'LSU Tigers',
        toTeam: 'Orlando Magic',
        toTeamAbbr: 'ORL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
        marketValue: '40,00 mill. $',
        feeOrType: 'Draft NBA (#1 / 7 años)'
      },
      {
        season: '96/97',
        date: '18/07/1996',
        fromTeam: 'Orlando Magic',
        fromTeamAbbr: 'ORL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
        toTeam: 'Los Angeles Lakers',
        toTeamAbbr: 'LAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        marketValue: '120,00 mill. $',
        feeOrType: 'Agente Libre Histórico (7 años)'
      },
      {
        season: '04/05',
        date: '14/07/2004',
        fromTeam: 'Los Angeles Lakers',
        fromTeamAbbr: 'LAL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        toTeam: 'Miami Heat',
        toTeamAbbr: 'MIA',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        marketValue: '100,00 mill. $',
        feeOrType: 'Traspaso por Odom, Butler y Grant'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 4, details: '2000, 2001, 2002 (LAL), 2006 (MIA)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 3, details: '2000, 2001, 2002 (Three-peat)' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '2000 (Casi unánime)' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 2, details: '1995, 2000' },
      { icon: 'star', name: 'NBA All-Star', count: 15, details: '1993-1998, 2000-2007, 2009' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 8, details: '1998, 2000-2006' }
    ],
    seasonAverages: {
      pts: '29.7',
      reb: '13.6',
      ast: '3.8',
      stl: '0.5',
      blk: '3.0',
      fgPct: '57.4%',
      threePct: '0.0%',
      ftPct: '52.4%'
    }
  },

  'Stephen Curry': {
    tacticalRole: 'El Mejor Tirador de Todos los Tiempos (Chef Curry)',
    specialty: 'Triples desde cualquier rango, movimiento sin balón sin igual y 91% en libres',
    playStyle: '4 anillos con Golden State Warriors, 2 MVPs (1 unánime) y cambió la historia del baloncesto',
    draftInfo: {
      year: 2009,
      round: 1,
      pick: 7,
      teamName: 'Golden State Warriors',
      teamAbbr: 'GSW',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
      origin: 'Davidson Wildcats'
    },
    draft: '2009 · Pick #7 (1ª Ronda por Golden State Warriors)',
    experience: '16+ Temporadas (Golden State Warriors)',
    transfers: [
      {
        season: '09/10',
        date: '25/06/2009',
        fromTeam: 'Davidson Wildcats',
        toTeam: 'Golden State Warriors',
        toTeamAbbr: 'GSW',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
        marketValue: '12,70 mill. $',
        feeOrType: 'Draft NBA (#7)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 4, details: '2015, 2017, 2018, 2022 (Warriors)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 1, details: '2022' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 2, details: '2015, 2016 (Único unánime de la historia)' },
      { icon: 'flame', name: 'Máximo Triplista Histórico de la NBA', count: 1, details: '+3.700 triples convertidos' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 2, details: '2016 (30.1 pts), 2021 (32.0 pts)' },
      { icon: 'star', name: 'NBA All-Star', count: 10, details: '2014-2019, 2021-2024' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'París 2024 (4 triples seguidos en la final)' }
    ],
    seasonAverages: {
      pts: '30.1',
      reb: '5.4',
      ast: '6.7',
      stl: '2.1',
      blk: '0.2',
      fgPct: '50.4%',
      threePct: '45.4%',
      ftPct: '90.8%'
    }
  },

  'Kevin Durant': {
    tacticalRole: 'Easy Money Sniper (KD) & Anotador Imparable de 2.11m',
    specialty: 'Tiro de media y larga distancia por encima de cualquier defensor, manejo y versatilidad',
    playStyle: '2 anillos de campeón, 2 MVPs de Finales, 1 MVP de temporada y 4 títulos de anotación',
    draftInfo: {
      year: 2007,
      round: 1,
      pick: 2,
      teamName: 'Seattle SuperSonics (Thunder)',
      teamAbbr: 'OKC',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
      origin: 'Texas Longhorns'
    },
    draft: '2007 · Pick #2 (1ª Ronda por Seattle SuperSonics)',
    experience: '17+ Temporadas (Thunder / Warriors / Nets / Suns)',
    transfers: [
      {
        season: '07/08',
        date: '28/06/2007',
        fromTeam: 'Texas Longhorns',
        toTeam: 'Seattle SuperSonics',
        toTeamAbbr: 'OKC',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        marketValue: '19,50 mill. $',
        feeOrType: 'Draft NBA (#2)'
      },
      {
        season: '16/17',
        date: '07/07/2016',
        fromTeam: 'Oklahoma City Thunder',
        fromTeamAbbr: 'OKC',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        toTeam: 'Golden State Warriors',
        toTeamAbbr: 'GSW',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
        marketValue: '54,30 mill. $',
        feeOrType: 'Agente Libre (2 años)'
      },
      {
        season: '19/20',
        date: '07/07/2019',
        fromTeam: 'Golden State Warriors',
        fromTeamAbbr: 'GSW',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
        toTeam: 'Brooklyn Nets',
        toTeamAbbr: 'BKN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        marketValue: '164,00 mill. $',
        feeOrType: 'Sign-and-Trade (4 años)'
      },
      {
        season: '22/23',
        date: '09/02/2023',
        fromTeam: 'Brooklyn Nets',
        fromTeamAbbr: 'BKN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        toTeam: 'Phoenix Suns',
        toTeamAbbr: 'PHX',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        marketValue: '198,00 mill. $',
        feeOrType: 'Mega-Traspaso (Bridges, Johnson, 4 picks)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 2, details: '2017, 2018 (Warriors)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 2, details: '2017, 2018' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '2014' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 4, details: '2010, 2011, 2012, 2014' },
      { icon: 'star', name: 'NBA All-Star', count: 14, details: '2010-2019, 2021-2024' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica (Récord USA)', count: 4, details: 'Londres 2012, Río 2016, Tokio 2020, París 2024' }
    ],
    seasonAverages: {
      pts: '32.0',
      reb: '7.4',
      ast: '5.5',
      stl: '1.3',
      blk: '0.7',
      fgPct: '50.3%',
      threePct: '39.1%',
      ftPct: '87.3%'
    }
  },

  'Tim Duncan': {
    tacticalRole: 'The Big Fundamental & El Mejor Ala-Pívot de la Historia',
    specialty: 'Tiro a tabla en el poste, defensa interior impecable, pase y liderazgo silencioso',
    playStyle: '5 anillos con los San Antonio Spurs en 3 décadas diferentes, 2 MVPs y 3 Finals MVPs',
    draftInfo: {
      year: 1997,
      round: 1,
      pick: 1,
      teamName: 'San Antonio Spurs',
      teamAbbr: 'SAS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
      origin: 'Wake Forest Demon Deacons'
    },
    draft: '1997 · Pick #1 (1ª Ronda por San Antonio Spurs)',
    experience: '19 Temporadas (San Antonio Spurs)',
    transfers: [
      {
        season: '97/98',
        date: '25/06/1997',
        fromTeam: 'Wake Forest',
        toTeam: 'San Antonio Spurs',
        toTeamAbbr: 'SAS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
        marketValue: '14,30 mill. $',
        feeOrType: 'Draft NBA (#1)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 5, details: '1999, 2003, 2005, 2007, 2014 (Spurs)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 3, details: '1999, 2003, 2005' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 2, details: '2002, 2003' },
      { icon: 'star', name: 'NBA All-Star', count: 15, details: '1998, 2000-2011, 2013, 2015' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 10, details: '1998-2005, 2007, 2013' },
      { icon: 'shield', name: 'All-Defensive Team (Récord histórico)', count: 15, details: '8x 1er equipo, 7x 2do equipo' }
    ],
    seasonAverages: {
      pts: '23.3',
      reb: '12.9',
      ast: '3.9',
      stl: '0.7',
      blk: '2.9',
      fgPct: '51.3%',
      threePct: '27.3%',
      ftPct: '71.0%'
    }
  },

  'Hakeem Olajuwon': {
    tacticalRole: 'The Dream & El Maestro del Juego de Pies Interior (Dream Shake)',
    specialty: 'Dream Shake indescifrable, intimidación en el aro, fadeaway y tapones récord',
    playStyle: '2 campeonatos con Houston Rockets; único jugador en ganar MVP, DPOY y Finals MVP en el mismo año',
    draftInfo: {
      year: 1984,
      round: 1,
      pick: 1,
      teamName: 'Houston Rockets',
      teamAbbr: 'HOU',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
      origin: 'Houston Cougars'
    },
    draft: '1984 · Pick #1 (1ª Ronda por Houston Rockets)',
    experience: '18 Temporadas (Houston Rockets / Toronto Raptors)',
    transfers: [
      {
        season: '84/85',
        date: '19/06/1984',
        fromTeam: 'Houston Cougars',
        toTeam: 'Houston Rockets',
        toTeamAbbr: 'HOU',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
        marketValue: '6,30 mill. $',
        feeOrType: 'Draft NBA (#1)'
      },
      {
        season: '01/02',
        date: '08/08/2001',
        fromTeam: 'Houston Rockets',
        fromTeamAbbr: 'HOU',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
        toTeam: 'Toronto Raptors',
        toTeamAbbr: 'TOR',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
        marketValue: '18,00 mill. $',
        feeOrType: 'Sign-and-Trade (3 años)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 2, details: '1994, 1995 (Rockets)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 2, details: '1994, 1995' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '1994' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY)', count: 2, details: '1993, 1994' },
      { icon: 'shield', name: 'Máximo Taponador Histórico de la NBA', count: 1, details: '3.830 tapones (Récord absoluto)' },
      { icon: 'star', name: 'NBA All-Star', count: 12, details: '1985-1990, 1992-1997' }
    ],
    seasonAverages: {
      pts: '27.3',
      reb: '11.9',
      ast: '3.6',
      stl: '1.6',
      blk: '3.7',
      fgPct: '52.8%',
      threePct: '42.1%',
      ftPct: '71.6%'
    }
  },

  'Charles Barkley': {
    tacticalRole: 'Sir Charles & El Reboteador Más Feroz e Implacable',
    specialty: 'Rebote ofensivo con 1.98m, transición de costa a costa y juego al poste demoledor',
    playStyle: 'MVP de 1993, miembro del Dream Team de 1992 y líder indiscutido en la pintura',
    draftInfo: {
      year: 1984,
      round: 1,
      pick: 5,
      teamName: 'Philadelphia 76ers',
      teamAbbr: 'PHI',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
      origin: 'Auburn Tigers'
    },
    draft: '1984 · Pick #5 (1ª Ronda por Philadelphia 76ers)',
    experience: '16 Temporadas (76ers / Suns / Rockets)',
    transfers: [
      {
        season: '84/85',
        date: '19/06/1984',
        fromTeam: 'Auburn Tigers',
        toTeam: 'Philadelphia 76ers',
        toTeamAbbr: 'PHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
        marketValue: '2,00 mill. $',
        feeOrType: 'Draft NBA (#5)'
      },
      {
        season: '92/93',
        date: '17/06/1992',
        fromTeam: 'Philadelphia 76ers',
        fromTeamAbbr: 'PHI',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
        toTeam: 'Phoenix Suns',
        toTeamAbbr: 'PHX',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        marketValue: '15,00 mill. $',
        feeOrType: 'Traspaso por Hornacek, Lang y Perry'
      },
      {
        season: '96/97',
        date: '19/08/1996',
        fromTeam: 'Phoenix Suns',
        fromTeamAbbr: 'PHX',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        toTeam: 'Houston Rockets',
        toTeamAbbr: 'HOU',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
        marketValue: '18,00 mill. $',
        feeOrType: 'Mega-Traspaso por 4 jugadores'
      }
    ],
    awards: [
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '1993 (Phoenix Suns - 62 victorias)' },
      { icon: 'star', name: 'NBA All-Star', count: 11, details: '1987-1997 (MVP All-Star 1991)' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 5, details: '1988-1991, 1993' },
      { icon: 'flame', name: 'Líder en Rebotes de la NBA', count: 1, details: '1987 (14.6 REB)' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Barcelona 1992 (Máximo anotador del Dream Team), Atlanta 1996' }
    ],
    seasonAverages: {
      pts: '25.6',
      reb: '12.2',
      ast: '5.1',
      stl: '1.6',
      blk: '1.0',
      fgPct: '52.0%',
      threePct: '30.5%',
      ftPct: '76.5%'
    }
  },

  'Penny Hardaway': {
    tacticalRole: 'El Base del Futuro & Showtime de Orlando',
    specialty: 'Manejo mágico de 2.01m, visión perimetral, mates en penetración y química con Shaq',
    playStyle: '1er Equipo All-NBA a los 23 años, llevó a Orlando Magic a las Finales de 1995',
    draftInfo: {
      year: 1993,
      round: 1,
      pick: 3,
      teamName: 'Golden State Warriors (Traspasado a Magic)',
      teamAbbr: 'ORL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
      origin: 'Memphis Tigers'
    },
    draft: '1993 · Pick #3 (1ª Ronda traspasado a Orlando Magic)',
    experience: '14 Temporadas (Magic / Suns / Knicks / Heat)',
    transfers: [
      {
        season: '93/94',
        date: '30/06/1993',
        fromTeam: 'Memphis Tigers',
        toTeam: 'Orlando Magic',
        toTeamAbbr: 'ORL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
        marketValue: '65,00 mill. $',
        feeOrType: 'Traspaso noche del Draft por Chris Webber'
      },
      {
        season: '99/00',
        date: '05/08/1999',
        fromTeam: 'Orlando Magic',
        fromTeamAbbr: 'ORL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
        toTeam: 'Phoenix Suns',
        toTeamAbbr: 'PHX',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        marketValue: '86,00 mill. $',
        feeOrType: 'Sign-and-Trade (7 años)'
      },
      {
        season: '03/04',
        date: '05/01/2004',
        fromTeam: 'Phoenix Suns',
        fromTeamAbbr: 'PHX',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '15,00 mill. $',
        feeOrType: 'Traspaso de Stephon Marbury'
      }
    ],
    awards: [
      { icon: 'albums', name: '1er Equipo All-NBA', count: 2, details: '1995, 1996' },
      { icon: 'star', name: 'NBA All-Star', count: 4, details: '1995, 1996, 1997, 1998' },
      { icon: 'trophy', name: 'Campeón de la Conferencia Este', count: 1, details: '1995 (Orlando Magic)' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Atlanta 1996 (Dream Team III)' }
    ],
    seasonAverages: {
      pts: '21.7',
      reb: '4.3',
      ast: '7.1',
      stl: '2.0',
      blk: '0.5',
      fgPct: '51.3%',
      threePct: '31.4%',
      ftPct: '76.7%'
    }
  },

  'Jason Kidd': {
    tacticalRole: 'El Gran Maestro del Triple-Doble & Base Cerebral',
    specialty: 'Pase en transición, lectura táctica inigualable, robos y rebote desde el puesto de base',
    playStyle: 'Campeón NBA en 2011 con Dallas, 2do máximo asistente y recuperador de la historia',
    draftInfo: {
      year: 1994,
      round: 1,
      pick: 2,
      teamName: 'Dallas Mavericks',
      teamAbbr: 'DAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
      origin: 'California Golden Bears'
    },
    draft: '1994 · Pick #2 (1ª Ronda por Dallas Mavericks)',
    experience: '19 Temporadas (Mavs / Suns / Nets / Knicks)',
    transfers: [
      {
        season: '94/95',
        date: '29/06/1994',
        fromTeam: 'California',
        toTeam: 'Dallas Mavericks',
        toTeamAbbr: 'DAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        marketValue: '54,00 mill. $',
        feeOrType: 'Draft NBA (#2 / 9 años)'
      },
      {
        season: '96/97',
        date: '26/12/1996',
        fromTeam: 'Dallas Mavericks',
        fromTeamAbbr: 'DAL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        toTeam: 'Phoenix Suns',
        toTeamAbbr: 'PHX',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        marketValue: '30,00 mill. $',
        feeOrType: 'Traspaso por Michael Finley y Sam Cassell'
      },
      {
        season: '01/02',
        date: '18/07/2001',
        fromTeam: 'Phoenix Suns',
        fromTeamAbbr: 'PHX',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        toTeam: 'New Jersey Nets',
        toTeamAbbr: 'BKN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        marketValue: '60,00 mill. $',
        feeOrType: 'Traspaso por Stephon Marbury'
      },
      {
        season: '07/08',
        date: '19/02/2008',
        fromTeam: 'New Jersey Nets',
        fromTeamAbbr: 'BKN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        toTeam: 'Dallas Mavericks',
        toTeamAbbr: 'DAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        marketValue: '45,00 mill. $',
        feeOrType: 'Traspaso regreso a Dallas'
      },
      {
        season: '12/13',
        date: '12/07/2012',
        fromTeam: 'Dallas Mavericks',
        fromTeamAbbr: 'DAL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '9,50 mill. $',
        feeOrType: 'Agente Libre (Última temporada)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2011 (Dallas Mavericks)' },
      { icon: 'flame', name: 'Líder en Asistencias de la NBA', count: 5, details: '1999-2001, 2003, 2004' },
      { icon: 'star', name: 'NBA All-Star', count: 10, details: '1996, 1998, 2000-2004, 2007, 2008, 2010' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 5, details: '1999-2002, 2004' },
      { icon: 'shield', name: '1er Equipo All-Defensive', count: 4, details: '1999, 2001, 2002, 2006' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Sídney 2000, Pekín 2008' }
    ],
    seasonAverages: {
      pts: '16.9',
      reb: '6.8',
      ast: '10.8',
      stl: '2.3',
      blk: '0.4',
      fgPct: '44.4%',
      threePct: '36.6%',
      ftPct: '83.5%'
    }
  },

  'Patrick Ewing': {
    tacticalRole: 'Big Pat & El Eterno Rey del Madison Square Garden',
    specialty: 'Tiro tras media vuelta en suspensión, protección de aro implacable y garra neoyorquina',
    playStyle: '11 veces All-Star, máximo anotador, reboteador y taponador en la historia de los Knicks',
    draftInfo: {
      year: 1985,
      round: 1,
      pick: 1,
      teamName: 'New York Knicks',
      teamAbbr: 'NYK',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
      origin: 'Georgetown Hoyas'
    },
    draft: '1985 · Pick #1 (1ª Ronda - Primera Lotería del Draft por NY Knicks)',
    experience: '17 Temporadas (Knicks / Sonics / Magic)',
    transfers: [
      {
        season: '85/86',
        date: '18/06/1985',
        fromTeam: 'Georgetown Hoyas',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '31,20 mill. $',
        feeOrType: 'Draft NBA (#1 - Contrato de 10 años)'
      },
      {
        season: '00/01',
        date: '20/09/2000',
        fromTeam: 'New York Knicks',
        fromTeamAbbr: 'NYK',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        toTeam: 'Seattle SuperSonics',
        toTeamAbbr: 'OKC',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        marketValue: '18,70 mill. $',
        feeOrType: 'Mega-Traspaso a 4 bandas'
      },
      {
        season: '01/02',
        date: '18/07/2001',
        fromTeam: 'Seattle SuperSonics',
        fromTeamAbbr: 'OKC',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        toTeam: 'Orlando Magic',
        toTeamAbbr: 'ORL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
        marketValue: '4,50 mill. $',
        feeOrType: 'Agente Libre (Última temporada)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la Conferencia Este', count: 2, details: '1994, 1999 (New York Knicks)' },
      { icon: 'star', name: 'NBA All-Star', count: 11, details: '1986, 1988-1997' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 1, details: '1990' },
      { icon: 'albums', name: '2º Equipo All-NBA', count: 6, details: '1988, 1989, 1991, 1992, 1993, 1997' },
      { icon: 'shield', name: 'All-Defensive Team', count: 3, details: '1988, 1989, 1992' },
      { icon: 'sparkles', name: 'Rookie del Año de la NBA (ROTY)', count: 1, details: '1986' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Los Ángeles 1984, Barcelona 1992 (Dream Team)' }
    ],
    seasonAverages: {
      pts: '28.6',
      reb: '10.9',
      ast: '2.2',
      stl: '1.0',
      blk: '4.0',
      fgPct: '55.1%',
      threePct: '25.0%',
      ftPct: '77.5%'
    }
  },

  'Allen Iverson': {
    tacticalRole: 'The Answer (A.I.) & El Rey del Crossover Cultural',
    specialty: 'Crossover criminal, velocidad supersónica, corazón inagotable y coraje en penetración',
    playStyle: 'MVP de 2001, 4 títulos de anotación y llevó a los Sixers a las Finales NBA',
    draftInfo: {
      year: 1996,
      round: 1,
      pick: 1,
      teamName: 'Philadelphia 76ers',
      teamAbbr: 'PHI',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
      origin: 'Georgetown Hoyas'
    },
    draft: '1996 · Pick #1 (1ª Ronda por Philadelphia 76ers)',
    experience: '14 Temporadas (76ers / Nuggets / Pistons / Grizzlies)',
    transfers: [
      {
        season: '96/97',
        date: '26/06/1996',
        fromTeam: 'Georgetown Hoyas',
        toTeam: 'Philadelphia 76ers',
        toTeamAbbr: 'PHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
        marketValue: '9,40 mill. $',
        feeOrType: 'Draft NBA (#1)'
      },
      {
        season: '06/07',
        date: '19/12/2006',
        fromTeam: 'Philadelphia 76ers',
        fromTeamAbbr: 'PHI',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
        toTeam: 'Denver Nuggets',
        toTeamAbbr: 'DEN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
        marketValue: '40,00 mill. $',
        feeOrType: 'Traspaso histórico por Andre Miller'
      },
      {
        season: '08/09',
        date: '03/11/2008',
        fromTeam: 'Denver Nuggets',
        fromTeamAbbr: 'DEN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
        toTeam: 'Detroit Pistons',
        toTeamAbbr: 'DET',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
        marketValue: '21,00 mill. $',
        feeOrType: 'Traspaso por Chauncey Billups'
      },
      {
        season: '09/10',
        date: '02/12/2009',
        fromTeam: 'Memphis Grizzlies',
        fromTeamAbbr: 'MEM',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png',
        toTeam: 'Philadelphia 76ers',
        toTeamAbbr: 'PHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
        marketValue: '1,30 mill. $',
        feeOrType: 'Regreso triunfal a Philadelphia'
      }
    ],
    awards: [
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '2001 (Philadelphia 76ers)' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 4, details: '1999, 2001, 2002, 2005 (33.0 pts)' },
      { icon: 'shield', name: 'Líder en Robos de Balón de la NBA', count: 3, details: '2001, 2002, 2003' },
      { icon: 'star', name: 'NBA All-Star', count: 11, details: '2000-2010 (2x MVP All-Star)' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 3, details: '1999, 2001, 2005' },
      { icon: 'sparkles', name: 'Rookie del Año de la NBA (ROTY)', count: 1, details: '1997' }
    ],
    seasonAverages: {
      pts: '31.1',
      reb: '3.8',
      ast: '4.6',
      stl: '2.5',
      blk: '0.3',
      fgPct: '42.0%',
      threePct: '32.0%',
      ftPct: '81.4%'
    }
  },

  'Dirk Nowitzki': {
    tacticalRole: 'German Wunderkind & Revolucionario del Ala-Pívot Tirador',
    specialty: 'Flamingo Fadeaway a una pierna, rango de tiro ilimitado y clutch infalible',
    playStyle: 'Campeón NBA 2011 y Finals MVP con Dallas Mavericks; 6to máximo anotador de la historia (+31.560 pts)',
    draftInfo: {
      year: 1998,
      round: 1,
      pick: 9,
      teamName: 'Milwaukee Bucks (Traspasado a Dallas)',
      teamAbbr: 'DAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
      origin: 'DJK Würzburg (Alemania)'
    },
    draft: '1998 · Pick #9 (1ª Ronda traspasado a Dallas Mavericks)',
    experience: '21 Temporadas con una sola franquicia (Dallas Mavericks - Récord)',
    transfers: [
      {
        season: '98/99',
        date: '24/06/1998',
        fromTeam: 'DJK Würzburg (Alemania)',
        toTeam: 'Dallas Mavericks',
        toTeamAbbr: 'DAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        marketValue: '4,80 mill. $',
        feeOrType: 'Traspaso noche del Draft por Robert Traylor'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2011 (Dallas Mavericks)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 1, details: '2011' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '2007 (Primer europeo en lograrlo)' },
      { icon: 'flame', name: 'Club 50-40-90', count: 1, details: '2007' },
      { icon: 'star', name: 'NBA All-Star', count: 14, details: '2002-2012, 2014, 2015, 2019' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 4, details: '2005, 2006, 2007, 2009' }
    ],
    seasonAverages: {
      pts: '27.7',
      reb: '8.1',
      ast: '2.5',
      stl: '0.6',
      blk: '0.6',
      fgPct: '48.5%',
      threePct: '46.0%',
      ftPct: '94.1%'
    }
  },

  'Kevin Garnett': {
    tacticalRole: 'The Big Ticket (KG) & Intensidad Defensiva Pura',
    specialty: 'Defensa perimetral e interior de 2.11m, tiro de media distancia, pase y liderazgo voraz',
    playStyle: 'Campeón NBA 2008 con Celtics, MVP de 2004 con Minnesota y DPOY legendario',
    draftInfo: {
      year: 1995,
      round: 1,
      pick: 5,
      teamName: 'Minnesota Timberwolves',
      teamAbbr: 'MIN',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
      origin: 'Farragut Career Academy HS'
    },
    draft: '1995 · Pick #5 (1ª Ronda por Minnesota Timberwolves)',
    experience: '21 Temporadas (Timberwolves / Celtics / Nets)',
    transfers: [
      {
        season: '95/96',
        date: '28/06/1995',
        fromTeam: 'Farragut HS',
        toTeam: 'Minnesota Timberwolves',
        toTeamAbbr: 'MIN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
        marketValue: '5,60 mill. $',
        feeOrType: 'Draft NBA (#5)'
      },
      {
        season: '07/08',
        date: '31/07/2007',
        fromTeam: 'Minnesota Timberwolves',
        fromTeamAbbr: 'MIN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
        toTeam: 'Boston Celtics',
        toTeamAbbr: 'BOS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        marketValue: '60,00 mill. $',
        feeOrType: 'Mega-Traspaso por 7 jugadores (Récord NBA)'
      },
      {
        season: '13/14',
        date: '12/07/2013',
        fromTeam: 'Boston Celtics',
        fromTeamAbbr: 'BOS',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        toTeam: 'Brooklyn Nets',
        toTeamAbbr: 'BKN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        marketValue: '24,00 mill. $',
        feeOrType: 'Traspaso Blockbuster por rondas de draft'
      },
      {
        season: '14/15',
        date: '19/02/2015',
        fromTeam: 'Brooklyn Nets',
        fromTeamAbbr: 'BKN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        toTeam: 'Minnesota Timberwolves',
        toTeamAbbr: 'MIN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
        marketValue: '12,00 mill. $',
        feeOrType: 'Regreso a Minnesota para despedida'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2008 (Boston Celtics)' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '2004 (Minnesota Timberwolves)' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY)', count: 1, details: '2008' },
      { icon: 'flame', name: 'Líder en Rebotes de la NBA', count: 4, details: '2004-2007 (4 años consecutivos)' },
      { icon: 'star', name: 'NBA All-Star', count: 15, details: '1997, 1998, 2000-2011, 2013' },
      { icon: 'shield', name: '1er Equipo All-Defensive', count: 9, details: '2000-2005, 2008, 2009, 2011' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Sídney 2000' }
    ],
    seasonAverages: {
      pts: '24.2',
      reb: '13.9',
      ast: '5.0',
      stl: '1.5',
      blk: '2.2',
      fgPct: '49.9%',
      threePct: '25.6%',
      ftPct: '79.1%'
    }
  },

  'Dwyane Wade': {
    tacticalRole: 'Flash & El Escolta Más Letal en las Finales',
    specialty: 'Eurostep demoledor, corte vertiginoso a canasta, tapones de escolta y tiros decisivos',
    playStyle: '3 campeonatos con Miami Heat y MVP de las Finales de 2006 con una actuación legendaria',
    draftInfo: {
      year: 2003,
      round: 1,
      pick: 5,
      teamName: 'Miami Heat',
      teamAbbr: 'MIA',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
      origin: 'Marquette Golden Eagles'
    },
    draft: '2003 · Pick #5 (1ª Ronda por Miami Heat)',
    experience: '16 Temporadas (Heat / Bulls / Cavs)',
    transfers: [
      {
        season: '03/04',
        date: '26/06/2003',
        fromTeam: 'Marquette Golden Eagles',
        toTeam: 'Miami Heat',
        toTeamAbbr: 'MIA',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        marketValue: '12,30 mill. $',
        feeOrType: 'Draft NBA (#5)'
      },
      {
        season: '16/17',
        date: '15/07/2016',
        fromTeam: 'Miami Heat',
        fromTeamAbbr: 'MIA',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        toTeam: 'Chicago Bulls',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '47,00 mill. $',
        feeOrType: 'Agente Libre (Regreso a su ciudad natal)'
      },
      {
        season: '17/18',
        date: '08/02/2018',
        fromTeam: 'Cleveland Cavaliers',
        fromTeamAbbr: 'CLE',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
        toTeam: 'Miami Heat',
        toTeamAbbr: 'MIA',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        marketValue: '2,40 mill. $',
        feeOrType: 'Regreso definitivo a Miami Heat ("One Last Dance")'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 3, details: '2006, 2012, 2013 (Miami Heat)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 1, details: '2006 (34.7 PTS de media en Finales)' },
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 1, details: '2009 (30.2 pts)' },
      { icon: 'star', name: 'NBA All-Star', count: 13, details: '2005-2016, 2019' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 2, details: '2009, 2010' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Pekín 2008 (Máximo anotador del Redeem Team)' }
    ],
    seasonAverages: {
      pts: '30.2',
      reb: '5.0',
      ast: '7.5',
      stl: '2.2',
      blk: '1.3',
      fgPct: '49.1%',
      threePct: '31.7%',
      ftPct: '76.5%'
    }
  },

  'Scottie Pippen': {
    tacticalRole: 'El Alero Todoterreno Supremo & Ancla Defensiva',
    specialty: 'Defensa asfixiante sobre cualquier posición, generación de juego en contraataque y rebote',
    playStyle: '6 anillos con Chicago Bulls, 8 veces 1er Equipo Defensivo y co-creador del mítico 72-10',
    draftInfo: {
      year: 1987,
      round: 1,
      pick: 5,
      teamName: 'Seattle SuperSonics (Traspasado a Bulls)',
      teamAbbr: 'CHI',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
      origin: 'Central Arkansas Bears'
    },
    draft: '1987 · Pick #5 (1ª Ronda traspasado a Chicago Bulls)',
    experience: '17 Temporadas (Bulls / Rockets / Blazers)',
    transfers: [
      {
        season: '87/88',
        date: '22/06/1987',
        fromTeam: 'Central Arkansas',
        toTeam: 'Chicago Bulls',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '5,00 mill. $',
        feeOrType: 'Traspaso noche del Draft por Olden Polynice'
      },
      {
        season: '98/99',
        date: '22/01/1999',
        fromTeam: 'Chicago Bulls',
        fromTeamAbbr: 'CHI',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        toTeam: 'Houston Rockets',
        toTeamAbbr: 'HOU',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
        marketValue: '67,20 mill. $',
        feeOrType: 'Sign-and-Trade (5 años)'
      },
      {
        season: '99/00',
        date: '02/10/1999',
        fromTeam: 'Houston Rockets',
        fromTeamAbbr: 'HOU',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
        toTeam: 'Portland Trail Blazers',
        toTeamAbbr: 'POR',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
        marketValue: '40,00 mill. $',
        feeOrType: 'Traspaso por 6 jugadores'
      },
      {
        season: '03/04',
        date: '20/07/2003',
        fromTeam: 'Portland Trail Blazers',
        fromTeamAbbr: 'POR',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
        toTeam: 'Chicago Bulls',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '10,00 mill. $',
        feeOrType: 'Regreso de despedida a Chicago'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 6, details: '1991, 1992, 1993, 1996, 1997, 1998 (Bulls)' },
      { icon: 'shield', name: '1er Equipo All-Defensive de la NBA', count: 8, details: '1992-1999 (8 años consecutivos)' },
      { icon: 'star', name: 'NBA All-Star', count: 7, details: '1990, 1992-1997 (MVP All-Star 1994)' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 3, details: '1994, 1995, 1996' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Barcelona 1992 (Dream Team), Atlanta 1996' }
    ],
    seasonAverages: {
      pts: '19.4',
      reb: '6.4',
      ast: '5.9',
      stl: '1.7',
      blk: '0.7',
      fgPct: '46.3%',
      threePct: '37.4%',
      ftPct: '72.3%'
    }
  },

  'David Robinson': {
    tacticalRole: 'El Almirante (The Admiral) & Protector de Aro y Físico Portentoso',
    specialty: 'Velocidad en transición para un 2.16m, tapones estratosféricos, cuádruple-doble y 71 pts',
    playStyle: '2 anillos con San Antonio Spurs, 1 MVP, 1 DPOY y uno de los centros más completos',
    draftInfo: {
      year: 1987,
      round: 1,
      pick: 1,
      teamName: 'San Antonio Spurs',
      teamAbbr: 'SAS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
      origin: 'Navy Midshipmen'
    },
    draft: '1987 · Pick #1 (1ª Ronda por San Antonio Spurs)',
    experience: '14 Temporadas (San Antonio Spurs)',
    transfers: [
      {
        season: '89/90',
        date: '01/11/1989',
        fromTeam: 'US Navy Service',
        toTeam: 'San Antonio Spurs',
        toTeamAbbr: 'SAS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
        marketValue: '26,00 mill. $',
        feeOrType: 'Debut tras cumplir servicio militar naval'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 2, details: '1999, 2003 (Spurs)' },
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '1995' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY)', count: 1, details: '1992' },
      { icon: 'flame', name: 'Cuádruple-Doble Oficial', count: 1, details: '17/02/1994 (34 PTS, 10 REB, 10 AST, 10 BLK)' },
      { icon: 'flame', name: 'Partido de 71 Puntos', count: 1, details: '24/04/1994 vs Clippers' },
      { icon: 'star', name: 'NBA All-Star', count: 10, details: '1990-1996, 1998, 2000, 2001' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Barcelona 1992, Atlanta 1996' }
    ],
    seasonAverages: {
      pts: '27.6',
      reb: '10.8',
      ast: '2.9',
      stl: '1.7',
      blk: '3.2',
      fgPct: '53.0%',
      threePct: '100%',
      ftPct: '77.4%'
    }
  },

  'Gary Payton': {
    tacticalRole: 'The Glove & El Defensor de Perímetro Más Asfixiante',
    specialty: 'Presión defensiva en todo el campo, robos de balón, liderazgo y pase en alley-oop',
    playStyle: 'Único base en ganar el DPOY; 9 veces 1er Equipo Defensivo y campeón en 2006',
    draftInfo: {
      year: 1990,
      round: 1,
      pick: 2,
      teamName: 'Seattle SuperSonics',
      teamAbbr: 'OKC',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
      origin: 'Oregon State Beavers'
    },
    draft: '1990 · Pick #2 (1ª Ronda por Seattle SuperSonics)',
    experience: '17 Temporadas (Sonics / Bucks / Lakers / Celtics / Heat)',
    transfers: [
      {
        season: '90/91',
        date: '27/06/1990',
        fromTeam: 'Oregon State Beavers',
        toTeam: 'Seattle SuperSonics',
        toTeamAbbr: 'OKC',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        marketValue: '12,50 mill. $',
        feeOrType: 'Draft NBA (#2)'
      },
      {
        season: '02/03',
        date: '20/02/2003',
        fromTeam: 'Seattle SuperSonics',
        fromTeamAbbr: 'OKC',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        toTeam: 'Milwaukee Bucks',
        toTeamAbbr: 'MIL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
        marketValue: '15,00 mill. $',
        feeOrType: 'Traspaso por Ray Allen'
      },
      {
        season: '03/04',
        date: '16/07/2003',
        fromTeam: 'Milwaukee Bucks',
        fromTeamAbbr: 'MIL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
        toTeam: 'Los Angeles Lakers',
        toTeamAbbr: 'LAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        marketValue: '4,90 mill. $',
        feeOrType: 'Agente Libre con Karl Malone'
      },
      {
        season: '05/06',
        date: '22/09/2005',
        fromTeam: 'Boston Celtics',
        fromTeamAbbr: 'BOS',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        toTeam: 'Miami Heat',
        toTeamAbbr: 'MIA',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        marketValue: '1,10 mill. $',
        feeOrType: 'Firma rumbo al título 2006'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2006 (Miami Heat)' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY)', count: 1, details: '1996 (Único base de la historia)' },
      { icon: 'shield', name: '1er Equipo All-Defensive de la NBA', count: 9, details: '1994-2002 (9 años consecutivos - Récord)' },
      { icon: 'star', name: 'NBA All-Star', count: 9, details: '1994-1998, 2000-2003' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 2, details: '1998, 2000' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Atlanta 1996, Sídney 2000' }
    ],
    seasonAverages: {
      pts: '19.3',
      reb: '4.2',
      ast: '7.5',
      stl: '2.8',
      blk: '0.2',
      fgPct: '48.4%',
      threePct: '32.8%',
      ftPct: '74.8%'
    }
  },

  'Derrick Rose': {
    tacticalRole: 'Pooh & El MVP Más Joven de la Historia de la NBA',
    specialty: 'Velocidad explosiva y cambios de dirección inalcanzables, suspensiones acrobáticas y garra',
    playStyle: 'MVP de 2011 con tan solo 22 años liderando a los Chicago Bulls al mejor récord de la NBA (62-20)',
    draftInfo: {
      year: 2008,
      round: 1,
      pick: 1,
      teamName: 'Chicago Bulls',
      teamAbbr: 'CHI',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
      origin: 'Memphis Tigers'
    },
    draft: '2008 · Pick #1 (1ª Ronda por Chicago Bulls)',
    experience: '15 Temporadas (Bulls / Knicks / Cavs / Wolves / Pistons / Grizzlies)',
    transfers: [
      {
        season: '08/09',
        date: '26/06/2008',
        fromTeam: 'Memphis Tigers',
        toTeam: 'Chicago Bulls',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '22,50 mill. $',
        feeOrType: 'Draft NBA (#1)'
      },
      {
        season: '16/17',
        date: '22/06/2016',
        fromTeam: 'Chicago Bulls',
        fromTeamAbbr: 'CHI',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '21,30 mill. $',
        feeOrType: 'Traspaso por Robin Lopez y Calderón'
      },
      {
        season: '20/21',
        date: '08/02/2021',
        fromTeam: 'Detroit Pistons',
        fromTeamAbbr: 'DET',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '7,60 mill. $',
        feeOrType: 'Regreso estelar a NY Knicks con Thibodeau'
      }
    ],
    awards: [
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 1, details: '2011 (El más joven de la historia a los 22 años)' },
      { icon: 'sparkles', name: 'Rookie del Año de la NBA (ROTY)', count: 1, details: '2009' },
      { icon: 'star', name: 'NBA All-Star', count: 3, details: '2010, 2011, 2012' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 1, details: '2011' },
      { icon: 'medal', name: 'Medalla de Oro en Mundial FIBA', count: 2, details: 'Turquía 2010, España 2014' }
    ],
    seasonAverages: {
      pts: '25.0',
      reb: '4.1',
      ast: '7.7',
      stl: '1.0',
      blk: '0.6',
      fgPct: '44.5%',
      threePct: '33.2%',
      ftPct: '85.8%'
    }
  },

  'Kyrie Irving': {
    tacticalRole: 'Uncle Drew & El Mejor Manejo de Balón de Todos los Tiempos',
    specialty: 'Manijas impredecibles, finalizaciones acrobáticas con ambas manos y clutch letal',
    playStyle: 'Campeón NBA en 2016 con Cleveland Cavaliers con el triple decisivo en el Game 7',
    draftInfo: {
      year: 2011,
      round: 1,
      pick: 1,
      teamName: 'Cleveland Cavaliers',
      teamAbbr: 'CLE',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
      origin: 'Duke Blue Devils'
    },
    draft: '2011 · Pick #1 (1ª Ronda por Cleveland Cavaliers)',
    experience: '14+ Temporadas (Cavs / Celtics / Nets / Mavs)',
    transfers: [
      {
        season: '11/12',
        date: '23/06/2011',
        fromTeam: 'Duke Blue Devils',
        toTeam: 'Cleveland Cavaliers',
        toTeamAbbr: 'CLE',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
        marketValue: '23,20 mill. $',
        feeOrType: 'Draft NBA (#1)'
      },
      {
        season: '17/18',
        date: '22/08/2017',
        fromTeam: 'Cleveland Cavaliers',
        fromTeamAbbr: 'CLE',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
        toTeam: 'Boston Celtics',
        toTeamAbbr: 'BOS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        marketValue: '60,00 mill. $',
        feeOrType: 'Traspaso por Isaiah Thomas, Crowder y pick #8'
      },
      {
        season: '19/20',
        date: '06/07/2019',
        fromTeam: 'Boston Celtics',
        fromTeamAbbr: 'BOS',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        toTeam: 'Brooklyn Nets',
        toTeamAbbr: 'BKN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        marketValue: '136,50 mill. $',
        feeOrType: 'Agente Libre (4 años con Kevin Durant)'
      },
      {
        season: '22/23',
        date: '06/02/2023',
        fromTeam: 'Brooklyn Nets',
        fromTeamAbbr: 'BKN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        toTeam: 'Dallas Mavericks',
        toTeamAbbr: 'DAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        marketValue: '126,00 mill. $',
        feeOrType: 'Traspaso junto a Luka Doncic (Finales 2024)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2016 (Cleveland Cavaliers - "The Shot")' },
      { icon: 'sparkles', name: 'Rookie del Año de la NBA (ROTY)', count: 1, details: '2012' },
      { icon: 'flame', name: 'Club 50-40-90', count: 1, details: '2021 (Brooklyn Nets)' },
      { icon: 'star', name: 'NBA All-Star', count: 8, details: '2013-2015, 2017-2019, 2021, 2023 (MVP All-Star 2014)' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Río 2016' }
    ],
    seasonAverages: {
      pts: '27.1',
      reb: '4.8',
      ast: '6.1',
      stl: '1.4',
      blk: '0.7',
      fgPct: '50.6%',
      threePct: '40.2%',
      ftPct: '92.2%'
    }
  },

  'Steve Nash': {
    tacticalRole: 'El Genio de los 7 Segundos o Menos & Maestro del P&R',
    specialty: 'Pase magistral a una mano en drible, tiros tras finta y 4 veces miembro del club 50-40-90',
    playStyle: '2 veces MVP consecutivo con Phoenix Suns y líder de una de las mayores revoluciones ofensivas',
    draftInfo: {
      year: 1996,
      round: 1,
      pick: 15,
      teamName: 'Phoenix Suns',
      teamAbbr: 'PHX',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
      origin: 'Santa Clara Broncos'
    },
    draft: '1996 · Pick #15 (1ª Ronda por Phoenix Suns)',
    experience: '18 Temporadas (Suns / Mavs / Lakers)',
    transfers: [
      {
        season: '96/97',
        date: '26/06/1996',
        fromTeam: 'Santa Clara Broncos',
        toTeam: 'Phoenix Suns',
        toTeamAbbr: 'PHX',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        marketValue: '5,50 mill. $',
        feeOrType: 'Draft NBA (#15)'
      },
      {
        season: '98/99',
        date: '24/06/1998',
        fromTeam: 'Phoenix Suns',
        fromTeamAbbr: 'PHX',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        toTeam: 'Dallas Mavericks',
        toTeamAbbr: 'DAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        marketValue: '33,00 mill. $',
        feeOrType: 'Traspaso noche del Draft con Dirk Nowitzki'
      },
      {
        season: '04/05',
        date: '14/07/2004',
        fromTeam: 'Dallas Mavericks',
        fromTeamAbbr: 'DAL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        toTeam: 'Phoenix Suns',
        toTeamAbbr: 'PHX',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
        marketValue: '66,00 mill. $',
        feeOrType: 'Agente Libre (Regreso triunfal a Suns - 2x MVP)'
      }
    ],
    awards: [
      { icon: 'ribbon', name: 'MVP de la Temporada Regular NBA', count: 2, details: '2005, 2006 (Phoenix Suns)' },
      { icon: 'flame', name: 'Líder en Asistencias de la NBA', count: 5, details: '2005, 2006, 2007, 2010, 2011' },
      { icon: 'flame', name: 'Club 50-40-90 (Récord absoluto)', count: 4, details: '2006, 2008, 2009, 2010' },
      { icon: 'star', name: 'NBA All-Star', count: 8, details: '2002, 2003, 2005-2008, 2010, 2012' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 3, details: '2005, 2006, 2007' }
    ],
    seasonAverages: {
      pts: '18.8',
      reb: '4.2',
      ast: '11.5',
      stl: '0.8',
      blk: '0.1',
      fgPct: '51.2%',
      threePct: '43.9%',
      ftPct: '92.1%'
    }
  },

  'Ray Allen': {
    tacticalRole: 'Jesus Shuttlesworth & El Lanzador Más Frío en Momentos Críticos',
    specialty: 'Mecánica de tiro perfecta y rápida, salidas de carretón y el triple más clutch de la historia',
    playStyle: '2 veces campeón de la NBA (2008 con Boston Celtics y 2013 con Miami Heat)',
    draftInfo: {
      year: 1996,
      round: 1,
      pick: 5,
      teamName: 'Minnesota Timberwolves (Traspasado a Bucks)',
      teamAbbr: 'MIL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
      origin: 'UConn Huskies'
    },
    draft: '1996 · Pick #5 (1ª Ronda traspasado a Milwaukee Bucks)',
    experience: '18 Temporadas (Bucks / Sonics / Celtics / Heat)',
    transfers: [
      {
        season: '96/97',
        date: '26/06/1996',
        fromTeam: 'UConn Huskies',
        toTeam: 'Milwaukee Bucks',
        toTeamAbbr: 'MIL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
        marketValue: '6,20 mill. $',
        feeOrType: 'Traspaso noche del Draft por Stephon Marbury'
      },
      {
        season: '02/03',
        date: '20/02/2003',
        fromTeam: 'Milwaukee Bucks',
        fromTeamAbbr: 'MIL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
        toTeam: 'Seattle SuperSonics',
        toTeamAbbr: 'OKC',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        marketValue: '85,00 mill. $',
        feeOrType: 'Traspaso por Gary Payton'
      },
      {
        season: '07/08',
        date: '28/06/2007',
        fromTeam: 'Seattle SuperSonics',
        fromTeamAbbr: 'OKC',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        toTeam: 'Boston Celtics',
        toTeamAbbr: 'BOS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        marketValue: '54,00 mill. $',
        feeOrType: 'Traspaso para formar el Big 3 con Pierce y KG'
      },
      {
        season: '12/13',
        date: '11/07/2012',
        fromTeam: 'Boston Celtics',
        fromTeamAbbr: 'BOS',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        toTeam: 'Miami Heat',
        toTeamAbbr: 'MIA',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        marketValue: '6,30 mill. $',
        feeOrType: 'Agente Libre con LeBron, Wade y Bosh'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 2, details: '2008 (Celtics), 2013 (Heat - "The Shot")' },
      { icon: 'flame', name: 'Segundo Máximo Triplista Histórico', count: 1, details: '2.973 triples en carrera' },
      { icon: 'star', name: 'NBA All-Star', count: 10, details: '2000-2002, 2004-2009, 2011' },
      { icon: 'albums', name: '2º Equipo All-NBA', count: 1, details: '2005' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Sídney 2000' }
    ],
    seasonAverages: {
      pts: '26.4',
      reb: '4.5',
      ast: '4.1',
      stl: '1.5',
      blk: '0.2',
      fgPct: '45.4%',
      threePct: '41.2%',
      ftPct: '90.3%'
    }
  },

  'Paul Pierce': {
    tacticalRole: 'The Truth & El Anotador Clutch de Boston',
    specialty: 'Juego de media distancia con contacto, fadeaway en poste medio y frialdad decisiva',
    playStyle: 'MVP de las Finales de 2008 liderando a los Boston Celtics al campeonato #17',
    draftInfo: {
      year: 1998,
      round: 1,
      pick: 10,
      teamName: 'Boston Celtics',
      teamAbbr: 'BOS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      origin: 'Kansas Jayhawks'
    },
    draft: '1998 · Pick #10 (1ª Ronda por Boston Celtics)',
    experience: '19 Temporadas (Celtics / Nets / Wizards / Clippers)',
    transfers: [
      {
        season: '98/99',
        date: '24/06/1998',
        fromTeam: 'Kansas Jayhawks',
        toTeam: 'Boston Celtics',
        toTeamAbbr: 'BOS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        marketValue: '5,10 mill. $',
        feeOrType: 'Draft NBA (#10)'
      },
      {
        season: '13/14',
        date: '12/07/2013',
        fromTeam: 'Boston Celtics',
        fromTeamAbbr: 'BOS',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        toTeam: 'Brooklyn Nets',
        toTeamAbbr: 'BKN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        marketValue: '15,30 mill. $',
        feeOrType: 'Traspaso Blockbuster junto a Kevin Garnett'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2008 (Boston Celtics)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 1, details: '2008' },
      { icon: 'star', name: 'NBA All-Star', count: 10, details: '2002-2006, 2008-2012' },
      { icon: 'albums', name: '2º Equipo All-NBA', count: 1, details: '2009' }
    ],
    seasonAverages: {
      pts: '25.3',
      reb: '6.7',
      ast: '4.7',
      stl: '1.4',
      blk: '0.4',
      fgPct: '47.1%',
      threePct: '39.2%',
      ftPct: '80.0%'
    }
  },

  'Ben Wallace': {
    tacticalRole: 'Big Ben & El Muro Defensivo Más Temido de Detroit',
    specialty: 'Tapones a dos manos, rebotes salvajes, intimidación física total e intensidad',
    playStyle: '4 veces DPOY de la NBA, ancla defensiva de los Pistons campeones de 2004',
    draftInfo: {
      year: 1996,
      round: 2,
      pick: 'No elegido',
      teamName: 'Washington Bullets (Agente Libre no drafteado)',
      teamAbbr: 'WAS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/was.png',
      origin: 'Virginia Union Panthers'
    },
    draft: '1996 · No drafteado (Firmado como Agente Libre por Washington)',
    experience: '16 Temporadas (Bullets / Magic / Pistons / Bulls / Cavs)',
    transfers: [
      {
        season: '96/97',
        date: '02/10/1996',
        fromTeam: 'Virginia Union',
        toTeam: 'Washington Bullets',
        toTeamAbbr: 'WAS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/was.png',
        marketValue: '250.000 $',
        feeOrType: 'Agente Libre no drafteado'
      },
      {
        season: '00/01',
        date: '03/08/2000',
        fromTeam: 'Orlando Magic',
        fromTeamAbbr: 'ORL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
        toTeam: 'Detroit Pistons',
        toTeamAbbr: 'DET',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
        marketValue: '30,00 mill. $',
        feeOrType: 'Traspaso por Grant Hill (Sign-and-Trade)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2004 (Detroit Pistons)' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY - Récord)', count: 4, details: '2002, 2003, 2005, 2006' },
      { icon: 'shield', name: '1er Equipo All-Defensive de la NBA', count: 5, details: '2002-2006' },
      { icon: 'flame', name: 'Líder en Rebotes de la NBA', count: 2, details: '2002 (13.0 REB), 2003 (15.4 REB)' },
      { icon: 'star', name: 'NBA All-Star', count: 4, details: '2003, 2004, 2005, 2006' }
    ],
    seasonAverages: {
      pts: '9.5',
      reb: '15.4',
      ast: '1.7',
      stl: '1.4',
      blk: '3.2',
      fgPct: '48.1%',
      threePct: '0.0%',
      ftPct: '45.0%'
    }
  },

  'Carmelo Anthony': {
    tacticalRole: 'Melo & Uno de los Anotadores Más Puros en la Historia',
    specialty: 'Triple amenaza letal, tiro de media distancia tras jab step y rebote ofensivo',
    playStyle: '10 veces All-Star, máximo anotador de la NBA 2013 con los New York Knicks y leyenda olímpica',
    draftInfo: {
      year: 2003,
      round: 1,
      pick: 3,
      teamName: 'Denver Nuggets',
      teamAbbr: 'DEN',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
      origin: 'Syracuse Orange (Campeón NCAA)'
    },
    draft: '2003 · Pick #3 (1ª Ronda por Denver Nuggets)',
    experience: '19 Temporadas (Nuggets / Knicks / Thunder / Rockets / Blazers / Lakers)',
    transfers: [
      {
        season: '03/04',
        date: '26/06/2003',
        fromTeam: 'Syracuse Orange',
        toTeam: 'Denver Nuggets',
        toTeamAbbr: 'DEN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
        marketValue: '15,10 mill. $',
        feeOrType: 'Draft NBA (#3)'
      },
      {
        season: '10/11',
        date: '22/02/2011',
        fromTeam: 'Denver Nuggets',
        fromTeamAbbr: 'DEN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '65,00 mill. $',
        feeOrType: 'Mega-Traspaso Blockbuster a 3 bandas'
      },
      {
        season: '17/18',
        date: '25/09/2017',
        fromTeam: 'New York Knicks',
        fromTeamAbbr: 'NYK',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        toTeam: 'Oklahoma City Thunder',
        toTeamAbbr: 'OKC',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
        marketValue: '54,00 mill. $',
        feeOrType: 'Traspaso por Enes Kanter y McDermott'
      }
    ],
    awards: [
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 1, details: '2013 (28.7 pts con New York Knicks)' },
      { icon: 'star', name: 'NBA All-Star', count: 10, details: '2007, 2008, 2010-2017' },
      { icon: 'albums', name: '2º Equipo All-NBA', count: 2, details: '2010, 2013' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica (Récord histórico)', count: 3, details: 'Pekín 2008, Londres 2012, Río 2016' }
    ],
    seasonAverages: {
      pts: '28.7',
      reb: '6.9',
      ast: '2.6',
      stl: '0.8',
      blk: '0.5',
      fgPct: '44.9%',
      threePct: '37.9%',
      ftPct: '83.0%'
    }
  },

  'Dennis Rodman': {
    tacticalRole: 'The Worm & El Mayor Especialista en Rebotes de la Historia',
    specialty: 'Anticipación del rebote con cálculos de trayectoria, defensa sofocante e intensidad',
    playStyle: '5 veces campeón NBA (Bad Boys Pistons & 72-10 Bulls) y 7 títulos consecutivos de rebotes',
    draftInfo: {
      year: 1986,
      round: 2,
      pick: 27,
      teamName: 'Detroit Pistons',
      teamAbbr: 'DET',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
      origin: 'Southeastern Oklahoma State'
    },
    draft: '1986 · Pick #27 (2ª Ronda por Detroit Pistons)',
    experience: '14 Temporadas (Pistons / Spurs / Bulls / Lakers / Mavs)',
    transfers: [
      {
        season: '86/87',
        date: '17/06/1986',
        fromTeam: 'SE Oklahoma State',
        toTeam: 'Detroit Pistons',
        toTeamAbbr: 'DET',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
        marketValue: '450.000 $',
        feeOrType: 'Draft NBA (2ª ronda)'
      },
      {
        season: '93/94',
        date: '01/10/1993',
        fromTeam: 'Detroit Pistons',
        fromTeamAbbr: 'DET',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
        toTeam: 'San Antonio Spurs',
        toTeamAbbr: 'SAS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
        marketValue: '5,00 mill. $',
        feeOrType: 'Traspaso por Sean Elliott'
      },
      {
        season: '95/96',
        date: '02/10/1995',
        fromTeam: 'San Antonio Spurs',
        fromTeamAbbr: 'SAS',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
        toTeam: 'Chicago Bulls',
        toTeamAbbr: 'CHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
        marketValue: '9,00 mill. $',
        feeOrType: 'Traspaso por Will Perdue'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 5, details: '1989, 1990 (Pistons), 1996, 1997, 1998 (Bulls)' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY)', count: 2, details: '1990, 1991' },
      { icon: 'flame', name: 'Líder en Rebotes de la NBA (Récord)', count: 7, details: '1992-1998 (7 años consecutivos - 18.7 REB en 1992)' },
      { icon: 'shield', name: '1er Equipo All-Defensive de la NBA', count: 7, details: '1989-1993, 1995, 1996' },
      { icon: 'star', name: 'NBA All-Star', count: 2, details: '1990, 1992' }
    ],
    seasonAverages: {
      pts: '5.5',
      reb: '14.9',
      ast: '2.5',
      stl: '0.4',
      blk: '0.4',
      fgPct: '48.0%',
      threePct: '11.1%',
      ftPct: '52.8%'
    }
  },

  'Manu Ginóbili': {
    tacticalRole: 'El Manudona & El Mejor Sexto Hombre de Todos los Tiempos',
    specialty: 'Eurostep revolucionario, pases mágicos entre piernas, clutch letal y corazón ganador',
    playStyle: '4 veces campeón con San Antonio Spurs, Oro Olímpico 2004 con Argentina batiendo al Team USA',
    draftInfo: {
      year: 1999,
      round: 2,
      pick: 57,
      teamName: 'San Antonio Spurs',
      teamAbbr: 'SAS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
      origin: 'Virtus Bologna (Italia / Argentina)'
    },
    draft: '1999 · Pick #57 (2ª Ronda por San Antonio Spurs)',
    experience: '16 Temporadas con una sola franquicia (San Antonio Spurs)',
    transfers: [
      {
        season: '02/03',
        date: '18/07/2002',
        fromTeam: 'Virtus Bologna (Italia)',
        toTeam: 'San Antonio Spurs',
        toTeamAbbr: 'SAS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
        marketValue: '2,80 mill. $',
        feeOrType: 'Llegada a la NBA tras ganar Euroliga'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 4, details: '2003, 2005, 2007, 2014 (Spurs)' },
      { icon: 'sparkles', name: 'Mejor Sexto Hombre del Año (6MOTY)', count: 1, details: '2008' },
      { icon: 'star', name: 'NBA All-Star', count: 2, details: '2005, 2011' },
      { icon: 'albums', name: '3er Equipo All-NBA', count: 2, details: '2008, 2011' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica (Histórica)', count: 1, details: 'Atenas 2004 (MVP y líder de Argentina)' }
    ],
    seasonAverages: {
      pts: '19.5',
      reb: '4.8',
      ast: '4.5',
      stl: '1.5',
      blk: '0.4',
      fgPct: '46.0%',
      threePct: '40.1%',
      ftPct: '86.0%'
    }
  },

  'Tony Parker': {
    tacticalRole: 'TP9 & El Rayo Francés de la Pintura',
    specialty: 'Flotadora en bandeja (teardrop), penetración supersónica y dirección del Big 3 de Spurs',
    playStyle: '4 veces campeón NBA y MVP de las Finales 2007 (primer europeo en lograrlo)',
    draftInfo: {
      year: 2001,
      round: 1,
      pick: 28,
      teamName: 'San Antonio Spurs',
      teamAbbr: 'SAS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
      origin: 'Paris Basket Racing (Francia)'
    },
    draft: '2001 · Pick #28 (1ª Ronda por San Antonio Spurs)',
    experience: '18 Temporadas (Spurs / Hornets)',
    transfers: [
      {
        season: '01/02',
        date: '27/06/2001',
        fromTeam: 'Paris Basket Racing',
        toTeam: 'San Antonio Spurs',
        toTeamAbbr: 'SAS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
        marketValue: '2,60 mill. $',
        feeOrType: 'Draft NBA (#28)'
      },
      {
        season: '18/19',
        date: '23/07/2018',
        fromTeam: 'San Antonio Spurs',
        fromTeamAbbr: 'SAS',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
        toTeam: 'Charlotte Hornets',
        toTeamAbbr: 'CHA',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
        marketValue: '10,00 mill. $',
        feeOrType: 'Agente Libre (Última temporada)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 4, details: '2003, 2005, 2007, 2014 (Spurs)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 1, details: '2007 (Primer europeo de la historia)' },
      { icon: 'star', name: 'NBA All-Star', count: 6, details: '2006, 2007, 2009, 2012, 2013, 2014' },
      { icon: 'albums', name: '2º Equipo All-NBA', count: 3, details: '2012, 2013, 2014' },
      { icon: 'medal', name: 'Campeón del EuroBasket (Francia)', count: 1, details: '2013 (MVP del torneo)' }
    ],
    seasonAverages: {
      pts: '18.6',
      reb: '3.2',
      ast: '5.5',
      stl: '1.1',
      blk: '0.1',
      fgPct: '52.0%',
      threePct: '39.5%',
      ftPct: '78.3%'
    }
  },

  'Dikembe Mutombo': {
    tacticalRole: 'Mount Mutombo & El Dedo Negador de la NBA (Finger Wag)',
    specialty: 'Tapón monumental con movimiento de dedo ("Not in my house"), rebotes y presencia física',
    playStyle: '4 veces DPOY de la NBA, 2do máximo taponador de la historia (3.289 tapones)',
    draftInfo: {
      year: 1991,
      round: 1,
      pick: 4,
      teamName: 'Denver Nuggets',
      teamAbbr: 'DEN',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
      origin: 'Georgetown Hoyas'
    },
    draft: '1991 · Pick #4 (1ª Ronda por Denver Nuggets)',
    experience: '18 Temporadas (Nuggets / Hawks / 76ers / Nets / Knicks / Rockets)',
    transfers: [
      {
        season: '91/92',
        date: '26/06/1991',
        fromTeam: 'Georgetown Hoyas',
        toTeam: 'Denver Nuggets',
        toTeamAbbr: 'DEN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
        marketValue: '13,70 mill. $',
        feeOrType: 'Draft NBA (#4)'
      },
      {
        season: '96/97',
        date: '15/07/1996',
        fromTeam: 'Denver Nuggets',
        fromTeamAbbr: 'DEN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
        toTeam: 'Atlanta Hawks',
        toTeamAbbr: 'ATL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
        marketValue: '55,00 mill. $',
        feeOrType: 'Agente Libre (5 años)'
      },
      {
        season: '00/01',
        date: '22/02/2001',
        fromTeam: 'Atlanta Hawks',
        fromTeamAbbr: 'ATL',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
        toTeam: 'Philadelphia 76ers',
        toTeamAbbr: 'PHI',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
        marketValue: '68,00 mill. $',
        feeOrType: 'Traspaso rumbo a las Finales con Iverson'
      },
      {
        season: '03/04',
        date: '09/10/2003',
        fromTeam: 'New Jersey Nets',
        fromTeamAbbr: 'BKN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '8,50 mill. $',
        feeOrType: 'Agente Libre (2 años)'
      }
    ],
    awards: [
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY - Récord)', count: 4, details: '1995, 1997, 1998, 2001' },
      { icon: 'shield', name: 'Líder en Tapones de la NBA', count: 3, details: '1994, 1995, 1996 (4.5 BLQ por partido)' },
      { icon: 'flame', name: 'Líder en Rebotes de la NBA', count: 2, details: '2000, 2001' },
      { icon: 'star', name: 'NBA All-Star', count: 8, details: '1992, 1995-1998, 2000-2002' },
      { icon: 'shield', name: '1er Equipo All-Defensive de la NBA', count: 3, details: '1997, 1998, 2001' }
    ],
    seasonAverages: {
      pts: '11.5',
      reb: '12.2',
      ast: '1.2',
      stl: '0.4',
      blk: '3.9',
      fgPct: '51.8%',
      threePct: '0.0%',
      ftPct: '68.4%'
    }
  },

  'Vince Carter': {
    tacticalRole: 'Vinsanity & Half-Man, Half-Amazing',
    specialty: 'Los mejores mates de la historia del baloncesto, tiro perimetral y longevidad récord (22 temporadas)',
    playStyle: '8 veces All-Star, campeón del concurso de mates del 2000 y referente de Toronto Raptors y New Jersey Nets',
    draftInfo: {
      year: 1998,
      round: 1,
      pick: 5,
      teamName: 'Golden State Warriors (Traspasado a Raptors)',
      teamAbbr: 'TOR',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
      origin: 'North Carolina Tar Heels'
    },
    draft: '1998 · Pick #5 (1ª Ronda traspasado a Toronto Raptors)',
    experience: '22 Temporadas (Récord en 4 décadas distintas: 90s, 00s, 10s, 20s)',
    transfers: [
      {
        season: '98/99',
        date: '24/06/1998',
        fromTeam: 'UNC Tar Heels',
        toTeam: 'Toronto Raptors',
        toTeamAbbr: 'TOR',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
        marketValue: '6,40 mill. $',
        feeOrType: 'Traspaso noche del Draft por Antawn Jamison'
      },
      {
        season: '04/05',
        date: '17/12/2004',
        fromTeam: 'Toronto Raptors',
        fromTeamAbbr: 'TOR',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
        toTeam: 'New Jersey Nets',
        toTeamAbbr: 'BKN',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
        marketValue: '84,00 mill. $',
        feeOrType: 'Traspaso con Jason Kidd'
      }
    ],
    awards: [
      { icon: 'sparkles', name: 'Rookie del Año de la NBA (ROTY)', count: 1, details: '1999' },
      { icon: 'flame', name: 'Campeón del Concurso de Mates NBA', count: 1, details: '2000 (La mejor exhibición de la historia)' },
      { icon: 'star', name: 'NBA All-Star', count: 8, details: '2000-2007' },
      { icon: 'albums', name: '2º Equipo All-NBA', count: 1, details: '2001' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Sídney 2000 ("El mate de la muerte")' }
    ],
    seasonAverages: {
      pts: '27.6',
      reb: '5.5',
      ast: '3.9',
      stl: '1.5',
      blk: '1.1',
      fgPct: '46.0%',
      threePct: '40.8%',
      ftPct: '79.5%'
    }
  },

  'Dominique Wilkins': {
    tacticalRole: 'The Human Highlight Film & El Martillo de Atlanta',
    specialty: 'Mates molino a dos manos imparables, anotación voraz y duelos épicos contra Larry Bird y Jordan',
    playStyle: 'Máximo anotador de 1986 con 30.3 pts por partido y líder legendario de los Atlanta Hawks',
    draftInfo: {
      year: 1982,
      round: 1,
      pick: 3,
      teamName: 'Utah Jazz (Traspasado a Hawks)',
      teamAbbr: 'ATL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
      origin: 'Georgia Bulldogs'
    },
    draft: '1982 · Pick #3 (1ª Ronda traspasado a Atlanta Hawks)',
    experience: '15 Temporadas (Hawks / Clippers / Celtics / Spurs / Magic)',
    transfers: [
      {
        season: '82/83',
        date: '02/09/1982',
        fromTeam: 'Georgia Bulldogs',
        toTeam: 'Atlanta Hawks',
        toTeamAbbr: 'ATL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
        marketValue: '3,00 mill. $',
        feeOrType: 'Traspaso por John Drew y Freeman Williams'
      }
    ],
    awards: [
      { icon: 'flame', name: 'Máximo Anotador de la NBA', count: 1, details: '1986 (30.3 pts)' },
      { icon: 'flame', name: 'Campeón del Concurso de Mates NBA', count: 2, details: '1985, 1990' },
      { icon: 'star', name: 'NBA All-Star', count: 9, details: '1986-1994' },
      { icon: 'albums', name: '1er Equipo All-NBA', count: 1, details: '1986' }
    ],
    seasonAverages: {
      pts: '30.3',
      reb: '7.9',
      ast: '2.6',
      stl: '1.8',
      blk: '0.6',
      fgPct: '46.8%',
      threePct: '28.6%',
      ftPct: '81.8%'
    }
  },

  'Chauncey Billups': {
    tacticalRole: 'Mr. Big Shot & El Comandante Frío de Detroit',
    specialty: 'Triples clutch en los últimos segundos, tiro libre bajo presión y defensa física de perímetro',
    playStyle: 'MVP de las Finales 2004 destronando a los Lakers de Shaq y Kobe; líder de los Pistons campeones',
    draftInfo: {
      year: 1997,
      round: 1,
      pick: 3,
      teamName: 'Boston Celtics',
      teamAbbr: 'BOS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      origin: 'Colorado Buffaloes'
    },
    draft: '1997 · Pick #3 (1ª Ronda por Boston Celtics)',
    experience: '17 Temporadas (Celtics / Raptors / Nuggets / Wolves / Pistons / Knicks / Clippers)',
    transfers: [
      {
        season: '97/98',
        date: '25/06/1997',
        fromTeam: 'Colorado Buffaloes',
        toTeam: 'Boston Celtics',
        toTeamAbbr: 'BOS',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
        marketValue: '7,40 mill. $',
        feeOrType: 'Draft NBA (#3)'
      },
      {
        season: '02/03',
        date: '17/07/2002',
        fromTeam: 'Minnesota Timberwolves',
        fromTeamAbbr: 'MIN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
        toTeam: 'Detroit Pistons',
        toTeamAbbr: 'DET',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
        marketValue: '35,00 mill. $',
        feeOrType: 'Agente Libre (6 años - Llegada histórica a Detroit)'
      },
      {
        season: '10/11',
        date: '22/02/2011',
        fromTeam: 'Denver Nuggets',
        fromTeamAbbr: 'DEN',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
        toTeam: 'New York Knicks',
        toTeamAbbr: 'NYK',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
        marketValue: '14,20 mill. $',
        feeOrType: 'Traspaso Blockbuster con Carmelo Anthony'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 1, details: '2004 (Detroit Pistons)' },
      { icon: 'ribbon', name: 'MVP de las Finales de la NBA', count: 1, details: '2004 (21.0 PTS, 5.2 AST, 47% 3P)' },
      { icon: 'star', name: 'NBA All-Star', count: 5, details: '2006-2010' },
      { icon: 'albums', name: '2º Equipo All-NBA', count: 1, details: '2006' },
      { icon: 'shield', name: '2º Equipo All-Defensive', count: 2, details: '2005, 2006' },
      { icon: 'medal', name: 'Medalla de Oro en Mundial FIBA', count: 1, details: 'Turquía 2010' }
    ],
    seasonAverages: {
      pts: '18.5',
      reb: '3.1',
      ast: '8.6',
      stl: '0.9',
      blk: '0.1',
      fgPct: '44.8%',
      threePct: '43.3%',
      ftPct: '89.2%'
    }
  },

  'Klay Thompson': {
    tacticalRole: 'Game 6 Klay & El Tirador En Racha Más Devastador',
    specialty: 'Tiro de tres en suspensión inmediato (catch-and-shoot), 37 puntos en un solo cuarto y defensa 1v1',
    playStyle: '4 veces campeón con Golden State Warriors y co-líder de los legendarios Splash Brothers',
    draftInfo: {
      year: 2011,
      round: 1,
      pick: 11,
      teamName: 'Golden State Warriors',
      teamAbbr: 'GSW',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
      origin: 'Washington State Cougars'
    },
    draft: '2011 · Pick #11 (1ª Ronda por Golden State Warriors)',
    experience: '13+ Temporadas (Warriors / Mavericks)',
    transfers: [
      {
        season: '11/12',
        date: '23/06/2011',
        fromTeam: 'Washington State',
        toTeam: 'Golden State Warriors',
        toTeamAbbr: 'GSW',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
        marketValue: '10,20 mill. $',
        feeOrType: 'Draft NBA (#11)'
      },
      {
        season: '24/25',
        date: '06/07/2024',
        fromTeam: 'Golden State Warriors',
        fromTeamAbbr: 'GSW',
        fromTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
        toTeam: 'Dallas Mavericks',
        toTeamAbbr: 'DAL',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
        marketValue: '50,00 mill. $',
        feeOrType: 'Sign-and-Trade (3 años con Luka y Kyrie)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 4, details: '2015, 2017, 2018, 2022 (Warriors)' },
      { icon: 'flame', name: 'Récord de Triples en un Partido NBA', count: 1, details: '14 triples vs Chicago Bulls (29/10/2018)' },
      { icon: 'flame', name: 'Récord de Puntos en un Cuarto', count: 1, details: '37 puntos en el 3er cuarto vs Kings' },
      { icon: 'star', name: 'NBA All-Star', count: 5, details: '2015-2019' },
      { icon: 'shield', name: '2º Equipo All-Defensive', count: 1, details: '2019' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 1, details: 'Río 2016' }
    ],
    seasonAverages: {
      pts: '22.3',
      reb: '3.7',
      ast: '2.1',
      stl: '0.8',
      blk: '0.6',
      fgPct: '47.0%',
      threePct: '44.0%',
      ftPct: '90.2%'
    }
  },

  'Draymond Green': {
    tacticalRole: 'El Corazón Defensivo & Point-Forward de la Dinastía',
    specialty: 'Visión de pase desde poste alto, defensa multiposicional 1 a 5, intimidación y comunicación táctica',
    playStyle: '4 veces campeón con Golden State Warriors, DPOY 2017 y líder vocal de la era Splash',
    draftInfo: {
      year: 2012,
      round: 2,
      pick: 35,
      teamName: 'Golden State Warriors',
      teamAbbr: 'GSW',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
      origin: 'Michigan State Spartans'
    },
    draft: '2012 · Pick #35 (2ª Ronda por Golden State Warriors)',
    experience: '13+ Temporadas (Golden State Warriors)',
    transfers: [
      {
        season: '12/13',
        date: '28/06/2012',
        fromTeam: 'Michigan State Spartans',
        toTeam: 'Golden State Warriors',
        toTeamAbbr: 'GSW',
        toTeamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
        marketValue: '2,60 mill. $',
        feeOrType: 'Draft NBA (2ª ronda)'
      }
    ],
    awards: [
      { icon: 'trophy', name: 'Campeón de la NBA', count: 4, details: '2015, 2017, 2018, 2022 (Warriors)' },
      { icon: 'shield', name: 'Jugador Defensivo del Año (DPOY)', count: 1, details: '2017' },
      { icon: 'shield', name: '1er Equipo All-Defensive de la NBA', count: 4, details: '2015, 2016, 2017, 2021' },
      { icon: 'star', name: 'NBA All-Star', count: 4, details: '2016, 2017, 2018, 2022' },
      { icon: 'medal', name: 'Medalla de Oro Olímpica', count: 2, details: 'Río 2016, Tokio 2020' }
    ],
    seasonAverages: {
      pts: '14.0',
      reb: '9.5',
      ast: '7.4',
      stl: '1.5',
      blk: '1.4',
      fgPct: '49.0%',
      threePct: '38.8%',
      ftPct: '69.6%'
    }
  }
};
