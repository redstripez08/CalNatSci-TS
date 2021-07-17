import { Message } from "discord.js";
import { EventHandler } from "../../typings";
import prisma from "../classes/PrismaClient";

export default {
    name: "messageDelete",
    type: "on",
    async handler(message: Message) {
        // Prevent's caching it's own deleted messages
        if (message.author?.bot) return;

        // Saves Deleted messages in a SQLite3 database for `snipe` command.
        try {
            await prisma.snipes.upsert({
                where: {
                    id: 1,
                },
                create: {
                    id: 1,
                    author: message.author?.username ?? "Unknown",
                    content: message.content ?? "Content_Not_Found",
                },
                update: {
                    author: message.author?.username ?? "Unknown",
                    content: message.content ?? "Content_Not_Found",
                },
            });
        } catch (error) {
            console.error(error);
        }
    },
} as EventHandler;
