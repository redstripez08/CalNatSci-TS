import { Command } from "../../../typings";

/**
 * Just a Command for Testing stuff
 */
export default {
    name: "test",
    aliases: ["t"],
    description: "Generic test stuff",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message, args) {
        try {
            message.channel.send(args.join(" "));
        } catch (error) {
            console.error(error);   
        }
    }
} as Command;