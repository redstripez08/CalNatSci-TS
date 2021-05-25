"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const classes_1 = require("../../classes");
const utils_1 = require("../../utils");
const link = new classes_1.Link("/api/breeds/image/random/", "https://dog.ceo/", {
    headers: {
        accept: "application/json"
    }
});
exports.default = {
    name: "dog",
    aliases: [],
    description: "Sends dog picture",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const { data } = await link.get();
            const embed = new discord_js_1.MessageEmbed()
                .setImage(data.message)
                .setColor(utils_1.randomHex());
            message.channel.send(embed);
        }
        catch (error) {
            if (error.isAxiosError) {
                return utils_1.axiosErrorHandler(message, error);
            }
        }
    }
};
