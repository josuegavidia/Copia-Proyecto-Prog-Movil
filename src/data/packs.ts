import { PackDefinition } from '../types';

export const PACK_DEFINITIONS: PackDefinition[] = [
  {
    id: 'pack-bronze',
    name: 'Sobre Bronce',
    description: '5 cartas oficiales NBA de nivel Bronce (65-74 OVR).',
    cost: 250,
    cardCount: 5,
    themeColor: '#8C5A2B',
    secondaryColor: '#E6D5C3',
    badge: 'BRONCE',
    guaranteedMinRarity: 'BRONZE',
    rarityChances: {
      bronze: 1.0,
      silver: 0,
      gold: 0,
      diamond: 0,
      icon: 0,
    },
  },
  {
    id: 'pack-silver',
    name: 'Sobre Plata',
    description: '4 cartas oficiales NBA de nivel Plata (75-84 OVR).',
    cost: 500,
    cardCount: 4,
    themeColor: '#64748B',
    secondaryColor: '#E2E8F0',
    badge: 'PLATA',
    guaranteedMinRarity: 'SILVER',
    rarityChances: {
      bronze: 0,
      silver: 1.0,
      gold: 0,
      diamond: 0,
      icon: 0,
    },
  },
  {
    id: 'pack-gold',
    name: 'Sobre Oro',
    description: '3 cartas oficiales NBA de nivel Oro (85-92 OVR).',
    cost: 1000,
    cardCount: 3,
    themeColor: '#CA8A04',
    secondaryColor: '#FEF08A',
    badge: 'ORO',
    guaranteedMinRarity: 'GOLD',
    rarityChances: {
      bronze: 0,
      silver: 0,
      gold: 1.0,
      diamond: 0,
      icon: 0,
    },
  },
  {
    id: 'pack-diamond',
    name: 'Sobre Diamante',
    description: '2 cartas oficiales NBA de nivel Diamante (93-97 OVR).',
    cost: 2000,
    cardCount: 2,
    themeColor: '#0284C7',
    secondaryColor: '#BAE6FD',
    badge: 'DIAMANTE',
    guaranteedMinRarity: 'DIAMOND',
    rarityChances: {
      bronze: 0,
      silver: 0,
      gold: 0,
      diamond: 1.0,
      icon: 0,
    },
  },
  {
    id: 'pack-icon',
    name: 'Sobre Iconos & Leyendas',
    description: '2 cartas históricas de Leyendas e Iconos NBA (98-99 OVR).',
    cost: 3500,
    cardCount: 2,
    themeColor: '#B45309',
    secondaryColor: '#FEF08A',
    badge: 'ICONO LEYENDA',
    guaranteedMinRarity: 'ICON',
    rarityChances: {
      bronze: 0,
      silver: 0,
      gold: 0,
      diamond: 0,
      icon: 1.0,
    },
  },
];

/**
 * Returns the exact coin value for recycling a duplicate card based on pack costs and card counts, rounded down.
 * - ICON: Pack Icon (3500 cost / 2 cards = 1750 -> 1700 coins)
 * - DIAMOND: Pack Diamond (2000 cost / 2 cards = 1000 coins)
 * - GOLD: Pack Gold (1000 cost / 3 cards = 333.3 -> 300 coins)
 * - SILVER: Pack Silver (500 cost / 4 cards = 125 -> 120 coins)
 * - BRONZE: Pack Bronze (250 cost / 5 cards = 50 coins)
 */
export const getCardRecycleValue = (rarity: string): number => {
  switch (rarity) {
    case 'ICON':
      return 1700;
    case 'DIAMOND':
      return 1000;
    case 'GOLD':
      return 300;
    case 'SILVER':
      return 120;
    case 'BRONZE':
      return 50;
    default:
      return 50;
  }
};

