import { WebhookClient } from "discord.js";
import { DateTime } from "luxon";
import prisma from "../../classes/PrismaClient";
import { ReadyCommand } from "../../../typings";
import { randomHex } from "../../utils";

const { VERSES_WEBHOOK_ID, VERSES_WEBHOOK_TOKEN, IANA_TIMEZONE } = process.env;

if (!VERSES_WEBHOOK_ID || !VERSES_WEBHOOK_TOKEN || !IANA_TIMEZONE) {
    throw new Error("Webhook Token or ID not found!");
}

const webhook = new WebhookClient(VERSES_WEBHOOK_ID, VERSES_WEBHOOK_TOKEN);

let sentBool: boolean = false;
export default {
    name: "sendverses",
    execute() {
        setInterval(async () => {
            const date = DateTime.fromJSDate(new Date()).setZone(IANA_TIMEZONE);
        
            if (date.hour === 8 && !sentBool) {
                const verses = await prisma.verses.findFirst({
                    where: {
                        id: date.day
                    }
                });

                await webhook.send(null, {
                    embeds: [
                        {
                            title: verses?.title,
                            description: verses?.content,
                            color: randomHex()
                        }
                    ]
                });

                sentBool = true;
                setTimeout(() => sentBool = false, 3630 * 1000);
            }
        }, 60 * 1000);
    }
} as ReadyCommand;