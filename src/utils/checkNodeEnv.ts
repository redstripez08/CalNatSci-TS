type Envs = "development" | "production";

/**
 * Checks for Node Environment
 * @param env Environment to be checked
 */
export default function (env: Envs): boolean {
    return process.env.NODE_ENV === env;
}