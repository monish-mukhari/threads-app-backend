import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';
const PORT = process.env.PORT || 3000;


async function startServer() {
    const app = express();
    app.use(express.json());

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }

            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!',
                say: (_, { name }: { name: string }) => `Hey, ${name}` 
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: "random_salt"
                        }
                    });
                    return true;
                }
            }
        },
    });

    await gqlServer.start();

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT}`); });
}

startServer();
