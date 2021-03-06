import { Message, MessageEmbed } from "discord.js";

describe("Run Commands", () => {
    const message = {
        content: "Message boi",
        channel: {
            send: jest.fn(),
        },
    } as unknown as Message;

    it("Runs dadjoke", async () => {
        const command = (await import("../src/commands/base/dadjoke")).default;

        const msg = message;
        await command.execute(msg, ["hello", "world"]);

        expect(msg.channel.send).toHaveBeenCalledWith(expect.any(String));
    });

    it("Runs myTest", async () => {
        const command = (await import("../src/commands/base/myTest")).default;

        const msg = message;
        command.execute(msg, ["hello", "world"]);

        expect(msg.channel.send).toHaveBeenCalledWith(expect.any(String));
    });

    it("Runs Urban Dictionary", async () => {
        const command = (await import("../src/commands/base/ud")).default;

        const msg = message;
        await command.execute(msg, ["hello", "world"]);

        expect(msg.channel.send).toHaveBeenCalledWith(expect.any(MessageEmbed));
    });

    it("Runs fact", async () => {
        const command = (await import("../src/commands/base/fact")).default;

        const msg = message;
        await command.execute(msg, []);

        expect(msg.channel.send).toHaveBeenCalledWith(expect.any(MessageEmbed));
    });
});
