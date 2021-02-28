import * as Discord from "discord.js";
import Client from "../classes/Client";

export interface Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string | null;
    cooldown: number;
    guildOnly: boolean;
    argsRequired: boolean;
    rolesRequired: object[];
    /** 
     * The actual command to be executed.
     * @param   message       Discord Message
     * @param   args          Arguments passed by user
     * */
    execute(message: Discord.Message, args: string[]): Promise<void> | void;
}

export interface ReadyCommand {
    name:string,
    execute(client: Client): Promise<void> | void;
}

export interface LinkOptions {
    url?: string;
    base?: string | URL;
    querystring?: ParsedUrlQueryInput;
    headers?: object;
    method?:  "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}