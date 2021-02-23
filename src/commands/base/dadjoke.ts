import axios from 'axios';
import Link from '../../classes/Link';
import { Command } from '../../typings';
import charChecker from '../../utils/charChecker';

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
            message.channel.send(charChecker(res.data, 2048, true));            
        } catch (error) {
            console.error(error);   
        }
    }
} as Command;