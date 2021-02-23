import { Link } from "../../classes";
import { Command } from "../../typings";

export default {
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
            const link = new Link("");
        } catch (error) {
            
        }
    }
} as Command;