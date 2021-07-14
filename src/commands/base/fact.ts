import { Command } from "../../../typings";
import { randomHex, axiosErrorHandler, charCounter } from "../../utils";
import Link from "../../classes/Link";
import { MessageEmbed } from "discord.js";
import { AxiosResponse } from "axios";

interface Response extends AxiosResponse {
    data: {
        id: string;
        text: string;
        source: string;
        source_url: string;
        language: "en" | "de";
        permalink: string;
    };
}

const link = new Link("/random.json", "https://uselessfacts.jsph.pl/", {
    querystring: { language: "en" },
    headers: { Accept: "applicaton/json" },
});

export default {
    name: "fact",
    aliases: ["facts"],
    description: "Grabs a random fact from the internet",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const { data }: Response = await link.get();

            const embed = new MessageEmbed()
                .setTitle("Random Fact")
                .setColor(randomHex())
                .setURL(data.permalink)
                .setDescription(charCounter(data.text, 2048, true))
                .setFooter(`Source: ${data.source}`);

            message.channel.send(embed);
        } catch (error) {
            if (error.isAxiosError) {
                return axiosErrorHandler(message, error);
            }
            console.error(error);
        }
    },
} as Command;
