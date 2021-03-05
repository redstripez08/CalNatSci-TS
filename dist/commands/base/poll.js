"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../../utils");
const emojiList = [
    '\u0031\u20E3',
    '\u0032\u20E3',
    '\u0033\u20E3',
    '\u0034\u20E3',
    '\u0035\u20E3',
    '\u0036\u20E3',
    '\u0037\u20E3',
    '\u0038\u20E3',
    '\u0039\u20E3',
    '\uD83D\uDD1F'
];
async function pollEmbed(message, pollOptions) {
    const { title, options, timeout, emojiList, forceEndPollEmoji } = pollOptions;
    // Main Text
    let text = `*To vote, react using the correspoding emoji.\nThe voting will end in **${timeout} seconds**.` +
        `\nPoll creater can end the poll **forcefully** by reacting to ${forceEndPollEmoji} emoji.*` +
        `\n**Remember to wait for all reactions before voting, otherwise your vote won't count!**\n\n`;
    const emojiInfo = {};
    for (const option of options) {
        // Iterates through emojilist one a time
        const [emoji] = emojiList.splice(0, 1);
        emojiInfo[emoji] = { option, votes: 0 };
        text += `${emoji} : \`${option}\`\n\n`;
    }
    if (!utils_1.charCounter(text, 2048))
        return message.channel.send("Poll is too large to send!\nTry shortening your options");
    // Gets keys of emojiInfo and returns as an array (UsedEmojis)
    const usedEmojis = Object.keys(emojiInfo);
    // Pushes force End Poll Emoji to usedEmoji Array
    usedEmojis.push(forceEndPollEmoji);
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`Poll | __${title}__`)
        .setColor(utils_1.randomHex())
        .setDescription(text)
        .setFooter(`Poll created by ${message.author.tag}`);
    // Sends Poll
    const poll = await message.channel.send(embed);
    // Reacts to the poll with emojis in usedEmojis
    for (const emoji of usedEmojis) {
        poll.react(emoji);
    }
    const reactionCollector = poll.createReactionCollector((reaction, user) => 
    // Checks if reacted emojis are the same as list and if user is not a bot.
    usedEmojis.includes(reaction.emoji.name) && !user.bot, 
    // If timeout is 0, it infinite. If timeout is specified, use that value.
    timeout === 0 ? {} : { time: timeout * 1000 });
    const voterInfo = new discord_js_1.Collection();
    reactionCollector.on('collect', (reaction, user) => {
        if (usedEmojis.includes(reaction.emoji.name)) {
            //Checks if reaction is force end emoji and it's from the poll creator. Ends if true.
            if (reaction.emoji.name === forceEndPollEmoji && message.author.id === user.id)
                return reactionCollector.stop();
            if (reaction.emoji.name === forceEndPollEmoji)
                return;
            // If voter info is not found, it instantiates it
            if (!voterInfo.has(user.id)) {
                voterInfo.set(user.id, { emoji: reaction.emoji.name });
            }
            const votedEmoji = voterInfo.get(user.id)?.emoji;
            if (!votedEmoji)
                return message.channel.send("what");
            // Checks if vote has been changed
            if (votedEmoji !== reaction.emoji.name) {
                const lastVote = poll.reactions.cache.get(votedEmoji);
                if (!lastVote)
                    return message.channel.send("We weren't able to process that!");
                // LastVote may possibly be null
                if (!lastVote.count) {
                    lastVote.count = 0;
                }
                // Removes emoji from poll
                lastVote.count -= 1;
                lastVote.users.remove(user.id);
                // lowers vote
                emojiInfo[votedEmoji].votes -= 1;
                voterInfo.set(user.id, { emoji: reaction.emoji.name });
            }
            // adds a vote
            emojiInfo[reaction.emoji.name].votes += 1;
        }
    });
    // Removes vote when reaction is removed
    reactionCollector.on('dispose', (reaction, user) => {
        if (usedEmojis.includes(reaction.emoji.name)) {
            voterInfo.delete(user.id);
            emojiInfo[reaction.emoji.name].votes -= 1;
        }
    });
    // Sends Results when timeout reached or poll is forced closed
    reactionCollector.on('end', () => {
        text = '*Ding! Ding! Ding! Time\'s up!\n Results are in,*\n\n';
        const resultEmbed = new discord_js_1.MessageEmbed()
            .setColor("#32009e")
            .setTitle(`Poll | __${title}__`)
            .setDescription(text)
            .setFooter(`Poll created by ${message.author.tag}`);
        for (const emoji in emojiInfo) {
            resultEmbed.addField(`${emojiInfo[emoji].option}:`, `**\`${emojiInfo[emoji].votes}\`**`);
        }
        poll.delete();
        message.channel.send(resultEmbed);
    });
}
exports.default = {
    name: "poll",
    aliases: [],
    description: "Creates a poll.",
    usage: "<poll title>;<option 1>|<option 2>;<timeout in seconds>",
    cooldown: 5,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        const argsArr = args.join(" ").split(";");
        const options = argsArr[1].trim().split("|").map(s => s.trim());
        if (!argsArr[0])
            return message.reply('Poll title is not given.');
        if (!utils_1.charCounter(argsArr[0], 256))
            return message.reply("Too large");
        if (!options)
            return message.reply('Poll options are not given.');
        if (options.length < 2)
            return message.reply('Please provide more than one choice.');
        if (options.length > 10)
            return message.reply(`Please provide 10 or less choices.`);
        if (typeof parseInt(argsArr[2]) !== "number")
            return message.reply("timeout is not a number");
        pollEmbed(message, {
            title: argsArr[0],
            options,
            timeout: parseInt(argsArr[2]),
            emojiList,
            forceEndPollEmoji: '\u2705'
        });
    }
};
