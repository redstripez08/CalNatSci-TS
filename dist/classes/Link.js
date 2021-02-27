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
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = __importStar(require("querystring"));
class Link extends URL {
    /**
     * The Link interface represents an object providing static methods used for creating object links.
     * @param url       Relative path or full Link
     * @param base      Base link for `url`
     * @param options   Options for Link
     * @extends URL
     */
    constructor(url, base, options) {
        typeof base === "string" || base instanceof URL ? super(url, base) : super(url);
        if (base) {
            if (typeof base !== "string" && !(base instanceof URL)) {
                this.method = base.method ? base.method : undefined;
                this.headers = base.headers ? base.headers : undefined;
                this.search = base.querystring ? querystring.stringify(base.querystring) : this.search;
            }
            else if (options) {
                this.method = options.method ? options.method : undefined;
                this.headers = options.headers ? options.headers : undefined;
                this.search = options.querystring ? querystring.stringify(options.querystring) : this.search;
            }
        }
    }
}
exports.default = Link;
