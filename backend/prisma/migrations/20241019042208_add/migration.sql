-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "artist" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
