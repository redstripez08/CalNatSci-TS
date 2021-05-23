import { Command } from "../../../typings";
import prisma from "../../classes/PrismaClient";
import { MessageEmbed } from "discord.js";
import { randomHex } from "../../utils";

export default {
    name: "editsnipe",
    aliases: [],
    description: "Edited Message Sniper",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const snipedObject = await prisma.editSnipes.findFirst({
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