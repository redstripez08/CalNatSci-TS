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
const axios_1 = __importDefault(require("axios"));
const querystring = __importStar(require("querystring"));
class Link extends URL {
    constructor(url, base, config) {
        typeof base === "string" || base instanceof URL
            ? super(url.toString(), base)
            : super(url.toString());
        if (base) {
            // Checks if base is LinkConfig
            if (typeof base !== "string" && !(base instanceof URL)) {
                this.config = base;
                this.method = base.method ?? undefined;
                this.headers = base.headers ?? undefined;
                this.search = base.querystring ? querystring.stringify(base.querystring) : this.search;
            }
            else if (config) {
                this.config = config;
                this.method = config.method ?? undefined;
                this.headers = config.headers ?? undefined;
                this.search = config.querystring ? querystring.stringify(config.querystring) : this.search;
            }
        }
    }
    /**
     * Sends Request using Method specifed in `config`
     * @param config
     * @returns
     */
    request(config) {
        try {
            const conf = config ?? this.config;
            if (!conf || !conf.method)
                throw new Error("URL and Method are required properties!");
            return axios_1.default.request(Object.assign({ url: this.href }, conf));
        }
        catch (error) {
            return error;
        }
    }
    /**
     * Sends a `GET` request using `Axios` library
     * @param config Overrides instantiated config
     * @returns Axios Response
     */
    get(config) {
        try {
            return axios_1.default.get(this.href, config ?? this.config);
        }
        catch (error) {
            return error;
        }
    }
    /**
     * Sends a `POST` request using `Axios` library
     * @param body The body of the request
     * @param config Overrides instantiated config
     * @returns Axios Response
     */
    post(body, config) {
        try {
            return axios_1.default.post(this.href, body, config ?? this.config);
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = Link;
