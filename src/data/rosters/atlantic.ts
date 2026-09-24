import { NBAPlayer } from '../../types';
import { createPlayer } from './helper';

export const ATLANTIC_PLAYERS: NBAPlayer[] = [
  // ==========================================
  // BOSTON CELTICS (BOS)
  // ==========================================
  createPlayer('bos-4065648', 4065648, 'Jayson Tatum', 'Boston Celtics', 'BOS', 'Eastern', 'SF', 'PF', 0, 93, 94, 92, 91, 89, 92, 90, 89, 'STARTER'),
  createPlayer('bos-3078576', 3078576, 'Derrick White', 'Boston Celtics', 'BOS', 'Eastern', 'PG', 'SG', 9, 83, 84, 82, 85, 79, 87, 86, 69, 'STARTER'),
  createPlayer('bos-4251', 4251, 'Paul George', 'Boston Celtics', 'BOS', 'Eastern', 'SF', 'PF', 13, 82, 83, 81, 80, 78, 81, 79, 78, 'STARTER'),
  createPlayer('bos-4066354', 4066354, 'Payton Pritchard', 'Boston Celtics', 'BOS', 'Eastern', 'PG', 'SG', 11, 82, 83, 81, 84, 78, 86, 85, 68, 'STARTER'),
  createPlayer('bos-4351852', 4351852, 'Mitchell Robinson', 'Boston Celtics', 'BOS', 'Eastern', 'C', 'PF', 4, 81, 82, 80, 64, 82, 74, 78, 87, 'STARTER'),
  createPlayer('bos-3195', 3195, 'Mike Conley', 'Boston Celtics', 'BOS', 'Eastern', 'PG', 'SG', 45, 79, 80, 78, 81, 75, 83, 82, 65, 'BENCH'),
  createPlayer('bos-4065804', 4065804, 'Sam Hauser', 'Boston Celtics', 'BOS', 'Eastern', 'SF', 'PF', 30, 79, 80, 78, 77, 75, 78, 76, 75, 'BENCH'),
  createPlayer('bos-4397424', 4397424, 'Neemias Queta', 'Boston Celtics', 'BOS', 'Eastern', 'C', 'PF', 88, 76, 77, 75, 59, 77, 69, 73, 82, 'BENCH'),

  // ==========================================
  // BROOKLYN NETS (BKN)
  // ==========================================
  createPlayer('bkn-4278104', 4278104, 'Michael Porter Jr.', 'Brooklyn Nets', 'BKN', 'Eastern', 'SF', 'PF', 17, 85, 86, 84, 83, 81, 84, 82, 81, 'STARTER'),
  createPlayer('bkn-3064514', 3064514, 'Julius Randle', 'Brooklyn Nets', 'BKN', 'Eastern', 'SF', 'PF', 30, 83, 84, 82, 81, 79, 82, 80, 79, 'STARTER'),
  createPlayer('bkn-4702177', 4702177, 'Keon Ellis', 'Brooklyn Nets', 'BKN', 'Eastern', 'PG', 'SG', 3, 78, 79, 77, 80, 74, 82, 81, 64, 'STARTER'),
  createPlayer('bkn-3907823', 3907823, 'Terance Mann', 'Brooklyn Nets', 'BKN', 'Eastern', 'PG', 'SG', 14, 78, 79, 77, 80, 74, 82, 81, 64, 'STARTER'),
  createPlayer('bkn-5105626', 5105626, 'Tyler Bilodeau', 'Brooklyn Nets', 'BKN', 'Eastern', 'SF', 'PF', 34, 77, 78, 76, 75, 73, 76, 74, 73, 'STARTER'),
  createPlayer('bkn-5101761', 5101761, 'Mikel Brown Jr.', 'Brooklyn Nets', 'BKN', 'Eastern', 'PG', 'SG', 6, 76, 77, 75, 78, 72, 80, 79, 62, 'BENCH'),
  createPlayer('bkn-4712896', 4712896, 'Noah Clowney', 'Brooklyn Nets', 'BKN', 'Eastern', 'SF', 'PF', 21, 75, 76, 74, 73, 71, 74, 72, 71, 'BENCH'),
  createPlayer('bkn-4432194', 4432194, "Day'Ron Sharpe", 'Brooklyn Nets', 'BKN', 'Eastern', 'C', 'PF', 20, 75, 74, 76, 53, 76, 65, 68, 82, 'BENCH'),
  createPlayer('bkn-3150844', 3150844, 'Moritz Wagner', 'Brooklyn Nets', 'BKN', 'Eastern', 'C', 'PF', 18, 74, 75, 73, 70, 74, 68, 70, 78, 'BENCH'),

  // ==========================================
  // NEW YORK KNICKS (NYK)
  // ==========================================
  createPlayer('nyk-3934672', 3934672, 'Jalen Brunson', 'New York Knicks', 'NYK', 'Eastern', 'PG', 'SG', 11, 96, 97, 95, 98, 92, 98, 98, 82, 'STARTER'),
  createPlayer('nyk-3136195', 3136195, 'Karl-Anthony Towns', 'New York Knicks', 'NYK', 'Eastern', 'C', 'PF', 32, 93, 94, 92, 76, 94, 86, 90, 98, 'STARTER'),
  createPlayer('nyk-3934719', 3934719, 'OG Anunoby', 'New York Knicks', 'NYK', 'Eastern', 'SF', 'PF', 8, 90, 91, 92, 88, 86, 89, 87, 85, 'STARTER'),
  createPlayer('nyk-3147657', 3147657, 'Mikal Bridges', 'New York Knicks', 'NYK', 'Eastern', 'SG', 'SF', 25, 90, 91, 91, 89, 84, 90, 89, 78, 'STARTER'),
  createPlayer('nyk-3062679', 3062679, 'Josh Hart', 'New York Knicks', 'NYK', 'Eastern', 'SF', 'SG', 3, 90, 89, 92, 87, 84, 89, 88, 92, 'STARTER'),
  createPlayer('nyk-6585', 6585, 'Andre Drummond', 'New York Knicks', 'NYK', 'Eastern', 'C', 'PF', 6, 79, 80, 78, 62, 80, 72, 76, 85, 'BENCH'),
  createPlayer('nyk-4277869', 4277869, 'Jose Alvarado', 'New York Knicks', 'NYK', 'Eastern', 'PG', 'SG', 5, 75, 76, 74, 77, 71, 79, 78, 61, 'BENCH'),
  createPlayer('nyk-2528426', 2528426, 'Jordan Clarkson', 'New York Knicks', 'NYK', 'Eastern', 'PG', 'SG', 8, 75, 76, 74, 76, 70, 78, 77, 60, 'BENCH'),
  createPlayer('nyk-4431823', 4431823, 'Miles McBride', 'New York Knicks', 'NYK', 'Eastern', 'PG', 'SG', 2, 75, 75, 76, 78, 68, 80, 76, 60, 'BENCH'),

  // ==========================================
  // PHILADELPHIA 76ERS (PHI)
  // ==========================================
  createPlayer('phi-4431678', 4431678, 'Tyrese Maxey', 'Philadelphia 76ers', 'PHI', 'Eastern', 'PG', 'SG', 0, 92, 93, 91, 94, 88, 96, 95, 78, 'STARTER'),
  createPlayer('phi-3917376', 3917376, 'Jaylen Brown', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SG', 'SF', 7, 91, 92, 90, 93, 87, 95, 94, 77, 'STARTER'),
  createPlayer('phi-3059318', 3059318, 'Joel Embiid', 'Philadelphia 76ers', 'PHI', 'Eastern', 'C', 'PF', 21, 91, 92, 90, 74, 92, 84, 88, 97, 'STARTER'),
  createPlayer('phi-1966', 1966, 'LeBron James', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SF', 'PF', 23, 91, 92, 90, 89, 87, 90, 88, 87, 'STARTER'),
  createPlayer('phi-5124612', 5124612, 'VJ Edgecombe', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SG', 'SF', 77, 83, 84, 82, 85, 79, 87, 86, 69, 'STARTER'),
  createPlayer('phi-2581018', 2581018, 'Kentavious Caldwell-Pope', 'Philadelphia 76ers', 'PHI', 'Eastern', 'SG', 'SF', 5, 79, 80, 78, 81, 75, 83, 82, 65, 'BENCH'),
  createPlayer('phi-4870562', 4870562, 'Dominick Barlow', 'Philadelphia 76ers', 'PHI', 'Eastern', 'PF', 'C', 25, 75, 76, 74, 73, 71, 74, 72, 71, 'BENCH'),
  createPlayer('phi-5105637', 5105637, 'Adem Bona', 'Philadelphia 76ers', 'PHI', 'Eastern', 'C', 'PF', 30, 74, 75, 73, 57, 75, 67, 71, 80, 'BENCH'),

  // ==========================================
  // TORONTO RAPTORS (TOR)
  // ==========================================
  createPlayer('tor-4433134', 4433134, 'Scottie Barnes', 'Toronto Raptors', 'TOR', 'Eastern', 'SF', 'PF', 4, 88, 89, 87, 86, 84, 87, 85, 84, 'STARTER'),
  createPlayer('tor-3913176', 3913176, 'Brandon Ingram', 'Toronto Raptors', 'TOR', 'Eastern', 'SF', 'PF', 3, 84, 85, 83, 82, 80, 83, 81, 80, 'STARTER'),
  createPlayer('tor-4395625', 4395625, 'RJ Barrett', 'Toronto Raptors', 'TOR', 'Eastern', 'SG', 'SF', 9, 82, 83, 81, 80, 78, 81, 79, 78, 'STARTER'),
  createPlayer('tor-4395724', 4395724, 'Immanuel Quickley', 'Toronto Raptors', 'TOR', 'Eastern', 'PG', 'SG', 5, 82, 83, 81, 84, 78, 86, 85, 68, 'STARTER'),
  createPlayer('tor-2993874', 2993874, 'Kyle Anderson', 'Toronto Raptors', 'TOR', 'Eastern', 'PF', 'SF', 5, 77, 78, 76, 75, 73, 76, 74, 73, 'STARTER'),
  createPlayer('tor-3134908', 3134908, 'Jakob Poeltl', 'Toronto Raptors', 'TOR', 'Eastern', 'C', 'PF', 19, 78, 76, 80, 53, 78, 65, 70, 84, 'BENCH'),
  createPlayer('tor-5106258', 5106258, 'Gradey Dick', 'Toronto Raptors', 'TOR', 'Eastern', 'SG', 'SF', 1, 76, 78, 72, 84, 70, 78, 74, 60, 'BENCH'),
  createPlayer('tor-4431893', 4431893, 'Jamison Battle', 'Toronto Raptors', 'TOR', 'Eastern', 'SF', 'PF', 77, 76, 77, 75, 74, 72, 75, 73, 72, 'BENCH'),
];
