"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = {
    name: "seedSnipes",
    async execute(client) {
        try {
            // const t = await prisma.snipes.create({
            //     data: {
            //         id: 1,
            //         author: "",
            //         content: ""
            //     }
            // });
            // console.log(t);
        }
        catch (error) {
            console.error(error);
        }
        prisma.$disconnect();
    }
};
