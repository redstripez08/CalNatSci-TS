"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const luxon_1 = require("luxon");
const classes_1 = require("../../classes");
const utils_1 = require("../../utils");
const { TIMEZONE = "UTC" } = process.env;
function swapLinks(matches, str) {
    if (matches.length) {
        for (const link of matches) {
            // Removes brackets surrounding word
            const linkWord = link.slice(1, -1);
            const regex = new RegExp(`\\[${linkWord}\\]`);
            const embedLink = `[${linkWord}](https://www.urbandictionary.com/define.php?term=${linkWord.replace(/ +/g, "%20")})`;
            str = str.replace(regex, embedLink);
        }
    }
    return str;
}
exports.default = {
    name: "ud",
    aliases: ["urbandict", "udict"],
    description: "Gets definition of term from Urban Dictionary",
    usage: "<Search Term>",
    cooldown: 3,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new classes_1.Link("https://api.urbandictionary.com/v0/define", {
                querystring: { term: args.join(" ") },
                headers: { "Accept": "application/json" }
            });
            const { data } = await axios_1.default.get(link.href, { headers: link.headers });
            if (!data.list.length)
                return message.channel.send("No Results Found!");
            // TODO create flags for getting specific ranking of definiton
            // const flags = args.filter(str => /(-[A-Z]|--\b[A-Z]{0,20}\b)+/gi.test(str));
            // const ahh = flags.find(flag => /-r=.{0,2}/);
            // console.log(flags);
            // console.log(ahh);
            const res = data.list[0];
            const date = luxon_1.DateTime.fromISO(res.written_on).setZone(TIMEZONE).toFormat("yyyy LLL dd, t ZZZZ");
            const ud_links = /\[(\w| |\d){0,}\]/gi;
            const linkMatches = res.definition.match(ud_links) || [];
            const exLinkMatches = res.example.match(ud_links) || [];
            const definition = swapLinks(linkMatches, res.definition);
            const example = swapLinks(exLinkMatches, res.example);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(res.word)
                .setURL(res.permalink)
                .setAuthor("Author: " + res.author)
                .setColor(utils_1.randomHex())
                .setDescription(utils_1.charCounter(definition, 2048, true))
                .addField("Example", utils_1.charCounter(example, 1024, true) || "No Example")
                .setFooter(`${res.thumbs_up} 👍\t${res.thumbs_down} 👎\nWritten on: ${date}`);
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
