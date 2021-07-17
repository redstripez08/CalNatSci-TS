import { PrismaClient } from "@prisma/client";
import * as Discord from "discord.js";
import { Command } from "../../typings";
import prisma from "./PrismaClient";

interface ClientOptions extends Discord.ClientOptions {
    prefix: string;
    db: PrismaClient;
}

export class Client extends Discord.Client {
    private _commands!: Discord.Collection<Command["name"], Command>;
    private _prefix: string;

    constructor(options: ClientOptions) {
        super(options);
        this._prefix = options.prefix;
    }

    public setCommands(commands: Discord.Collection<string, Command>): void {
        this._commands = commands;
    }

    public get prefix(): string {
        return this._prefix;
    }

    public get commands(): Discord.Collection<string, Command> {
        return this._commands;
    }
}

export default new Client({
    ws: { intents: Discord.Intents.ALL },
    prefix: process.env.PREFIX ?? "t!",
    db: prisma,
});
