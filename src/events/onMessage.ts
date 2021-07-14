import { Collection, Message } from "discord.js";
import { EventHandler, Command } from "../../typings";
import client from "../classes/Client";
import fsp from "fs/promises";
import path from "path";

client.setCommands(new Collection());
const commands = client.commands;
const cooldowns = new Collection<string, Collection<string, number>>();

(async () => {
    const base = fsp.readdir(path.resolve(__dirname, "../commands/base/"));

    for (const commandFile of await base) {
        const commandImport = await import(`../commands/base/${commandFile}`);
        const command: Command = commandImport.default;
        commands.set(command.name, command);
    }
})();

function isValidMessage(message: Message) {
    const invalidMsg =
        message.author?.bot ||
        !message.content
            .slice(0, client.prefix.length)
            .toLowerCase()
            .startsWith(client.prefix);

    if (invalidMsg) {
        return false;
    } else {
        return true;
    }
}

function parseCommand(message: Message) {
    const args = message.content
        .slice(client.prefix.length)
        .trim()
        .split(/ +/g);

    const commandName = args.shift()?.toLowerCase();

    // Occurs if only prefix is typed without a command.
    if (!commandName) {
        const msg =
            "You need to supply a command, not just the prefix dummy." +
            `\nTry \`${client.prefix}help\``;

        message.channel.send(msg);
        return false;
    }

    const command =
        commands.get(commandName) ||
        commands.find(cmd => cmd.aliases.includes(commandName));

    if (!command) return false;

    return { command, args };
}

export default {
    name: "message",
    type: "on",
    async handler(_, message: Message) {
        if (!isValidMessage(message)) {
            return;
        }

        const parsedCommand = parseCommand(message);

        if (!parsedCommand) {
            return;
        }

        const { command, args } = parsedCommand;

        // Checks if command works only for Servers
        if (command.guildOnly && message.channel.type !== "text") {
            return message.reply(
                `\`${client.prefix}${command.name}\` only works for servers.`
            );
        }

        // Checks if arguments are required and returns when args are required and none are found,
        if (command.argsRequired && !args.length) {
            const usage = command.usage
                ? `\nUsage: \`${client.prefix}${command.name} ${command.usage}\``
                : "";

            const reply = `**Args required!**${usage}`;
            return message.channel.send(reply);
        }

        // cooldownHandler(message, command);

        // Sets cooldown for each command
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection<string, number>());
        }

        const now = Date.now();
        // Records the time command was called
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;

        if (!timestamps) {
            throw new Error("Timestamps not found for some reason");
        }

        if (timestamps.has(message.author.id)) {
            const expirationTime =
                (timestamps.get(message.author.id) ?? 0) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const timeLeftToFixed = timeLeft.toFixed(1);
                const text = `Please wait **${timeLeftToFixed}** more second(s) before reusing 
                the \`${command.name}\` command.`;

                return message.channel.send(text);
            }
        }

        // Executes the Command
        try {
            command.execute(message, args);
            // Set Cooldown.
            // If cooldown is 0, it will not set since it is instantaneous.
            // I think this makes it less expensive to run though I may be wrong
            if (cooldownAmount !== 0) {
                timestamps.set(message.author.id, now);
                setTimeout(
                    () => timestamps.delete(message.author.id),
                    cooldownAmount
                );
            }
        } catch (error) {
            console.error(error);
            message.channel.send(
                `There was an error executing the command!\n\`${error}\``
            );
        }
    },
} as EventHandler;
