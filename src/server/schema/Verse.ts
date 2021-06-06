import { mutationType, objectType } from "nexus";

export const Verse = objectType({
    name: "Verse",
    definition(t) {
        t.id('id');
        t.string('title');
        t.string('content');
    }
});

// export const VerseMutation = mutationType({
//     definition(t) {
        
//     }
// });