"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keyv_1 = __importDefault(require("keyv"));
const discord_js_1 = require("discord.js");
const { MONGODB_ROLES_URL } = process.env;
if (!MONGODB_ROLES_URL)
    throw new Error("MongoDB Role URL not found!");
const keyv = new keyv_1.default(MONGODB_ROLES_URL);
exports.default = {
    name: "reactRoles",
    async execute(client) {
        try {
            const roles = await keyv.get("Roles");
            const srv = await keyv.get("CalNatSRV");
            const guild = client.guilds.cache.get("711606963246596167");
            const channel = client.channels.cache.get("816903529226698783");
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#fff")
                .setTitle("React to get Section Role")
                .setDescription("**:regional_indicator_a: : `Andromeda`**\n\n" +
                "**:regional_indicator_c: : `Cassisopeia`**\n\n" +
                "**:regional_indicator_o: : `Orion`**\n\n" +
                "**:regional_indicator_p: : `Perseus`**\n\n" +
                "**:regional_indicator_s: : `Spectator (Other)`**\n\n" +
                "**:x: : `Remove Section Role`**");
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
