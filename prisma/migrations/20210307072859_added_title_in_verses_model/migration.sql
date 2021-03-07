-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'this a tile',
    "content" TEXT NOT NULL
);
INSERT INTO "new_Verses" ("id", "content") SELECT "id", "content" FROM "Verses";
DROP TABLE "Verses";
ALTER TABLE "new_Verses" RENAME TO "Verses";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
