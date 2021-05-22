"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../../classes/PrismaClient"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../../utils");
exports.default = {
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
            const snipedObject = await PrismaClient_1.default.editSnipes.findFirst({
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
