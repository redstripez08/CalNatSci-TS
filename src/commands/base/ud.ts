import { AxiosResponse } from "axios";
import { MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { Link } from "../../classes";
import { Command } from "../../../typings";
import { axiosErrorHandler, charCounter, randomHex } from "../../utils";
const { TIMEZONE = "UTC"} = process.env;

interface Response extends AxiosResponse {
    data: {
        list: Array<{
            definition: string;
            permalink: string;
            thumbs_up: number;
            sound_urls: Array<any>;
            author: string;
            word: string;
            defid: number;
            current_vote: string;
            written_on: string;
            example: string;
            thumbs_down: number;
        }>
    } 
}

function swapLinks(matches: RegExpMatchArray, str: string): string {
    if (matches.length) {
        for (const link of matches) {
            // Removes brackets surrounding word
            const linkWord = link.slice(1, -1);
            const regex = new RegExp(`\\[${linkWord}\\]`);
            const embedLink = `[${linkWord}](https://www.urbandictionary.com/define.php?term=${linkWord.replace(/ +/g, "%20")})`;
            str = str.replace(regex, embedLink);
        }
    }
    return str;
}

export default {
    name: "ud",
    aliases: ["urbandict", "udict"],
    description: "Gets definition of term from Urban Dictionary",
    usage: "<Search Term>",
    cooldown: 3,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new Link("https://api.urbandictionary.com/v0/define", {
                querystring: {term: args.join(" ")},
                headers: {"Accept": "application/json"}
            });

            const { data }: Response = await link.get();
            if (!data.list.length) return message.channel.send("No Results Found!");
            
            // TODO create flags for getting specific ranking of definiton
            // const flags = args.filter(str => /(-[A-Z]|--\b[A-Z]{0,20}\b)+/gi.test(str));
            
            // const ahh = flags.find(flag => /-r=.{0,2}/);
            // console.log(flags);
            // console.log(ahh);

            const res = data.list[0];
            const date = DateTime.fromISO(res.written_on).setZone(TIMEZONE).toFormat("yyyy LLL dd, t ZZZZ");

            const ud_links = /\[(\w| |\d){0,}\]/gi
            const linkMatches = res.definition.match(ud_links) || [];
            const exLinkMatches = res.example.match(ud_links) || [];

            const definition = swapLinks(linkMatches, res.definition);
            const example = swapLinks(exLinkMatches, res.example);
                        
            const embed = new MessageEmbed()
                .setTitle(res.word)
                .setURL(res.permalink)
                .setAuthor("Author: " + res.author)
                .setColor(randomHex())
                .setDescription(charCounter(definition, 2048, true))
                .addField("Example", charCounter(example, 1024, true) || "No Example")
                .setFooter(`${res.thumbs_up} 👍\t${res.thumbs_down} 👎\nWritten on: ${date}`);
            
            message.channel.send(embed);
        } catch (error) {
            if (error.isAxiosError) {
                return axiosErrorHandler(message, error);
            }
            console.error(error);
        }
    }
} as Command;