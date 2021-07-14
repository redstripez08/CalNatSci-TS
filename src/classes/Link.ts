import axios, { AxiosResponse } from "axios";
import * as querystring from "querystring";
import { LinkConfig } from "../../typings";

/**
 * Link Class to make requests and URL handling easier
 */
export class Link extends URL {
    private config?: LinkConfig;
    public headers?: Record<string, unknown>;
    public method?: LinkConfig["method"];

    /**
     * The Link interface represents an object providing static methods used for creating object links.
     * @param url       Relative path or full Link
     * @extends URL
     */
    constructor(url: string);

    /**
     * The Link interface represents an object providing static methods used for creating object links.
     * @param url       Relative path or full Link
     * @param base      Base link for `url`
     * @extends URL
     */
    constructor(url: string, base?: string);

    /**
     * The Link interface represents an object providing static methods used for creating object links.
     * @param url       Relative path or full Link
     * @param base      Base link for `url`
     * @param config   Options for Link
     * @extends URL
     */
    constructor(url: string, base?: string, config?: LinkConfig);
    constructor(url: string, base?: URL, config?: LinkConfig);
    constructor(url: string, base?: LinkConfig, config?: LinkConfig);

    constructor(
        url: string | URL,
        base?: string | URL | LinkConfig,
        config?: LinkConfig
    ) {
        typeof base === "string" || base instanceof URL
            ? super(url.toString(), base)
            : super(url.toString());

        if (base) {
            // Checks if base is LinkConfig
            if (typeof base !== "string" && !(base instanceof URL)) {
                this.config = base;
                this.method = base.method;
                this.headers = base.headers;
                this.search = base.querystring
                    ? querystring.stringify(base.querystring)
                    : this.search;
            } else if (config) {
                this.config = config;
                this.method = config.method;
                this.headers = config.headers;
                this.search = config.querystring
                    ? querystring.stringify(config.querystring)
                    : this.search;
            }
        }
    }

    /**
     * Sends Request using Method specifed in `config`
     * @param config
     * @returns Axios Response
     */
    public request(config?: LinkConfig): Promise<AxiosResponse<never>> {
        try {
            const conf = config ?? this.config;
            if (!conf || !conf.method)
                throw new Error("URL and Method are required properties!");

            return axios.request(Object.assign({ url: this.href }, conf));
        } catch (error) {
            return error;
        }
    }

    /**
     * Sends a `GET` request using `Axios` library
     * @param config Overrides instantiated config
     * @returns Axios Response
     */
    public get(config?: LinkConfig): Promise<AxiosResponse<never>> {
        try {
            return axios.get(this.href, config ?? this.config);
        } catch (error) {
            return error;
        }
    }

    /**
     * Sends a `POST` request using `Axios` library
     * @param body The body of the request
     * @param config Overrides instantiated config
     * @returns Axios Response
     */
    public post(
        body?: Record<string, unknown>,
        config?: LinkConfig
    ): Promise<AxiosResponse<never>> {
        try {
            return axios.post(this.href, body, config ?? this.config);
        } catch (error) {
            return error;
        }
    }
}

export default Link;
