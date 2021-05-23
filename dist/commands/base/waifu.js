"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const utils_1 = require("../../utils");
const discord_js_1 = require("discord.js");
exports.default = {
    name: "waifu",
    aliases: [],
    description: "Gets a random waifu pic. Uses https://waifu.pics API. Find more categories there.",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new classes_1.Link(`/api/sfw/${args[0] ? args[0].toLowerCase() : "waifu"}`, "https://waifu.pics", {
                headers: {
                    "Accept": "application/json"
                }
            });
            const res = await link.get();
            const embed = new discord_js_1.MessageEmbed()
                .setImage(res.data.url)
                .setColor(utils_1.randomHex());
            message.channel.send(embed);
        }
        catch (error) {
            if (error.isAxiosError) {
                if (error.response.status === 404) {
                    return message.channel.send(`There was an error!\n\`${error.response.status} || ${error.response.statusText}\n${JSON.stringify(error.response.data)}\``);
                }
                return utils_1.axiosErrorHandler(message, error);
            }
            console.error(error);
        }
    }
};
