"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "ping",
    aliases: [],
    description: "Sends Ping",
    usage: null,
    cooldown: 3,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const initEmbed = new discord_js_1.MessageEmbed()
                .setColor("#fff")
                .setTitle("Calculating Ping...");
            const sentMsg = await message.channel.send(initEmbed);
            const finalEmbed = new discord_js_1.MessageEmbed()
                .setColor("#fff000")
                .setTitle(":ping_pong: **Pong!**")
                .setDescription(`Ping is **\`${sentMsg.createdTimestamp - message.createdTimestamp}ms\`**`);
            sentMsg.edit(finalEmbed);
        }
        catch (error) {
            message.channel.send("**There was an error calculating the ping!**");
        }
    }
};
