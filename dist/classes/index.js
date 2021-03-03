"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = exports.Client = exports.Link = void 0;
const Link_1 = __importDefault(require("./Link"));
const Client_1 = __importDefault(require("./Client"));
const PrismaClient_1 = __importDefault(require("./PrismaClient"));
exports.Link = Link_1.default;
exports.Client = Client_1.default;
exports.PrismaClient = PrismaClient_1.default;
