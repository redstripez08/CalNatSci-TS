"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a random hexadecimal value. Used to randomize Discord Embed Colors.
 */
function default_1() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
exports.default = default_1;
