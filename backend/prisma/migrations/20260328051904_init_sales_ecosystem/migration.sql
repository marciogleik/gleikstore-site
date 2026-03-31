-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BOLETO', 'CREDIT_CARD', 'PIX', 'CASH', 'FINANCING');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "imei" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'PENDING',
    "contractUrl" TEXT,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "boletoUrl" TEXT,
    "boletoBarcode" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpf_consultas" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT,
    "score" INTEGER,
    "hasPendencies" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "pendencies" TEXT,
    "rawData" TEXT,
    "consultedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consultedBy" TEXT NOT NULL,

    CONSTRAINT "cpf_consultas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_imei_key" ON "products"("imei");

-- CreateIndex
CREATE UNIQUE INDEX "payments_saleId_key" ON "payments"("saleId");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpf_consultas" ADD CONSTRAINT "cpf_consultas_consultedBy_fkey" FOREIGN KEY ("consultedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
