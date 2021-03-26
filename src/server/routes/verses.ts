import express from "express";
import prisma from "../../classes/PrismaClient";
import { Route } from "../../typings";

const router = express.Router();

interface Body {
    id: number;
    title: string;
    content: string;
}

router.get("/", async (req, res) => {
    if (!req.query.id) return res.status(400).send("Provide id");
    const id: any = req.query.id;

    const s = await prisma.verses.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    res.send(s);
});

router.post("/", async (req, res) => {
    const body: Body = req.body;

    await prisma.verses.update({
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

export default {
    router,
    path: "/verses"
} as Route