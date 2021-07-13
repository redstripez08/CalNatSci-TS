import fsp from "fs/promises";
import path from "path";
import { EventHandler } from "../typings";
import client from "./classes/Client";

(async () => {
    const eventHandlers = (
        await fsp.readdir(path.resolve(__dirname, "./events/"))
    ).filter(file => file.endsWith(".js"));

    for (const eventHandler of eventHandlers) {
        const event: EventHandler = (await import(`./events/${eventHandler}`))
            .default;

        // Either client.on() or client.once()
        client[event.type](event.name, (...args) =>
            event.handler(client, ...args)
        );
    }

    try {
        await client.login();
    } catch (error) {
        throw new Error(error);
    }
})();
