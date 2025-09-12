-- Add phoneNumber column to TaxInformation table
ALTER TABLE "TaxInformation" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT NOT NULL DEFAULT '';

-- Update the column to remove the default after all existing records have a value
-- This is needed for the @default("") in the Prisma schema
UPDATE "TaxInformation" SET "phoneNumber" = '' WHERE "phoneNumber" IS NULL;