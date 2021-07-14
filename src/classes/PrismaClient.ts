import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { checkNodeEnv } from "../utils";

const prisma = new PrismaClient();

try {
    // Connect to Prisma Database
    prisma.$connect();
    const timeConnected = DateTime.fromJSDate(new Date()).toISO();

    console.log(
        `[${timeConnected}] [Prisma 2 | SQLite3] Connected to Database`
    );
} catch (error) {
    if (checkNodeEnv("production")) throw new Error(error);
    console.error(error);
}

export default prisma;
