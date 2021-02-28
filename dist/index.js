"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const classes_1 = require("./classes");
const client = new classes_1.Client({ ws: { intents: Discord.Intents.ALL } });
const commands = client.commands = new Discord.Collection();
const readyCommands = new Discord.Collection();
client.prefix = process.env.PREFIX ?? "t!";
(async () => {
    // Get and Cache Command Files
    const commandFiles = {
        base: (await fs.promises.readdir(path.resolve(__dirname, "./commands/base/"))).filter(file => /\.js$|\.ts$/.test(file)),
        ready: (await fs.promises.readdir(path.resolve(__dirname, "./commands/ready/"))).filter(file => /\.js$|\.ts$/.test(file)),
    };
    for (const commandFile of commandFiles.base) {
        const command = require(`./commands/base/${commandFile}`).default;
        commands.set(command.name, command);
    }
    for (const commandFile of commandFiles.ready) {
        const command = require(`./commands/ready/${commandFile}`).default;
        readyCommands.set(command.name, command);
    }
    client.on("ready", () => {
        for (const command of readyCommands.values()) {
            command.execute(client);
        }
        console.log(`${client.user?.username} Activated.`);
    });
    client.on("message", message => {
        if (!message.content.toLowerCase().startsWith(client.prefix) || message.author.bot)
            return;
        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));
        if (!command)
            return;
        if (command.argsRequired && !args.length) {
            const reply = `**Args required!**${command.usage ? `\nUsage: \`${client.prefix}${commandName} ${command.usage}\`` : ""}`;
            return message.channel.send(reply);
        }
        try {
            command.execute(message, args);
        }
        catch (error) {
            console.error(error);
            message.channel.send(`There was an error executing the command!\n\`${error}\``);
        }
    });
    client.login();
})();
