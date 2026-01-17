-- Quick migration script to remove duplicate fields
-- Run this directly in your database if you have access

-- Remove name, email, password from Student table
DROP INDEX IF EXISTS "Student_email_key";
ALTER TABLE "Student" DROP COLUMN IF EXISTS "name";
ALTER TABLE "Student" DROP COLUMN IF EXISTS "email";
ALTER TABLE "Student" DROP COLUMN IF EXISTS "password";

-- Remove name from other entity tables (only if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'University') THEN
        ALTER TABLE "University" DROP COLUMN IF EXISTS "name";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'College') THEN
        ALTER TABLE "College" DROP COLUMN IF EXISTS "name";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Department') THEN
        ALTER TABLE "Department" DROP COLUMN IF EXISTS "name";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Advisor') THEN
        ALTER TABLE "Advisor" DROP COLUMN IF EXISTS "name";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Company') THEN
        ALTER TABLE "Company" DROP COLUMN IF EXISTS "name";
    END IF;
END $$;
