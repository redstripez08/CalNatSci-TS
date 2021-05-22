import axios, { AxiosResponse } from "axios";
import * as querystring from "querystring";
import { LinkConfig } from "../typings";

export default class Link extends URL {
    private config?: LinkConfig;
    public headers?: object;
    public method?: LinkConfig["method"];

    /**
     * The Link interface represents an object providing static methods used for creating object links.
     * @param url       Relative path or full Link
     * @param base      Base link for `url`
     * @param config   Options for Link
     * @extends URL
     */

    constructor(url: string);
    constructor(url: string, base?: string);
    constructor(url: string, base?: string, config?: LinkConfig);
    constructor(url: string, base?: URL, config?: LinkConfig);
    constructor(url: string, base?: LinkConfig, config?: LinkConfig);

    constructor(url: string | URL, base?: string | URL | LinkConfig, config?: LinkConfig) {
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
            } else if (config) {
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
    public request(config?: LinkConfig): Promise<AxiosResponse<any>> {
        try {
            const conf = config ?? this.config;
            if (!conf || !conf.method) throw new Error("URL and Method are required properties!");

            return axios.request(Object.assign(
                {url: this.href},
                conf
            ));
        } catch (error) {
            return error;
        }
    }

    /**
     * Sends a `GET` request using `Axios`
     * @param config Overrides instantiated config
     * @returns Response
     */
    public get(config?: LinkConfig): Promise<AxiosResponse<any>> {
        try {
            return axios.get(this.href, config ?? this.config);
        } catch (error) {
            return error;
        }
    }

}