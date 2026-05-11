-- DropIndex
DROP INDEX "ProductCategory_isActive_sortOrder_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "featuredSortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "showOnHome" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "HomeContent" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "heroBadge" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroHighlight" TEXT NOT NULL,
    "heroIntro" TEXT NOT NULL,
    "heroImageUrl" TEXT,
    "heroVisualTitle" TEXT NOT NULL,
    "heroVisualText" TEXT NOT NULL,
    "categoriesEyebrow" TEXT NOT NULL,
    "categoriesTitle" TEXT NOT NULL,
    "categoriesIntro" TEXT NOT NULL,
    "productsEyebrow" TEXT NOT NULL,
    "productsTitle" TEXT NOT NULL,
    "productsIntro" TEXT NOT NULL,
    "paymentTitle" TEXT NOT NULL,
    "paymentText" TEXT NOT NULL,
    "paymentCta" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_isFeatured_featuredSortOrder_idx" ON "Product"("isFeatured", "featuredSortOrder");

-- CreateIndex
CREATE INDEX "ProductCategory_isActive_showOnHome_sortOrder_idx" ON "ProductCategory"("isActive", "showOnHome", "sortOrder");
