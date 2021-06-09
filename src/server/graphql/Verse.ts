import { list, mutationField, nonNull, objectType, queryField } from "nexus";

type verse = {
    id?: number | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
};

export const Verse = objectType({
    name: "Verse",
    definition(t) {
        t.id('id');
        t.string('title');
        t.string('content');
    }
});

export const VerseQuery = queryField("verses", {
    type: list("Verse"),
    args: {
        id: "Int"
    },
    async resolve(_root, args, ctx) {
        if (args.id) {
            return [(await ctx.db.verses.findMany()).find((verse: verse) => verse.id === args.id)];
        }

        return await ctx.db.verses.findMany() as any;
    }
});

export const VerseMutation = mutationField("updateVerse", {
    type: "Verse",
    args: {
        id: nonNull("Int"),
        title: nonNull("String"),
        content: nonNull("String")
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

        return res as any;
    }
});