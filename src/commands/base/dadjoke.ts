import Link from '../../classes/Link';
import { Command } from '../../typings';
import { axiosErrorHandler, charCounter } from '../../utils';

const link = new Link("https://icanhazdadjoke.com/", {headers: {"Accept": "text/plain"}});

export default {
    name: "dadjoke",
    aliases: ["djk", "dadjk"],
    description: "A dad joke",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const res = await link.get();
            message.channel.send(charCounter(res.data, 2048, true));            
        } catch (error) {
            if (error.isAxiosError) {
                return axiosErrorHandler(message, error);
            }
            console.error(error);
        }
    }
} as Command;