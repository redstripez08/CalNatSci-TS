import * as Discord from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { Command, ReadyCommand } from "./typings";
import { Client } from "./classes";
import prisma from "./classes/PrismaClient";
import { checkNodeEnv } from "./utils";

const client = new Client({
    ws: {intents: Discord.Intents.ALL}
});

const commands = client.commands = new Discord.Collection();
const readyCommands = new Discord.Collection<ReadyCommand["name"], ReadyCommand>();
client.prefix = process.env.PREFIX ?? "t!";

(async() => {
    // Get and Cache Command Files
    const commandFiles = {
        base: (await fs.promises.readdir(path.resolve(__dirname, "./commands/base/"))).filter(file => /\.js$|\.ts$/.test(file)),
        ready: (await fs.promises.readdir(path.resolve(__dirname, "./commands/ready/"))).filter(file => /\.js$|\.ts$/.test(file)),
    };
    
    for (const commandFile of commandFiles.base) {
        const command: Command = require(`./commands/base/${commandFile}`).default;
        commands.set(command.name, command);
    }

    for (const commandFile of commandFiles.ready) {
        const command: ReadyCommand = require(`./commands/ready/${commandFile}`).default;
        readyCommands.set(command.name, command);
    }
    
    
    client.on("ready", async () => {
        try {
            await prisma.$connect();
            console.log("[Prisma 2 | SQLite3] Connected to Snipe.db");
        } catch (error) {
            if (checkNodeEnv("production")) throw new Error(error); 
            console.error(error);
        }

        for (const command of readyCommands.values()) {
            command.execute(client);
        }

        console.log(`${client.user?.username} Activated.`);
    });


    client.on("message", message => {
        if (!message.content.toLowerCase().startsWith(client.prefix) || message.author.bot) return;
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
            message.channel.send(`There was an error executing the command!\n\`${error}\``);
        }
    });


    client.on("messageDelete", async message => {
        // Saves Deleted messages in a SQLite3 database for `snipe` command.
        try {
            await prisma.snipes.update({
                where: {
                    id: 1
                },
                data: {
                    author: message.author?.username ?? "Unknown",
                    content: message.content ?? "Content_Not_Found"
                }
            });  
        } catch (error) {
            console.error(error);
        }
    });

    try {
        await client.login();
    } catch (error) {
        throw new Error(error);
    }
})();
