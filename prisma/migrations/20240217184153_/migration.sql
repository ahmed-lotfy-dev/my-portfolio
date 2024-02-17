/*
  Warnings:

  - You are about to drop the column `certDesc` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `certTitle` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `postContent` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postImageLink` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postTitle` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postsCategories` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `projCategories` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projDesc` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projImageLink` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projTitle` on the `Project` table. All the data in the column will be lost.
  - Added the required column `desc` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageLink` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageLink` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "certDesc",
DROP COLUMN "certTitle",
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "postContent",
DROP COLUMN "postImageLink",
DROP COLUMN "postTitle",
DROP COLUMN "postsCategories",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "imageLink" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "projCategories",
DROP COLUMN "projDesc",
DROP COLUMN "projImageLink",
DROP COLUMN "projTitle",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "imageLink" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
