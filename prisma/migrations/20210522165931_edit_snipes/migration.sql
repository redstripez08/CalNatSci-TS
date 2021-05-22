-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EditSnipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "author" TEXT NOT NULL DEFAULT 'Placeholder Author',
    "content" TEXT NOT NULL DEFAULT 'Placeholder Content'
);
INSERT INTO "new_EditSnipes" ("id", "author", "content") SELECT "id", "author", "content" FROM "EditSnipes";
DROP TABLE "EditSnipes";
ALTER TABLE "new_EditSnipes" RENAME TO "EditSnipes";
CREATE TABLE "new_Snipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL DEFAULT 'Placeholder Author',
    "content" TEXT NOT NULL DEFAULT 'Placeholder Content'
);
INSERT INTO "new_Snipes" ("id", "author", "content") SELECT "id", "author", "content" FROM "Snipes";
DROP TABLE "Snipes";
ALTER TABLE "new_Snipes" RENAME TO "Snipes";
CREATE TABLE "new_Verses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Placeholder Title',
    "content" TEXT NOT NULL DEFAULT 'Placeholder Content'
);
INSERT INTO "new_Verses" ("id", "title", "content") SELECT "id", "title", "content" FROM "Verses";
DROP TABLE "Verses";
ALTER TABLE "new_Verses" RENAME TO "Verses";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
