import fsp from "fs/promises";
import path from "path";
import { EventHandler } from "../typings";
import client from "./classes/Client";

(async () => {
    const eventHandlers = fsp.readdir(path.resolve(__dirname, "./events/"));

    for (const eventHandler of await eventHandlers) {
        const event: EventHandler = (await import(`./events/${eventHandler}`))
            .default;

        // Either client.on() or client.once()
        client[event.type](event.name, (...args) => event.handler(...args));
    }

    try {
        await client.login();
    } catch (error) {
        throw new Error(error);
    }
})();
