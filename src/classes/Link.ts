import * as querystring from "querystring";
import { LinkOptions } from "../typings";

export default class Link extends URL {
    public headers?: object;
    public method?: LinkOptions["method"];

    /**
     * The Link interface represents an object providing static methods used for creating object links.
     * @param url       Relative path or full Link
     * @param base      Base link for `url`
     * @param options   Options for Link
     * @extends URL
     */
    constructor(url: string, base?: string | URL | LinkOptions, options?: LinkOptions) {
        typeof base === "string" || base instanceof URL ? super(url, base) : super(url);

        if (base) {
            if (typeof base !== "string" && !(base instanceof URL)) {
                this.method = base.method ? base.method : undefined;
                this.headers = base.headers ? base.headers : undefined;
                this.search = base.querystring ? querystring.stringify(base.querystring): this.search;
            } else if (options) {
                this.method = options.method ? options.method : undefined;
                this.headers = options.headers ? options.headers : undefined;
                this.search = options.querystring ? querystring.stringify(options.querystring) : this.search;
            }
        }
    }

}