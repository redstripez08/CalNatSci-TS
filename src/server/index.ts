import { ApolloServer } from "apollo-server-express";
import express from "express";
import * as fs from "fs";
import * as path from "path";
import * as types from "./schema";
import { makeSchema } from "nexus";
import { Route } from "../../typings";
import prisma from "../classes/PrismaClient";

const { PORT = 80, SERVER_AUTH } = process.env;
const app = express();

app.use([express.json(), express.urlencoded({extended: true})]);

app.use((req, res, next) => {
    if (req.headers.authorization !== SERVER_AUTH) return res.sendStatus(401);
    next();
});

const routeFiles = fs.readdirSync(path.resolve(__dirname, "./routes/")).filter(file => file.endsWith(".js"));

for (const routeFile of routeFiles) {
    const { path, router }: Route = require(`./routes/${routeFile}`).default;
    app.use(path, router);
}

const schema = makeSchema({
    types,
    outputs: {
        typegen: path.resolve(__dirname, "./nexus-typegen.ts"),
        schema: path.resolve(__dirname, "./schema/schema.graphql")
    },
    contextType: {
        module: path.resolve(__dirname, "./schema/context.ts"),
        export: "Context"
    }
});

(async () => {    
    const server = new ApolloServer({schema, 
        context: {
            db: {
                verses: await prisma.verses.findMany()
            }
        }
    });

    server.applyMiddleware({app});
    app.listen(PORT, () => console.log(`[HTTP/1.1 | Server] Listening to port ${PORT}`));
})();
