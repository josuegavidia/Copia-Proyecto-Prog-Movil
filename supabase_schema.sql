-- ========================================================================
-- 🏀 NBA SQUAD BUILDER & CARD CREATOR - SUPABASE DATABASE SCHEMA
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- References auth.users(id) if auth is enabled
    username TEXT NOT NULL DEFAULT 'NBA Manager',
    coins INT NOT NULL DEFAULT 1500,
    total_packs_opened INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PLAYERS MASTER CATALOG
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    nba_person_id INT NOT NULL,
    name TEXT NOT NULL,
    nickname TEXT,
    team TEXT NOT NULL,
    team_abbr TEXT NOT NULL,
    conference TEXT NOT NULL,
    position TEXT NOT NULL,
    secondary_position TEXT,
    jersey_number INT NOT NULL,
    rarity TEXT NOT NULL, -- 'DIAMOND', 'GOLD', 'SILVER', 'BRONZE'
    ovr INT NOT NULL,
    stat_offense INT NOT NULL,
    stat_defense INT NOT NULL,
    stat_playmaking INT NOT NULL,
    stat_rebound INT NOT NULL,
    stat_three_point INT NOT NULL,
    stat_dunk INT NOT NULL,
    stat_speed INT NOT NULL,
    image_url TEXT NOT NULL
);

-- 3. USER CARDS INVENTORY
CREATE TABLE IF NOT EXISTS user_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    obtained_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_locked BOOLEAN DEFAULT false
);

-- 4. CUSTOM HEAD COACH CARDS
CREATE TABLE IF NOT EXISTS user_coaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    team_affinity TEXT NOT NULL,
    tactic TEXT NOT NULL,
    boost_offense INT DEFAULT 3,
    boost_defense INT DEFAULT 3,
    boost_chemistry INT DEFAULT 5,
    signature_quote TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SQUAD LINEUPS
CREATE TABLE IF NOT EXISTS user_lineups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES user_coaches(id) ON DELETE SET NULL,
    pg_card_id UUID REFERENCES user_cards(id) ON DELETE SET NULL,
    sg_card_id UUID REFERENCES user_cards(id) ON DELETE SET NULL,
    sf_card_id UUID REFERENCES user_cards(id) ON DELETE SET NULL,
    pf_card_id UUID REFERENCES user_cards(id) ON DELETE SET NULL,
    c_card_id UUID REFERENCES user_cards(id) ON DELETE SET NULL,
    team_chemistry INT DEFAULT 0,
    team_ovr INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. STORAGE BUCKET FOR COACH SELFIES
-- INSERT INTO storage.buckets (id, name, public) VALUES ('coach-selfies', 'coach-selfies', true) ON CONFLICT DO NOTHING;
