import { MessageEmbed } from "discord.js";
import { Command } from "../../typings";

export default {
    name: "ping",
    aliases: [],
    description: "Sends Ping",
    usage: null,
    cooldown: 3,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const initEmbed = new MessageEmbed()
                .setColor("#fff")
                .setTitle("Calculating Ping...");
    
            const sentMsg = await message.channel.send(initEmbed);
            const finalEmbed = new MessageEmbed()
                .setColor("#fff000")
                .setTitle(":ping_pong: **Pong!**")
                .setDescription(`Ping is **\`${sentMsg.createdTimestamp - message.createdTimestamp}ms\`**`);
    
            sentMsg.edit(finalEmbed);
        } catch (error) {
            message.channel.send("**There was an error calculating the ping!**");
        }
    }
} as Command;