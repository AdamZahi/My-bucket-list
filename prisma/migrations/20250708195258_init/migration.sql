/*
  Warnings:

  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_user_id_fkey";

-- DropTable
DROP TABLE "List";

-- CreateTable
CREATE TABLE "my_list" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "overview" TEXT,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not Started Yet',
    "additional_links" TEXT,
    "form" TEXT NOT NULL,
    "created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "my_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "my_list" ADD CONSTRAINT "my_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
