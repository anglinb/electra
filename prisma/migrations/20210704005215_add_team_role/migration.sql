-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "TeamUser" ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT E'MEMBER';
