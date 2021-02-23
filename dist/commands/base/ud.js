"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
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
            const link = new classes_1.Link("");
        }
        catch (error) {
        }
    }
};
