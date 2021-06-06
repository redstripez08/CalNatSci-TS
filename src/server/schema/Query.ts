import { queryType } from "nexus";

type verse = {
    id?: number | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
};

export const Query = queryType({
    definition(t) {
        t.list.field("verses", {
            type: "Verse",
            args: {
                id: "Int"
            },
            resolve(_root, args, ctx) {
                if (args.id) {
                    return [ctx.db.verses.find((verse: verse) => verse.id === args.id)];
                }
                
                return ctx.db.verses as any;
            }
        });
    }
});