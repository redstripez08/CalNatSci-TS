import express from "express";
import * as fs from "fs";
import * as path from "path";
import { Route } from "../typings";

const { PORT = 80, SERVER_AUTH } = process.env;
const app = express();

app.use([express.json(), express.urlencoded({extended: true})]);

app.use((req, res, next) => {
    if (req.headers.authorization !== SERVER_AUTH) return res.sendStatus(401);
    next();
});

const routeFiles = fs.readdirSync(path.resolve(__dirname, "./routes/")).filter(file => /\.ts$|\.js$/.test(file));

for (const routeFile of routeFiles) {
    const { path, router }: Route = require(`./routes/${routeFile}`).default;
    app.use(path, router);
}


app.listen(PORT, () => console.log(`[HTTP/1.1 | Server] Listening to port ${PORT}`));