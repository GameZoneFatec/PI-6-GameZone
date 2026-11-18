-- CreateTable
CREATE TABLE "public"."Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "released" DATE,
    "metacritic" INTEGER,
    "developers" TEXT[],
    "publishers" TEXT[],
    "genres" TEXT[],
    "platforms" TEXT[],
    "cover_image" TEXT,
    "screenshots" TEXT[],
    "website" TEXT,
    "steam_appid" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "public"."Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Game_steam_appid_key" ON "public"."Game"("steam_appid");

-- CreateIndex
CREATE INDEX "Game_name_idx" ON "public"."Game"("name");

-- Análises e bibliotecas antigas apontavam para ids da RAWG, que não existem no
-- catálogo próprio. São só dados de demonstração (recriados por npm run seed:demo).
DELETE FROM "public"."Review";
DELETE FROM "public"."UserGame";

-- AddForeignKey
ALTER TABLE "public"."UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

