-- backend/database/schema.sql

CREATE TABLE IF NOT EXISTS analyses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resume_filename TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    job_description TEXT NOT NULL,
    match_percentage REAL NOT NULL,
    result_json TEXT NOT NULL   -- Full AnalysisResponse as JSON
);

CREATE TABLE IF NOT EXISTS skill_taxonomy (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    skill    TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,      -- e.g., "Programming Language", "Framework", "Soft Skill"
    aliases  TEXT                -- JSON array of synonyms: ["JS", "JavaScript", "ES6"]
);

CREATE INDEX IF NOT EXISTS idx_analyses_created ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_taxonomy_skill ON skill_taxonomy(skill);
