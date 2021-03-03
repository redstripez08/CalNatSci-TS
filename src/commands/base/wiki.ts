import axios, { AxiosResponse } from "axios";
import { MessageEmbed } from "discord.js";
import { Link } from "../../classes";
import { Command } from "../../typings";
import { axiosErrorHandler, charCounter, randomHex } from "../../utils";

interface Response extends AxiosResponse {
    data: {
        batchcomplete: string;
        query: {
            pages: {
                [id: string]: {
                    pageid: number;
                    ns: number;
                    title: string;
                    extract: string;
                }
            }
        }
    }
}

export default {
    name: "wiki",
    aliases: ["wikipedia"],
    description: "Urban Dictionary",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new Link("https://en.wikipedia.org/w/api.php", {
                method: "GET",
                querystring: {
                   action: "query",
                   titles: args.join(" "),
                   prop: "extracts",
                   exintro: true,
                   explaintext: true,
                   format: "json"
                },
                headers: {
                   "accept": "application/json"
                }
            });

            const { data }: Response = await axios.get(link.href, {headers: link.headers});
            const { query } = data;

            for (const id in query.pages) {
                if (Object.prototype.hasOwnProperty.call(query.pages, id)) {
                    const wikiPage = query.pages[id];
                    if (!wikiPage.extract) return message.channel.send("Not Found!\nTry being more specific.");

                    const wikiURL = `https://en.wikipedia.org/wiki/${wikiPage.title.replace(/ +/g, "_")}`;
                    const embed = new MessageEmbed()
                        .setTitle(wikiPage.title)
                        .setColor(randomHex())
                        .setURL(wikiURL)
                        .setDescription(charCounter(wikiPage.extract, 2048, true))
                        .setFooter("Wikipedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Wikipedia-logo-en-big.png/490px-Wikipedia-logo-en-big.png");

                    message.channel.send(embed);
                }
            }
            
        } catch (error) {
            axiosErrorHandler(message, error);
        }
    }
} as Command;