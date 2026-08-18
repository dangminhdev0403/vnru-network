-- CreateEnum
CREATE TYPE "AuthenticationLevel" AS ENUM ('PASSWORD', 'MFA');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN "authenticationLevel" "AuthenticationLevel" NOT NULL DEFAULT 'PASSWORD';
