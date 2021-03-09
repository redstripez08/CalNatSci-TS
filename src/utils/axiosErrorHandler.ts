import { AxiosError } from "axios";
import { Message } from "discord.js";

/**
 * Error Handler for Axios HTTP requests.
 * @param message   Discord Message
 * @param err       Error to be handled.
 */
export default function (message: Message, err: AxiosError) {
    if (!err.isAxiosError) {
        console.error("Not an Axios Error!");
        console.error(err);
        return;
    }

    if (err.response) {
        const text = "There was an error!\n" +
        `\`HTTP Status ${err.response.status} | ${err.response.statusText}\n${err.message}\`\n\n` +
        `**Response Data:**\n\`${JSON.stringify(err.response.data)}\``;

        message.channel.send(text);
    } else if (err.request) {
        message.channel.send(`There was an error!\n\`Request made but no Response received\n${err.message}\``);
    } else {
        message.channel.send(`There was an error!\n\`${err.message}\``);
    }
    console.error(err);
}