/**
 * Creates a random hexadecimal value. Used to randomize Discord Embed Colors.
 */
export default function () {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}