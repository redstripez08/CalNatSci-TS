import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../typings";

type RPSchoices = "r" | "p" | "s";

function getComputerChoice() {
    const choices: RPSchoices[] = ["r", "p", "s"];
    const randomNum = Math.floor(Math.random() * choices.length);
    return choices[randomNum];
}

function charToWord(char: RPSchoices) {
    switch (char) {
        case "r": return "Rock";
        case "p": return "Paper";
        case "s": return "Scissors";
    }
}

function embedBuilder(result: "win" | "lose" | "draw", compChoice: RPSchoices, playerChoice: RPSchoices): MessageEmbed {
    const embed = new MessageEmbed()
        .addField("Player's Choice", charToWord(playerChoice), true)
        .addField("Computer's Choice", charToWord(compChoice), true);
        
    if (result === "win") {
        embed.setColor("#00ff00").setTitle("You Won!");
    } else if (result === "lose") {
        embed.setColor("#ff0000").setTitle("You Lost!");
    } else {
        embed.setColor("#ffff00").setTitle("It's a Draw!");
    }

    return embed;
}

function getResults(message: Message, compChoice: RPSchoices, playerChoice: RPSchoices) {
    switch (true) {
        // Win conditions
        case compChoice === "r" && playerChoice === "p":
        case compChoice === "p" && playerChoice === "s":
        case compChoice === "s" && playerChoice === "r":
            message.channel.send(embedBuilder("win" , compChoice, playerChoice));
            break;

        // Lose conditions
        case compChoice === "p" && playerChoice === "r":
        case compChoice === "s" && playerChoice === "p":
        case compChoice === "r" && playerChoice === "s":
            message.channel.send(embedBuilder("lose" , compChoice, playerChoice));
            break;
        
        // Tie Condition
        case compChoice === playerChoice:
            message.channel.send(embedBuilder("draw" , compChoice, playerChoice));
            break;
    }
}

export default {
    name: "rps",
    aliases: [],
    description: "Rock Paper Scissors",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    argsRequired: true,
    rolesRequired: [],
    async execute(message, args) {
        const ans = args[0].toLowerCase();
        if (ans !== "r" && ans !== "p" && ans !== "s") return message.channel.send("Not a valid answer!");

        const compChoice = getComputerChoice();
        getResults(message, compChoice, ans);
    }
} as Command;