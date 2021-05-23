"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../classes/PrismaClient"));
exports.default = {
    name: "messageDelete",
    type: "on",
    async handler(_, message) {
        // Prevent's caching it's own deleted messages
        if (message.author?.bot)
            return;
        // Saves Deleted messages in a SQLite3 database for `snipe` command.
        try {
            await PrismaClient_1.default.snipes.update({
                where: {
                    id: 1
                },
                data: {
                    author: message.author?.username ?? "Unknown",
                    content: message.content ?? "Content_Not_Found"
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};
