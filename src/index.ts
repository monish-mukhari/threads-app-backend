import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
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
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!',
                say: (_, { name }: { name: string }) => `Hey, ${name}` 
            }
        },
    });

    await gqlServer.start();

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT}`); });
}

startServer();
