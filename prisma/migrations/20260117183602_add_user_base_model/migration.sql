-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UNIVERSITY', 'COMPANY', 'COLLEGE', 'DEPARTMENT', 'ADVISOR', 'STUDENT');

-- AlterTable
ALTER TABLE "College" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advisor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
