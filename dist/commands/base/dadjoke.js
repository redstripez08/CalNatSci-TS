"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Link_1 = __importDefault(require("../../classes/Link"));
const utils_1 = require("../../utils");
const link = new Link_1.default("https://icanhazdadjoke.com/", { headers: { "Accept": "text/plain" } });
exports.default = {
    name: "dadjoke",
    aliases: ["djk", "dadjk"],
    description: "A dad joke",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const res = await axios_1.default.get(link.href, { headers: link.headers });
            message.channel.send(utils_1.charCounter(res.data, 2048, true));
        }
        catch (error) {
            if (error.isAxiosError) {
                return utils_1.axiosErrorHandler(message, error);
            }
            console.error(error);
        }
    }
};
