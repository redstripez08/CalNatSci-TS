"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keyv_1 = __importDefault(require("keyv"));
const utils_1 = require("../../utils");
const discord_js_1 = require("discord.js");
const luxon_1 = require("luxon");
const { MONGODB_URL, OWNER_ID } = process.env;
if (!MONGODB_URL) {
    if (utils_1.checkNodeEnv("production"))
        throw new Error("MONGODB_URL is undefined");
    console.error("MONGODB_URL is undefined");
}
async function keyvWarn(message, user, mention, warnObject) {
    try {
        keyv.set(user.id, warnObject);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("Warning")
            .setColor("#ff0000")
            .setDescription(`Warning Logged.\n${mention}, You have been warned!`)
            .setFooter(warnObject.date_issued);
        const dmDesc = `You have been warned by **${message.author.tag}** (${message.author.id}) in **${message.guild?.name}**\n` +
            `\n**Reason:**\n${warnObject.reason}`;
        const dmEmbed = new discord_js_1.MessageEmbed()
            .setTitle("You Have Been Warned!")
            .setColor("#ff0000")
            .setDescription(dmDesc)
            .setFooter(warnObject.date_issued);
        message.channel.send(embed);
        try {
            return user.send(dmEmbed);
        }
        catch (error) {
            return message.channel.send(`<@!${message.author.id}> It seems I can't send you DM's!`);
        }
    }
    catch (error) {
        console.error(error);
        return message.channel.send(`There was an error logging the warning!\n\`${error}\``);
    }
}
async function keyvLog(message, user) {
    try {
        const res = await keyv.get(user.id);
        if (!res)
            return message.channel.send("This user has no warnings logged!");
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`${user.username}'s Warning History`)
            .setColor(utils_1.randomHex())
            .addField(res.date_issued, `\`Reason:\` ${res.reason}\n\`Issued by:\` ${res.issued_by_username}`);
        message.channel.send(embed);
    }
    catch (error) {
        console.error(error);
        return message.channel.send(`There was an error getting warnings!\n\`${error}\``);
    }
}
async function keyvDelete(message, user) {
    try {
        const res = await keyv.delete(user.id);
        if (res) {
            message.channel.send("Warning deleted");
        }
        else {
            message.channel.send("There is no warning to delete");
        }
    }
    catch (error) {
        console.error(error);
        return message.channel.send(`There was an error deleting the warning!\n\`${error}\``);
    }
}
const keyv = new keyv_1.default(MONGODB_URL);
exports.default = {
    name: "warn",
    aliases: ["warning"],
    description: "Warns someone. Actions are `log` and `warn`",
    usage: "<action> <@Someone> [<Reason>]",
    cooldown: 10,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        // Still WIP
        if (message.author.id !== OWNER_ID)
            return message.channel.send("no");
        const [action, mention] = args;
        const reason = args.slice(2).join(" ");
        const user = utils_1.getUserFromMention(message, mention);
        if (!action)
            return message.channel.send("An action is required!");
        if (!mention)
            return message.channel.send("You need to mention someone!");
        if (!user)
            return message.channel.send("User Cannot be found!");
        const warnObject = {
            issued_by_id: parseInt(message.author.id),
            issued_by_username: message.author.tag,
            reason,
            date_issued: luxon_1.DateTime.now().toUTC().toString()
        };
        if (action.toLowerCase() === "warn") {
            if (!reason || !reason.length)
                return message.channel.send("Reason or Description required");
            keyvWarn(message, user, mention, warnObject);
        }
        else if (action.toLowerCase() === "log") {
            keyvLog(message, user);
        }
        else if (action.toLowerCase() === "delete") {
            keyvDelete(message, user);
        }
        else {
            message.channel.send("Not a valid action!");
        }
    }
};
