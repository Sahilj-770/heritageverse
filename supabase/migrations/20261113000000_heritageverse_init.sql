-- =========================================================================
-- HERITAGEVERSE: SDG 11.4 DATABASE SCHEMA & INITIAL MIGRATION
-- Target: PostgreSQL / Supabase
-- Target 11.4: Strengthen efforts to protect and safeguard cultural heritage
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('visitor', 'contributor', 'admin')) DEFAULT 'visitor',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MONUMENTS TABLE
CREATE TABLE IF NOT EXISTS monuments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    vernacular_name TEXT,
    short_description TEXT NOT NULL,
    historical_background TEXT NOT NULL,
    architectural_style TEXT NOT NULL,
    cultural_significance TEXT NOT NULL,
    conservation_status TEXT NOT NULL CHECK (conservation_status IN ('Good', 'Requires Monitoring', 'At Risk', 'Under Restoration')),
    sdg_relevance TEXT NOT NULL,
    location TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Forts & Citadels',
        'Palaces & Mansions',
        'Rock-Cut Caves & Temples',
        'Museums & Archives',
        'Colonial & Modern Heritage'
    )),
    period TEXT NOT NULL,
    year_built TEXT NOT NULL,
    builder TEXT,
    timings TEXT,
    entry_fee TEXT,
    best_time_to_visit TEXT,
    nearest_transit TEXT,
    verified BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    cover_image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MONUMENT IMAGES
CREATE TABLE IF NOT EXISTS monument_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    monument_id UUID NOT NULL REFERENCES monuments(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    attribution TEXT NOT NULL,
    license TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOUR SCENES
CREATE TABLE IF NOT EXISTS tour_scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    monument_id UUID NOT NULL REFERENCES monuments(id) ON DELETE CASCADE,
    scene_name TEXT NOT NULL,
    panorama_url TEXT NOT NULL,
    thumbnail_url TEXT,
    initial_yaw DOUBLE PRECISION DEFAULT 0,
    initial_pitch DOUBLE PRECISION DEFAULT 0,
    historical_notes TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TOUR HOTSPOTS
CREATE TABLE IF NOT EXISTS tour_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id UUID NOT NULL REFERENCES tour_scenes(id) ON DELETE CASCADE,
    target_scene_id UUID REFERENCES tour_scenes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    yaw DOUBLE PRECISION NOT NULL,
    pitch DOUBLE PRECISION NOT NULL,
    hotspot_type TEXT NOT NULL CHECK (hotspot_type IN ('info', 'navigation')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SAVED MONUMENTS (Bookmarks)
CREATE TABLE IF NOT EXISTS saved_monuments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    monument_id UUID NOT NULL REFERENCES monuments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, monument_id)
);

-- 7. COMMUNITY SUBMISSIONS
CREATE TABLE IF NOT EXISTS community_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    monument_id UUID NOT NULL REFERENCES monuments(id) ON DELETE CASCADE,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('story', 'photograph', 'oral_history', 'correction')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    media_attribution TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    admin_feedback TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONSERVATION REPORTS
CREATE TABLE IF NOT EXISTS conservation_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    monument_id UUID NOT NULL REFERENCES monuments(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('weathering', 'vandalism', 'pollution', 'structural_crack', 'vegetation_overgrowth', 'neglect')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'urgent')),
    area_location TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    date_observed DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'investigating', 'archived', 'acknowledged')) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE monuments ENABLE ROW LEVEL SECURITY;
ALTER TABLE monument_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_monuments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conservation_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read, user can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Monuments, Images, Scenes & Hotspots: Public read
CREATE POLICY "Monuments readable by all" ON monuments FOR SELECT USING (true);
CREATE POLICY "Monument images readable by all" ON monument_images FOR SELECT USING (true);
CREATE POLICY "Tour scenes readable by all" ON tour_scenes FOR SELECT USING (true);
CREATE POLICY "Tour hotspots readable by all" ON tour_hotspots FOR SELECT USING (true);

-- Saved Monuments: Users can manage their own
CREATE POLICY "Users view own saved monuments" ON saved_monuments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own saved monuments" ON saved_monuments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own saved monuments" ON saved_monuments FOR DELETE USING (auth.uid() = user_id);

-- Submissions: Approved are public, users see own, admins see all
CREATE POLICY "Public can view approved submissions" ON community_submissions FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own submissions" ON community_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create submissions" ON community_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports: Users see own, admins see all
CREATE POLICY "Users can view own reports" ON conservation_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit conservation reports" ON conservation_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
