"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "reload",
    aliases: ["r"],
    description: "Reloads a command",
    usage: "<Command>",
    cooldown: 5,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const _client = message.client;
        const client = _client;
        const command = client.commands.get(commandName) ?? client.commands.find(cmd => cmd.aliases.includes(commandName));
        if (!command)
            return message.channel.send(`\`${commandName}\` not Found!`);
        try {
            delete require.cache[require.resolve(`./${command.name}.js`)];
            const newCommand = require(`./${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            return message.channel.send(`Command \`${command.name}\` was reloaded!`);
        }
        catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    }
};
