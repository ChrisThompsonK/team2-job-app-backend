-- Migration superseded by 00_slow_gamma_corps.sql
-- This migration was originally intended to rename application_submissions to job_applications
-- However, the initial migration now creates the correct table structure from the start
-- Keeping this file for migration history but no operations needed

-- No-op migration: Create and drop a temporary table to satisfy Drizzle's migration requirements
CREATE TABLE IF NOT EXISTS _drizzle_migration_0001 (id INTEGER PRIMARY KEY);
DROP TABLE IF EXISTS _drizzle_migration_0001;