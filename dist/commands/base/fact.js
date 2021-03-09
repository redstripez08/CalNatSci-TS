"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const classes_1 = require("../../classes");
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const link = new classes_1.Link("/random.json", "https://uselessfacts.jsph.pl/", {
    querystring: { language: "en" },
    headers: { "Accept": "applicaton/json" },
});
exports.default = {
    name: "fact",
    aliases: ["facts"],
    description: "Grabs a random fact from the internet",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const { data } = await axios_1.default.get(link.href, { headers: link.headers });
            const embed = new discord_js_1.MessageEmbed()
                .setTitle("Random Fact")
                .setColor(utils_1.randomHex())
                .setURL(data.permalink)
                .setDescription(utils_1.charCounter(data.text, 2048, true))
                .setFooter(`Source: ${data.source}`);
            message.channel.send(embed);
        }
        catch (error) {
            if (error.isAxiosError) {
                return utils_1.axiosErrorHandler(message, error);
            }
            console.error(error);
        }
    }
};
