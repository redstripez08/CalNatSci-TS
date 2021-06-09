"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerseMutation = exports.VerseQuery = exports.Verse = void 0;
const nexus_1 = require("nexus");
exports.Verse = nexus_1.objectType({
    name: "Verse",
    definition(t) {
        t.id('id');
        t.string('title');
        t.string('content');
    }
});
exports.VerseQuery = nexus_1.queryField("verses", {
    type: nexus_1.list("Verse"),
    args: {
        id: "Int"
    },
    async resolve(_root, args, ctx) {
        if (args.id) {
            return [(await ctx.db.verses.findMany()).find((verse) => verse.id === args.id)];
        }
        return await ctx.db.verses.findMany();
    }
});
exports.VerseMutation = nexus_1.mutationField("updateVerse", {
    type: "Verse",
    args: {
        id: nexus_1.nonNull("Int"),
        title: nexus_1.nonNull("String"),
        content: nexus_1.nonNull("String")
    },
    async resolve(_root, args, ctx) {
        const res = await ctx.db.verses.update({
            where: {
                id: args.id
            },
            data: {
                id: args.id,
                title: args.title,
                content: args.content
            }
        });
        return res;
    }
});
