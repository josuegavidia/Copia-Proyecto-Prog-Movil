import { NBAPlayer } from '../../types';
import { createPlayer } from './helper';

export const SOUTHEAST_PLAYERS: NBAPlayer[] = [
  // ==========================================
  // ATLANTA HAWKS (ATL)
  // ==========================================
  createPlayer('atl-4701230', 4701230, 'Jalen Johnson', 'Atlanta Hawks', 'ATL', 'Eastern', 'PF', 'SF', 1, 87, 88, 86, 85, 83, 86, 84, 83, 'STARTER'),
  createPlayer('atl-4278039', 4278039, 'Nickeil Alexander-Walker', 'Atlanta Hawks', 'ATL', 'Eastern', 'SG', 'PG', 7, 83, 84, 82, 85, 79, 87, 86, 69, 'STARTER'),
  createPlayer('atl-2490149', 2490149, 'CJ McCollum', 'Atlanta Hawks', 'ATL', 'Eastern', 'SG', 'PG', 3, 83, 84, 82, 85, 79, 87, 86, 69, 'STARTER'),
  createPlayer('atl-4869342', 4869342, 'Dyson Daniels', 'Atlanta Hawks', 'ATL', 'Eastern', 'PG', 'SG', 5, 81, 82, 80, 83, 77, 85, 84, 67, 'STARTER'),
  createPlayer('atl-4431680', 4431680, 'Onyeka Okongwu', 'Atlanta Hawks', 'ATL', 'Eastern', 'C', 'PF', 17, 81, 82, 80, 79, 77, 80, 78, 84, 'STARTER'),
  createPlayer('atl-4397020', 4397020, 'Luguentz Dort', 'Atlanta Hawks', 'ATL', 'Eastern', 'SG', 'SF', 7, 78, 76, 86, 78, 74, 82, 74, 68, 'BENCH'),
  createPlayer('atl-2990984', 2990984, 'Buddy Hield', 'Atlanta Hawks', 'ATL', 'Eastern', 'SG', 'SF', 8, 77, 80, 70, 90, 65, 76, 74, 60, 'BENCH'),
  createPlayer('atl-4280151', 4280151, 'Corey Kispert', 'Atlanta Hawks', 'ATL', 'Eastern', 'SF', 'SG', 24, 76, 78, 72, 88, 70, 76, 72, 65, 'BENCH'),
  createPlayer('atl-4397183', 4397183, 'Aaron Wiggins', 'Atlanta Hawks', 'ATL', 'Eastern', 'SG', 'SF', 2, 75, 76, 74, 80, 74, 78, 72, 66, 'BENCH'),

  // ==========================================
  // CHARLOTTE HORNETS (CHA)
  // ==========================================
  createPlayer('cha-4433287', 4433287, 'Brandon Miller', 'Charlotte Hornets', 'CHA', 'Eastern', 'SF', 'SG', 24, 85, 86, 84, 83, 81, 84, 82, 81, 'STARTER'),
  createPlayer('cha-4396971', 4396971, 'Naz Reid', 'Charlotte Hornets', 'CHA', 'Eastern', 'C', 'PF', 11, 82, 83, 81, 65, 83, 75, 79, 88, 'STARTER'),
  createPlayer('cha-3032979', 3032979, 'Dennis Schroder', 'Charlotte Hornets', 'CHA', 'Eastern', 'PG', 'SG', 17, 80, 81, 79, 82, 76, 84, 83, 66, 'STARTER'),
  createPlayer('cha-2578185', 2578185, 'Dorian Finney-Smith', 'Charlotte Hornets', 'CHA', 'Eastern', 'PF', 'SF', 28, 78, 79, 77, 76, 74, 77, 75, 74, 'STARTER'),
  createPlayer('cha-5211176', 5211176, 'Tidjane Salaun', 'Charlotte Hornets', 'CHA', 'Eastern', 'PF', 'SF', 31, 77, 78, 76, 75, 73, 76, 74, 73, 'STARTER'),
  createPlayer('cha-3135045', 3135045, 'Grayson Allen', 'Charlotte Hornets', 'CHA', 'Eastern', 'SG', 'SF', 3, 77, 80, 74, 90, 72, 78, 76, 62, 'BENCH'),
  createPlayer('cha-4395651', 4395651, 'Coby White', 'Charlotte Hornets', 'CHA', 'Eastern', 'PG', 'SG', 0, 77, 80, 72, 84, 74, 84, 80, 60, 'BENCH'),
  createPlayer('cha-4066218', 4066218, 'Grant Williams', 'Charlotte Hornets', 'CHA', 'Eastern', 'PF', 'C', 2, 76, 76, 78, 78, 70, 72, 74, 78, 'BENCH'),

  // ==========================================
  // MIAMI HEAT (MIA)
  // ==========================================
  createPlayer('mia-3032977', 3032977, 'Giannis Antetokounmpo', 'Miami Heat', 'MIA', 'Eastern', 'PF', 'C', 34, 96, 97, 95, 94, 92, 95, 93, 92, 'STARTER'),
  createPlayer('mia-4066261', 4066261, 'Bam Adebayo', 'Miami Heat', 'MIA', 'Eastern', 'C', 'PF', 13, 87, 88, 86, 70, 88, 80, 84, 93, 'STARTER'),
  createPlayer('mia-3899664', 3899664, 'Simone Fontecchio', 'Miami Heat', 'MIA', 'Eastern', 'SF', 'PF', 5, 77, 78, 76, 75, 73, 76, 74, 73, 'STARTER'),
  createPlayer('mia-4997528', 4997528, 'Nikola Jovic', 'Miami Heat', 'MIA', 'Eastern', 'PF', 'SF', 55, 77, 78, 74, 80, 76, 76, 78, 76, 'STARTER'),
  createPlayer('mia-2528210', 2528210, 'Tim Hardaway Jr.', 'Miami Heat', 'MIA', 'Eastern', 'SG', 'SF', 10, 76, 78, 70, 86, 70, 78, 74, 60, 'STARTER'),
  createPlayer('mia-4278053', 4278053, 'Davion Mitchell', 'Miami Heat', 'MIA', 'Eastern', 'PG', 'SG', 45, 76, 75, 82, 76, 68, 88, 82, 58, 'BENCH'),
  createPlayer('mia-3064482', 3064482, 'Bobby Portis', 'Miami Heat', 'MIA', 'Eastern', 'C', 'PF', 9, 76, 78, 74, 80, 78, 70, 72, 84, 'BENCH'),
  createPlayer('mia-3059319', 3059319, 'Andrew Wiggins', 'Miami Heat', 'MIA', 'Eastern', 'SF', 'SG', 22, 76, 78, 76, 78, 82, 80, 72, 70, 'BENCH'),

  // ==========================================
  // ORLANDO MAGIC (ORL)
  // ==========================================
  createPlayer('orl-4432573', 4432573, 'Paolo Banchero', 'Orlando Magic', 'ORL', 'Eastern', 'PF', 'SF', 5, 87, 88, 86, 85, 83, 86, 84, 83, 'STARTER'),
  createPlayer('orl-4566434', 4566434, 'Franz Wagner', 'Orlando Magic', 'ORL', 'Eastern', 'SF', 'SG', 22, 85, 86, 84, 83, 81, 84, 82, 81, 'STARTER'),
  createPlayer('orl-4066320', 4066320, 'Desmond Bane', 'Orlando Magic', 'ORL', 'Eastern', 'SG', 'SF', 3, 84, 85, 83, 86, 80, 88, 87, 70, 'STARTER'),
  createPlayer('orl-4277847', 4277847, 'Wendell Carter Jr.', 'Orlando Magic', 'ORL', 'Eastern', 'C', 'PF', 34, 80, 80, 82, 76, 78, 72, 74, 85, 'STARTER'),
  createPlayer('orl-4712849', 4712849, 'Anthony Black', 'Orlando Magic', 'ORL', 'Eastern', 'PG', 'SG', 0, 78, 78, 80, 76, 78, 84, 82, 68, 'STARTER'),
  createPlayer('orl-4432165', 4432165, 'Jalen Suggs', 'Orlando Magic', 'ORL', 'Eastern', 'PG', 'SG', 4, 78, 77, 84, 78, 80, 86, 80, 66, 'BENCH'),
  createPlayer('orl-4065654', 4065654, 'Jonathan Isaac', 'Orlando Magic', 'ORL', 'Eastern', 'PF', 'SF', 1, 77, 74, 88, 72, 80, 78, 72, 80, 'BENCH'),
  createPlayer('orl-4348700', 4348700, 'Goga Bitadze', 'Orlando Magic', 'ORL', 'Eastern', 'C', 'PF', 35, 76, 74, 78, 58, 76, 68, 72, 82, 'BENCH'),

  // ==========================================
  // WASHINGTON WIZARDS (WAS)
  // ==========================================
  createPlayer('was-6583', 6583, 'Anthony Davis', 'Washington Wizards', 'WAS', 'Eastern', 'C', 'PF', 23, 90, 91, 89, 88, 86, 89, 87, 86, 'STARTER'),
  createPlayer('was-4277905', 4277905, 'Trae Young', 'Washington Wizards', 'WAS', 'Eastern', 'PG', 'SG', 11, 87, 88, 86, 89, 83, 91, 90, 73, 'STARTER'),
  createPlayer('was-5160992', 5160992, 'Alex Sarr', 'Washington Wizards', 'WAS', 'Eastern', 'PF', 'C', 20, 83, 84, 82, 66, 84, 76, 80, 89, 'STARTER'),
  createPlayer('was-4278129', 4278129, 'Deandre Ayton', 'Washington Wizards', 'WAS', 'Eastern', 'C', 'PF', 2, 78, 78, 78, 60, 78, 70, 74, 85, 'STARTER'),
  createPlayer('was-5104155', 5104155, 'Bilal Coulibaly', 'Washington Wizards', 'WAS', 'Eastern', 'SF', 'SG', 0, 77, 76, 80, 76, 82, 84, 74, 68, 'STARTER'),
  createPlayer('was-4845374', 4845374, 'Bub Carrington', 'Washington Wizards', 'WAS', 'Eastern', 'PG', 'SG', 8, 76, 77, 75, 78, 72, 80, 79, 62, 'BENCH'),
  createPlayer('was-4432819', 4432819, 'Tre Mann', 'Washington Wizards', 'WAS', 'Eastern', 'PG', 'SG', 12, 75, 78, 72, 82, 74, 82, 78, 58, 'BENCH'),
  createPlayer('was-6609', 6609, 'Khris Middleton', 'Washington Wizards', 'WAS', 'Eastern', 'SF', 'SG', 22, 75, 78, 72, 82, 68, 74, 76, 68, 'BENCH'),
];
