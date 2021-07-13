import { AxiosRequestConfig } from "axios";
import * as Discord from "discord.js";
import Client from "../src/classes/Client";

/**
 * Command Interface of the bot
 */
export interface Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string | null;
    cooldown: number;
    guildOnly: boolean;
    argsRequired: boolean;
    rolesRequired: Record<string, unknown>[];
    /**
     * The actual command to be executed.
     * @param   message       Discord Message
     * @param   args          Arguments passed by user
     * */
    execute(message: Discord.Message, args: string[]): Promise<void> | void;
}

export interface ReadyCommand {
    name: string;
    execute(client: Client): Promise<void> | void;
}

export interface LinkConfig extends AxiosRequestConfig {
    url?: string;
    base?: string | URL;
    querystring?: ParsedUrlQueryInput;
    headers?: Record<string, unknown>;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export interface Route {
    router: Router;
    path: string;
}

export interface EventHandler {
    name: keyof Discord.ClientEvents;
    type: "on" | "once";
    handler(client: Client, ...args: unknown): Promise<void> | void;
}
