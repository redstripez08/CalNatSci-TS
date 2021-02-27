import * as Discord from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { Command } from "./typings";

class Client extends Discord.Client {
    commands!: Discord.Collection<Command["name"], Command>;
    prefix!: string;
}

const client = new Client({ws:{intents: Discord.Intents.ALL}});
const commands = client.commands = new Discord.Collection();
client.prefix = process.env.PREFIX ?? "t!";

(async() => {
    const commandFiles = {
        base: (await fs.promises.readdir(path.resolve(__dirname, "./commands/base/"))).filter(file => /\.js$|\.ts$/.test(file)),
        ready: (await fs.promises.readdir(path.resolve(__dirname, "./commands/ready/"))).filter(file => /\.js$|\.ts$/.test(file)),
    };

    for (const commandFile of commandFiles.base) {
        const command: Command = require(`./commands/base/${commandFile}`).default;
        commands.set(command.name, command);
    }

    for (const commandFile of commandFiles.ready) {
        const command = require(`./commands/ready/${commandFile}`).default;
        command.execute();
    }

    client.on("ready", () => {
        console.log(`${client.user?.username} Activated.`);
        
    });

    client.on("message", message => {
        if (!message.content.startsWith(client.prefix) || message.author.bot) return;
        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;
    
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.argsRequired && !args.length) {
            const reply = `**Args required!**${command.usage ? `\nUsage: \`${client.prefix}${commandName} ${command.usage}\`` : ""}`;
            return message.channel.send(reply);
        }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an Error!\n${error}`);
        }
    });

    client.login();
})();
