import { NBAPlayer } from '../../types';
import { createPlayer } from './helper';

export const CENTRAL_PLAYERS: NBAPlayer[] = [
  // ==========================================
  // CHICAGO BULLS (CHI)
  // ==========================================
  createPlayer('chi-4871145', 4871145, 'Josh Giddey', 'Chicago Bulls', 'CHI', 'Eastern', 'PG', 'SG', 3, 84, 85, 83, 86, 80, 88, 87, 70, 'STARTER'),
  createPlayer('chi-2595516', 2595516, 'Norman Powell', 'Chicago Bulls', 'CHI', 'Eastern', 'SG', 'SF', 24, 84, 85, 83, 86, 80, 88, 87, 70, 'STARTER'),
  createPlayer('chi-4278067', 4278067, 'Nic Claxton', 'Chicago Bulls', 'CHI', 'Eastern', 'C', 'PF', 33, 82, 83, 81, 65, 83, 75, 79, 88, 'STARTER'),
  createPlayer('chi-4711294', 4711294, 'Matas Buzelis', 'Chicago Bulls', 'CHI', 'Eastern', 'SF', 'PF', 14, 81, 82, 80, 79, 77, 80, 78, 77, 'STARTER'),
  createPlayer('chi-4395626', 4395626, 'Tre Jones', 'Chicago Bulls', 'CHI', 'Eastern', 'PG', 'SG', 30, 78, 79, 77, 80, 74, 82, 81, 64, 'STARTER'),
  createPlayer('chi-4017844', 4017844, 'Guerschon Yabusele', 'Chicago Bulls', 'CHI', 'Eastern', 'PF', 'C', 28, 78, 79, 77, 76, 74, 77, 75, 74, 'BENCH'),
  createPlayer('chi-4066650', 4066650, 'Zach Collins', 'Chicago Bulls', 'CHI', 'Eastern', 'C', 'PF', 12, 77, 78, 76, 75, 73, 76, 74, 73, 'BENCH'),
  createPlayer('chi-4684275', 4684275, 'Rob Dillingham', 'Chicago Bulls', 'CHI', 'Eastern', 'PG', 'SG', 7, 76, 77, 75, 80, 70, 80, 78, 60, 'BENCH'),
  createPlayer('chi-4432822', 4432822, 'Isaac Okoro', 'Chicago Bulls', 'CHI', 'Eastern', 'SG', 'SF', 35, 75, 74, 78, 72, 76, 78, 72, 68, 'BENCH'),

  // ==========================================
  // CLEVELAND CAVALIERS (CLE)
  // ==========================================
  createPlayer('cle-3908809', 3908809, 'Donovan Mitchell', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'SG', 'PG', 45, 93, 94, 92, 95, 89, 97, 96, 79, 'STARTER'),
  createPlayer('cle-3992', 3992, 'James Harden', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'PG', 'SG', 1, 87, 88, 86, 89, 83, 91, 90, 73, 'STARTER'),
  createPlayer('cle-4432158', 4432158, 'Evan Mobley', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'PF', 'C', 4, 87, 88, 86, 70, 88, 80, 84, 93, 'STARTER'),
  createPlayer('cle-4066328', 4066328, 'Jarrett Allen', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'C', 'PF', 31, 85, 86, 84, 68, 86, 78, 82, 91, 'STARTER'),
  createPlayer('cle-3934723', 3934723, 'Thomas Bryant', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'C', 'PF', 3, 77, 78, 76, 60, 78, 70, 74, 83, 'STARTER'),
  createPlayer('cle-4066757', 4066757, 'Sam Merrill', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'SG', 'SF', 5, 76, 78, 72, 88, 65, 76, 74, 60, 'BENCH'),
  createPlayer('cle-4701233', 4701233, 'Craig Porter Jr.', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'PG', 'SG', 9, 75, 76, 74, 74, 68, 78, 76, 58, 'BENCH'),
  createPlayer('cle-4683747', 4683747, 'Jaylon Tyson', 'Cleveland Cavaliers', 'CLE', 'Eastern', 'SF', 'SG', 20, 74, 75, 73, 74, 70, 74, 72, 68, 'BENCH'),

  // ==========================================
  // DETROIT PISTONS (DET)
  // ==========================================
  createPlayer('det-4432166', 4432166, 'Cade Cunningham', 'Detroit Pistons', 'DET', 'Eastern', 'PG', 'SG', 2, 94, 95, 93, 96, 90, 98, 97, 80, 'STARTER'),
  createPlayer('det-4433621', 4433621, 'Jalen Duren', 'Detroit Pistons', 'DET', 'Eastern', 'C', 'PF', 0, 85, 86, 84, 68, 86, 78, 82, 91, 'STARTER'),
  createPlayer('det-4684742', 4684742, 'Ausar Thompson', 'Detroit Pistons', 'DET', 'Eastern', 'SF', 'SG', 9, 85, 86, 84, 87, 81, 89, 88, 71, 'STARTER'),
  createPlayer('det-3908845', 3908845, 'John Collins', 'Detroit Pistons', 'DET', 'Eastern', 'PF', 'C', 4, 78, 79, 77, 76, 74, 77, 75, 74, 'STARTER'),
  createPlayer('det-2596112', 2596112, 'Javonte Green', 'Detroit Pistons', 'DET', 'Eastern', 'SG', 'SF', 31, 77, 78, 76, 79, 73, 81, 80, 63, 'STARTER'),
  createPlayer('det-4066372', 4066372, 'Kevin Huerter', 'Detroit Pistons', 'DET', 'Eastern', 'SG', 'SF', 27, 76, 78, 72, 85, 68, 76, 74, 60, 'BENCH'),
  createPlayer('det-4683771', 4683771, 'Ronald Holland II', 'Detroit Pistons', 'DET', 'Eastern', 'SF', 'PF', 5, 75, 75, 76, 70, 78, 76, 70, 72, 'BENCH'),
  createPlayer('det-4395702', 4395702, 'Isaiah Joe', 'Detroit Pistons', 'DET', 'Eastern', 'SG', 'PG', 11, 75, 78, 70, 88, 64, 76, 72, 58, 'BENCH'),

  // ==========================================
  // INDIANA PACERS (IND)
  // ==========================================
  createPlayer('ind-4396993', 4396993, 'Tyrese Haliburton', 'Indiana Pacers', 'IND', 'Eastern', 'PG', 'SG', 0, 90, 91, 89, 92, 86, 94, 93, 76, 'STARTER'),
  createPlayer('ind-3149673', 3149673, 'Pascal Siakam', 'Indiana Pacers', 'IND', 'Eastern', 'PF', 'SF', 43, 87, 88, 86, 85, 83, 86, 84, 83, 'STARTER'),
  createPlayer('ind-4017837', 4017837, 'Ivica Zubac', 'Indiana Pacers', 'IND', 'Eastern', 'C', 'PF', 40, 84, 85, 83, 67, 85, 77, 81, 90, 'STARTER'),
  createPlayer('ind-3133603', 3133603, 'Kelly Oubre Jr.', 'Indiana Pacers', 'IND', 'Eastern', 'SF', 'SG', 4, 80, 81, 79, 82, 76, 84, 83, 66, 'STARTER'),
  createPlayer('ind-4395712', 4395712, 'Andrew Nembhard', 'Indiana Pacers', 'IND', 'Eastern', 'PG', 'SG', 2, 80, 82, 78, 80, 70, 84, 85, 62, 'STARTER'),
  createPlayer('ind-4396909', 4396909, 'Aaron Nesmith', 'Indiana Pacers', 'IND', 'Eastern', 'SF', 'SG', 23, 78, 79, 78, 84, 76, 80, 76, 70, 'BENCH'),
  createPlayer('ind-2530530', 2530530, 'T.J. McConnell', 'Indiana Pacers', 'IND', 'Eastern', 'PG', 'SG', 9, 77, 78, 76, 70, 60, 88, 88, 60, 'BENCH'),
  createPlayer('ind-4278355', 4278355, 'Obi Toppin', 'Indiana Pacers', 'IND', 'Eastern', 'PF', 'SF', 1, 76, 78, 72, 78, 88, 78, 72, 74, 'BENCH'),
  createPlayer('ind-5106060', 5106060, 'Jarace Walker', 'Indiana Pacers', 'IND', 'Eastern', 'PF', 'SF', 5, 75, 74, 76, 72, 78, 74, 72, 76, 'BENCH'),

  // ==========================================
  // MILWAUKEE BUCKS (MIL)
  // ==========================================
  createPlayer('mil-4395725', 4395725, 'Tyler Herro', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SG', 'PG', 14, 85, 86, 84, 87, 81, 89, 88, 71, 'STARTER'),
  createPlayer('mil-3133628', 3133628, 'Myles Turner', 'Milwaukee Bucks', 'MIL', 'Eastern', 'C', 'PF', 33, 83, 82, 86, 78, 82, 72, 74, 88, 'STARTER'),
  createPlayer('mil-4432848', 4432848, 'Jaime Jaquez Jr.', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SF', 'SG', 11, 80, 81, 78, 78, 78, 78, 76, 74, 'STARTER'),
  createPlayer('mil-3134907', 3134907, 'Kyle Kuzma', 'Milwaukee Bucks', 'MIL', 'Eastern', 'PF', 'SF', 18, 79, 80, 76, 80, 76, 78, 74, 76, 'STARTER'),
  createPlayer('mil-2991043', 2991043, 'Caris LeVert', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SG', 'SF', 10, 78, 80, 74, 80, 74, 82, 80, 66, 'STARTER'),
  createPlayer('mil-4397475', 4397475, 'AJ Green', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SG', 'PG', 20, 77, 78, 72, 88, 62, 76, 74, 58, 'BENCH'),
  createPlayer('mil-4997526', 4997526, 'Ousmane Dieng', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SF', 'PF', 21, 76, 76, 76, 74, 76, 76, 72, 74, 'BENCH'),
  createPlayer('mil-4277843', 4277843, 'Gary Trent Jr.', 'Milwaukee Bucks', 'MIL', 'Eastern', 'SG', 'SF', 5, 76, 78, 72, 85, 68, 78, 72, 60, 'BENCH'),
];
