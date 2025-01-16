/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Petshop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Petshop_cnpj_key" ON "Petshop"("cnpj");
