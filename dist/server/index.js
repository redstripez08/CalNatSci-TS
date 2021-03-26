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
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const { PORT = 80, SERVER_AUTH } = process.env;
const app = express_1.default();
app.use([express_1.default.json(), express_1.default.urlencoded({ extended: true })]);
app.use((req, res, next) => {
    if (req.headers.authorization !== SERVER_AUTH)
        return res.sendStatus(401);
    next();
});
const routeFiles = fs.readdirSync(path.resolve(__dirname, "./routes/")).filter(file => /\.ts$|\.js$/.test(file));
for (const routeFile of routeFiles) {
    const { path, router } = require(`./routes/${routeFile}`).default;
    app.use(path, router);
}
app.listen(PORT, () => console.log(`[HTTP/1.1 | Server] Listening to port ${PORT}`));
