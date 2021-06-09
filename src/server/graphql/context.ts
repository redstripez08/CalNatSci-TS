import { PrismaClient, Verses } from ".prisma/client";
import prisma from "../../classes/PrismaClient";

export interface Verse extends Verses {}

export type Context = {
    db: PrismaClient
}

export const context = {
    db: prisma
};