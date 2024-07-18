import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { createApolloGraphqlServer } from './graphql';
import UserService from './services/user';

const PORT = process.env.PORT || 3000;

async function startServer() {
    const app = express();
    app.use(express.json());


    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer(), {
        context: async({ req }) => {
            //@ts-ignore
            const token = req.headers["token"];
            try {
                const user = UserService.decodeJWTToken(token as string);
                return { user }
            } catch (error) {
                return {};
            }
        }
    }));

    app.listen(PORT, () => { console.log(`Server started on http://localhost:${PORT}`); });
}

startServer();
