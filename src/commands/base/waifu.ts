import { AxiosResponse } from "axios";
import Link from "../../classes/Link";
import { Command } from "../../../typings";
import { axiosErrorHandler, randomHex } from "../../utils";
import { MessageEmbed } from "discord.js";

interface Response extends AxiosResponse {
    data: {
        url: string;
    };
}

export default {
    name: "waifu",
    aliases: [],
    description:
        "Gets a random waifu pic. Uses https://waifu.pics API. Find more categories there.",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message, args) {
        try {
            const link = new Link(
                `/api/sfw/${args[0] ? args[0].toLowerCase() : "waifu"}`,
                "https://waifu.pics",
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const res: Response = await link.get();
            const embed = new MessageEmbed()
                .setImage(res.data.url)
                .setColor(randomHex());

            message.channel.send(embed);
        } catch (error) {
            if (error.isAxiosError) {
                if (error.response.status === 404) {
                    return message.channel.send(
                        `There was an error!\n\`${error.response.status} || ${
                            error.response.statusText
                        }\n${JSON.stringify(error.response.data)}\``
                    );
                }
                return axiosErrorHandler(message, error);
            }
            console.error(error);
        }
    },
} as Command;
