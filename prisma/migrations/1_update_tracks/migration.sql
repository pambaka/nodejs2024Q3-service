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

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistId" TEXT,
    "albumId" TEXT,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "fk_track_artist" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

