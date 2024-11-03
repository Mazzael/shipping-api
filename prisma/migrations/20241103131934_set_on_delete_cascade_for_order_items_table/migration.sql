/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_item_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_order_id_fkey";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "OrderItems";

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "price_in_cents" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "price_in_cents" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
