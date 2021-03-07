"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "help",
    aliases: ["cmd", "cmds", "commands", "command"],
    description: "Shows Commands",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    execute(message, args) {
        // Some stuff for TS to stop giving me errors even if it is correct.
        const _client = message.client;
        const client = _client;
        const commands = client.commands;
        const commandNames = commands.map(commands => commands.name);
        const { prefix } = client;
        const imgNotFoundLink = "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";
        const helpEmbed = new discord_js_1.MessageEmbed()
            .setColor("#6600ff")
            .setAuthor(client.user?.username, client.user?.avatarURL() ?? imgNotFoundLink)
            //! Replace this with CalNatSci CDN link
            .setThumbnail(message.guild?.iconURL() ?? (client.user?.avatarURL() ?? imgNotFoundLink))
            .setTitle("Here's a list of all my commands:")
            .setDescription(`\`${commandNames.join("`, `")}\``)
            .addField("Tip:", `\nYou can send \`${prefix}help <Command Name>\` to get info on a specific command!`);
        //* Separate General commands from Role-restricted commands
        if (!args.length) {
            try {
                message.author.send(helpEmbed);
                if (message.channel.type === 'dm')
                    return;
                return message.reply('I\'ve sent you a DM with all my commands!');
            }
            catch (error) {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply(`it seems like I can't DM you! Do you have DMs disabled\nIf you do, type \`${prefix}help now.\``);
            }
        }
        if (args[0].toLowerCase() === "now")
            return message.channel.send(helpEmbed);
        const name = args[0].toLowerCase();
        const command = commands.get(name) ?? commands.find(c => c.aliases && c.aliases.includes(name));
        if (!command)
            return message.reply("that's not a valid command!");
        const checkAlias = (aliases) => (!aliases || !aliases.length) ? "No Aliases" : aliases.join("`, `");
        const checkCooldown = (cooldown) => (!cooldown || cooldown === 0) ? "None" : `${cooldown} seconds`;
        const checkUsage = (usage) => usage ? ` ${usage}` : "";
        const checkFlags = (flags) => (!flags || !flags.length) ? "No Flags" : flags.join("`, `");
        // Add flags
        const cmdInfo = new discord_js_1.MessageEmbed()
            .setColor("#3400a6")
            .setThumbnail("https://i.imgur.com/xJf6bqz.png")
            .setTitle(`Command: \`${command.name}\``)
            .setDescription(command.description)
            .addFields({ name: "Aliases:", value: `\`${checkAlias(command.aliases)}\`` }, { name: "Usage:", value: `\`${prefix}${command.name}${checkUsage(command.usage)}\`` }, 
        // {name: "Flags:", value: `\`${checkFlags(command.flags)} \``},
        { name: "Cooldown:", value: `\`${checkCooldown(command.cooldown)}\`` });
        message.channel.send(cmdInfo);
    }
};
