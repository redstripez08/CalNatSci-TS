"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error Handler for Axios HTTP requests.
 * @param message   Discord Message
 * @param err       Error to be handled.
 */
function default_1(message, err) {
    if (err.response) {
        console.error(err.response);
        // console.error(err.response.status, err.response.statusText, err.response.headers, err.response.config);
        message.channel.send(`There was an error!\n\`${err.response.status} || ${err.response.statusText}\n${err.response.data.error}\``);
    }
    else if (err.request) {
        console.error(err.request);
        message.channel.send(`There was an error!\n\`Request made but no Response received\``);
    }
    else {
        console.error(err);
        message.channel.send(`There was an error!\n\`${err}\``);
    }
}
exports.default = default_1;
