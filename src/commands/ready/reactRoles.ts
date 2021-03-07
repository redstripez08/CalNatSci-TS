import { ReadyCommand } from "../../typings";
import Keyv from "keyv";
import { MessageEmbed, TextChannel, User } from "discord.js";

interface Roles {
    [role: string]: {
        emoji: string;
        id: string;
    }
}

interface CalNatSRV {
    guild_id: string;
    react_roles_id: string;
    message_id: string;
}

const { MONGODB_ROLES_URL } = process.env;
if (!MONGODB_ROLES_URL) throw new Error("MongoDB Role URL not found!");

const keyv = new Keyv(MONGODB_ROLES_URL);

const acceptedEmojis = [
    "🇦",
    "🇨",
    "🇴",
    "🇵",
    "🇸",
    "❌"
];

const invalidEmojiEmbedBuilder = (user: User) => 
    new MessageEmbed()
        .setTitle("Invalid Emoji!")
        .setColor("#ff0000")
        .setDescription(`<@!${user.id}>, only react with supplied emojis`);

const alreadyInRoleEmbedBuilder = (user: User, roleName: string, _roleName: string) => 
    new MessageEmbed()
        .setTitle("You're Already in a Section Role!")
        .setColor("#ff0000")
        .setDescription(`<@!${user.id}>, You're already in **${_roleName}**.\nTo join **${roleName}**, react with :x: to clear section roles, then react with specified emoji.`);


const rolesRemovedEmbedBuilder = () => 
    new MessageEmbed()
        .setTitle("All your Section Roles have been removed!")
        .setColor("#00ff00");

const embed = new MessageEmbed()
.setColor("#fff")
.setTitle("React to get Section Role")
.setDescription(
    "**:regional_indicator_a: : `Andromeda`**\n\n" +
    "**:regional_indicator_c: : `Cassisopeia`**\n\n" +
    "**:regional_indicator_o: : `Orion`**\n\n" +
    "**:regional_indicator_p: : `Perseus`**\n\n" +
    "**:regional_indicator_s: : `Spectator (Other)`**\n\n" + 
    "**:x: : `Remove Section Role`**" 
);

    
/**
 * For controlling and managing React-Roles
 */
export default {
    name: "reactRoles",
    async execute(client) {
        try {
            const roles: Roles = await keyv.get("Roles");
            const srv: CalNatSRV = await keyv.get("CalNatSRV");            
            
            // the channels return as `Channel` Class even tho it is `TextChannel` so I have to do this stupidity
            // to access `TextChannel` methods, properties, and make TypeScript happy and not reee errors at me.
            const guild = client.guilds.cache.get(srv.guild_id);          
            const _channel: any = client.channels.cache.get(srv.react_roles_id);
            const channel: TextChannel = _channel;

            if (!guild || !_channel || !channel) {
                return console.error("raaah");
            }

            const m = await channel.messages.fetch(srv.message_id);
            // m.edit(embed)

            const reactionCollector = m.createReactionCollector((_, user) => !user.bot);
            reactionCollector.on("collect", async (reaction, user) => {
                reaction.users.remove(user.id);

                // Checks if the Reacted emojis are accepted or valid
                if (!acceptedEmojis.some(emoji => emoji === reaction.emoji.name)) {
                    const msg = await channel.send(invalidEmojiEmbedBuilder(user));
                    msg.delete({timeout: 5000});
                    return;
                }
                
                const member = guild.members.cache.get(user.id);
                for (const roleName in roles) {
                    const role = roles[roleName];
                    
                    if (reaction.emoji.name === "❌") {
                        if (member?.roles.cache.has(role.id)) {
                            member.roles.remove(role.id);
                            const msg = await channel.send(rolesRemovedEmbedBuilder());
                            msg.delete({timeout: 5000});
                            break;
                        }
                    }
                    
                    if (reaction.emoji.name === role.emoji) {
                        // it took me like 3 hours to do this. Inefficient? probably but aaaaaaaaaa
                        // User can only have one role at a time. This checks if they are already in a role.
                        for (const _roleName in roles) {
                            if (member?.roles.cache.has(roles[_roleName].id)) {
                                const msg = await channel.send(alreadyInRoleEmbedBuilder(user, roleName, _roleName));
                                msg.delete({timeout: 15000});
                                return;
                            }
                        }

                        member?.roles.add(role.id);
                        const msg = await channel.send(`You have been assigned to ${roleName}`);
                        msg.delete({timeout: 5000});
                        break;
                    }
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }
} as ReadyCommand;