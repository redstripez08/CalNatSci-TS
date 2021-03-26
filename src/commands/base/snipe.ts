import { Command } from "../../typings";
import { PrismaClient } from "@prisma/client";
import { MessageEmbed } from "discord.js";
import { randomHex } from "../../utils";

const prisma = new PrismaClient();

export default {
    name: "snipe",
    aliases: [],
    description: "Deleted Message Sniper",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const snipedObject = await prisma.snipes.findFirst({
                where: {
                    id: 1
                }
            });
            
            const embed = new MessageEmbed()
                .setTitle(snipedObject?.author)
                .setDescription(snipedObject?.content)
                .setColor(randomHex());

            message.channel.send(embed);
        } catch (error) {
            console.error(error);
            message.channel.send(error);
        }
    }
} as Command;