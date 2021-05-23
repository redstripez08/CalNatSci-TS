"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Client_1 = __importDefault(require("./classes/Client"));
const eventHandlers = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "./events/")).filter(file => file.endsWith(".js"));
for (const eventHandler of eventHandlers) {
    const event = require(`./events/${eventHandler}`).default;
    // Either client.on() or client.once()
    Client_1.default[event.type](event.name, (...args) => event.handler(Client_1.default, ...args));
}
try {
    Client_1.default.login();
}
catch (error) {
    throw new Error(error);
}
