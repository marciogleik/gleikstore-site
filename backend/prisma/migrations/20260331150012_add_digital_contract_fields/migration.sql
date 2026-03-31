-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "isDigital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modelName" TEXT,
ADD COLUMN     "signature" TEXT,
ALTER COLUMN "fileUrl" DROP NOT NULL;
