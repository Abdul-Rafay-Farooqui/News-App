-- Supabase Schema for News Application
-- This SQL file creates the necessary tables and structure for the news app

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('latest', 'global', 'sports', 'tech')),
    author TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author);

-- Enable Row Level Security (RLS) for security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all read operations on news table
CREATE POLICY "Enable read access for all users" ON news
    FOR SELECT USING (true);

-- Create policy to allow insert operations (for admin use)
CREATE POLICY "Enable insert for authenticated users" ON news
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow update operations (for admin use)
CREATE POLICY "Enable update for authenticated users" ON news
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow delete operations (for admin use)
CREATE POLICY "Enable delete for authenticated users" ON news
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO news (title, description, image_url, video_url, category, author) VALUES
-- Latest News
('Breaking: Major Tech Company Announces Revolutionary AI', 'A leading technology company has unveiled a groundbreaking artificial intelligence system that promises to transform how we interact with technology.', 'https://picsum.photos/seed/tech1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'latest', 'John Smith'),
('Global Climate Summit Reaches Historic Agreement', 'World leaders have come together to sign a comprehensive climate agreement that aims to reduce carbon emissions significantly by 2030.', 'https://picsum.photos/seed/climate1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'latest', 'Sarah Johnson'),

-- Global News
('International Trade Agreement Boosts Global Economy', 'A new multilateral trade agreement has been signed by 50 countries, expected to boost global economic growth by 2.5% annually.', 'https://picsum.photos/seed/trade1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'global', 'Michael Chen'),
('European Union Launches Digital Currency Initiative', 'The EU has announced plans for a unified digital currency that could revolutionize cross-border transactions within member states.', 'https://picsum.photos/seed/eu1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'global', 'Emma Wilson'),

-- Sports News
('Championship Finals: Underdogs Take the Trophy', 'In a stunning upset, the underdog team has won the national championship in a thrilling match that went into overtime.', 'https://picsum.photos/seed/sports1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'sports', 'David Martinez'),
('Olympic Athlete Breaks World Record', 'A legendary athlete has broken a 20-year-old world record at the international championships, setting a new benchmark for the sport.', 'https://picsum.photos/seed/olympic1/800/400.jpg', 'https://picsum.photos/seed/olympic1/800/400.jpg', 'sports', 'Lisa Anderson'),

-- Technology News
('Quantum Computer Achieves Major Breakthrough', 'Researchers have successfully built a quantum computer capable of solving complex problems that would take traditional computers millennia to complete.', 'https://picsum.photos/seed/quantum1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'tech', 'Dr. Robert Kim'),
('New Smartphone Features Revolutionary Battery Technology', 'A major smartphone manufacturer has unveiled a device with battery life that lasts up to one week on a single charge.', 'https://picsum.photos/seed/phone1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'tech', 'Alex Thompson'),

-- Additional sample data
('Healthcare Innovation: AI-Powered Diagnosis', 'New artificial intelligence systems are now capable of detecting diseases with 95% accuracy, revolutionizing medical diagnostics.', 'https://picsum.photos/seed/health1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'tech', 'Dr. Maria Garcia'),

('Space Exploration: Mars Mission Success', 'The latest Mars rover has discovered evidence of ancient river beds, bringing us closer to understanding the planet''s history.', 'https://picsum.photos/seed/mars1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'global', 'James Taylor'),

('World Cup Qualifiers: Surprising Results', 'Several underdog teams have secured unexpected victories in the World Cup qualifying rounds, reshaping the tournament landscape.', 'https://picsum.photos/seed/soccer1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'sports', 'Carlos Rodriguez'),

('Electric Vehicle Sales Hit Record High', 'Electric vehicle sales have surpassed expectations, with major manufacturers reporting record-breaking quarterly figures.', 'https://picsum.photos/seed/ev1/800/400.jpg', 'https://www.w3schools.com/html/mov_bbb.mp4', 'tech', 'Nina Patel');

-- Create views for commonly accessed data
CREATE OR REPLACE VIEW latest_news AS
SELECT * FROM news 
WHERE category = 'latest' 
ORDER BY published_at DESC;

CREATE OR REPLACE VIEW global_news AS
SELECT * FROM news 
WHERE category = 'global' 
ORDER BY published_at DESC;

CREATE OR REPLACE VIEW sports_news AS
SELECT * FROM news 
WHERE category = 'sports' 
ORDER BY published_at DESC;

CREATE OR REPLACE VIEW tech_news AS
SELECT * FROM news 
WHERE category = 'tech' 
ORDER BY published_at DESC;

-- Create functions for easy data retrieval
CREATE OR REPLACE FUNCTION get_news_by_category(category_param TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    category TEXT,
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id, title, description, image_url, video_url, category, author, published_at
    FROM news 
    WHERE category = category_param 
    ORDER BY published_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function for pagination
CREATE OR REPLACE FUNCTION get_news_paginated(
    category_param TEXT DEFAULT NULL,
    limit_param INTEGER DEFAULT 10,
    offset_param INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    category TEXT,
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id, title, description, image_url, video_url, category, author, published_at
    FROM news 
    WHERE (category_param IS NULL OR category = category_param)
    ORDER BY published_at DESC
    LIMIT limit_param
    OFFSET offset_param;
END;
$$ LANGUAGE plpgsql;

-- Add comments to tables and columns for documentation
COMMENT ON TABLE news IS 'Main table storing news articles for the application';
COMMENT ON COLUMN news.id IS 'Unique identifier for each news article';
COMMENT ON COLUMN news.title IS 'Title of the news article';
COMMENT ON COLUMN news.description IS 'Full description/content of the news article';
COMMENT ON COLUMN news.image_url IS 'URL of the news article image';
COMMENT ON COLUMN news.video_url IS 'URL of the news article video (mandatory field)';
COMMENT ON COLUMN news.category IS 'Category of the news: latest, global, sports, or tech';
COMMENT ON COLUMN news.author IS 'Author name of the news article';
COMMENT ON COLUMN news.published_at IS 'Publication date of the news article';
COMMENT ON COLUMN news.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN news.updated_at IS 'Timestamp when the record was last updated';

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Grant read permissions for anonymous users (if needed for public access)
-- GRANT SELECT ON news TO anon;
-- GRANT SELECT ON latest_news TO anon;
-- GRANT SELECT ON global_news TO anon;
-- GRANT SELECT ON sports_news TO anon;
-- GRANT SELECT ON tech_news TO anon;

CREATE POLICY "Allow insert for anon" ON news
FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for anon" ON news
FOR UPDATE USING (true);
CREATE POLICY "Allow delete for anon" ON news
FOR DELETE USING (true);

