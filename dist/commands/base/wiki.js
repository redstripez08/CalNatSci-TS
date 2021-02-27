"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const classes_1 = require("../../classes");
const utils_1 = require("../../utils");
exports.default = {
    name: "wiki",
    aliases: ["wikipedia"],
    description: "Urban Dictionary",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new classes_1.Link("https://en.wikipedia.org/w/api.php", {
                method: "GET",
                querystring: {
                    action: "query",
                    titles: args.join(" "),
                    prop: "extracts",
                    exintro: true,
                    explaintext: true,
                    format: "json"
                },
                headers: {
                    "accept": "application/json"
                }
            });
            const { data } = await axios_1.default.get(link.href, { headers: link.headers });
            const { query } = data;
            for (const id in query.pages) {
                if (Object.prototype.hasOwnProperty.call(query.pages, id)) {
                    const wikiPage = query.pages[id];
                    if (!wikiPage.extract)
                        return message.channel.send("Not Found!\nTry being more specific.");
                    const embed = new discord_js_1.MessageEmbed()
                        .setTitle(wikiPage.title)
                        .setColor(utils_1.randomHex())
                        .setDescription(utils_1.charCounter(wikiPage.extract, 2048, true))
                        .setFooter("Wikipedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Wikipedia-logo-en-big.png/490px-Wikipedia-logo-en-big.png");
                    message.channel.send(embed);
                }
            }
        }
        catch (error) {
            utils_1.axiosErrorHandler(message, error);
        }
    }
};
