"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DISCORD_GUILD_ID, DISCORD_REACTROLES_ID } = process.env;
exports.default = {
    name: "reactRoles",
    async execute(client) {
        if (!DISCORD_GUILD_ID || !DISCORD_REACTROLES_ID)
            return console.error("Environment Variables not found!");
        const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
        const channel = client.channels.cache.get(DISCORD_REACTROLES_ID);
    }
};
