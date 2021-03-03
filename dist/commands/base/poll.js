"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "poll",
    aliases: [],
    description: "Creates a poll.",
    usage: "<poll title>;<option 1>|<option 2>;<timeout in seconds>",
    cooldown: 5,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        const argsArr = args.join(" ").split(";");
        const options = argsArr[1].trim().split("|").map(s => s.trim());
        if (!argsArr[0])
            return message.reply('Poll title is not given.');
        if (!options)
            return message.reply('Poll options are not given.');
        if (options.length < 2)
            return message.reply('Please provide more than one choice.');
        if (options.length > 10)
            return message.reply(`Please provide 10 or less choices.`);
        if (typeof argsArr[2] !== "number")
            return message.reply("timeout is not a number");
    }
};
