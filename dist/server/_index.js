"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const PrismaClient_1 = __importDefault(require("../classes/PrismaClient"));
const { PORT = 80 } = process.env;
const server = http.createServer((req, res) => {
    switch (req.url) {
        case "/":
        case "/index":
        case "/index.html":
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write("<h1>Site is not yet made lol</h1>");
            break;
        case "/verses":
            if (req.method === "POST") {
                req.on("data", async (chunk) => {
                    const body = JSON.parse(chunk.toString());
                    await PrismaClient_1.default.verses.update({
                        where: {
                            id: body.id
                        },
                        data: {
                            title: body.title,
                            content: body.content
                        }
                    });
                    res.writeHead(204);
                });
                break;
            }
            else if (req.method === "GET") {
                (async () => {
                    const data = await PrismaClient_1.default.verses.findMany({
                        where: {
                            id: {
                                lte: 15
                            }
                        }
                    });
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify(data));
                })();
                break;
            }
            res.writeHead(405, { "Content-Type": "text/plain" });
            res.write("405 Method Not Allowed");
            break;
        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("404 Not Found");
            break;
    }
    res.end();
});
server.on("listening", async () => {
    await PrismaClient_1.default.$connect();
});
server.listen(PORT, () => console.log(`[HTTP/1.1 | Server] Listening to port ${PORT}`));
