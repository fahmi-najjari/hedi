-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "lowStockThreshold" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "stockQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_stockQuantity_idx" ON "Product"("stockQuantity");
