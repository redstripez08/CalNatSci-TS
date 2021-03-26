"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const discord_js_1 = require("discord.js");
const utils_1 = require("../../utils");
const prisma = new client_1.PrismaClient();
exports.default = {
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
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(snipedObject?.author)
                .setDescription(snipedObject?.content)
                .setColor(utils_1.randomHex());
            message.channel.send(embed);
        }
        catch (error) {
            console.error(error);
            message.channel.send(error);
        }
    }
};
