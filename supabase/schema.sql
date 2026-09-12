CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP TABLES (for clean migrations if needed)
-- DROP TABLE IF EXISTS user_inventory CASCADE;
-- DROP TABLE IF EXISTS shop_items CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS attributes CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  total_xp INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 50,
  current_theme TEXT NOT NULL DEFAULT 'default',
  streak_count INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ATTRIBUTES TABLE (5 Fixed RPG Attributes)
CREATE TABLE IF NOT EXISTS public.attributes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (name IN ('Intellect', 'Strength', 'Discipline', 'Creativity', 'Social')),
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, name)
);

-- 5. TASKS TABLE (Quests)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Intellect', 'Strength', 'Discipline', 'Creativity', 'Social')),
  base_xp INTEGER NOT NULL DEFAULT 20 CHECK (base_xp >= 5 AND base_xp <= 100),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SHOP ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('theme', 'avatar_item', 'badge')),
  cost INTEGER NOT NULL CHECK (cost >= 0),
  asset_key TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. USER INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  equipped BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(user_id, item_id)
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Zero-Tolerance: Users can ONLY see and mutate their own data
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Attributes Policies
CREATE POLICY "Users can view own attributes" 
  ON public.attributes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own attributes" 
  ON public.attributes FOR UPDATE 
  USING (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "Users can view own tasks" 
  ON public.tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" 
  ON public.tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" 
  ON public.tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" 
  ON public.tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- Shop Items Policies (Public read)
CREATE POLICY "Anyone can view shop items" 
  ON public.shop_items FOR SELECT 
  USING (true);

-- User Inventory Policies
CREATE POLICY "Users can view own inventory" 
  ON public.user_inventory FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory" 
  ON public.user_inventory FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory" 
  ON public.user_inventory FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATED USER REGISTRATION TRIGGER
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Initialize Profile
  INSERT INTO public.profiles (id, username, avatar_url, total_xp, gold, streak_count, current_theme)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    0,
    100, -- starting bonus gold
    0,
    'default'
  );

  -- 2. Initialize 5 RPG Attributes
  INSERT INTO public.attributes (user_id, name, xp, level)
  VALUES 
    (NEW.id, 'Intellect', 0, 1),
    (NEW.id, 'Strength', 0, 1),
    (NEW.id, 'Discipline', 0, 1),
    (NEW.id, 'Creativity', 0, 1),
    (NEW.id, 'Social', 0, 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- SERVER-AUTHORITATIVE ANTI-CHEAT RPC ENGINE
-- ====================================================================

-- Function: Complete Task with Server-Enforced Math
CREATE OR REPLACE FUNCTION public.complete_task_rpc(p_task_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_task RECORD;
  v_profile RECORD;
  v_attr RECORD;
  v_multiplier NUMERIC := 1.0;
  v_awarded_xp INTEGER;
  v_awarded_gold INTEGER;
  v_streak_bonus NUMERIC;
  v_new_streak INTEGER;
  v_today DATE := CURRENT_DATE;
  v_new_total_xp INTEGER;
  v_new_attr_xp INTEGER;
  v_old_level INTEGER;
  v_new_level INTEGER;
  v_attr_new_level INTEGER;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: User is not authenticated';
  END IF;

  -- 1. Fetch and Lock Task
  SELECT * INTO v_task FROM public.tasks 
  WHERE id = p_task_id AND user_id = v_user_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not found or does not belong to user';
  END IF;

  IF v_task.status = 'completed' THEN
    RAISE EXCEPTION 'Quest is already completed';
  END IF;

  -- 2. Fetch Profile
  SELECT * INTO v_profile FROM public.profiles 
  WHERE id = v_user_id 
  FOR UPDATE;

  -- 3. Calculate Speed Multiplier (based on created_at vs deadline vs now)
  IF v_task.deadline IS NOT NULL AND v_task.deadline > v_task.created_at THEN
    DECLARE
      v_total_seconds NUMERIC := EXTRACT(EPOCH FROM (v_task.deadline - v_task.created_at));
      v_remaining_seconds NUMERIC := EXTRACT(EPOCH FROM (v_task.deadline - NOW()));
    BEGIN
      IF v_total_seconds > 0 THEN
        v_multiplier := 1.0 + (v_remaining_seconds / v_total_seconds) * 0.5;
        -- Clamp between 0.75x (late completion floor) and 1.5x (fast completion bonus)
        IF v_multiplier < 0.75 THEN v_multiplier := 0.75; END IF;
        IF v_multiplier > 1.5 THEN v_multiplier := 1.5; END IF;
      END IF;
    END;
  END IF;

  -- 4. Calculate Awarded XP
  v_awarded_xp := ROUND(v_task.base_xp * v_multiplier);
  IF v_awarded_xp < 5 THEN v_awarded_xp := 5; END IF;

  -- 5. Calculate Streak
  IF v_profile.last_active_date IS NULL THEN
    v_new_streak := 1;
  ELSIF v_profile.last_active_date = v_today THEN
    v_new_streak := v_profile.streak_count;
  ELSIF v_profile.last_active_date = (v_today - INTERVAL '1 day')::DATE THEN
    v_new_streak := v_profile.streak_count + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  -- 6. Calculate Gold (with streak multiplier up to 50%)
  v_streak_bonus := 1.0 + (LEAST(v_new_streak, 10) * 0.05);
  v_awarded_gold := ROUND((v_awarded_xp * 0.5) * v_streak_bonus);
  IF v_awarded_gold < 2 THEN v_awarded_gold := 2; END IF;

  -- 7. Update Task Status
  UPDATE public.tasks 
  SET status = 'completed', completed_at = NOW()
  WHERE id = p_task_id;

  -- 8. Compute Level Changes
  -- Non-linear formula: xp_to_level(n) = floor(100 * 1.15^(n-1))
  v_new_total_xp := v_profile.total_xp + v_awarded_xp;
  
  -- Calculate character level iteratively from total_xp
  DECLARE
    v_temp_xp INTEGER := v_new_total_xp;
    v_req_xp INTEGER;
    v_calc_level INTEGER := 1;
  BEGIN
    LOOP
      v_req_xp := FLOOR(100 * POWER(1.15, v_calc_level - 1));
      IF v_temp_xp >= v_req_xp THEN
        v_temp_xp := v_temp_xp - v_req_xp;
        v_calc_level := v_calc_level + 1;
      ELSE
        EXIT;
      END IF;
    END LOOP;
    v_new_level := v_calc_level;
  END;

  -- Update Profile
  UPDATE public.profiles 
  SET 
    total_xp = v_new_total_xp,
    gold = gold + v_awarded_gold,
    streak_count = v_new_streak,
    last_active_date = v_today
  WHERE id = v_user_id;

  -- 9. Update Specific Attribute
  SELECT * INTO v_attr FROM public.attributes 
  WHERE user_id = v_user_id AND name = v_task.category
  FOR UPDATE;

  IF FOUND THEN
    v_new_attr_xp := v_attr.xp + v_awarded_xp;
    
    -- Calculate attribute level
    DECLARE
      v_attr_temp INTEGER := v_new_attr_xp;
      v_attr_req INTEGER;
      v_calc_attr_lvl INTEGER := 1;
    BEGIN
      LOOP
        v_attr_req := FLOOR(80 * POWER(1.15, v_calc_attr_lvl - 1));
        IF v_attr_temp >= v_attr_req THEN
          v_attr_temp := v_attr_temp - v_attr_req;
          v_calc_attr_lvl := v_calc_attr_lvl + 1;
        ELSE
          EXIT;
        END IF;
      END LOOP;
      v_attr_new_level := v_calc_attr_lvl;
    END;

    UPDATE public.attributes 
    SET xp = v_new_attr_xp, level = v_attr_new_level
    WHERE user_id = v_user_id AND name = v_task.category;
  END IF;

  -- Return detailed result payload
  RETURN json_build_object(
    'success', true,
    'awarded_xp', v_awarded_xp,
    'awarded_gold', v_awarded_gold,
    'new_total_xp', v_new_total_xp,
    'new_level', v_new_level,
    'streak_count', v_new_streak,
    'category', v_task.category,
    'attribute_level', v_attr_new_level
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- SEED SHOP ITEMS
-- ====================================================================

INSERT INTO public.shop_items (id, name, type, cost, asset_key, description)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Dungeon Tavern Theme', 'theme', 0, 'theme-default', 'The classic cozy medieval tavern where all legendary adventurers gather.'),
  ('a2222222-2222-2222-2222-222222222222', 'Cyberpunk Neon Theme', 'theme', 300, 'theme-cyberpunk', 'Sleek neon grid theme from the neon underworld of 2099.'),
  ('a3333333-3333-3333-3333-333333333333', 'Emerald Forest Sanctuary', 'theme', 250, 'theme-emerald', 'Deep twilight emerald forest canopy with mystical teal waters and glowing night flora.'),
  ('a4444444-4444-4444-4444-444444444444', 'Golden Autumn Citadel', 'theme', 250, 'theme-autumn', 'Warm golden autumn foliage, golden pathways, and russet-tile roofs.'),
  ('a5555555-5555-5555-5555-555555555555', 'Lavender Spirit Realm', 'theme', 280, 'theme-lavender', 'An ethereal twilight realm of soft violet paths, haunted blossoms, and spiritual mist.'),
  ('b1111111-1111-1111-1111-111111111111', 'Mage Hood', 'avatar_item', 150, 'gear-mage-hood', 'A mysterious hood woven from enchanted starlight silk.'),
  ('b2222222-2222-2222-2222-222222222222', 'Golden Crown', 'avatar_item', 500, 'gear-golden-crown', 'Forged from pure aurum for true champions of discipline.'),
  ('b3333333-3333-3333-3333-333333333333', 'Dragonfang Broadsword', 'avatar_item', 350, 'gear-dragon-blade', 'A legendary blade forged in dragon flame, sheathed at your hip ready for battle.'),
  ('b4444444-4444-4444-4444-444444444444', 'Lionheart Aegis Shield', 'avatar_item', 275, 'gear-knight-shield', 'An ornate royal heater shield bearing the golden lion crest of the high kingdom.'),
  ('b5555555-5555-5555-5555-555555555555', 'Shadowstalker Ranger Cowl', 'avatar_item', 220, 'gear-ranger-cowl', 'A stealthy forest ranger cowl fitted with an emerald hawk plume feather.'),
  ('b6666666-6666-6666-6666-666666666666', 'Celestial Archmage Cape', 'avatar_item', 400, 'gear-celestial-cape', 'A flowing royal midnight-blue cape lined with starlight embroidery and gold trims.'),
  ('c1111111-1111-1111-1111-111111111111', 'Early Quester Badge', 'badge', 50, 'badge-early-quester', 'Conferred upon the brave souls who embark on their life journey.'),
  ('c2222222-2222-2222-2222-222222222222', 'Iron Will Discipline Crest', 'badge', 120, 'badge-iron-will', 'Proof of unshakeable mental discipline and consecutive habit completion.'),
  ('c3333333-3333-3333-3333-333333333333', 'Dragon Slayer Champion Seal', 'badge', 450, 'badge-dragon-slayer', 'The highest medal of honor, awarded only to conquerors of the realm''s fiercest trials.'),
  ('c4444444-4444-4444-4444-444444444444', 'Grandmaster Scholar Seal', 'badge', 250, 'badge-grandmaster', 'Bestowed upon scholarly adventurers who unlock great wisdom in the arcane library.')
ON CONFLICT (id) DO NOTHING;
