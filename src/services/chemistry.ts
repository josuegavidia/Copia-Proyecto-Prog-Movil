import { SquadLineup, SquadSynergy, Position, UserCard } from '../types';

export const calculateSquadSynergy = (squad: SquadLineup): SquadSynergy => {
  const slots: { pos: Position; card: UserCard | null }[] = [
    { pos: 'PG', card: squad.pg },
    { pos: 'SG', card: squad.sg },
    { pos: 'SF', card: squad.sf },
    { pos: 'PF', card: squad.pf },
    { pos: 'C', card: squad.c },
  ];

  const activeCards = slots
    .filter((slot) => slot.card !== null)
    .map((slot) => slot.card!);

  if (activeCards.length === 0) {
    return {
      totalOvr: 0,
      teamChemistry: 0,
      offenseRating: 0,
      defenseRating: 0,
      teamBonuses: [],
    };
  }

  let baseChemistry = 0;
  const bonuses: string[] = [];
  const structuredBonuses: { iconName: string; text: string; type: 'positive' | 'warning' | 'coach' }[] = [];

  // 1. Positional Fit Check
  slots.forEach((slot) => {
    if (!slot.card) return;
    const player = slot.card.player;
    if (player.position === slot.pos) {
      baseChemistry += 16; // Perfect fit (max 16 * 5 = 80)
    } else if (player.secondaryPosition === slot.pos) {
      baseChemistry += 11; // Secondary position
      const text = `${player.name} fuera de pos. natural (${player.position})`;
      bonuses.push(text);
      structuredBonuses.push({ iconName: 'information-circle-outline', text, type: 'warning' });
    } else {
      baseChemistry += 4; // Out of position penalty
      const text = `${player.name} en posición no apta (${slot.pos})`;
      bonuses.push(text);
      structuredBonuses.push({ iconName: 'alert-circle-outline', text, type: 'warning' });
    }
  });

  // 2. Team Franchise Synergy
  const teamCounts: Record<string, number> = {};
  const confCounts: Record<string, number> = { Eastern: 0, Western: 0 };

  activeCards.forEach((card) => {
    const p = card.player;
    teamCounts[p.teamAbbr] = (teamCounts[p.teamAbbr] || 0) + 1;
    confCounts[p.conference] = (confCounts[p.conference] || 0) + 1;
  });

  let franchiseBonusChem = 0;
  let franchiseBonusOff = 0;
  let franchiseBonusDef = 0;

  Object.entries(teamCounts).forEach(([teamAbbr, count]) => {
    if (count >= 3) {
      franchiseBonusChem += 15;
      franchiseBonusOff += 4;
      franchiseBonusDef += 4;
      const text = `Trío ${teamAbbr} (+15 Química, +4 OFF/DEF)`;
      bonuses.push(text);
      structuredBonuses.push({ iconName: 'flame', text, type: 'positive' });
    } else if (count === 2) {
      franchiseBonusChem += 8;
      franchiseBonusOff += 2;
      const text = `Dúo ${teamAbbr} (+8 Química, +2 OFF)`;
      bonuses.push(text);
      structuredBonuses.push({ iconName: 'flash', text, type: 'positive' });
    }
  });

  // 3. Conference Synergy
  if (confCounts.Eastern >= 4) {
    franchiseBonusChem += 8;
    const text = 'Dominio Conferencia Este (+8 Química)';
    bonuses.push(text);
    structuredBonuses.push({ iconName: 'globe-outline', text, type: 'positive' });
  } else if (confCounts.Western >= 4) {
    franchiseBonusChem += 8;
    const text = 'Dominio Conferencia Oeste (+8 Química)';
    bonuses.push(text);
    structuredBonuses.push({ iconName: 'globe-outline', text, type: 'positive' });
  }

  // 4. Coach Synergy & Tactical Boost
  let coachBonusOff = 0;
  let coachBonusDef = 0;
  let coachBonusChem = 0;

  if (squad.coach) {
    coachBonusOff = squad.coach.boostOffense || 0;
    coachBonusDef = squad.coach.boostDefense || 0;
    coachBonusChem = squad.coach.boostChemistry || 0;

    const coachText = `DT ${squad.coach.name} (${squad.coach.tactic}: +${coachBonusOff} OFF, +${coachBonusDef} DEF)`;
    bonuses.push(coachText);
    structuredBonuses.push({ iconName: 'shirt-outline', text: coachText, type: 'coach' });

    // Matching coach franchise affinity
    const matchingTeamPlayers = activeCards.filter(
      (c) => c.player.teamAbbr === squad.coach?.teamAffinity
    ).length;

    if (matchingTeamPlayers > 0) {
      const coachTeamAffinityBoost = matchingTeamPlayers * 4;
      coachBonusChem += coachTeamAffinityBoost;
      const affinityText = `Afinidad Franquicia DT (${squad.coach.teamAffinity}: +${coachTeamAffinityBoost} Química)`;
      bonuses.push(affinityText);
      structuredBonuses.push({ iconName: 'ribbon-outline', text: affinityText, type: 'coach' });
    }
  }

  // Calculate final chemistry clamped between 0 and 100
  const finalChemistry = Math.min(
    100,
    Math.max(0, Math.round(baseChemistry + franchiseBonusChem + coachBonusChem))
  );

  // Compute Base Stats averages
  const avgOvr =
    activeCards.reduce((sum, c) => sum + c.player.stats.ovr, 0) /
    activeCards.length;
  const avgOff =
    activeCards.reduce((sum, c) => sum + c.player.stats.offense, 0) /
    activeCards.length;
  const avgDef =
    activeCards.reduce((sum, c) => sum + c.player.stats.defense, 0) /
    activeCards.length;

  // Chemistry multiplier (if chemistry is 100, gives +3 OVR bonus; if 0, -5 OVR penalty)
  const chemOvrModifier = (finalChemistry - 50) / 25; // -2 to +2

  const finalOvr = Math.min(
    99,
    Math.max(
      50,
      Math.round(avgOvr + chemOvrModifier + (coachBonusOff + coachBonusDef) / 4)
    )
  );

  const finalOff = Math.min(
    99,
    Math.max(50, Math.round(avgOff + franchiseBonusOff + coachBonusOff))
  );
  const finalDef = Math.min(
    99,
    Math.max(50, Math.round(avgDef + franchiseBonusDef + coachBonusDef))
  );

  return {
    totalOvr: finalOvr,
    teamChemistry: finalChemistry,
    offenseRating: finalOff,
    defenseRating: finalDef,
    teamBonuses: bonuses,
    structuredBonuses,
  };
};
