import * as Discord from "discord.js";
import { Command } from "../../typings";

interface ClientOptions extends Discord.ClientOptions {
    prefix: string;
}

export class Client extends Discord.Client {
    public commands!: Discord.Collection<Command["name"], Command>;
    private _prefix: string;

    constructor(options: ClientOptions) {
        super(options);
        this._prefix = options.prefix;
    }
    
    public get prefix(): string {
        return this._prefix;
    }
    
}

export default new Client({
    ws: {intents: Discord.Intents.ALL},
    prefix: process.env.PREFIX ?? "t!"
});
