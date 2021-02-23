"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const Link_1 = __importDefault(require("../../classes/Link"));
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
exports.default = {
    name: "fact",
    aliases: ["facts"],
    description: "Grabs a random fact from the internet",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message, args) {
        const link = new Link_1.default("/random.json", "https://uselessfacts.jsph.pl/", {
            querystring: { language: "en" },
            headers: { "Accept": "applicaton/json" },
        });
        try {
            const res = await axios_1.default.get(link.href, { headers: link.headers });
            const embed = new discord_js_1.MessageEmbed()
                .setTitle("Random Fact")
                .setColor(utils_1.randomHex())
                .setURL(res.data.permalink)
                .setDescription(res.data.text)
                .setFooter(`Source: ${res.data.source}`);
            message.channel.send(embed);
        }
        catch (error) {
            utils_1.axiosErrorHandler(message, error);
        }
    }
};
