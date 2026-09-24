import { NBAPlayer } from '../../types';
import { createPlayer } from './helper';

export const SOUTHWEST_PLAYERS: NBAPlayer[] = [
  // ==========================================
  // DALLAS MAVERICKS (DAL)
  // ==========================================
  createPlayer('dal-5041939', 5041939, 'Cooper Flagg', 'Dallas Mavericks', 'DAL', 'Western', 'SF', 'PF', 32, 87, 88, 86, 85, 83, 86, 84, 83, 'STARTER'),
  createPlayer('dal-6442', 6442, 'Kyrie Irving', 'Dallas Mavericks', 'DAL', 'Western', 'PG', 'SG', 11, 87, 88, 86, 89, 83, 91, 90, 73, 'STARTER'),
  createPlayer('dal-5211175', 5211175, 'Zaccharie Risacher', 'Dallas Mavericks', 'DAL', 'Western', 'SF', 'SG', 10, 80, 81, 79, 84, 76, 80, 76, 74, 'STARTER'),
  createPlayer('dal-4683688', 4683688, 'Dereck Lively II', 'Dallas Mavericks', 'DAL', 'Western', 'C', 'PF', 2, 80, 78, 82, 25, 84, 74, 70, 88, 'STARTER'),
  createPlayer('dal-4278078', 4278078, 'P.J. Washington', 'Dallas Mavericks', 'DAL', 'Western', 'PF', 'SF', 25, 79, 80, 78, 80, 78, 76, 76, 80, 'STARTER'),
  createPlayer('dal-3138160', 3138160, 'Caleb Martin', 'Dallas Mavericks', 'DAL', 'Western', 'SF', 'SG', 16, 78, 79, 77, 78, 76, 78, 74, 72, 'BENCH'),
  createPlayer('dal-4593125', 4593125, 'Santi Aldama', 'Dallas Mavericks', 'DAL', 'Western', 'PF', 'C', 7, 77, 78, 76, 80, 74, 74, 76, 78, 'BENCH'),
  createPlayer('dal-4278049', 4278049, 'Daniel Gafford', 'Dallas Mavericks', 'DAL', 'Western', 'C', 'PF', 21, 77, 76, 78, 25, 88, 72, 68, 86, 'BENCH'),
  createPlayer('dal-4278594', 4278594, 'Naji Marshall', 'Dallas Mavericks', 'DAL', 'Western', 'SF', 'PF', 13, 76, 76, 78, 76, 72, 78, 76, 74, 'BENCH'),

  // ==========================================
  // HOUSTON ROCKETS (HOU)
  // ==========================================
  createPlayer('hou-3202', 3202, 'Kevin Durant', 'Houston Rockets', 'HOU', 'Western', 'SF', 'PF', 7, 93, 94, 92, 91, 89, 92, 90, 89, 'STARTER'),
  createPlayer('hou-4871144', 4871144, 'Alperen Sengun', 'Houston Rockets', 'HOU', 'Western', 'C', 'PF', 28, 87, 88, 86, 70, 88, 80, 84, 93, 'STARTER'),
  createPlayer('hou-4684740', 4684740, 'Amen Thompson', 'Houston Rockets', 'HOU', 'Western', 'PG', 'SG', 1, 86, 87, 85, 88, 82, 90, 89, 72, 'STARTER'),
  createPlayer('hou-4432639', 4432639, 'Jabari Smith Jr.', 'Houston Rockets', 'HOU', 'Western', 'PF', 'C', 10, 81, 82, 80, 84, 78, 76, 78, 84, 'STARTER'),
  createPlayer('hou-4711272', 4711272, 'Reed Sheppard', 'Houston Rockets', 'HOU', 'Western', 'PG', 'SG', 15, 80, 81, 79, 88, 74, 84, 82, 64, 'STARTER'),
  createPlayer('hou-4433192', 4433192, 'Tari Eason', 'Houston Rockets', 'HOU', 'Western', 'SF', 'PF', 17, 78, 76, 84, 78, 80, 80, 74, 80, 'BENCH'),
  createPlayer('hou-2991230', 2991230, 'Fred VanVleet', 'Houston Rockets', 'HOU', 'Western', 'PG', 'SG', 5, 78, 80, 76, 82, 60, 84, 86, 60, 'BENCH'),
  createPlayer('hou-2990992', 2990992, 'Marcus Smart', 'Houston Rockets', 'HOU', 'Western', 'PG', 'SG', 36, 77, 74, 86, 76, 68, 82, 82, 66, 'BENCH'),
  createPlayer('hou-2991235', 2991235, 'Steven Adams', 'Houston Rockets', 'HOU', 'Western', 'C', 'PF', 12, 77, 74, 78, 20, 76, 60, 68, 92, 'BENCH'),

  // ==========================================
  // MEMPHIS GRIZZLIES (MEM)
  // ==========================================
  createPlayer('mem-4600663', 4600663, 'Zach Edey', 'Memphis Grizzlies', 'MEM', 'Western', 'C', 'PF', 14, 80, 81, 79, 63, 81, 73, 77, 86, 'STARTER'),
  createPlayer('mem-5041935', 5041935, 'Cameron Boozer', 'Memphis Grizzlies', 'MEM', 'Western', 'SF', 'PF', 27, 80, 81, 79, 78, 76, 79, 77, 76, 'STARTER'),
  createPlayer('mem-2991070', 2991070, 'Jerami Grant', 'Memphis Grizzlies', 'MEM', 'Western', 'PF', 'SF', 9, 79, 80, 76, 82, 80, 78, 74, 74, 'STARTER'),
  createPlayer('mem-5105550', 5105550, 'GG Jackson', 'Memphis Grizzlies', 'MEM', 'Western', 'SF', 'PF', 45, 78, 80, 74, 80, 84, 80, 72, 72, 'STARTER'),
  createPlayer('mem-4065733', 4065733, 'Ty Jerome', 'Memphis Grizzlies', 'MEM', 'Western', 'PG', 'SG', 2, 78, 80, 74, 86, 62, 82, 82, 58, 'STARTER'),
  createPlayer('mem-4683750', 4683750, 'Jordan Hawkins', 'Memphis Grizzlies', 'MEM', 'Western', 'SG', 'SF', 6, 76, 78, 72, 86, 72, 78, 74, 60, 'BENCH'),
  createPlayer('mem-4431785', 4431785, 'Scotty Pippen Jr.', 'Memphis Grizzlies', 'MEM', 'Western', 'PG', 'SG', 1, 76, 76, 78, 78, 70, 84, 80, 60, 'BENCH'),
  createPlayer('mem-4684806', 4684806, 'Taylor Hendricks', 'Memphis Grizzlies', 'MEM', 'Western', 'PF', 'SF', 22, 75, 74, 78, 78, 78, 76, 72, 76, 'BENCH'),

  // ==========================================
  // NEW ORLEANS PELICANS (NOP)
  // ==========================================
  createPlayer('nop-4397688', 4397688, 'Trey Murphy III', 'New Orleans Pelicans', 'NOP', 'Western', 'SF', 'SG', 25, 85, 86, 84, 88, 86, 84, 80, 78, 'STARTER'),
  createPlayer('nop-4395628', 4395628, 'Zion Williamson', 'New Orleans Pelicans', 'NOP', 'Western', 'PF', 'C', 1, 85, 86, 84, 65, 96, 88, 82, 84, 'STARTER'),
  createPlayer('nop-3907497', 3907497, 'Dejounte Murray', 'New Orleans Pelicans', 'NOP', 'Western', 'PG', 'SG', 5, 82, 83, 81, 84, 78, 86, 85, 68, 'STARTER'),
  createPlayer('nop-4277813', 4277813, 'Herbert Jones', 'New Orleans Pelicans', 'NOP', 'Western', 'SF', 'PF', 2, 80, 76, 88, 78, 76, 82, 78, 72, 'STARTER'),
  createPlayer('nop-4683634', 4683634, 'Bennedict Mathurin', 'New Orleans Pelicans', 'NOP', 'Western', 'SG', 'SF', 0, 79, 82, 74, 80, 84, 84, 76, 66, 'STARTER'),
  createPlayer('nop-4397136', 4397136, 'Saddiq Bey', 'New Orleans Pelicans', 'NOP', 'Western', 'SF', 'PF', 41, 78, 79, 77, 80, 74, 82, 81, 64, 'BENCH'),
  createPlayer('nop-4277956', 4277956, 'Jordan Poole', 'New Orleans Pelicans', 'NOP', 'Western', 'SG', 'PG', 3, 77, 80, 72, 82, 76, 86, 80, 58, 'BENCH'),
  createPlayer('nop-5061589', 5061589, 'Yves Missi', 'New Orleans Pelicans', 'NOP', 'Western', 'C', 'PF', 21, 76, 72, 80, 25, 86, 72, 66, 84, 'BENCH'),

  // ==========================================
  // SAN ANTONIO SPURS (SAS)
  // ==========================================
  createPlayer('sas-5104157', 5104157, 'Victor Wembanyama', 'San Antonio Spurs', 'SAS', 'Western', 'C', 'PF', 1, 97, 98, 96, 95, 93, 96, 94, 98, 'STARTER'),
  createPlayer('sas-4845367', 4845367, 'Stephon Castle', 'San Antonio Spurs', 'SAS', 'Western', 'PG', 'SG', 5, 87, 88, 86, 89, 83, 91, 90, 73, 'STARTER'),
  createPlayer('sas-4066259', 4066259, "De'Aaron Fox", 'San Antonio Spurs', 'SAS', 'Western', 'PG', 'SG', 4, 86, 88, 82, 82, 86, 98, 90, 68, 'STARTER'),
  createPlayer('sas-4395630', 4395630, 'Devin Vassell', 'San Antonio Spurs', 'SAS', 'Western', 'SG', 'SF', 24, 82, 84, 80, 86, 78, 84, 80, 68, 'STARTER'),
  createPlayer('sas-6440', 6440, 'Tobias Harris', 'San Antonio Spurs', 'SAS', 'Western', 'PF', 'SF', 12, 80, 82, 78, 80, 76, 76, 78, 80, 'STARTER'),
  createPlayer('sas-4395723', 4395723, 'Keldon Johnson', 'San Antonio Spurs', 'SAS', 'Western', 'SF', 'PF', 3, 80, 81, 79, 78, 82, 80, 76, 76, 'BENCH'),
  createPlayer('sas-6578', 6578, 'Harrison Barnes', 'San Antonio Spurs', 'SAS', 'Western', 'SF', 'PF', 40, 78, 79, 77, 82, 74, 76, 74, 72, 'BENCH'),
  createPlayer('sas-3064560', 3064560, 'Luke Kornet', 'San Antonio Spurs', 'SAS', 'Western', 'C', 'PF', 7, 75, 74, 76, 70, 74, 62, 72, 82, 'BENCH'),
];
