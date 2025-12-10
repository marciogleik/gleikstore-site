-- CreateTable
CREATE TABLE "warranty_templates" (
    "id" TEXT NOT NULL,
    "imei" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "warrantyEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warranty_templates_imei_key" ON "warranty_templates"("imei");
