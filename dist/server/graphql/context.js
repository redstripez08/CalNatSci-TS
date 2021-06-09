"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = void 0;
const PrismaClient_1 = __importDefault(require("../../classes/PrismaClient"));
exports.context = {
    db: PrismaClient_1.default
};
