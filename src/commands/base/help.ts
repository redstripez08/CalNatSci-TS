import { Collection } from "discord.js";
import { Command } from "../../typings";

export default {
    name: "help",
    aliases: ["cmd", "cmds", "commands", "command"],
    description: "Shows Commands",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    execute(message, args) {        
        const { commands }: any = message.client;
        const comms: Collection<string, Command> = commands;
    }
} as Command;