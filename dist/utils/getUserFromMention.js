"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets a discord mention id and returns a Discord User
 * @param message Discord Message
 * @param mention Mention from message
 */
function default_1(message, mention) {
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return message.client.users.cache.get(mention);
    }
}
exports.default = default_1;
