import { mutations } from "./mutations";
import { resolvers } from "./resolvers";
import { queries } from "./queries";
import { typeDef } from "./typedef";

export const User = { typeDef, queries, mutations, resolvers };