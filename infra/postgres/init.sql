-- Create additional databases for service isolation (dev environment)
-- Primary database 'sfms_applications' is created by POSTGRES_DB env var

-- Extensions needed by the application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant connect on the primary database
GRANT ALL PRIVILEGES ON DATABASE sfms_applications TO sfms_admin;