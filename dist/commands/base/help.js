"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "help",
    aliases: ["cmd", "cmds", "commands", "command"],
    description: "Shows Commands",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    execute(message, args) {
        const { commands } = message.client;
        const comms = commands;
    }
};
