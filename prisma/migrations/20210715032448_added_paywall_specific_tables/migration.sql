-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('WEEKLY', 'MONTHLY', 'ANNUALLY', 'LIFETIME', 'DAILY');

-- CreateEnum
CREATE TYPE "JourneyItemType" AS ENUM ('EVENT', 'PAYWALL');

-- CreateEnum
CREATE TYPE "EventSeenType" AS ENUM ('ORDINAL', 'SINCEINSTALL');

-- CreateTable
CREATE TABLE "Paywall" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "dismissable" BOOLEAN NOT NULL,
    "impressionCount" BIGINT NOT NULL,
    "conversionCount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "paywallId" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "isDiscounted" BOOLEAN NOT NULL,
    "percentDiscounted" INTEGER NOT NULL,
    "duration" "Duration" NOT NULL,
    "impressionCount" BIGINT NOT NULL,
    "conversionCount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstSeenDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenDate" TIMESTAMP(3) NOT NULL,
    "firedCount" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "userCount" BIGINT NOT NULL,
    "userCountActive" BIGINT NOT NULL,
    "conversionCount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyEventItem" (
    "id" TEXT NOT NULL,
    "journeyOrder" INTEGER NOT NULL,
    "journeyId" TEXT NOT NULL,
    "journeyItemtype" "JourneyItemType" NOT NULL,
    "journeyItemEventType" "EventSeenType" NOT NULL,
    "eventId" TEXT NOT NULL,
    "firedCount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyPaywallItem" (
    "id" TEXT NOT NULL,
    "journeyOrder" INTEGER NOT NULL,
    "journeyId" TEXT NOT NULL,
    "journeyItemtype" "JourneyItemType" NOT NULL,
    "journeyItemEventType" "EventSeenType" NOT NULL,
    "paywallId" TEXT NOT NULL,
    "impressionCount" BIGINT NOT NULL,
    "conversionCount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "percentTotalTraffic" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "becomeActiveDate" TIMESTAMP(3) NOT NULL,
    "becomeInactiveActiveDate" TIMESTAMP(3) NOT NULL,
    "userCount" BIGINT NOT NULL,
    "userCountActive" BIGINT NOT NULL,
    "conversionCount" BIGINT NOT NULL,
    "convertWinningVariantDefaultJourney" BOOLEAN NOT NULL,
    "atStatSig" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "percentABTestTraffic" DOUBLE PRECISION NOT NULL,
    "journeyId" TEXT NOT NULL,
    "abTestId" TEXT NOT NULL,
    "userCount" BIGINT NOT NULL,
    "userCountActive" BIGINT NOT NULL,
    "conversionCount" BIGINT NOT NULL,
    "isWinner" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paywall_Project_slug_unique" ON "Paywall"("slug", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Price.projectId_cost_isDiscounted_percentDiscounted_duration_unique" ON "Price"("projectId", "cost", "isDiscounted", "percentDiscounted", "duration");

-- CreateIndex
CREATE UNIQUE INDEX "Event.projectId_eventName_unique" ON "Event"("projectId", "eventName");

-- AddForeignKey
ALTER TABLE "Paywall" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD FOREIGN KEY ("paywallId") REFERENCES "Paywall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyEventItem" ADD FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyEventItem" ADD FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPaywallItem" ADD FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyPaywallItem" ADD FOREIGN KEY ("paywallId") REFERENCES "Paywall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTest" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD FOREIGN KEY ("abTestId") REFERENCES "ABTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
