"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readyCommands = new discord_js_1.Collection();
exports.default = {
    name: "ready",
    type: "once",
    async handler(client) {
        const commandFiles = (await fs_1.default.promises.readdir(path_1.default.resolve(__dirname, "../commands/ready/"))).filter(file => file.endsWith(".js"));
        for (const commandFile of commandFiles) {
            const command = require(`../commands/ready/${commandFile}`).default;
            readyCommands.set(command.name, command);
        }
        // Execute Ready Commands
        for (const command of readyCommands.values()) {
            command.execute(client);
        }
        client.user?.setActivity({ name: `${client.prefix}help`, type: "LISTENING" });
        console.log(`${client.user?.username} Ready`);
    }
};
