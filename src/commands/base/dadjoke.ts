import axios from 'axios';
import Link from '../../classes/Link';
import { Command } from '../../typings';
import { axiosErrorHandler, charCounter } from '../../utils';

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
        const link = new Link("https://icanhazdadjoke.com/", {headers: {"Accept": "text/plain"}});

        try {
            const res = await axios.get(link.href, {headers: link.headers});
            message.channel.send(charCounter(res.data, 2048, true));            
        } catch (error) {
            axiosErrorHandler(message, error);
        }
    }
} as Command;