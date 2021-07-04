/*
  Warnings:

  - You are about to drop the `TeamUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamUser" DROP CONSTRAINT "TeamUser_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamUser" DROP CONSTRAINT "TeamUser_userId_fkey";

-- DropTable
DROP TABLE "TeamUser";

-- CreateTable
CREATE TABLE "TeamUserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT E'MEMBER',

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamUserRole" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUserRole" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
