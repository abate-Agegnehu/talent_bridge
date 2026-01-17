-- Remove duplicate fields from entity models
-- These fields are now only in the User model

-- Remove name, email, password from Student table
-- First drop the unique constraint on email if it exists
DROP INDEX IF EXISTS "Student_email_key";

-- Drop the columns (PostgreSQL will handle NOT NULL constraints automatically when dropping)
ALTER TABLE "Student" DROP COLUMN IF EXISTS "name";
ALTER TABLE "Student" DROP COLUMN IF EXISTS "email";
ALTER TABLE "Student" DROP COLUMN IF EXISTS "password";

-- Remove name from University table
ALTER TABLE "University" DROP COLUMN IF EXISTS "name";

-- Remove name from College table
ALTER TABLE "College" DROP COLUMN IF EXISTS "name";

-- Remove name from Department table
ALTER TABLE "Department" DROP COLUMN IF EXISTS "name";

-- Remove name from Advisor table
ALTER TABLE "Advisor" DROP COLUMN IF EXISTS "name";

-- Remove name from Company table (if it exists)
ALTER TABLE "Company" DROP COLUMN IF EXISTS "name";

-- Make userId required on all tables (set default for existing NULL values first)
-- Note: You may need to update existing records with NULL userId before making it required

-- For University: Update NULL userId values (you'll need to create Users for these first)
-- UPDATE "University" SET "userId" = ... WHERE "userId" IS NULL;
-- ALTER TABLE "University" ALTER COLUMN "userId" SET NOT NULL;

-- For College: Update NULL userId values
-- UPDATE "College" SET "userId" = ... WHERE "userId" IS NULL;
-- ALTER TABLE "College" ALTER COLUMN "userId" SET NOT NULL;

-- For Department: Update NULL userId values
-- UPDATE "Department" SET "userId" = ... WHERE "userId" IS NULL;
-- ALTER TABLE "Department" ALTER COLUMN "userId" SET NOT NULL;

-- For Student: Update NULL userId values
-- UPDATE "Student" SET "userId" = ... WHERE "userId" IS NULL;
-- ALTER TABLE "Student" ALTER COLUMN "userId" SET NOT NULL;
