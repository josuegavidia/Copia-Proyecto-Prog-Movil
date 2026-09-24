import { NBAPlayer } from '../../types';
import { createPlayer } from './helper';

export const PACIFIC_PLAYERS: NBAPlayer[] = [
  // ==========================================
  // GOLDEN STATE WARRIORS (GSW)
  // ==========================================
  createPlayer('gsw-3975', 3975, 'Stephen Curry', 'Golden State Warriors', 'GSW', 'Western', 'PG', 'SG', 30, 93, 94, 92, 95, 89, 97, 96, 79, 'STARTER'),
  createPlayer('gsw-6430', 6430, 'Jimmy Butler III', 'Golden State Warriors', 'GSW', 'Western', 'SF', 'PF', 10, 85, 86, 84, 83, 81, 84, 82, 81, 'STARTER'),
  createPlayer('gsw-3102531', 3102531, 'Kristaps Porzingis', 'Golden State Warriors', 'GSW', 'Western', 'C', 'PF', 7, 84, 85, 83, 67, 85, 77, 81, 90, 'STARTER'),
  createPlayer('gsw-3213', 3213, 'Al Horford', 'Golden State Warriors', 'GSW', 'Western', 'C', 'PF', 20, 79, 80, 78, 62, 80, 72, 76, 85, 'STARTER'),
  createPlayer('gsw-6589', 6589, 'Draymond Green', 'Golden State Warriors', 'GSW', 'Western', 'PF', 'C', 23, 79, 76, 86, 72, 74, 80, 88, 80, 'STARTER'),
  createPlayer('gsw-4709138', 4709138, 'Brandin Podziemski', 'Golden State Warriors', 'GSW', 'Western', 'PG', 'SG', 2, 78, 79, 76, 82, 70, 84, 82, 68, 'BENCH'),
  createPlayer('gsw-4432171', 4432171, 'Moses Moody', 'Golden State Warriors', 'GSW', 'Western', 'SG', 'SF', 4, 76, 78, 74, 84, 78, 80, 74, 65, 'BENCH'),
  createPlayer('gsw-3134903', 3134903, 'Gary Payton II', 'Golden State Warriors', 'GSW', 'Western', 'PG', 'SG', 14, 75, 74, 84, 68, 88, 84, 72, 66, 'BENCH'),
  createPlayer('gsw-4066436', 4066436, "De'Anthony Melton", 'Golden State Warriors', 'GSW', 'Western', 'PG', 'SG', 8, 75, 76, 78, 82, 68, 82, 76, 62, 'BENCH'),

  // ==========================================
  // LA CLIPPERS (LAC)
  // ==========================================
  createPlayer('lac-6450', 6450, 'Kawhi Leonard', 'LA Clippers', 'LAC', 'Western', 'SF', 'PF', 2, 93, 94, 92, 91, 89, 92, 90, 89, 'STARTER'),
  createPlayer('lac-4396907', 4396907, 'Darius Garland', 'LA Clippers', 'LAC', 'Western', 'PG', 'SG', 10, 84, 85, 83, 86, 80, 88, 87, 70, 'STARTER'),
  createPlayer('lac-6580', 6580, 'Bradley Beal', 'LA Clippers', 'LAC', 'Western', 'SG', 'PG', 3, 79, 80, 78, 81, 75, 83, 82, 65, 'STARTER'),
  createPlayer('lac-4066648', 4066648, 'Rui Hachimura', 'LA Clippers', 'LAC', 'Western', 'PF', 'SF', 28, 78, 80, 74, 78, 80, 76, 74, 76, 'STARTER'),
  createPlayer('lac-3448', 3448, 'Brook Lopez', 'LA Clippers', 'LAC', 'Western', 'C', 'PF', 11, 78, 76, 82, 76, 70, 60, 68, 84, 'STARTER'),
  createPlayer('lac-2991139', 2991139, 'Kris Dunn', 'LA Clippers', 'LAC', 'Western', 'PG', 'SG', 8, 76, 74, 84, 70, 72, 82, 80, 64, 'BENCH'),
  createPlayer('lac-3936099', 3936099, 'Derrick Jones Jr.', 'LA Clippers', 'LAC', 'Western', 'SF', 'PF', 5, 76, 74, 80, 72, 94, 82, 70, 70, 'BENCH'),
  createPlayer('lac-4065778', 4065778, 'Max Strus', 'LA Clippers', 'LAC', 'Western', 'SG', 'SF', 19, 75, 78, 72, 86, 70, 76, 74, 60, 'BENCH'),

  // ==========================================
  // LOS ANGELES LAKERS (LAL)
  // ==========================================
  createPlayer('lal-3945274', 3945274, 'Luka Doncic', 'Los Angeles Lakers', 'LAL', 'Western', 'PG', 'SG', 77, 96, 97, 95, 98, 92, 98, 98, 82, 'STARTER'),
  createPlayer('lal-4066457', 4066457, 'Austin Reaves', 'Los Angeles Lakers', 'LAL', 'Western', 'SG', 'PG', 15, 88, 89, 87, 90, 84, 92, 91, 74, 'STARTER'),
  createPlayer('lal-4433136', 4433136, 'Walker Kessler', 'Los Angeles Lakers', 'LAL', 'Western', 'C', 'PF', 3, 81, 82, 80, 64, 82, 74, 78, 87, 'STARTER'),
  createPlayer('lal-4897943', 4897943, 'Dalton Knecht', 'Los Angeles Lakers', 'LAL', 'Western', 'SF', 'SG', 4, 80, 81, 79, 86, 80, 82, 76, 70, 'STARTER'),
  createPlayer('lal-4277811', 4277811, 'Collin Sexton', 'Los Angeles Lakers', 'LAL', 'Western', 'PG', 'SG', 14, 79, 82, 74, 82, 80, 88, 80, 60, 'STARTER'),
  createPlayer('lal-4397014', 4397014, 'Quentin Grimes', 'Los Angeles Lakers', 'LAL', 'Western', 'SG', 'SF', 7, 76, 78, 74, 84, 74, 78, 72, 62, 'BENCH'),
  createPlayer('lal-4278077', 4278077, 'Jarred Vanderbilt', 'Los Angeles Lakers', 'LAL', 'Western', 'PF', 'SF', 2, 76, 70, 86, 50, 78, 78, 70, 84, 'BENCH'),
  createPlayer('lal-3907498', 3907498, 'Matisse Thybulle', 'Los Angeles Lakers', 'LAL', 'Western', 'SG', 'SF', 16, 75, 70, 88, 72, 78, 82, 70, 62, 'BENCH'),
  createPlayer('lal-4683774', 4683774, 'Bronny James', 'Los Angeles Lakers', 'LAL', 'Western', 'PG', 'SG', 9, 73, 72, 76, 74, 78, 80, 74, 60, 'BENCH'),

  // ==========================================
  // PHOENIX SUNS (PHX)
  // ==========================================
  createPlayer('phx-3136193', 3136193, 'Devin Booker', 'Phoenix Suns', 'PHX', 'Western', 'SG', 'PG', 1, 91, 92, 90, 93, 87, 95, 94, 77, 'STARTER'),
  createPlayer('phx-3155526', 3155526, 'Dillon Brooks', 'Phoenix Suns', 'PHX', 'Western', 'SF', 'SG', 3, 82, 83, 81, 80, 78, 81, 79, 78, 'STARTER'),
  createPlayer('phx-4066383', 4066383, 'Miles Bridges', 'Phoenix Suns', 'PHX', 'Western', 'PF', 'SF', 0, 80, 82, 78, 80, 88, 82, 76, 78, 'STARTER'),
  createPlayer('phx-4437244', 4437244, 'Jalen Green', 'Phoenix Suns', 'PHX', 'Western', 'SG', 'PG', 4, 79, 82, 74, 82, 92, 90, 78, 62, 'STARTER'),
  createPlayer('phx-4701232', 4701232, 'Mark Williams', 'Phoenix Suns', 'PHX', 'Western', 'C', 'PF', 15, 78, 76, 80, 25, 82, 68, 68, 86, 'STARTER'),
  createPlayer('phx-4888725', 4888725, 'Ryan Dunn', 'Phoenix Suns', 'PHX', 'Western', 'SF', 'PF', 6, 76, 72, 86, 74, 82, 80, 70, 74, 'BENCH'),
  createPlayer('phx-3913174', 3913174, 'Luke Kennard', 'Phoenix Suns', 'PHX', 'Western', 'SG', 'PG', 14, 76, 78, 70, 92, 60, 74, 76, 56, 'BENCH'),
  createPlayer('phx-4291678', 4291678, 'Haywood Highsmith', 'Phoenix Suns', 'PHX', 'Western', 'SF', 'PF', 7, 75, 74, 78, 76, 74, 76, 72, 72, 'BENCH'),

  // ==========================================
  // SACRAMENTO KINGS (SAC)
  // ==========================================
  createPlayer('sac-3155942', 3155942, 'Domantas Sabonis', 'Sacramento Kings', 'SAC', 'Western', 'C', 'PF', 11, 85, 86, 84, 83, 81, 84, 82, 81, 'STARTER'),
  createPlayer('sac-3064440', 3064440, 'Zach LaVine', 'Sacramento Kings', 'SAC', 'Western', 'SG', 'SF', 8, 82, 83, 81, 84, 78, 86, 85, 68, 'STARTER'),
  createPlayer('sac-4594327', 4594327, 'Keegan Murray', 'Sacramento Kings', 'SAC', 'Western', 'SF', 'PF', 13, 81, 82, 80, 86, 78, 80, 78, 78, 'STARTER'),
  createPlayer('sac-4066262', 4066262, 'Malik Monk', 'Sacramento Kings', 'SAC', 'Western', 'SG', 'PG', 0, 80, 82, 74, 84, 84, 88, 82, 60, 'STARTER'),
  createPlayer('sac-3907387', 3907387, 'Ben Simmons', 'Sacramento Kings', 'SAC', 'Western', 'PG', 'PF', 3, 77, 74, 82, 25, 78, 84, 88, 80, 'STARTER'),
  createPlayer('sac-4431679', 4431679, 'Precious Achiuwa', 'Sacramento Kings', 'SAC', 'Western', 'PF', 'C', 9, 77, 76, 78, 65, 82, 74, 72, 82, 'BENCH'),
  createPlayer('sac-4065732', 4065732, "De'Andre Hunter", 'Sacramento Kings', 'SAC', 'Western', 'SF', 'SG', 15, 76, 78, 76, 80, 76, 78, 74, 70, 'BENCH'),
  createPlayer('sac-4702384', 4702384, 'Nique Clifford', 'Sacramento Kings', 'SAC', 'Western', 'SG', 'SF', 5, 75, 76, 74, 77, 71, 79, 78, 61, 'BENCH'),
];
