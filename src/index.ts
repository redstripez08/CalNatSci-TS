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
const cooldowns = new Discord.Collection<string, Discord.Collection<string, number>>();
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
            // Connect to Prisma Database
            await prisma.$connect();
            console.log("[Prisma 2 | SQLite3] Connected to Database.db");
        } catch (error) {
            if (checkNodeEnv("production")) throw new Error(error); 
            console.error(error);
        }

        // Execute Ready Commands
        for (const command of readyCommands.values()) {
            command.execute(client);
        }

        client.user?.setActivity({name: `${client.prefix}help`, type: "LISTENING"});
        console.log(`${client.user?.username} Activated.`);
    });


    client.on("message", message => {
        if (!message.content.toLowerCase().startsWith(client.prefix) || message.author?.bot) return;
        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();

        // Occurs if only prefix is typed without a command.
        if (!commandName) {
            return message.channel.send(`You need to supply a command, not just the prefix dummy.\nTry \`${client.prefix}help\``);
        }

        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));
        if (!command) return;

        // Checks if command works only for Servers
        if (command.guildOnly && message.channel.type !== "text") {
            return message.reply(`\`${client.prefix}${command.name}\` only works for servers.`);
        }

        // Checks if arguments are required and returns when args are required and none are found,
        if (command.argsRequired && !args.length) {
            const reply = `**Args required!**${command.usage ? `\nUsage: \`${client.prefix}${commandName} ${command.usage}\`` : ""}`;
            return message.channel.send(reply);
        }

        // Sets cooldown for each command
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection()); 
        }
    
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (!timestamps) return console.error("Timestamps not found for some reason despite being set in lines 81-83");
    
        if (timestamps.has(message.author.id)) {
            const expirationTime = (timestamps.get(message.author.id) ?? 0) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const text = `Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the \`${command.name}\` command.`;
                return message.channel.send(text);
            }
        }
        
        try {
            command.execute(message, args);
            // Set Cooldown.
            // If cooldown is 0, it will not set since it is instantaneous. I think this makes it less expensive to run though I may be wrong
            if (cooldownAmount !== 0) {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error executing the command!\n\`${error}\``);
        }
    });


    client.on("messageDelete", async message => {
        // Prevent's caching it's own deleted messages
        if (message.author?.bot) return;
        
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
