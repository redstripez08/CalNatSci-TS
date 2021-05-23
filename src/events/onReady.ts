import { Collection } from "discord.js";
import { EventHandler, ReadyCommand } from "../../typings";
import { Client } from "../classes/Client";
import fs from "fs";
import path from "path";

const readyCommands = new Collection<ReadyCommand["name"], ReadyCommand>();

export default {
    name: "ready",
    type: "once",
    async handler(client: Client) {
        const commandFiles = (await fs.promises.readdir(path.resolve(__dirname, "../commands/ready/"))).filter(file => file.endsWith(".js"));
        
        for (const commandFile of commandFiles) {
            const command: ReadyCommand = require(`../commands/ready/${commandFile}`).default;
            readyCommands.set(command.name, command);
        }
        // Execute Ready Commands
        for (const command of readyCommands.values()) {
            command.execute(client);
        }

        client.user?.setActivity({name: `${client.prefix}help`, type: "LISTENING"});
        console.log(`${client.user?.username} Ready`);
    }
} as EventHandler;