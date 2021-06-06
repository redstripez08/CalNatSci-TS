import { Verses } from ".prisma/client";

export type Context = {
    db: {
        verses: Verses[]
    }
}