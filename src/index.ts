import fs from "fs";
import path from "path";
import { EventHandler } from "../typings";
import client from "./classes/Client";

const eventHandlers = fs.readdirSync(path.resolve(__dirname, "./events/")).filter(file => file.endsWith(".js"));

for (const eventHandler of eventHandlers) {
    const event: EventHandler = require(`./events/${eventHandler}`).default;

    // Either client.on() or client.once()
    client[event.type](event.name, (...args) => event.handler(client, ...args));
}


try {
    client.login();
} catch (error) {
    throw new Error(error);
}