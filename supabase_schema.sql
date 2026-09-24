    -- ========================================================================
    -- 🏀 NBA SQUAD BUILDER - ESQUEMA COMPLETO DE BASE DE DATOS SUPABASE
    -- Con Tablas Normalizadas, Relaciones, Triggers y Políticas RLS
    -- ========================================================================

    -- Habilitar extensión UUID
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- ========================================================================
    -- 1. TABLA: PROFILES (Perfiles de Manager)
    -- Vinculada 1:1 con auth.users de Supabase
    -- ========================================================================
    CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username TEXT NOT NULL DEFAULT 'NBA Manager',
        avatar_url TEXT,
        email TEXT,
        coins INT NOT NULL DEFAULT 1500,
        total_packs_opened INT NOT NULL DEFAULT 0,
        three_point_high_score INT NOT NULL DEFAULT 0,
        seasons_won INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
    );

    -- ========================================================================
    -- 2. TABLA: USER_CARDS (Cartas Coleccionadas por el Usuario)
    -- ========================================================================
    CREATE TABLE IF NOT EXISTS public.user_cards (
        id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        player_id TEXT NOT NULL,
        is_locked BOOLEAN DEFAULT false,
        games_played INT DEFAULT 0,
        obtained_at TIMESTAMPTZ DEFAULT now() NOT NULL
    );

    -- Índice para consultas rápidas de cartas por usuario
    CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON public.user_cards(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_cards_player_id ON public.user_cards(player_id);

    -- ========================================================================
    -- 3. TABLA: USER_COACHES (Entrenadores Creados por el Usuario)
    -- ========================================================================
    CREATE TABLE IF NOT EXISTS public.user_coaches (
        id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
        user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        photo_uri TEXT NOT NULL,
        team_affinity TEXT NOT NULL,
        tactic TEXT NOT NULL,
        boost_offense INT DEFAULT 3,
        boost_defense INT DEFAULT 3,
        boost_chemistry INT DEFAULT 5,
        signature_quote TEXT,
        is_cutout BOOLEAN DEFAULT false,
        cutout_shape TEXT DEFAULT 'bust',
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_user_coaches_user_id ON public.user_coaches(user_id);

    -- ========================================================================
    -- 4. TABLA: USER_LINEUPS (Quinteto Titular y Entrenador)
    -- ========================================================================
    CREATE TABLE IF NOT EXISTS public.user_lineups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        team_name TEXT DEFAULT 'My NBA Squad',
        team_abbr TEXT DEFAULT 'NBA',
        team_logo TEXT,
        coach_id TEXT REFERENCES public.user_coaches(id) ON DELETE SET NULL,
        pg_card_id TEXT REFERENCES public.user_cards(id) ON DELETE SET NULL,
        sg_card_id TEXT REFERENCES public.user_cards(id) ON DELETE SET NULL,
        sf_card_id TEXT REFERENCES public.user_cards(id) ON DELETE SET NULL,
        pf_card_id TEXT REFERENCES public.user_cards(id) ON DELETE SET NULL,
        c_card_id TEXT REFERENCES public.user_cards(id) ON DELETE SET NULL,
        team_chemistry INT DEFAULT 0,
        team_ovr INT DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
    );

    -- ========================================================================
    -- 5. TABLA: USER_ACHIEVEMENTS (Logros Reclamados)
    -- ========================================================================
    CREATE TABLE IF NOT EXISTS public.user_achievements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        achievement_id TEXT NOT NULL,
        claimed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
    );

    CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

    -- ========================================================================
    -- 6. TRIGGER AUTOMÁTICO AL REGISTRARSE UN USUARIO (Email, Google, Apple, FB)
    -- ========================================================================
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
        -- 1. Crear el perfil del usuario si no existe
        INSERT INTO public.profiles (
            id,
            email,
            username,
            avatar_url,
            coins,
            total_packs_opened
        )
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(
                NEW.raw_user_meta_data->>'username',
                NEW.raw_user_meta_data->>'full_name',
                NEW.raw_user_meta_data->>'name',
                split_part(NEW.email, '@', 1),
                'NBA Manager'
            ),
            COALESCE(
                NEW.raw_user_meta_data->>'avatar_url',
                NEW.raw_user_meta_data->>'picture',
                NULL
            ),
            1500, -- Monedas iniciales de bienvenida
            0
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            username = COALESCE(public.profiles.username, EXCLUDED.username),
            avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
            updated_at = now();

        -- 2. Inicializar su quinteto vacío si no existe
        INSERT INTO public.user_lineups (user_id)
        VALUES (NEW.id)
        ON CONFLICT (user_id) DO NOTHING;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Eliminar trigger previo si existe y volver a crearlo
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- ========================================================================
    -- 7. SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
    -- Cada usuario solo puede ver, insertar, modificar o eliminar sus propios datos
    -- ========================================================================

    -- Habilitar RLS en todas las tablas
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_coaches ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_lineups ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

    -- Políticas para: PROFILES
    CREATE POLICY "profiles_select_own" ON public.profiles
        FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "profiles_update_own" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);

    CREATE POLICY "profiles_insert_own" ON public.profiles
        FOR INSERT WITH CHECK (auth.uid() = id);

    -- Políticas para: USER_CARDS
    CREATE POLICY "cards_select_own" ON public.user_cards
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "cards_insert_own" ON public.user_cards
        FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "cards_update_own" ON public.user_cards
        FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "cards_delete_own" ON public.user_cards
        FOR DELETE USING (auth.uid() = user_id);

    -- Políticas para: USER_COACHES
    CREATE POLICY "coaches_select_own" ON public.user_coaches
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "coaches_insert_own" ON public.user_coaches
        FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "coaches_update_own" ON public.user_coaches
        FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "coaches_delete_own" ON public.user_coaches
        FOR DELETE USING (auth.uid() = user_id);

    -- Políticas para: USER_LINEUPS
    CREATE POLICY "lineups_select_own" ON public.user_lineups
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "lineups_insert_own" ON public.user_lineups
        FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "lineups_update_own" ON public.user_lineups
        FOR UPDATE USING (auth.uid() = user_id);

    -- Políticas para: USER_ACHIEVEMENTS
    CREATE POLICY "achievements_select_own" ON public.user_achievements
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "achievements_insert_own" ON public.user_achievements
        FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- ========================================================================
    -- 8. STORAGE BUCKET: Para Fotos de Entrenadores
    -- ========================================================================
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('coach-selfies', 'coach-selfies', true)
    ON CONFLICT (id) DO NOTHING;

    -- Políticas de Storage para coach-selfies
    CREATE POLICY "coach_selfies_select" ON storage.objects
        FOR SELECT USING (bucket_id = 'coach-selfies');

    CREATE POLICY "coach_selfies_insert" ON storage.objects
        FOR INSERT WITH CHECK (
            bucket_id = 'coach-selfies' AND
            auth.role() = 'authenticated'
        );
