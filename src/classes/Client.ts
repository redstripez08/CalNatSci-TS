import * as Discord from "discord.js";
import { Command } from "../../typings";

export default class Client extends Discord.Client {
    commands!: Discord.Collection<Command["name"], Command>;
    prefix!: string;
}
