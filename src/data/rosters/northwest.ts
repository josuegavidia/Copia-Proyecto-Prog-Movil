import { NBAPlayer } from '../../types';
import { createPlayer } from './helper';

export const NORTHWEST_PLAYERS: NBAPlayer[] = [
  // ==========================================
  // DENVER NUGGETS (DEN)
  // ==========================================
  createPlayer('den-3112335', 3112335, 'Nikola Jokic', 'Denver Nuggets', 'DEN', 'Western', 'C', 'PF', 15, 97, 98, 96, 80, 98, 90, 94, 98, 'STARTER'),
  createPlayer('den-3936299', 3936299, 'Jamal Murray', 'Denver Nuggets', 'DEN', 'Western', 'PG', 'SG', 27, 89, 90, 88, 91, 85, 93, 92, 75, 'STARTER'),
  createPlayer('den-3978', 3978, 'DeMar DeRozan', 'Denver Nuggets', 'DEN', 'Western', 'SG', 'SF', 11, 83, 84, 82, 85, 79, 87, 86, 69, 'STARTER'),
  createPlayer('den-3064290', 3064290, 'Aaron Gordon', 'Denver Nuggets', 'DEN', 'Western', 'PF', 'C', 32, 83, 84, 82, 81, 79, 82, 80, 79, 'STARTER'),
  createPlayer('den-3138196', 3138196, 'Cameron Johnson', 'Denver Nuggets', 'DEN', 'Western', 'SF', 'PF', 23, 80, 81, 79, 78, 76, 79, 77, 76, 'STARTER'),
  createPlayer('den-4431767', 4431767, 'Christian Braun', 'Denver Nuggets', 'DEN', 'Western', 'SG', 'SF', 0, 78, 80, 78, 82, 82, 84, 76, 70, 'BENCH'),
  createPlayer('den-4277848', 4277848, 'Marvin Bagley III', 'Denver Nuggets', 'DEN', 'Western', 'C', 'PF', 35, 76, 77, 75, 74, 72, 75, 73, 72, 'BENCH'),
  createPlayer('den-3135046', 3135046, 'Tyus Jones', 'Denver Nuggets', 'DEN', 'Western', 'PG', 'SG', 5, 76, 76, 74, 80, 60, 84, 88, 56, 'BENCH'),

  // ==========================================
  // MINNESOTA TIMBERWOLVES (MIN)
  // ==========================================
  createPlayer('min-4594268', 4594268, 'Anthony Edwards', 'Minnesota Timberwolves', 'MIN', 'Western', 'SG', 'SF', 5, 95, 96, 94, 97, 91, 98, 98, 81, 'STARTER'),
  createPlayer('min-4432816', 4432816, 'LaMelo Ball', 'Minnesota Timberwolves', 'MIN', 'Western', 'PG', 'SG', 2, 86, 87, 85, 88, 82, 90, 89, 72, 'STARTER'),
  createPlayer('min-4431671', 4431671, 'Jaden McDaniels', 'Minnesota Timberwolves', 'MIN', 'Western', 'SF', 'PF', 3, 85, 86, 84, 83, 81, 84, 82, 81, 'STARTER'),
  createPlayer('min-3032976', 3032976, 'Rudy Gobert', 'Minnesota Timberwolves', 'MIN', 'Western', 'C', 'PF', 27, 84, 85, 83, 67, 85, 77, 81, 90, 'STARTER'),
  createPlayer('min-4397002', 4397002, 'Ayo Dosunmu', 'Minnesota Timberwolves', 'MIN', 'Western', 'PG', 'SG', 13, 81, 82, 80, 83, 77, 85, 84, 67, 'STARTER'),
  createPlayer('min-3934673', 3934673, 'Donte DiVincenzo', 'Minnesota Timberwolves', 'MIN', 'Western', 'SG', 'PG', 0, 78, 80, 76, 88, 74, 82, 78, 62, 'BENCH'),
  createPlayer('min-4433247', 4433247, 'Jonathan Kuminga', 'Minnesota Timberwolves', 'MIN', 'Western', 'PF', 'SF', 0, 78, 80, 72, 72, 90, 84, 72, 76, 'BENCH'),
  createPlayer('min-4592492', 4592492, 'Bones Hyland', 'Minnesota Timberwolves', 'MIN', 'Western', 'PG', 'SG', 8, 76, 78, 70, 84, 70, 86, 80, 56, 'BENCH'),

  // ==========================================
  // OKLAHOMA CITY THUNDER (OKC)
  // ==========================================
  createPlayer('okc-4278073', 4278073, 'Shai Gilgeous-Alexander', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 2, 97, 98, 96, 98, 93, 98, 98, 83, 'STARTER'),
  createPlayer('okc-4433255', 4433255, 'Chet Holmgren', 'Oklahoma City Thunder', 'OKC', 'Western', 'C', 'PF', 7, 86, 87, 85, 69, 87, 79, 83, 92, 'STARTER'),
  createPlayer('okc-4593803', 4593803, 'Jalen Williams', 'Oklahoma City Thunder', 'OKC', 'Western', 'SG', 'SF', 8, 85, 86, 84, 87, 81, 89, 88, 71, 'STARTER'),
  createPlayer('okc-4222252', 4222252, 'Isaiah Hartenstein', 'Oklahoma City Thunder', 'OKC', 'Western', 'C', 'PF', 55, 82, 83, 81, 65, 83, 75, 79, 88, 'STARTER'),
  createPlayer('okc-4900671', 4900671, 'Ajay Mitchell', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 25, 82, 83, 81, 84, 78, 86, 85, 68, 'STARTER'),
  createPlayer('okc-2991350', 2991350, 'Alex Caruso', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 9, 81, 82, 80, 83, 77, 85, 84, 67, 'BENCH'),
  createPlayer('okc-4683692', 4683692, 'Cason Wallace', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 22, 81, 82, 80, 83, 77, 85, 84, 67, 'BENCH'),
  createPlayer('okc-4683778', 4683778, 'Jared McCain', 'Oklahoma City Thunder', 'OKC', 'Western', 'PG', 'SG', 3, 80, 81, 79, 82, 76, 84, 83, 66, 'BENCH'),
  createPlayer('okc-4432823', 4432823, 'Jaylin Williams', 'Oklahoma City Thunder', 'OKC', 'Western', 'PF', 'C', 6, 76, 75, 78, 74, 70, 72, 78, 80, 'BENCH'),

  // ==========================================
  // PORTLAND TRAIL BLAZERS (POR)
  // ==========================================
  createPlayer('por-4683021', 4683021, 'Deni Avdija', 'Portland Trail Blazers', 'POR', 'Western', 'SF', 'PF', 8, 88, 89, 87, 86, 84, 87, 85, 84, 'STARTER'),
  createPlayer('por-6606', 6606, 'Damian Lillard', 'Portland Trail Blazers', 'POR', 'Western', 'PG', 'SG', 0, 86, 87, 85, 88, 82, 90, 89, 72, 'STARTER'),
  createPlayer('por-4279888', 4279888, 'Ja Morant', 'Portland Trail Blazers', 'POR', 'Western', 'PG', 'SG', 12, 84, 85, 83, 86, 80, 88, 87, 70, 'STARTER'),
  createPlayer('por-5105565', 5105565, 'Donovan Clingan', 'Portland Trail Blazers', 'POR', 'Western', 'C', 'PF', 23, 82, 83, 81, 65, 83, 75, 79, 88, 'STARTER'),
  createPlayer('por-3995', 3995, 'Jrue Holiday', 'Portland Trail Blazers', 'POR', 'Western', 'PG', 'SG', 11, 82, 83, 81, 84, 78, 86, 85, 68, 'STARTER'),
  createPlayer('por-4914336', 4914336, 'Shaedon Sharpe', 'Portland Trail Blazers', 'POR', 'Western', 'SG', 'SF', 17, 81, 82, 80, 83, 77, 85, 84, 67, 'BENCH'),
  createPlayer('por-4610139', 4610139, 'Jeremy Sochan', 'Portland Trail Blazers', 'POR', 'Western', 'PF', 'SF', 10, 80, 81, 79, 78, 76, 79, 77, 76, 'BENCH'),
  createPlayer('por-4683678', 4683678, 'Scoot Henderson', 'Portland Trail Blazers', 'POR', 'Western', 'PG', 'SG', 0, 77, 78, 74, 76, 84, 88, 80, 60, 'BENCH'),
  createPlayer('por-4066211', 4066211, 'Robert Williams III', 'Portland Trail Blazers', 'POR', 'Western', 'C', 'PF', 35, 77, 74, 84, 25, 88, 74, 68, 86, 'BENCH'),

  // ==========================================
  // UTAH JAZZ (UTA)
  // ==========================================
  createPlayer('uta-4277961', 4277961, 'Jaren Jackson Jr.', 'Utah Jazz', 'UTA', 'Western', 'PF', 'C', 13, 86, 87, 85, 84, 82, 85, 83, 82, 'STARTER'),
  createPlayer('uta-4066336', 4066336, 'Lauri Markkanen', 'Utah Jazz', 'UTA', 'Western', 'SF', 'PF', 23, 86, 87, 85, 84, 82, 85, 83, 82, 'STARTER'),
  createPlayer('uta-4433627', 4433627, 'Keyonte George', 'Utah Jazz', 'UTA', 'Western', 'PG', 'SG', 3, 84, 85, 83, 86, 80, 88, 87, 70, 'STARTER'),
  createPlayer('uta-4433268', 4433268, 'Trey Alexander', 'Utah Jazz', 'UTA', 'Western', 'PG', 'SG', 23, 78, 79, 77, 80, 74, 82, 81, 64, 'STARTER'),
  createPlayer('uta-4873138', 4873138, 'Ace Bailey', 'Utah Jazz', 'UTA', 'Western', 'SF', 'SG', 19, 77, 78, 76, 79, 73, 81, 80, 63, 'STARTER'),
  createPlayer('uta-4277919', 4277919, 'Mo Bamba', 'Utah Jazz', 'UTA', 'Western', 'C', 'PF', 11, 76, 77, 75, 59, 77, 69, 73, 82, 'BENCH'),
  createPlayer('uta-4683766', 4683766, 'Isaiah Collier', 'Utah Jazz', 'UTA', 'Western', 'PG', 'SG', 8, 75, 76, 74, 76, 76, 82, 80, 60, 'BENCH'),
  createPlayer('uta-4684793', 4684793, 'Kyle Filipowski', 'Utah Jazz', 'UTA', 'Western', 'PF', 'C', 22, 75, 76, 74, 76, 72, 74, 74, 78, 'BENCH'),
  createPlayer('uta-3102530', 3102530, 'Jusuf Nurkic', 'Utah Jazz', 'UTA', 'Western', 'C', 'PF', 27, 75, 74, 76, 60, 74, 62, 76, 84, 'BENCH'),
];
