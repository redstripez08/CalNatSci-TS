import { AxiosResponse } from "axios";
import { MessageEmbed } from "discord.js";
import { Command } from "../../../typings";
import Link from "../../classes/Link";
import { axiosErrorHandler, randomHex } from "../../utils";

const link = new Link("/api/breeds/image/random/", "https://dog.ceo/", {
    headers: {
        accept: "application/json",
    },
});

interface Response extends AxiosResponse {
    data: {
        message: string;
        status: string;
    };
}

export default {
    name: "dog",
    aliases: [],
    description: "Sends dog picture",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: false,
    rolesRequired: [],
    async execute(message) {
        try {
            const { data }: Response = await link.get();
            const embed = new MessageEmbed()
                .setImage(data.message)
                .setColor(randomHex());

            message.channel.send(embed);
        } catch (error) {
            if (error.isAxiosError) {
                return axiosErrorHandler(message, error);
            }
        }
    },
} as Command;
