"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const luxon_1 = require("luxon");
const PrismaClient_1 = __importDefault(require("../../classes/PrismaClient"));
const utils_1 = require("../../utils");
const { VERSES_WEBHOOK_ID, VERSES_WEBHOOK_TOKEN, IANA_TIMEZONE } = process.env;
if (!VERSES_WEBHOOK_ID || !VERSES_WEBHOOK_TOKEN || !IANA_TIMEZONE) {
    throw new Error("Webhook Token or ID not found!");
}
const webhook = new discord_js_1.WebhookClient(VERSES_WEBHOOK_ID, VERSES_WEBHOOK_TOKEN);
let sentBool = false;
exports.default = {
    name: "sendverses",
    execute() {
        setInterval(async () => {
            const date = luxon_1.DateTime.fromJSDate(new Date()).setZone(IANA_TIMEZONE);
            if (date.hour === 8 && !sentBool) {
                const verses = await PrismaClient_1.default.verses.findFirst({
                    where: {
                        id: date.day
                    }
                });
                await webhook.send(null, {
                    embeds: [
                        {
                            title: verses?.title,
                            description: verses?.content,
                            color: utils_1.randomHex()
                        }
                    ]
                });
                sentBool = true;
                setTimeout(() => sentBool = false, 3630 * 1000);
            }
        }, 60 * 1000);
    }
};
