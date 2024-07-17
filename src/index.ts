import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { createApolloGraphqlServer } from './graphql';

const PORT = process.env.PORT || 3000;

async function startServer() {
    const app = express();
    app.use(express.json());


    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer()));

    app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT}`); });
}

startServer();
