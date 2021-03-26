import { PrismaClient } from "@prisma/client";
import { checkNodeEnv } from "../utils";

const prisma = new PrismaClient();

try {
    // Connect to Prisma Database
    prisma.$connect();
    console.log("[Prisma 2 | SQLite3] Connected to Database.db");
} catch (error) {
    if (checkNodeEnv("production")) throw new Error(error); 
    console.error(error);
}


export default prisma;