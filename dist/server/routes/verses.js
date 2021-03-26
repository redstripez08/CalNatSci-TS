"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PrismaClient_1 = __importDefault(require("../../classes/PrismaClient"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    if (!req.query.id)
        return res.status(400).send("Provide id");
    const id = req.query.id;
    const s = await PrismaClient_1.default.verses.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    res.send(s);
});
router.post("/", async (req, res) => {
    const body = req.body;
    await PrismaClient_1.default.verses.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    });
    res.sendStatus(204);
});
exports.default = {
    router,
    path: "/verses"
};
