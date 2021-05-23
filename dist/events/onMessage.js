"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Client_1 = __importDefault(require("../classes/Client"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commands = Client_1.default.commands = new discord_js_1.Collection();
const cooldowns = new discord_js_1.Collection();
const base = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "../commands/base/")).filter(file => file.endsWith(".js"));
for (const commandFile of base) {
    const command = require(`../commands/base/${commandFile}`).default;
    commands.set(command.name, command);
}
exports.default = {
    name: "message",
    type: "on",
    async handler(_, message) {
        if (message.author?.bot || !message.content.slice(0, Client_1.default.prefix.length).toLowerCase().startsWith(Client_1.default.prefix))
            return;
        const args = message.content.slice(Client_1.default.prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        // Occurs if only prefix is typed without a command.
        if (!commandName) {
            return message.channel.send(`You need to supply a command, not just the prefix dummy.\nTry \`${Client_1.default.prefix}help\``);
        }
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));
        if (!command)
            return;
        // Checks if command works only for Servers
        if (command.guildOnly && message.channel.type !== "text") {
            return message.reply(`\`${Client_1.default.prefix}${command.name}\` only works for servers.`);
        }
        // Checks if arguments are required and returns when args are required and none are found,
        if (command.argsRequired && !args.length) {
            const reply = `**Args required!**${command.usage ? `\nUsage: \`${Client_1.default.prefix}${commandName} ${command.usage}\`` : ""}`;
            return message.channel.send(reply);
        }
        // Sets cooldown for each command
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new discord_js_1.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (!timestamps)
            return console.error("Timestamps not found for some reason despite being set in lines 81-83");
        if (timestamps.has(message.author.id)) {
            const expirationTime = (timestamps.get(message.author.id) ?? 0) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const text = `Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the \`${command.name}\` command.`;
                return message.channel.send(text);
            }
        }
        // Executes the Command
        try {
            command.execute(message, args);
            // Set Cooldown.
            // If cooldown is 0, it will not set since it is instantaneous. I think this makes it less expensive to run though I may be wrong
            if (cooldownAmount !== 0) {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        }
        catch (error) {
            console.error(error);
            message.channel.send(`There was an error executing the command!\n\`${error}\``);
        }
    }
};
