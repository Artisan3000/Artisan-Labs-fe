-- Initial, additive schema for the separate Artisan-owned onboarding database.
CREATE TYPE "EmploymentClassification" AS ENUM ('W2', 'CONTRACTOR_1099');
CREATE TYPE "Applicability" AS ENUM ('ALL', 'W2', 'CONTRACTOR_1099');
CREATE TYPE "ResourceDocumentType" AS ENUM ('BLOB', 'EXTERNAL_LINK');
CREATE TYPE "ResourceKind" AS ENUM ('REFERENCE', 'FORM');

CREATE TABLE "OnboardingProfile" (
  "id" TEXT NOT NULL, "academyUserId" TEXT NOT NULL, "displayName" TEXT NOT NULL, "email" TEXT NOT NULL,
  "employmentClassification" "EmploymentClassification", "startDate" DATE,
  "trainingAccess" BOOLEAN NOT NULL DEFAULT false, "assistantStylistEligible" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "OnboardingProfile_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ChecklistGroup" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "subtitle" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChecklistGroup_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ChecklistItem" (
  "id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "slug" TEXT NOT NULL, "label" TEXT NOT NULL,
  "applicability" "Applicability" NOT NULL DEFAULT 'ALL', "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ChecklistCompletion" (
  "profileId" TEXT NOT NULL, "itemId" TEXT NOT NULL, "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ChecklistCompletion_pkey" PRIMARY KEY ("profileId", "itemId")
);
CREATE TABLE "Meeting" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL, "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "applicability" "Applicability" NOT NULL DEFAULT 'ALL', "requiresAssistantStylist" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MeetingAssignment" (
  "id" TEXT NOT NULL, "profileId" TEXT NOT NULL, "meetingId" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3), "hostDisplayName" TEXT, "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MeetingAssignment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ResourceCategory" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "articleContent" JSONB,
  "applicability" "Applicability" NOT NULL DEFAULT 'ALL', "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ResourceCategory_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ResourceDocument" (
  "id" TEXT NOT NULL, "categoryId" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL,
  "description" TEXT, "type" "ResourceDocumentType" NOT NULL, "kind" "ResourceKind" NOT NULL DEFAULT 'REFERENCE',
  "blobUrl" TEXT, "blobPathname" TEXT, "fileName" TEXT, "externalUrl" TEXT, "mimeType" TEXT,
  "isRequired" BOOLEAN NOT NULL DEFAULT false, "version" INTEGER NOT NULL DEFAULT 1,
  "sortOrder" INTEGER NOT NULL DEFAULT 0, "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "archivedAt" TIMESTAMP(3), "requiredSubmissionVersion" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResourceDocument_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ResourceProgress" (
  "profileId" TEXT NOT NULL, "documentId" TEXT NOT NULL, "firstOpenedAt" TIMESTAMP(3),
  "lastOpenedAt" TIMESTAMP(3), "completedAt" TIMESTAMP(3), "completedVersion" INTEGER,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ResourceProgress_pkey" PRIMARY KEY ("profileId", "documentId")
);
CREATE TABLE "ResourceSubmission" (
  "profileId" TEXT NOT NULL, "documentId" TEXT NOT NULL, "blobUrl" TEXT NOT NULL,
  "blobPathname" TEXT NOT NULL, "fileName" TEXT NOT NULL, "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
  "sizeBytes" INTEGER NOT NULL, "documentVersion" INTEGER NOT NULL,
  "uploadIssuedAt" TIMESTAMP(3) NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResourceSubmission_pkey" PRIMARY KEY ("profileId", "documentId")
);

CREATE UNIQUE INDEX "OnboardingProfile_academyUserId_key" ON "OnboardingProfile"("academyUserId");
CREATE INDEX "OnboardingProfile_isActive_displayName_idx" ON "OnboardingProfile"("isActive", "displayName");
CREATE UNIQUE INDEX "ChecklistGroup_slug_key" ON "ChecklistGroup"("slug");
CREATE INDEX "ChecklistGroup_isActive_sortOrder_idx" ON "ChecklistGroup"("isActive", "sortOrder");
CREATE UNIQUE INDEX "ChecklistItem_slug_key" ON "ChecklistItem"("slug");
CREATE INDEX "ChecklistItem_groupId_isActive_sortOrder_idx" ON "ChecklistItem"("groupId", "isActive", "sortOrder");
CREATE INDEX "ChecklistItem_applicability_isActive_idx" ON "ChecklistItem"("applicability", "isActive");
CREATE INDEX "ChecklistCompletion_itemId_idx" ON "ChecklistCompletion"("itemId");
CREATE UNIQUE INDEX "Meeting_slug_key" ON "Meeting"("slug");
CREATE INDEX "Meeting_isActive_sortOrder_idx" ON "Meeting"("isActive", "sortOrder");
CREATE INDEX "Meeting_applicability_isActive_idx" ON "Meeting"("applicability", "isActive");
CREATE UNIQUE INDEX "MeetingAssignment_profileId_meetingId_key" ON "MeetingAssignment"("profileId", "meetingId");
CREATE INDEX "MeetingAssignment_meetingId_idx" ON "MeetingAssignment"("meetingId");
CREATE UNIQUE INDEX "ResourceCategory_slug_key" ON "ResourceCategory"("slug");
CREATE INDEX "ResourceCategory_isPublished_sortOrder_idx" ON "ResourceCategory"("isPublished", "sortOrder");
CREATE INDEX "ResourceCategory_applicability_isPublished_idx" ON "ResourceCategory"("applicability", "isPublished");
CREATE UNIQUE INDEX "ResourceDocument_slug_key" ON "ResourceDocument"("slug");
CREATE UNIQUE INDEX "ResourceDocument_blobUrl_key" ON "ResourceDocument"("blobUrl");
CREATE UNIQUE INDEX "ResourceDocument_blobPathname_key" ON "ResourceDocument"("blobPathname");
CREATE INDEX "ResourceDocument_categoryId_isPublished_sortOrder_idx" ON "ResourceDocument"("categoryId", "isPublished", "sortOrder");
CREATE INDEX "ResourceProgress_documentId_idx" ON "ResourceProgress"("documentId");
CREATE UNIQUE INDEX "ResourceSubmission_blobUrl_key" ON "ResourceSubmission"("blobUrl");
CREATE UNIQUE INDEX "ResourceSubmission_blobPathname_key" ON "ResourceSubmission"("blobPathname");
CREATE INDEX "ResourceSubmission_documentId_idx" ON "ResourceSubmission"("documentId");

ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ChecklistGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChecklistCompletion" ADD CONSTRAINT "ChecklistCompletion_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "OnboardingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChecklistCompletion" ADD CONSTRAINT "ChecklistCompletion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ChecklistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MeetingAssignment" ADD CONSTRAINT "MeetingAssignment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "OnboardingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MeetingAssignment" ADD CONSTRAINT "MeetingAssignment_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceDocument" ADD CONSTRAINT "ResourceDocument_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ResourceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceProgress" ADD CONSTRAINT "ResourceProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "OnboardingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceProgress" ADD CONSTRAINT "ResourceProgress_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ResourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceSubmission" ADD CONSTRAINT "ResourceSubmission_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "OnboardingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceSubmission" ADD CONSTRAINT "ResourceSubmission_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ResourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_durationMinutes_check" CHECK ("durationMinutes" > 0);
ALTER TABLE "ResourceDocument" ADD CONSTRAINT "ResourceDocument_version_check" CHECK ("version" > 0 AND "requiredSubmissionVersion" > 0);
ALTER TABLE "ResourceDocument" ADD CONSTRAINT "ResourceDocument_target_check" CHECK (
  "archivedAt" IS NOT NULL OR ("type" = 'BLOB' AND "isPublished" = false AND "blobUrl" IS NULL) OR
  ("type" = 'BLOB' AND "blobUrl" IS NOT NULL AND "blobPathname" IS NOT NULL AND "fileName" IS NOT NULL AND "externalUrl" IS NULL) OR
  ("type" = 'EXTERNAL_LINK' AND "externalUrl" IS NOT NULL AND "blobUrl" IS NULL AND "blobPathname" IS NULL AND "fileName" IS NULL)
);
ALTER TABLE "ResourceDocument" ADD CONSTRAINT "ResourceDocument_form_check" CHECK ("kind" = 'REFERENCE' OR "type" = 'BLOB');
ALTER TABLE "ResourceProgress" ADD CONSTRAINT "ResourceProgress_completion_check" CHECK (
  ("completedAt" IS NULL AND "completedVersion" IS NULL) OR ("completedAt" IS NOT NULL AND "completedVersion" IS NOT NULL)
);
ALTER TABLE "ResourceSubmission" ADD CONSTRAINT "ResourceSubmission_size_check" CHECK ("sizeBytes" > 0 AND "sizeBytes" <= 20971520 AND "documentVersion" > 0);
