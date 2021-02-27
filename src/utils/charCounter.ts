/**
 * Checks Length of string. If over max, it shortens it and adds trailing ellipses. When `slice` params is false,
 * it returns true when string legnth is lower than max.
 * @param str   String to check character amount.
 * @param max   Maximum amount of characters. Defaults to 2048.
 * @param slice Set to true to slice on overflow. Set false to return boolean. 
 */
export default function (str: string, max: number = 2048, slice?: boolean): string | boolean {
    if (slice) {
        return str.length > max ? `${str.slice(0, max - 3)}...` : str;
    } else {
        return str.length < max;
    }
}