"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const luxon_1 = require("luxon");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
try {
    // Connect to Prisma Database
    prisma.$connect();
    console.log(`[${luxon_1.DateTime.fromJSDate(new Date()).toISO()}] [Prisma 2 | SQLite3] Connected to Database`);
}
catch (error) {
    if (utils_1.checkNodeEnv("production"))
        throw new Error(error);
    console.error(error);
}
exports.default = prisma;
