-- CreateTable
CREATE TABLE "University" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "universityId" INTEGER,
    "collegeId" INTEGER,
    "departmentId" INTEGER,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
