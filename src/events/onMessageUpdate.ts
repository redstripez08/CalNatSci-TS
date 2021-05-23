import { Message } from "discord.js";
import { EventHandler } from "../../typings";
import prisma from "../classes/PrismaClient";

export default {
    name: "messageUpdate",
    type: "on",
    async handler(_, message: Message) {
        // Prevent's caching it's own deleted messages
        if (message.author?.bot) return;

        // Saves Deleted messages in a SQLite3 database for `snipe` command.
        try {
            await prisma.editSnipes.update({
                where: {
                    id: 1
                },
                data: {
                    author: message.author?.username ?? "Unknown",
                    content: message.content ?? "Content_Not_Found"
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
} as EventHandler