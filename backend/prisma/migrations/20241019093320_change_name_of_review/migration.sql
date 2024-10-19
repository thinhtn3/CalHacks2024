/*
  Warnings:

  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "reviews";

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "artist" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);
