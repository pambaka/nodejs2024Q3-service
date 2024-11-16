-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "login" VARCHAR(36) NOT NULL,
    "password" VARCHAR(36) NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
